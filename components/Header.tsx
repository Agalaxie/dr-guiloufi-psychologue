'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Calendar, User } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et nom */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-2">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dr. Guiloufi</h1>
              <p className="text-sm text-gray-600">Psychologue</p>
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary transition-colors">
              À propos
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Boutons d'action */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/booking">
              <Button size="lg">
                <Calendar className="h-4 w-4 mr-2" />
                Prendre RDV
              </Button>
            </Link>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Menu mobile ouvert */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                href="/services"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/faq"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="px-3 py-2">
                <Link href="/booking" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    Prendre RDV
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}