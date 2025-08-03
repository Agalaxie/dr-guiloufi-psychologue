import { NextRequest, NextResponse } from 'next/server';
import { testEmailConfig, sendEmail } from '@/lib/email-config';
import { getClientConfirmationEmail, getDoctorNotificationEmail, AppointmentEmailData } from '@/lib/email-templates';

export async function GET(request: NextRequest) {
  try {
    // Tester la configuration email
    const configTest = await testEmailConfig();
    
    if (!configTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Configuration email invalide',
        details: configTest.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Configuration email valide',
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        from: process.env.SMTP_FROM,
        psychologist_email: process.env.PSYCHOLOGIST_EMAIL,
      }
    });

  } catch (error) {
    console.error('Erreur test email:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors du test email',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { test_email } = await request.json();

    if (!test_email) {
      return NextResponse.json({
        success: false,
        error: 'Email de test requis'
      }, { status: 400 });
    }

    // Données de test
    const testData: AppointmentEmailData = {
      clientName: 'Jean Dupont',
      date: '2024-12-15',
      time: '14:00',
      consultationType: 'cabinet',
      reason: 'Test du système d\'email',
      message: 'Ceci est un email de test pour vérifier le bon fonctionnement du système.',
      clientEmail: test_email,
      clientPhone: '06 12 34 56 78',
    };

    // Test email client
    const clientEmailResult = await sendEmail({
      to: test_email,
      subject: '🧪 Test - Email de confirmation client',
      html: getClientConfirmationEmail(testData),
    });

    // Test email docteur
    const doctorEmailResult = await sendEmail({
      to: process.env.PSYCHOLOGIST_EMAIL || 'stephdumaz@gmail.com',
      subject: '🧪 Test - Email de notification docteur',
      html: getDoctorNotificationEmail(testData),
    });

    return NextResponse.json({
      success: true,
      message: 'Emails de test envoyés',
      results: {
        client_email: {
          success: clientEmailResult.success,
          error: clientEmailResult.error || null,
          messageId: clientEmailResult.success ? clientEmailResult.messageId : null
        },
        doctor_email: {
          success: doctorEmailResult.success,
          error: doctorEmailResult.error || null,
          messageId: doctorEmailResult.success ? doctorEmailResult.messageId : null
        }
      }
    });

  } catch (error) {
    console.error('Erreur envoi email test:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de l\'envoi des emails de test',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}