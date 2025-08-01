'use client'

import { useState, useRef, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, MessageCircle, Clock, User } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'doctor'
  timestamp: Date
}

export default function ChatPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [userName, setUserName] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleConnect = () => {
    if (userName.trim()) {
      setIsConnected(true)
      // Message de bienvenue automatique
      setMessages([{
        id: 1,
        text: `Bonjour ${userName}, je suis Dr. Guiloufi. Comment puis-je vous aider aujourd'hui ? Ce chat est destiné aux questions générales. Pour une consultation approfondie, je vous invite à prendre rendez-vous.`,
        sender: 'doctor',
        timestamp: new Date()
      }])
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && isConnected) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, userMessage])
      setNewMessage('')
      
      // Simulation de "en train d'écrire"
      setIsTyping(true)
      
      // Réponse automatique simulée (en production, ce serait connecté à un vrai système de chat)
      setTimeout(() => {
        setIsTyping(false)
        const doctorResponse: Message = {
          id: messages.length + 2,
          text: getAutomaticResponse(newMessage),
          sender: 'doctor',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, doctorResponse])
      }, 2000)
    }
  }

  const getAutomaticResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('rendez-vous') || lowerMessage.includes('rdv') || lowerMessage.includes('consultat')) {
      return "Pour prendre rendez-vous, vous pouvez utiliser notre système de réservation en ligne ou me contacter directement. Souhaitez-vous que je vous guide vers la page de réservation ?"
    }
    
    if (lowerMessage.includes('tarif') || lowerMessage.includes('prix') || lowerMessage.includes('coût')) {
      return "Les consultations sont de 70€ au cabinet et 65€ en ligne. Certaines mutuelles proposent une prise en charge partielle. Avez-vous d'autres questions sur les modalités ?"
    }
    
    if (lowerMessage.includes('urgence') || lowerMessage.includes('aide') || lowerMessage.includes('crise')) {
      return "Si vous êtes en situation d'urgence, je vous conseille de contacter le 15 (SAMU) ou de vous rendre aux urgences. Pour un soutien psychologique immédiat, vous pouvez appeler SOS Amitié au 09 72 39 40 50. Nous pouvons également planifier une consultation rapide."
    }
    
    if (lowerMessage.includes('dépression') || lowerMessage.includes('anxiété') || lowerMessage.includes('stress')) {
      return "Je comprends que vous traversez une période difficile. Les troubles anxieux et dépressifs sont très courants et se soignent bien avec un accompagnement adapté. Nous pourrions en discuter plus en détail lors d'une consultation. Souhaitez-vous prendre rendez-vous ?"
    }
    
    if (lowerMessage.includes('couple') || lowerMessage.includes('relation')) {
      return "Les difficultés relationnelles peuvent être travaillées en thérapie de couple. Je propose des séances où les deux partenaires peuvent s'exprimer dans un cadre neutre et bienveillant. Seriez-vous intéressé(e) par ce type d'accompagnement ?"
    }
    
    if (lowerMessage.includes('enfant') || lowerMessage.includes('adolescent')) {
      return "Je reçois les enfants et adolescents à partir de 6 ans. Les consultations peuvent inclure des bilans psychologiques et un accompagnement pour divers troubles (TDAH, difficultés scolaires, troubles anxieux...). Voulez-vous en savoir plus ?"
    }
    
    if (lowerMessage.includes('en ligne') || lowerMessage.includes('visio')) {
      return "Les consultations en ligne se déroulent par vidéoconférence sécurisée. Elles sont aussi efficaces que les consultations en présentiel et offrent plus de flexibilité. Le tarif est de 65€. Souhaitez-vous essayer ce format ?"
    }
    
    // Réponse par défaut
    return "Merci pour votre message. Pour mieux vous accompagner et répondre à vos besoins spécifiques, je vous invite à prendre rendez-vous pour une consultation. Avez-vous d'autres questions que je puisse clarifier ici ?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-md mx-auto px-4 py-16">
          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Chat avec Dr. Guiloufi</CardTitle>
              <CardDescription>
                Posez vos questions générales et obtenez des informations sur les consultations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                  Votre prénom
                </label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Entrez votre prénom"
                  onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Information importante :</strong><br />
                  Ce chat est destiné aux questions générales et aux informations pratiques. 
                  Il ne remplace pas une consultation psychologique professionnelle.
                </p>
              </div>
              
              <Button 
                onClick={handleConnect} 
                disabled={!userName.trim()}
                className="w-full"
              >
                Commencer le chat
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Dr. Guiloufi</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <CardDescription>En ligne</CardDescription>
                  </div>
                </div>
              </div>
              <Badge variant="outline">Chat actif</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>
          
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Appuyez sur Entrée pour envoyer • Ce chat ne remplace pas une consultation
            </p>
          </div>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}