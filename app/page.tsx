import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  Calendar, 
  MessageCircle, 
  Award, 
  Heart, 
  Brain, 
  Users, 
  Shield, 
  Clock,
  CheckCircle,
  Star,
  Quote,
  MapPin,
  Phone
} from 'lucide-react'

export default function HomePage() {
  const services = [
    { name: 'Dépression', icon: Heart, description: 'Accompagnement personnalisé pour sortir de la dépression' },
    { name: 'Anxiété', icon: Brain, description: 'Techniques éprouvées pour gérer stress et anxiété' },
    { name: 'Thérapie de couple', icon: Users, description: 'Rétablir la communication et l\'harmonie' },
    { name: 'Confiance en soi', icon: Star, description: 'Développer estime de soi et assertivité' },
    { name: 'EMDR', icon: Shield, description: 'Traitement des traumatismes par EMDR' },
    { name: 'Hypnose', icon: Clock, description: 'Hypnose thérapeutique pour divers troubles' }
  ]

  const formations = [
    'Formation de psychothérapie Université René Descartes Paris V',
    'Institut supérieur de psychologie Paris 19',
    'Diplôme Master Alfonso Caycédo (FAC)'
  ]

  const testimonials = [
    {
      text: "Dr. Guiloufi m'a aidé à retrouver confiance en moi. Son approche bienveillante et ses conseils pratiques m'ont permis de surmonter mes difficultés.",
      author: "Marie L.",
      rating: 5
    },
    {
      text: "Un accompagnement exceptionnel pour ma thérapie de couple. Nous avons pu rétablir le dialogue et reconstruire notre relation.",
      author: "Thomas & Sophie",
      rating: 5
    },
    {
      text: "Grâce à l'EMDR, j'ai pu traiter mon traumatisme. Je recommande vivement Dr. Guiloufi pour son professionnalisme et son empathie.",
      author: "David M.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Disponible pour consultation</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Bonjour, je suis
                <span className="block text-primary">Dr. Guiloufi</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Psychologue clinicien à Paris 18ème, je vous accompagne avec bienveillance 
                dans votre parcours de développement personnel et de guérison.
              </p>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Paris 18ème</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Lun-Sam 9h-19h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>01 XX XX XX XX</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/booking">
                <Button size="lg" className="w-full sm:w-auto group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Calendar className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                  Prendre rendez-vous
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" size="lg" className="w-full sm:w-auto group transition-all duration-300 hover:scale-105">
                  <MessageCircle className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Chat en ligne
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"></div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">200+</span> patients accompagnés
              </div>
            </div>
          </div>

          {/* Right side - Photo and visual elements */}
          <div className="relative">
            <div className="relative z-10 animate-fade-in-right">
              {/* Photo du psychologue */}
              <div className="relative mx-auto w-80 h-80 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-6 animate-pulse"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
                    alt="Dr. Guiloufi - Psychologue"
                    width={400}
                    height={400}
                    className="rounded-xl object-cover"
                    priority
                  />
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3">
                    <div className="flex items-center space-x-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">4.9/5 • 127 avis</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-10 -left-10 bg-white rounded-lg shadow-lg p-3 animate-float">
              <Heart className="h-6 w-6 text-red-500" />
              <p className="text-xs text-gray-600 mt-1">Écoute<br/>bienveillante</p>
            </div>
            
            <div className="absolute bottom-10 -right-10 bg-white rounded-lg shadow-lg p-3 animate-float-delayed">
              <Shield className="h-6 w-6 text-green-500" />
              <p className="text-xs text-gray-600 mt-1">Confidentialité<br/>absolue</p>
            </div>

            <div className="absolute top-1/2 -left-8 bg-white rounded-lg shadow-lg p-3 animate-float-slow">
              <Award className="h-6 w-6 text-blue-500" />
              <p className="text-xs text-gray-600 mt-1">10+ ans<br/>d'expérience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mes spécialités</h2>
          <p className="text-lg text-gray-600">
            Un accompagnement adapté à vos besoins spécifiques
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-6 w-6 text-primary group-hover:animate-pulse" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{service.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="group-hover:text-gray-800 transition-colors">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ce que disent mes patients</h2>
            <p className="text-xl text-blue-100">
              Témoignages authentiques de personnes que j'ai eu l'honneur d'accompagner
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-blue-200 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-white/90 mb-4 italic leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <p className="text-blue-200 font-medium">— {testimonial.author}</p>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3">
              <div className="flex space-x-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-white font-semibold">4.9/5</span>
              <span className="text-blue-200">•</span>
              <span className="text-blue-200">127 avis patients</span>
            </div>
          </div>
        </div>
      </section>

      {/* À propos Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                À propos de votre psychologue
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Fort d'une expérience solide et d'une formation complète, je vous accompagne 
                avec bienveillance dans votre parcours de développement personnel et de guérison.
              </p>
              
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Formations</h3>
                {formations.map((formation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{formation}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/about">
                <Button variant="outline">
                  En savoir plus
                </Button>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Pourquoi me choisir ?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Expérience reconnue</h4>
                    <p className="text-gray-600 text-sm">Plus de 10 ans d'expérience en psychothérapie</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Approche humaniste</h4>
                    <p className="text-gray-600 text-sm">Écoute bienveillante et sans jugement</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Flexibilité</h4>
                    <p className="text-gray-600 text-sm">Consultations en cabinet et en ligne</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Disponible cette semaine</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à prendre soin de 
              <span className="block text-yellow-300">votre bien-être ?</span>
            </h2>
            
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Première consultation offerte de 15 minutes pour faire connaissance. 
              Prenez rendez-vous dès aujourd'hui et commencez votre parcours vers un mieux-être.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/booking">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto group hover:scale-105 transition-all duration-300 shadow-xl">
                  <Calendar className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                  Réserver maintenant
                </Button>
              </Link>
              <span className="text-white/70 hidden sm:block">ou</span>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white hover:text-primary group hover:scale-105 transition-all duration-300">
                  <MessageCircle className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Poser une question
                </Button>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Réponse sous 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Confidentialité absolue</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-400" />
                <span>Accompagnement bienveillant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}