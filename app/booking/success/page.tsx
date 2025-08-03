'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Calendar, Home, MapPin, Video } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface AppointmentDetails {
  date: string
  time: string
  consultation_type: string
  client_name: string
  client_email: string
  amount: number
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (sessionId) {
        try {
          const response = await fetch(`/api/bookings/details?session_id=${sessionId}`)
          if (response.ok) {
            const data = await response.json()
            setAppointmentDetails(data.appointment)
          }
        } catch (error) {
          console.error('Erreur récupération détails RDV:', error)
        }
      }
      
      // Délai pour l'affichage
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }

    fetchAppointmentDetails()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paiement confirmé !</h1>
          <p className="text-gray-600">Votre consultation en ligne est réservée</p>
        </div>

        <div className="space-y-6">
          {/* Confirmation du rendez-vous */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <Calendar className="w-5 h-5 mr-2" />
                Rendez-vous confirmé
              </CardTitle>
              <CardDescription>
                Votre consultation avec Dr. Guiloufi a été réservée avec succès
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {appointmentDetails && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date :</span>
                        <span className="font-medium">
                          {format(new Date(appointmentDetails.date), 'dd MMMM yyyy', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heure :</span>
                        <span className="font-medium">{appointmentDetails.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type de consultation :</span>
                        <span className="flex items-center font-medium">
                          {appointmentDetails.consultation_type === 'cabinet' ? (
                            <>
                              <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                              Au cabinet
                            </>
                          ) : (
                            <>
                              <Video className="w-4 h-4 mr-1 text-green-600" />
                              En visio
                            </>
                          )}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant payé :</span>
                    <span className="font-medium text-green-600">
                      {appointmentDetails?.amount ? `${appointmentDetails.amount}€` : '60€'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut :</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✅ Confirmé et payé
                    </span>
                  </div>
                  {sessionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID de session :</span>
                      <span className="font-mono text-xs text-gray-500">{sessionId.slice(0, 20)}...</span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Informations importantes</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>📧 Email de confirmation envoyé</li>
                    <li>📅 Rendez-vous ajouté à votre calendrier</li>
                    <li>🔔 Rappels automatiques activés</li>
                    <li>📞 Contact : stephdumaz@gmail.com</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prochaines étapes */}
          <Card>
            <CardHeader>
              <CardTitle>Prochaines étapes</CardTitle>
              <CardDescription>
                Ce qui va se passer maintenant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Email de confirmation</h4>
                    <p className="text-sm text-gray-600">
                      Vous allez recevoir un email avec tous les détails de votre rendez-vous.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Rendez-vous dans votre calendrier</h4>
                    <p className="text-sm text-gray-600">
                      L'événement a été automatiquement ajouté au calendrier de Dr. Guiloufi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Rappels automatiques</h4>
                    <p className="text-sm text-gray-600">
                      Google Calendar enverra des rappels automatiques selon la configuration.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => router.push('/')}
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>

          {/* Support */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600">💡</span>
                </div>
                <div>
                  <h4 className="font-medium text-amber-900">Besoin d'aide ?</h4>
                  <p className="text-sm text-amber-800 mt-1">
                    Si vous avez des questions ou rencontrez un problème, 
                    n'hésitez pas à nous contacter par email à <strong>stephdumaz@gmail.com</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}