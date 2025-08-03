'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, Lock, Unlock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AdminAuthGuard from '@/components/AdminAuthGuard'

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

interface BlockedSlot {
  id: string
  date: string
  time: string
  reason: string
}

export default function ScheduleManagement() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [blockedSlots, setBlockedSlots] = useState<string[]>([])
  const [blockedSlotsDetails, setBlockedSlotsDetails] = useState<BlockedSlot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      loadBlockedSlots()
    }
  }, [selectedDate])

  const loadBlockedSlots = async () => {
    if (!selectedDate) return
    
    setLoading(true)
    try {
      const dateStr = selectedDate.getFullYear() + '-' + 
                     String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(selectedDate.getDate()).padStart(2, '0')

      // Récupérer les créneaux occupés (réservations + bloqués)
      const busyResponse = await fetch(`/api/calendar/check-availability?date=${dateStr}`)
      const busyData = await busyResponse.json()
      
      // Récupérer les détails des créneaux bloqués
      const token = localStorage.getItem('admin_token')
      const blockedResponse = await fetch(`/api/admin/blocked-slots?date=${dateStr}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      const blockedData = await blockedResponse.json()
      
      setBlockedSlots(busyData.busySlots || [])
      setBlockedSlotsDetails(blockedData.blockedSlots || [])
    } catch (error) {
      console.error('Erreur chargement créneaux:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSlotBlock = async (time: string) => {
    if (!selectedDate) return

    const dateStr = selectedDate.getFullYear() + '-' + 
                   String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(selectedDate.getDate()).padStart(2, '0')

    const isCurrentlyBlocked = blockedSlotsDetails.some(slot => 
      slot.time.substring(0, 5) === time
    )

    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('Token d\'authentification manquant')
        return
      }

      const endpoint = isCurrentlyBlocked ? '/api/admin/unblock-slot' : '/api/admin/block-slot'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: dateStr, time })
      })

      if (response.ok) {
        loadBlockedSlots() // Recharger
      } else {
        const errorData = await response.json()
        alert(`Erreur: ${errorData.error || 'Erreur lors de la modification'}`)
      }
    } catch (error) {
      console.error('Erreur toggle slot:', error)
      alert('Erreur lors de la modification')
    }
  }

  const getSlotStatus = (time: string) => {
    const isBlocked = blockedSlotsDetails.some(slot => 
      slot.time.substring(0, 5) === time
    )
    const isOccupied = blockedSlots.includes(time)
    
    if (isBlocked) return 'blocked'
    if (isOccupied) return 'occupied'
    return 'available'
  }

  const getSlotBadge = (time: string) => {
    const status = getSlotStatus(time)
    
    switch (status) {
      case 'blocked':
        return <Badge className="bg-red-100 text-red-800"><Lock className="w-3 h-3 mr-1" />Bloqué</Badge>
      case 'occupied':
        return <Badge className="bg-yellow-100 text-yellow-800">Réservé</Badge>
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>
      default:
        return null
    }
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des créneaux</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendrier */}
          <Card>
            <CardHeader>
              <CardTitle>Sélectionner une date</CardTitle>
              <CardDescription>Choisissez une date pour gérer les créneaux</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Gestion des créneaux */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </CardTitle>
                <CardDescription>Bloquez ou débloquez les créneaux selon votre disponibilité</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Chargement...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {TIME_SLOTS.map((time) => {
                      const status = getSlotStatus(time)
                      const canToggle = status !== 'occupied' // Peut bloquer/débloquer sauf si réservé
                      
                      return (
                        <div key={time} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{time}</span>
                            {getSlotBadge(time)}
                          </div>
                          
                          <div className="flex gap-2">
                            {status === 'occupied' && !blockedSlotsDetails.some(slot => slot.time.substring(0, 5) === time) && (
                              <span className="text-sm text-gray-500">Réservation confirmée</span>
                            )}
                            
                            {canToggle && (
                              <Button
                                size="sm"
                                variant={status === 'blocked' ? 'default' : 'outline'}
                                onClick={() => toggleSlotBlock(time)}
                                className={status === 'blocked' ? 'bg-green-600 hover:bg-green-700' : ''}
                              >
                                {status === 'blocked' ? (
                                  <>
                                    <Unlock className="w-4 h-4 mr-1" />
                                    Débloquer
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-4 h-4 mr-1" />
                                    Bloquer
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                <span>Créneau libre, peut être réservé</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800"><Lock className="w-3 h-3 mr-1" />Bloqué</Badge>
                <span>Créneau bloqué par vous</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800">Réservé</Badge>
                <span>Réservation confirmée par un client</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminAuthGuard>
  )
}