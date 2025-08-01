'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StripePayment from '@/components/StripePayment'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CalendarDays, Clock, MapPin, Video, CreditCard, Check, AlertCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CONSULTATION_PRICES } from '@/lib/stripe'

export default function BookingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [consultationType, setConsultationType] = useState<'physical' | 'online'>('physical')
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [appointmentId, setAppointmentId] = useState('')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    message: ''
  })

  // Redirection si non authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        email: session.user.email || '',
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
      }))
    }
  }, [status, session, router])

  // Charger les créneaux disponibles depuis Supabase
  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots()
    }
  }, [selectedDate])

  const loadAvailableSlots = async () => {
    if (!selectedDate) return
    
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .eq('date', dateStr)
        .eq('is_available', true)
        .order('time')

      if (error) throw error
      setAvailableSlots(data || [])
    } catch (err) {
      console.error('Erreur chargement créneaux:', err)
      setError('Erreur lors du chargement des créneaux disponibles')
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime('')
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

  const createAppointment = async () => {
    if (!session?.user?.email || !selectedDate || !selectedTime) return null

    try {
      setLoading(true)
      setError('')

      // Récupérer l'ID de l'utilisateur
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (userError || !userData) {
        throw new Error('Utilisateur non trouvé')
      }

      const appointmentData = {
        patient_id: userData.id,
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: selectedTime + ':00',
        type: consultationType,
        reason: formData.reason,
        notes: formData.message,
        price: CONSULTATION_PRICES[consultationType],
        status: consultationType === 'physical' ? 'confirmed' : 'pending'
      }

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single()

      if (appointmentError) throw appointmentError

      return appointment
    } catch (err) {
      console.error('Erreur création RDV:', err)
      setError('Erreur lors de la création du rendez-vous')
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async () => {
    const appointment = await createAppointment()
    if (!appointment) return

    setAppointmentId(appointment.id)

    if (consultationType === 'online') {
      setStep(5) // Étape de paiement
    } else {
      setStep(6) // Confirmation directe pour consultation physique
    }
  }

  const handlePaymentSuccess = () => {
    setStep(6) // Confirmation
  }

  const handlePaymentError = (error: string) => {
    setError(error)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prendre rendez-vous</h1>
          <p className="text-gray-600">Réservez votre consultation avec Dr. Guiloufi</p>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Indicateur de progression */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNumber ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                {stepNumber < 6 && (
                  <div className={`w-8 h-0.5 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-500">
              {step === 1 && 'Choisir une date'}
              {step === 2 && 'Choisir un créneau'}
              {step === 3 && 'Type de consultation'}
              {step === 4 && 'Vos informations'}
              {step === 5 && 'Paiement'}
              {step === 6 && 'Confirmation'}
            </span>
          </div>
        </div>

        {/* Étape 1: Sélection de la date */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-2" />
                Choisissez une date
              </CardTitle>
              <CardDescription>
                Sélectionnez le jour qui vous convient le mieux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  locale={fr}
                  className="rounded-md border"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 2: Sélection de l'heure */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Choisissez un créneau
              </CardTitle>
              <CardDescription>
                {selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedTime === slot.time.slice(0, 5) ? 'default' : 'outline'}
                      onClick={() => handleTimeSelect(slot.time.slice(0, 5))}
                      className="h-12"
                    >
                      {slot.time.slice(0, 5)}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun créneau disponible pour cette date</p>
                  <Button variant="outline" onClick={() => setStep(1)} className="mt-4">
                    Choisir une autre date
                  </Button>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                onClick={() => setStep(1)}
                className="mt-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Changer de date
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Étape 3: Type de consultation */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Type de consultation</CardTitle>
              <CardDescription>
                Choisissez entre une consultation physique ou en ligne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={consultationType}
                onValueChange={(value) => handleConsultationTypeSelect(value as 'physical' | 'online')}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="physical" id="physical" />
                  <div className="flex-1">
                    <Label htmlFor="physical" className="flex items-center cursor-pointer">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      <div>
                        <div className="font-medium">Consultation physique</div>
                        <div className="text-sm text-gray-500">Au cabinet - Paris 18ème</div>
                      </div>
                    </Label>
                  </div>
                  <div className="text-lg font-bold text-green-600">60€</div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="online" id="online" />
                  <div className="flex-1">
                    <Label htmlFor="online" className="flex items-center cursor-pointer">
                      <Video className="w-5 h-5 mr-2 text-purple-600" />
                      <div>
                        <div className="font-medium">Consultation en ligne</div>
                        <div className="text-sm text-gray-500">Visioconférence sécurisée</div>
                      </div>
                    </Label>
                  </div>
                  <div className="text-lg font-bold text-blue-600">60€</div>
                </div>
              </RadioGroup>
              
              <Button 
                variant="ghost" 
                onClick={() => setStep(2)}
                className="mt-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Changer de créneau
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Étape 4: Formulaire */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Vos informations</CardTitle>
              <CardDescription>
                Merci de remplir ces informations pour finaliser votre rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email de votre compte connecté</p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">Motif de consultation *</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Ex: Anxiété, stress, thérapie de couple..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message (optionnel)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Informations complémentaires..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setStep(3)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                  <Button 
                    onClick={handleFormSubmit}
                    disabled={loading || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.reason}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Création en cours...
                      </>
                    ) : (
                      consultationType === 'online' ? 'Procéder au paiement' : 'Confirmer le rendez-vous'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 5: Paiement (uniquement pour consultations en ligne) */}
        {step === 5 && consultationType === 'online' && appointmentId && (
          <div className="space-y-6">
            {/* Récapitulatif */}
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif de votre rendez-vous</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heure:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">Consultation en ligne</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patient:</span>
                    <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Motif:</span>
                    <span className="font-medium">{formData.reason}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>60€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Paiement Stripe */}
            <StripePayment
              appointmentId={appointmentId}
              consultationType="online"
              amount={60}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            
            <Button 
              variant="ghost" 
              onClick={() => setStep(4)}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Modifier les informations
            </Button>
          </div>
        )}

        {/* Étape 6: Confirmation */}
        {step === 6 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <Check className="w-6 h-6 mr-2" />
                Rendez-vous confirmé !
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Votre rendez-vous est confirmé</h3>
                  <div className="space-y-1 text-sm text-green-700">
                    <p>📅 {selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })} à {selectedTime}</p>
                    <p>👨‍⚕️ Dr. Guiloufi</p>
                    <p>{consultationType === 'online' ? '💻 Consultation en ligne' : '🏥 Cabinet - Paris 18ème'}</p>
                    <p>📧 Un email de confirmation sera bientôt envoyé</p>
                  </div>
                </div>

                {consultationType === 'online' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Consultation en ligne</h3>
                    <p className="text-sm text-blue-700">
                      Le lien de connexion vous sera envoyé par email 30 minutes avant votre rendez-vous.
                    </p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button onClick={() => router.push('/')} variant="outline">
                    Retour à l'accueil
                  </Button>
                  <Button onClick={() => router.push('/patient/dashboard')}>
                    Voir mes rendez-vous
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
