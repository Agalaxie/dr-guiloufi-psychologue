'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, Mail, Phone, User, CheckCircle, XCircle, AlertCircle, LogOut } from 'lucide-react'
import Link from 'next/link'
import AdminAuthGuard from '@/components/AdminAuthGuard'
import { useRouter } from 'next/navigation'

interface Appointment {
  id: string
  date: string
  time: string
  client_name: string
  client_email: string
  client_phone: string
  reason: string
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  stripe_session_id?: string
  created_at: string
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const response = await fetch('/api/admin/appointments')
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error('Erreur chargement rendez-vous:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const response = await fetch('/api/admin/appointments/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })

      if (response.ok) {
        // Recharger la liste
        loadAppointments()
      } else {
        alert('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Confirmé</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />En attente</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Annulé</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Chargement des rendez-vous...</p>
          </div>
        </div>
      </div>
    )
  }

  const pendingAppointments = appointments.filter(a => a.status === 'pending')
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed')
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled')

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin - Rendez-vous</h1>
          <div className="flex gap-3">
            <Link href="/admin/schedule">
              <Button>
                <CalendarDays className="w-4 h-4 mr-2" />
                Gérer les créneaux
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingAppointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Confirmés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{confirmedAppointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Annulés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{cancelledAppointments.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des rendez-vous */}
        <Card>
          <CardHeader>
            <CardTitle>Tous les rendez-vous</CardTitle>
            <CardDescription>Gérez vos réservations</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun rendez-vous pour le moment</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center text-gray-600">
                            <CalendarDays className="w-4 h-4 mr-1" />
                            {format(new Date(appointment.date), 'EEEE d MMMM yyyy', { locale: fr })}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            {appointment.time.substring(0, 5)}
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center text-gray-700 mb-1">
                              <User className="w-4 h-4 mr-2" />
                              <strong>{appointment.client_name}</strong>
                            </div>
                            <div className="flex items-center text-gray-600 mb-1">
                              <Mail className="w-4 h-4 mr-2" />
                              {appointment.client_email}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              {appointment.client_phone}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-2">
                              <strong>Motif :</strong> {appointment.reason}
                            </div>
                            {appointment.message && (
                              <div className="text-sm text-gray-600">
                                <strong>Message :</strong> {appointment.message}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        {appointment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirmer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Annuler
                            </Button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Annuler
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminAuthGuard>
  )
}