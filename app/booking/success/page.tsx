'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Calendar, Clock, Video, Home, User } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [appointmentData, setAppointmentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const appointmentId = searchParams.get('appointment')

  useEffect(() => {
    if (appointmentId && session?.user) {
      // Récupérer les détails du rendez-vous depuis Supabase
      // Pour l'instant, simuler les données
      setTimeout(() => {
        setAppointmentData({
          id: appointmentId,
          date: new Date(Date.now() + 86400000), // Demain
          time: '14:00',
          type: 'online',
          status: 'confirmed'
        })
        setLoading(false)
      }, 1000)
    }
  }, [appointmentId, session])

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
                Détails de votre consultation avec Dr. Guiloufi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date :</span>
                    <span className="font-medium">
                      {appointmentData?.date && new Date(appointmentData.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heure :</span>
                    <span className="font-medium">{appointmentData?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type :</span>
                    <div className="flex items-center">
                      <Video className="w-4 h-4 mr-1 text-purple-600" />
                      <span className="font-medium">Consultation en ligne</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut :</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✅ Confirmé et payé
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Informations importantes</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>📧 Email de confirmation envoyé</li>
                    <li>🔗 Lien de connexion envoyé 30 min avant</li>
                    <li>💻 Testez votre connexion à l'avance</li>
                    <li>📱 Préparez un environnement calme</li>
                    <li>📋 Notez vos questions importantes</li>
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
                    <h4 className="font-medium">Rappel automatique</h4>
                    <p className="text-sm text-gray-600">
                      Un rappel sera envoyé 24h avant votre consultation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Lien de connexion</h4>
                    <p className="text-sm text-gray-600">
                      Le lien de visioconférence sécurisé vous sera envoyé 30 minutes avant le RDV.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => router.push('/patient/dashboard')}
              className="flex-1"
            >
              <User className="w-4 h-4 mr-2" />
              Mon espace patient
            </Button>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
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
                    Si vous avez des questions ou rencontrez un problème technique, 
                    n'hésitez pas à nous contacter au <strong>01 23 45 67 89</strong> ou 
                    par email à <strong>contact@dr-guiloufi.fr</strong>
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