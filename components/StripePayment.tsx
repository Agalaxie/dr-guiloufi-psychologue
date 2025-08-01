'use client'

import { useState, useEffect } from 'react'
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react'

interface StripePaymentProps {
  appointmentId: string
  consultationType: 'physical' | 'online'
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
}

interface PaymentFormProps {
  appointmentId: string
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
}

function PaymentForm({ appointmentId, amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success?appointment=${appointmentId}`,
      },
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'Une erreur est survenue')
        onError(error.message || 'Erreur de paiement')
      } else {
        setMessage('Une erreur inattendue est survenue')
        onError('Erreur inattendue')
      }
    } else {
      onSuccess()
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Consultation en ligne</span>
          </div>
          <span className="text-2xl font-bold text-blue-900">{amount}€</span>
        </div>

        <div className="border rounded-lg p-4">
          <PaymentElement />
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Lock className="w-4 h-4" />
          <span>Paiement sécurisé par Stripe</span>
        </div>
      </div>

      {message && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700">{message}</span>
        </div>
      )}

      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Traitement en cours...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Payer {amount}€
          </>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        En cliquant sur "Payer", vous acceptez nos conditions générales de vente.
        Aucune donnée de carte n'est stockée sur nos serveurs.
      </div>
    </form>
  )
}

export default function StripePayment({ 
  appointmentId, 
  consultationType, 
  amount, 
  onSuccess, 
  onError 
}: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Créer le Payment Intent côté serveur
    fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appointmentId,
        consultationType,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          onError(data.error)
        } else {
          setClientSecret(data.clientSecret)
        }
        setLoading(false)
      })
      .catch((error) => {
        onError('Erreur lors de l\'initialisation du paiement')
        setLoading(false)
      })
  }, [appointmentId, consultationType, onError])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Paiement sécurisé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Initialisation du paiement...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            Erreur de paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Impossible d'initialiser le paiement. Veuillez réessayer.
          </p>
        </CardContent>
      </Card>
    )
  }

  const stripePromise = getStripe()

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Paiement sécurisé
        </CardTitle>
        <CardDescription>
          Finalisation de votre réservation pour la consultation en ligne
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements options={options} stripe={stripePromise}>
          <PaymentForm 
            appointmentId={appointmentId}
            amount={amount}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </CardContent>
    </Card>
  )
}