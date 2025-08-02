import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dr. Guiloufi - Psychologue à Paris 18',
  description: 'Consultations de psychologie, thérapie individuelle et de couple à Paris 18. Spécialisé en dépression, anxiété, EMDR, hypnose et thérapie brève.',
  keywords: 'psychologue, Paris 18, thérapie, dépression, anxiété, EMDR, hypnose, couple',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}