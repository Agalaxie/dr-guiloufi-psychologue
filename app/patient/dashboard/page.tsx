'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, LogOut, User, CreditCard } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PatientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

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

  const isAdmin = (session.user as any)?.role === 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête du dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isAdmin ? '👨‍⚕️ Dashboard Admin' : '👋 Mon Espace Patient'}
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenue, {session.user?.name || session.user?.email}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Button 
                  onClick={() => router.push('/admin')}
                  variant="outline"
                >
                  Interface Admin
                </Button>
              )}
              <Button 
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="outline"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>

        {/* Cartes d'actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Prendre un RDV
              </CardTitle>
              <CardDescription>
                Réservez votre prochaine consultation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/booking')}
                className="w-full"
              >
                Réserver maintenant
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                Mes RDV
              </CardTitle>
              <CardDescription>
                Consultez vos rendez-vous à venir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {/* TODO: Implementer */}}
              >
                Voir mes RDV
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                Mon Profil
              </CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {/* TODO: Implementer */}}
              >
                Modifier le profil
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Section RDV récents */}
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous récents</CardTitle>
            <CardDescription>
              Vos dernières consultations avec Dr. Guiloufi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun rendez-vous pour le moment</p>
              <Button 
                onClick={() => router.push('/booking')}
                className="mt-4"
              >
                Prendre votre premier RDV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}