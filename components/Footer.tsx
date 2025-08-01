import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Informations de contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-gray-600">Paris 18ème</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-gray-600">01 XX XX XX XX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-gray-600">contact@dr-guiloufi.fr</span>
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Horaires</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Lundi - Vendredi</span>
                <span>9h - 19h</span>
              </div>
              <div className="flex justify-between">
                <span>Samedi</span>
                <span>9h - 17h</span>
              </div>
              <div className="flex justify-between">
                <span>Dimanche</span>
                <span>Fermé</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Navigation</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-600 hover:text-primary transition-colors">
                Accueil
              </Link>
              <Link href="/about" className="block text-gray-600 hover:text-primary transition-colors">
                À propos
              </Link>
              <Link href="/services" className="block text-gray-600 hover:text-primary transition-colors">
                Services
              </Link>
              <Link href="/booking" className="block text-gray-600 hover:text-primary transition-colors">
                Prendre RDV
              </Link>
              <Link href="/faq" className="block text-gray-600 hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* Services principaux */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Spécialités</h3>
            <div className="space-y-2 text-gray-600">
              <div>Dépression</div>
              <div>Anxiété</div>
              <div>Thérapie de couple</div>
              <div>EMDR</div>
              <div>Hypnose</div>
              <div>Thérapie brève</div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2024 Dr. Guiloufi - Psychologue. Tous droits réservés.</p>
          <p className="mt-2 text-sm">
            Site conforme aux réglementations en vigueur sur la protection des données personnelles.
          </p>
        </div>
      </div>
    </footer>
  )
}