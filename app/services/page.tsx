import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Heart, 
  Brain, 
  Users, 
  Star, 
  Clock, 
  Shield, 
  Baby,
  Zap,
  Eye,
  UserCheck,
  Target,
  Calendar
} from 'lucide-react'

export default function ServicesPage() {
  const mainServices = [
    {
      title: 'Dépression',
      description: 'Accompagnement spécialisé pour sortir des épisodes dépressifs et retrouver un équilibre émotionnel.',
      icon: Heart,
      features: ['Thérapie cognitivo-comportementale', 'Accompagnement personnalisé', 'Techniques de pleine conscience'],
      duration: '50 min',
      category: 'Troubles de l\'humeur'
    },
    {
      title: 'Anxiété et Stress',
      description: 'Gestion des troubles anxieux, attaques de panique et stress chronique avec des techniques éprouvées.',
      icon: Brain,
      features: ['Techniques de relaxation', 'Thérapie d\'exposition', 'Gestion du stress'],
      duration: '50 min',
      category: 'Troubles anxieux'
    },
    {
      title: 'Thérapie de couple',
      description: 'Rétablissement de la communication et résolution des conflits dans le couple.',
      icon: Users,
      features: ['Communication non violente', 'Résolution de conflits', 'Reconstruction de la confiance'],
      duration: '60 min',
      category: 'Thérapie relationnelle'
    },
    {
      title: 'Confiance en soi',
      description: 'Développement de l\'estime de soi, de l\'assertivité et de la confiance personnelle.',
      icon: Star,
      features: ['Techniques d\'affirmation de soi', 'Travail sur l\'image de soi', 'Gestion des émotions'],
      duration: '50 min',
      category: 'Développement personnel'
    },
    {
      title: 'Thérapie brève',
      description: 'Approche solution-focused pour des résultats rapides et durables.',
      icon: Clock,
      features: ['Approche orientée solutions', 'Objectifs à court terme', 'Techniques stratégiques'],
      duration: '50 min',
      category: 'Thérapie courte'
    },
    {
      title: 'EMDR',
      description: 'Traitement des traumatismes et troubles post-traumatiques par mouvement oculaire.',
      icon: Eye,
      features: ['Traitement des traumatismes', 'Réduction du stress post-traumatique', 'Thérapie validée scientifiquement'],
      duration: '60 min',
      category: 'Thérapie spécialisée'
    }
  ]

  const additionalServices = [
    {
      title: 'Dépendance affective',
      description: 'Accompagnement pour développer l\'autonomie émotionnelle',
      icon: Heart
    },
    {
      title: 'Psychologie enfant',
      description: 'Suivi psychologique spécialisé pour les enfants',
      icon: Baby
    },
    {
      title: 'TDAH',
      description: 'Diagnostic et accompagnement du trouble de l\'attention',
      icon: Zap
    },
    {
      title: 'Phobies',
      description: 'Traitement des peurs irrationnelles et phobies',
      icon: Shield
    },
    {
      title: 'Addictions',
      description: 'Accompagnement dans le sevrage et la prévention de rechute',
      icon: Target
    },
    {
      title: 'Sexologie',
      description: 'Thérapie sexuelle individuelle et de couple',
      icon: Users
    },
    {
      title: 'Test QI',
      description: 'Évaluation cognitive et tests psychométriques',
      icon: Brain
    },
    {
      title: 'Hypnose',
      description: 'Hypnose thérapeutique pour divers troubles',
      icon: Clock
    },
    {
      title: 'Dyslexie',
      description: 'Diagnostic et accompagnement des troubles d\'apprentissage',
      icon: UserCheck
    }
  ]

  const consultationTypes = [
    {
      title: 'Consultation au cabinet',
      price: '70€',
      description: 'Séance en face à face dans un environnement calme et confidentiel',
      features: ['Cadre thérapeutique optimal', 'Confidentialité absolue', 'Accès facile Paris 18ème']
    },
    {
      title: 'Consultation en ligne',
      price: '65€',
      description: 'Séance par vidéoconférence sécurisée depuis chez vous',
      features: ['Flexibilité horaire', 'Économie de transport', 'Même qualité d\'accompagnement']
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mes Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un accompagnement psychologique personnalisé et adapté à vos besoins spécifiques. 
            Découvrez l'ensemble de mes spécialités et approches thérapeutiques.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Spécialités principales</h2>
          <p className="text-lg text-gray-600">
            Mes domaines d'expertise pour un accompagnement approfondi
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainServices.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline">{service.duration}</Badge>
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <Badge variant="secondary" className="w-fit">{service.category}</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{service.description}</CardDescription>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-900">Approches utilisées :</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="h-1 w-1 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Additional Services */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Autres services proposés</h2>
            <p className="text-lg text-gray-600">
              Un accompagnement complet pour tous les âges et tous les besoins
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalServices.map((service, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <service.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{service.title}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Types & Pricing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Types de consultation</h2>
          <p className="text-lg text-gray-600">
            Choisissez le format qui vous convient le mieux
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {consultationTypes.map((type, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <Badge className="text-lg px-3 py-1">{type.price}</Badge>
                </div>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="h-1 w-1 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 mb-4">
            Les consultations ne sont pas remboursées par la Sécurité Sociale, 
            mais certaines mutuelles proposent une prise en charge partielle.
          </p>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment ça se passe ?</h2>
            <p className="text-lg text-gray-600">
              Le déroulement type d'un accompagnement psychologique
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-primary rounded-full h-12 w-12 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Premier contact</h3>
              <p className="text-sm text-gray-600">
                Prise de rendez-vous par téléphone, email ou en ligne
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary rounded-full h-12 w-12 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Première séance</h3>
              <p className="text-sm text-gray-600">
                Évaluation, compréhension de votre demande et définition des objectifs
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary rounded-full h-12 w-12 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Suivi régulier</h3>
              <p className="text-sm text-gray-600">
                Séances thérapeutiques adaptées à votre rythme et vos besoins
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary rounded-full h-12 w-12 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">4</div>
              <h3 className="font-semibold text-gray-900 mb-2">Évolution</h3>
              <p className="text-sm text-gray-600">
                Évaluation des progrès et adaptation du suivi selon votre évolution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer votre accompagnement ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Prenez rendez-vous dès aujourd'hui pour une première consultation
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
                Poser une question
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}