import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  GraduationCap, 
  Award, 
  Heart, 
  Users, 
  Brain, 
  Calendar,
  CheckCircle,
  MapPin,
  Clock
} from 'lucide-react'

export default function AboutPage() {
  const formations = [
    {
      title: 'Formation de psychothérapie',
      institution: 'Université René Descartes Paris V',
      description: 'Formation approfondie en psychothérapie et techniques thérapeutiques'
    },
    {
      title: 'Institut supérieur de psychologie',
      institution: 'Paris 19',
      description: 'Spécialisation en psychologie clinique et pathologique'
    },
    {
      title: 'Diplôme Master Alfonso Caycédo',
      institution: 'FAC (Fondation Alfonso Caycédo)',
      description: 'Formation certifiée en sophrologie caycédienne'
    }
  ]

  const specialites = [
    {
      title: 'Dépression',
      description: 'Accompagnement dans les épisodes dépressifs, thérapie cognitivo-comportementale',
      icon: Heart
    },
    {
      title: 'Anxiété et Stress',
      description: 'Gestion des troubles anxieux, attaques de panique, phobies',
      icon: Brain
    },
    {
      title: 'Thérapie de couple',
      description: 'Rétablissement de la communication, résolution des conflits',
      icon: Users
    },
    {
      title: 'Confiance en soi',
      description: 'Développement de l\'estime de soi et de l\'assertivité',
      icon: Award
    },
    {
      title: 'Thérapie brève',
      description: 'Approches solution-focused, thérapie stratégique',
      icon: Clock
    },
    {
      title: 'EMDR',
      description: 'Traitement des traumatismes par mouvement oculaire',
      icon: CheckCircle
    }
  ]

  const autres_services = [
    'Dépendance affective',
    'Dyslexie',
    'Psychologie enfant',
    'TDAH',
    'Phobies',
    'Addictions',
    'Sexologie',
    'Test QI',
    'Hypnose'
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              À propos de Dr. Guiloufi
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Psychologue expérimenté à Paris 18ème, je vous accompagne avec bienveillance 
              dans votre parcours de développement personnel et de guérison.
            </p>
          </div>
        </div>
      </section>

      {/* Présentation personnelle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Mon approche thérapeutique
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                En tant que psychologue clinicien, je privilégie une approche humaniste et intégrative, 
                adaptée aux besoins spécifiques de chaque patient. Mon objectif est de créer un espace 
                sécurisant où vous pourrez explorer vos difficultés en toute confiance.
              </p>
              <p>
                Ma pratique s'appuie sur différentes méthodes thérapeutiques éprouvées : thérapie 
                cognitivo-comportementale, EMDR, hypnose, et sophrologie. Cette diversité d'approches 
                me permet de personnaliser l'accompagnement selon votre profil et vos objectifs.
              </p>
              <p>
                Je reçois en consultation individuelle, en couple, ainsi qu'en thérapie familiale. 
                Des consultations en ligne sont également disponibles pour s'adapter à vos contraintes.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Informations pratiques</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-gray-600">Cabinet à Paris 18ème</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-gray-600">Consultations sur rendez-vous</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-gray-600">Adultes, couples, adolescents</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-gray-600">Consultations en ligne disponibles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formations */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Formation et qualifications</h2>
            <p className="text-lg text-gray-600">
              Une formation solide pour un accompagnement de qualité
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formations.map((formation, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{formation.title}</CardTitle>
                  </div>
                  <CardDescription className="font-medium text-primary">
                    {formation.institution}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{formation.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Spécialités principales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mes spécialités principales</h2>
          <p className="text-lg text-gray-600">
            Domaines d'expertise pour un accompagnement ciblé
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialites.map((specialite, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <specialite.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{specialite.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{specialite.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Autres services */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Autres services proposés</h2>
            <p className="text-lg text-gray-600">
              Un accompagnement complet pour tous les âges
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {autres_services.map((service, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <span className="text-gray-700 font-medium">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer votre suivi ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contactez-moi pour discuter de vos besoins et planifier une première rencontre
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Calendar className="h-5 w-5 mr-2" />
                Prendre rendez-vous
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-primary">
                Me contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}