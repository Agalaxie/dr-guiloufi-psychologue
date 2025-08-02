import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,

  Navigation
} from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Me contacter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            N'hésitez pas à me contacter pour toute question ou pour prendre rendez-vous. 
            Je vous répondrai dans les plus brefs délais.
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Informations de contact
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Vous pouvez me joindre par téléphone, email ou directement au cabinet. 
                Je suis également disponible pour des consultations en ligne.
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Adresse du cabinet</h3>
                      <p className="text-gray-600">
                        Paris 18ème arrondissement<br />
                        Métro : Ligne 4, 12 ou 13<br />
                        Parking disponible à proximité
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        L'adresse exacte vous sera communiquée lors de la prise de rendez-vous
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                      <p className="text-gray-600">01 XX XX XX XX</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Laissez un message si je ne réponds pas, je vous rappellerai rapidement
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">contact@dr-guiloufi.fr</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Réponse sous 24h en général
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Horaires</h3>
                      <div className="text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Lundi - Vendredi :</span>
                          <span>9h - 19h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Samedi :</span>
                          <span>9h - 17h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dimanche :</span>
                          <span>Fermé</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Actions rapides</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button className="h-12" asChild>
                  <a href="/booking">
                    <Calendar className="h-4 w-4 mr-2" />
                    Prendre RDV en ligne
                  </a>
                </Button>
                <Button variant="outline" className="h-12" asChild>
                  <a href="tel:+33123456789">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler directement
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Envoyez-moi un message</CardTitle>
                <CardDescription>
                  Utilisez ce formulaire pour me poser vos questions ou demander des informations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input id="firstName" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" required />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" />
                  </div>

                  <div>
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input id="subject" required placeholder="ex: Question sur les tarifs, demande de RDV..." />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      rows={5} 
                      required 
                      placeholder="Décrivez votre demande ou vos questions..."
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Confidentialité :</strong> Vos informations sont protégées et ne seront utilisées 
                      que pour répondre à votre demande. Pour les questions sensibles, privilégiez un contact 
                      téléphonique ou une consultation.
                    </p>
                  </div>

                  <Button type="submit" className="w-full">
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Access Information */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Accès au cabinet
            </h2>
            <p className="text-lg text-gray-600">
              Le cabinet est facilement accessible en transport en commun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Navigation className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Métro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Lignes 4, 12 ou 13<br />
                  Stations à proximité du cabinet
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Parking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Places de stationnement disponibles<br />
                  Parking payant dans la rue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Accessibilité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Cabinet accessible PMR<br />
                  Ascenseur disponible
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}