import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { supabaseAdmin } from '@/lib/supabase'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.SMTP_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user.email) {
        try {
          // Vérifier si l'utilisateur existe dans Supabase
          const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single()

          if (!existingUser) {
            // Créer nouvel utilisateur
            const { error } = await supabaseAdmin
              .from('users')
              .insert([
                {
                  email: user.email,
                  name: user.name,
                  role: user.email === process.env.DOCTOR_EMAIL ? 'admin' : 'patient',
                  avatar_url: user.image,
                }
              ])
            
            if (error) {
              console.error('Erreur création utilisateur:', error)
              return false
            }
          }
        } catch (error) {
          console.error('Erreur signIn:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          // Récupérer le rôle de l'utilisateur
          const { data: userData } = await supabaseAdmin
            .from('users')
            .select('role, id')
            .eq('email', session.user.email)
            .single()

          if (userData) {
            // @ts-ignore
            session.user.role = userData.role
            // @ts-ignore
            session.user.id = userData.id
          }
        } catch (error) {
          console.error('Erreur session:', error)
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }