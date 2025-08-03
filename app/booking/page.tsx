'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CalendarDays, Clock, CreditCard, Check, AlertCircle, MapPin, Video } from 'lucide-react'

// Créneaux horaires fixes (hard-codés)
const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
]

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [consultationType, setConsultationType] = useState<string>('cabinet')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [busySlots, setBusySlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    message: ''
  })

  // Effet pour détecter côté client et vérifier les paramètres de succès
  useEffect(() => {
    setIsClient(true)
    if (searchParams.get('success') === 'true') {
      setSuccess(true)
    }
  }, [searchParams])

  // Charger les créneaux occupés quand une date est sélectionnée
  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true)
      setSelectedTime('') // Reset du créneau sélectionné
      
      // Utiliser une méthode qui ne change pas selon la timezone
      const dateStr = selectedDate.getFullYear() + '-' + 
                     String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(selectedDate.getDate()).padStart(2, '0')
      
      fetch(`/api/calendar/check-availability?date=${dateStr}`)
        .then(res => res.json())
        .then(data => {
          setBusySlots(data.busySlots || [])
        })
        .catch(err => {
          console.error('Erreur récupération créneaux:', err)
          setBusySlots([])
        })
        .finally(() => {
          setLoadingSlots(false)
        })
    }
  }, [selectedDate])

  const handleFormSubmit = async () => {
    if (!selectedDate || !selectedTime || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.reason) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. Vérifier la disponibilité en temps réel avec Supabase
      const availabilityResponse = await fetch('/api/calendar/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
        }),
      })

      const availabilityData = await availabilityResponse.json()

      if (!availabilityData.available) {
        throw new Error('⚠️ Ce créneau vient d\'être réservé par quelqu\'un d\'autre. Veuillez choisir un autre horaire.')
      }

      // 2. Créer la session Stripe Checkout si disponible
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          reason: formData.reason,
          message: formData.message,
          consultationType: consultationType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réservation')
      }

      // Rediriger vers Stripe Checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      }
    } catch (err) {
      console.error('Erreur:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  // Si le paiement est réussi (retour de Stripe)
  if (success && isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600 text-2xl">
                <Check className="w-8 h-8 mr-3" />
                Rendez-vous confirmé !
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-green-800 mb-3">✅ Votre rendez-vous est confirmé</h3>
                  <p className="text-green-700 mb-4">
                    Vous recevrez un email de confirmation avec tous les détails de votre rendez-vous.
                  </p>
                  <div className="flex items-center text-green-600">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Paiement effectué avec succès (60€)</span>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">📋 Récapitulatif de votre réservation</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>📅 Date :</strong> Confirmée (voir email de confirmation)</p>
                    <p><strong>🕒 Heure :</strong> Confirmée (voir email de confirmation)</p>
                    <p><strong>💳 Montant payé :</strong> 60€</p>
                    <p><strong>📧 Confirmation :</strong> Envoyée par email</p>
                    <p><strong>🔄 Statut :</strong> <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Confirmé et payé</span></p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-800 mb-2">ℹ️ Informations importantes :</h4>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• 📧 Un email de confirmation détaillé vous a été envoyé</li>
                    <li>• 📅 Le rendez-vous a été ajouté au calendrier de Dr. Guiloufi</li>
                    <li>• ⏰ En cas d'empêchement, merci de prévenir 24h à l'avance</li>
                    <li>• 🆔 Apportez votre carte d'identité pour le premier rendez-vous</li>
                    <li>• 📞 Contact : stephdumaz@gmail.com</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h4 className="font-medium text-amber-800 mb-2">💡 Prochaines étapes :</h4>
                  <div className="space-y-2 text-sm text-amber-700">
                    <p><strong>1.</strong> Vérifiez votre email pour les détails complets</p>
                    <p><strong>2.</strong> Notez la date et l'heure dans votre agenda</p>
                    <p><strong>3.</strong> Préparez vos questions pour la consultation</p>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => window.location.href = '/'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Retour à l'accueil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <CalendarDays className="w-8 h-8 mr-3 text-blue-600" />
              Prendre rendez-vous
            </CardTitle>
            <CardDescription>
              Réservez votre consultation en quelques clics. Paiement sécurisé par carte bancaire.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Sélection de la date */}
            <div>
              <Label className="text-lg font-medium mb-4 block">
                1. Choisissez une date
              </Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={fr}
                  disabled={(date) => 
                    date < new Date() || 
                    date.getDay() === 0 // Dimanche
                  }
                  className="rounded-md border"
                />
              </div>
            </div>


            {/* Sélection de l'heure */}
            {selectedDate && (
              <div>
                <Label className="text-lg font-medium mb-4 block">
                  2. Choisissez un horaire
                </Label>
                {loadingSlots ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Vérification des créneaux disponibles...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {TIME_SLOTS.map((time) => {
                      const isOccupied = busySlots.includes(time)
                      return (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => !isOccupied && setSelectedTime(time)}
                          disabled={isOccupied}
                          className={`h-12 ${isOccupied ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {time}
                          {isOccupied && <span className="ml-2 text-xs">(Occupé)</span>}
                        </Button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Type de consultation */}
            {selectedDate && selectedTime && (
              <div>
                <Label className="text-lg font-medium mb-4 block">
                  3. Type de consultation
                </Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      consultationType === 'cabinet' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setConsultationType('cabinet')}
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Au cabinet</h3>
                        <p className="text-sm text-gray-600">Consultation en présentiel</p>
                        <p className="text-xs text-gray-500 mt-1">123 Rue de la Psychologie, Paris</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      consultationType === 'visio' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setConsultationType('visio')}
                  >
                    <div className="flex items-center space-x-3">
                      <Video className="w-6 h-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold">En visioconférence</h3>
                        <p className="text-sm text-gray-600">Consultation à distance</p>
                        <p className="text-xs text-gray-500 mt-1">Lien envoyé par email</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Formulaire */}
            {selectedDate && selectedTime && (
              <div>
                <Label className="text-lg font-medium mb-4 block">
                  4. Vos informations
                </Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="reason">Motif de consultation *</Label>
                    <Input
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="ex: Anxiété, dépression, thérapie de couple..."
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="message">Message (optionnel)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Informations complémentaires..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bouton de réservation */}
            {selectedDate && selectedTime && formData.firstName && formData.lastName && formData.email && formData.phone && formData.reason && (
              <div>
                <Label className="text-lg font-medium mb-4 block">
                  5. Finaliser la réservation
                </Label>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center text-red-800">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {error}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 border rounded-lg p-6 mb-6">
                  <h4 className="font-semibold mb-4">Récapitulatif :</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Date :</strong> {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}</p>
                    <p><strong>Heure :</strong> {selectedTime}</p>
                    <p className="flex items-center">
                      <strong>Type :</strong> 
                      <span className="ml-2 flex items-center">
                        {consultationType === 'cabinet' ? (
                          <>
                            <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                            Au cabinet
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4 mr-1 text-green-600" />
                            En visioconférence
                          </>
                        )}
                      </span>
                    </p>
                    <p><strong>Patient :</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Motif :</strong> {formData.reason}</p>
                    <p><strong>Tarif :</strong> 60€</p>
                  </div>
                </div>

                <Button 
                  onClick={handleFormSubmit}
                  disabled={loading}
                  size="lg"
                  className="w-full h-14 text-lg"
                >
                  {loading ? (
                    'Traitement en cours...'
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Réserver et payer 60€
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}