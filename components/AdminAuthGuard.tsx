'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      
      if (!token) {
        router.push('/admin/login')
        return
      }

      try {
        // Vérifier que le token est encore valide
        const response = await fetch('/api/admin/verify-token', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          setIsAuth(true)
        } else {
          localStorage.removeItem('admin_token')
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Erreur vérification auth:', error)
        localStorage.removeItem('admin_token')
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Vérification...</p>
        </div>
      </div>
    )
  }

  if (!isAuth) {
    return null // La redirection vers login est en cours
  }

  return <>{children}</>
}