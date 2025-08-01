import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Configuration Stripe côté serveur
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Configuration Stripe côté client
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Prix des consultations
export const CONSULTATION_PRICES = {
  physical: 60, // €60 pour consultation physique
  online: 60,   // €60 pour consultation en ligne
} as const

// Devises supportées
export const CURRENCIES = {
  EUR: 'eur',
  USD: 'usd',
} as const

export type ConsultationType = keyof typeof CONSULTATION_PRICES
export type Currency = keyof typeof CURRENCIES