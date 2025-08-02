import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { HelpCircle, Calendar, Phone } from 'lucide-react'

export default function FAQPage() {
  const faqs = [
    {
      question: "Comment prendre rendez-vous ?",
      answer: "Vous pouvez prendre rendez-vous directement en ligne via notre système de réservation en cliquant sur le bouton 'Prendre RDV'. Vous pourrez choisir la date, l'heure et le type de consultation (cabinet ou en ligne). Vous pouvez également nous contacter par téléphone ou email."
    },
    {
      question: "Quels sont les tarifs des consultations ?",
      answer: "Les tarifs sont de 70€ pour une consultation au cabinet et 65€ pour une consultation en ligne. Le paiement peut se faire par carte bancaire, chèque ou espèces pour les consultations au cabinet, et par carte bancaire pour les consultations en ligne."
    },
    {
      question: "Les consultations en ligne sont-elles aussi efficaces ?",
      answer: "Oui, les consultations en ligne peuvent être tout aussi efficaces que les consultations en présentiel. Elles offrent l'avantage de la flexibilité et permettent un suivi régulier même en cas de contraintes géographiques ou de mobilité. La qualité de l'écoute et de l'accompagnement reste la même."
    },
    {
      question: "Comment annuler ou reporter un rendez-vous ?",
      answer: "Pour annuler ou reporter un rendez-vous, merci de nous prévenir au moins 24h à l'avance. Vous pouvez nous contacter par téléphone ou par email. Les annulations tardives (moins de 24h) peuvent être facturées."
    },
    {
      question: "Combien de temps dure une séance ?",
      answer: "Une séance de psychothérapie dure généralement 50 minutes. Pour la première consultation, elle peut durer jusqu'à 1 heure pour permettre un bilan complet et l'établissement d'un plan de suivi personnalisé."
    },
    {
      question: "À quelle fréquence dois-je consulter ?",
      answer: "La fréquence des consultations dépend de vos besoins et de vos objectifs. En général, un rythme hebdomadaire ou bi-mensuel est recommandé en début de suivi, puis peut être espacé selon l'évolution. Nous définirons ensemble le rythme qui vous convient le mieux."
    },
    {
      question: "Les consultations sont-elles remboursées ?",
      answer: "Les consultations chez un psychologue ne sont pas remboursées par la Sécurité Sociale. Cependant, certaines mutuelles proposent une prise en charge partielle. Je vous remets une facture que vous pouvez transmettre à votre mutuelle."
    },
    {
      question: "Que se passe-t-il lors de la première consultation ?",
      answer: "La première consultation permet de faire connaissance et de comprendre votre demande. Nous discuterons de vos difficultés, de vos objectifs et de vos attentes. Je vous expliquerai mon approche thérapeutique et nous définirons ensemble un plan de suivi adapté à vos besoins."
    },
    {
      question: "Qu'est-ce que l'EMDR ?",
      answer: "L'EMDR (Eye Movement Desensitization and Reprocessing) est une thérapie efficace pour traiter les traumatismes et les troubles post-traumatiques. Elle utilise des mouvements oculaires pour aider le cerveau à traiter les souvenirs traumatiques et réduire leur impact émotionnel."
    },
    {
      question: "Puis-je venir accompagné(e) ?",
      answer: "Pour les consultations individuelles, il est préférable de venir seul(e) afin de créer un espace de parole libre et confidentiel. Pour la thérapie de couple ou familiale, la présence des deux partenaires ou des membres de la famille est nécessaire."
    },
    {
      question: "Comment fonctionne le secret professionnel ?",
      answer: "Le secret professionnel est absolu et protège tout ce qui est dit en consultation. Je ne peux révéler aucune information vous concernant à des tiers, sauf dans de très rares cas prévus par la loi (danger imminent pour vous ou autrui)."
    },
    {
      question: "Proposez-vous des consultations pour enfants ?",
      answer: "Oui, je reçois les enfants et adolescents à partir de 6 ans. Les consultations peuvent inclure des tests psychologiques (QI, troubles de l'apprentissage) et un accompagnement spécialisé pour les troubles comme le TDAH, la dyslexie, ou les difficultés émotionnelles."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Questions Fréquentes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez les réponses aux questions les plus courantes sur les consultations 
            de psychologie et le processus thérapeutique.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vous ne trouvez pas votre réponse ?
            </h2>
            <p className="text-lg text-gray-600">
              N'hésitez pas à me contacter directement pour toute question spécifique
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Prendre RDV</CardTitle>
                <CardDescription>
                  Réservez directement en ligne
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/booking">
                  <Button className="w-full">
                    Réserver maintenant
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Contact direct</CardTitle>
                <CardDescription>
                  Questions par téléphone ou email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/chat">
                  <Button variant="outline" className="w-full">
                    Ouvrir le chat
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Contact direct</CardTitle>
                <CardDescription>
                  Par téléphone ou email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">
                    Nous contacter
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}