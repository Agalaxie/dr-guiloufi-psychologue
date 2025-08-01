'use client'

import { useState } from 'react'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarDays, Clock, MapPin, Video, CreditCard, Check } from 'lucide-react'

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [consultationType, setConsultationType] = useState<'physical' | 'online'>('physical')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    message: ''
  })

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
  ]

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setStep(2)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(3)
  }

  const handleConsultationTypeSelect = (type: 'physical' | 'online') => {
    setConsultationType(type)
    setStep(4)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (consultationType === 'online') {
      // Rediriger vers le paiement Stripe
      setStep(5)
    } else {
      // Envoyer directement la confirmation par email
      await submitBooking()
    }
  }

  const submitBooking = async () => {
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          type: consultationType,
          ...formData
        }),
      })

      if (response.ok) {
        setStep(6) // Confirmation
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error)
    }
  }

  const handlePayment = async () => {
    // Simulation du paiement Stripe
    // En production, intégrer réellement Stripe
    setTimeout(() => {
      setStep(6) // Confirmation après paiement
    }, 2000)
  }

  const disabledDates = (date: Date) => {
    const today = new Date()
    const dayOfWeek = date.getDay()
    return date < today || dayOfWeek === 0 // Désactiver le dimanche et les dates passées
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium ${
                  step >= i ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > i ? <Check className="h-4 w-4" /> : i}
                </div>
                {i < 6 && (
                  <div className={`h-1 w-12 mx-2 ${
                    step > i ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Date</span>
            <span>Heure</span>
            <span>Type</span>
            <span>Infos</span>
            <span>Paiement</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Step 1: Date Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                Choisissez une date
              </CardTitle>
              <CardDescription>
                Sélectionnez le jour de votre consultation
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={disabledDates}
                locale={fr}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        )}

        {/* Step 2: Time Selection */}
        {step === 2 && selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Choisissez un horaire
              </CardTitle>
              <CardDescription>
                Consultation le {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => handleTimeSelect(time)}
                    className="h-12"
                  >
                    {time}
                  </Button>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  ← Changer de date
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Consultation Type */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Type de consultation</CardTitle>
              <CardDescription>
                Choisissez entre une consultation au cabinet ou en ligne
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    consultationType === 'physical' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                  onClick={() => handleConsultationTypeSelect('physical')}
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-medium">Consultation au cabinet</h3>
                      <p className="text-sm text-gray-600">Paris 18ème</p>
                      <p className="text-sm font-medium text-primary">70€</p>
                    </div>
                  </div>
                </div>
                
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    consultationType === 'online' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                  onClick={() => handleConsultationTypeSelect('online')}
                >
                  <div className="flex items-center space-x-3">
                    <Video className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-medium">Consultation en ligne</h3>
                      <p className="text-sm text-gray-600">Vidéoconférence sécurisée</p>
                      <p className="text-sm font-medium text-primary">65€</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  ← Changer d'horaire
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Patient Information */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Vos informations</CardTitle>
              <CardDescription>
                Remplissez le formulaire pour finaliser votre réservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">Motif de consultation</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="ex: anxiété, dépression, thérapie de couple..."
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message (optionnel)</Label>
                  <Textarea
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Précisions ou questions particulières..."
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="ghost" onClick={() => setStep(3)}>
                    ← Retour
                  </Button>
                  <Button type="submit">
                    {consultationType === 'online' ? 'Procéder au paiement' : 'Confirmer la réservation'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Payment (only for online consultations) */}
        {step === 5 && consultationType === 'online' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Paiement sécurisé
              </CardTitle>
              <CardDescription>
                Consultation en ligne - 65€
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Simulation de paiement Stripe</strong><br />
                  En production, cette étape intégrerait réellement l'API Stripe pour le paiement sécurisé.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Récapitulatif de votre réservation</Label>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <p><strong>Date:</strong> {selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</p>
                    <p><strong>Heure:</strong> {selectedTime}</p>
                    <p><strong>Type:</strong> Consultation en ligne</p>
                    <p><strong>Patient:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Total:</strong> 65€</p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(4)}>
                    ← Modifier les informations
                  </Button>
                  <Button onClick={handlePayment}>
                    Payer 65€
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Confirmation */}
        {step === 6 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <Check className="h-5 w-5 mr-2" />
                Réservation confirmée !
              </CardTitle>
              <CardDescription>
                Votre rendez-vous a été enregistré avec succès
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-medium text-green-900 mb-3">Détails de votre rendez-vous :</h3>
                <div className="space-y-2 text-green-800">
                  <p><strong>Date:</strong> {selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</p>
                  <p><strong>Heure:</strong> {selectedTime}</p>
                  <p><strong>Type:</strong> {consultationType === 'online' ? 'Consultation en ligne' : 'Consultation au cabinet'}</p>
                  <p><strong>Patient:</strong> {formData.firstName} {formData.lastName}</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <p className="text-sm text-gray-600">
                  📧 Un email de confirmation vous a été envoyé à <strong>{formData.email}</strong>
                </p>
                {consultationType === 'online' && (
                  <p className="text-sm text-gray-600">
                    🔗 Le lien de connexion pour votre consultation en ligne vous sera envoyé 30 minutes avant le rendez-vous
                  </p>
                )}
                {consultationType === 'physical' && (
                  <p className="text-sm text-gray-600">
                    📍 Adresse du cabinet : Paris 18ème (adresse précise dans l'email de confirmation)
                  </p>
                )}
              </div>

              <div className="flex justify-center mt-6">
                <Button onClick={() => {
                  setStep(1)
                  setSelectedDate(undefined)
                  setSelectedTime('')
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    reason: '',
                    message: ''
                  })
                }}>
                  Prendre un nouveau rendez-vous
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}