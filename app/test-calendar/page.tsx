'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestCalendarPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testCalendarConnection = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/calendar/check-availability', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      setTestResult({
        success: response.ok,
        status: response.status,
        data: result
      })
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    } finally {
      setLoading(false)
    }
  }

  const testSpecificDate = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      // Tester lundi 4 (votre événement)
      const today = new Date()
      const testDate = new Date(today.getFullYear(), today.getMonth(), 4) // 4 du mois
      if (testDate < today) {
        testDate.setMonth(testDate.getMonth() + 1) // Mois prochain si déjà passé
      }

      const response = await fetch('/api/calendar/check-availability?' + new URLSearchParams({
        date: testDate.toISOString().split('T')[0]
      }))

      const result = await response.json()
      setTestResult({
        success: response.ok,
        status: response.status,
        date: testDate.toISOString().split('T')[0],
        data: result
      })
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Test Google Calendar API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-4">
              <Button 
                onClick={testCalendarConnection}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Test en cours...' : '🔗 Tester la connexion Google Calendar'}
              </Button>

              <Button 
                onClick={testSpecificDate}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Test en cours...' : '📅 Tester créneaux pour le 4 du mois'}
              </Button>
            </div>

            {testResult && (
              <Card className={testResult.success ? 'border-green-500' : 'border-red-500'}>
                <CardHeader>
                  <CardTitle className={testResult.success ? 'text-green-600' : 'text-red-600'}>
                    {testResult.success ? '✅ Succès' : '❌ Erreur'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Status:</strong> {testResult.status}</p>
                    {testResult.date && <p><strong>Date testée:</strong> {testResult.date}</p>}
                    
                    {testResult.data && (
                      <div>
                        <strong>Réponse:</strong>
                        <pre className="bg-gray-100 p-3 rounded mt-2 text-sm overflow-auto">
                          {JSON.stringify(testResult.data, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {testResult.error && (
                      <p className="text-red-600"><strong>Erreur:</strong> {testResult.error}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold text-blue-800 mb-2">🔍 Diagnostic</h3>
              <p className="text-sm text-blue-700">
                Cette page teste si votre application peut se connecter à Google Calendar.
                Si vous avez créé un événement "Occupé" le lundi 4 à 14h, il devrait apparaître dans "busySlots".
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}