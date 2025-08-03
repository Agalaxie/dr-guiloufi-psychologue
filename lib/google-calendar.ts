import { google } from 'googleapis';

// Configuration Google Calendar
export const googleCalendarConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN!,
  calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary', // 'primary' pour le calendrier principal
};

// Créer client OAuth2
export function createOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    googleCalendarConfig.clientId,
    googleCalendarConfig.clientSecret,
    googleCalendarConfig.redirectUri
  );

  oauth2Client.setCredentials({
    refresh_token: googleCalendarConfig.refreshToken,
  });

  return oauth2Client;
}

// Créer client Google Calendar
export function createCalendarClient() {
  const auth = createOAuth2Client();
  return google.calendar({ version: 'v3', auth });
}

// Vérifier si un créneau est disponible
export async function isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
  console.log(`=== isTimeSlotAvailable called with date: ${date}, time: ${time} ===`);
  
  try {
    const calendar = createCalendarClient();
    console.log('✅ Calendar client created successfully');
    
    // Convertir date + time en datetime ISO avec timezone France
    const startDateTime = new Date(`${date}T${time}:00+02:00`); // Timezone France été
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 heure

    console.log(`Checking availability for ${date} ${time}`);
    console.log(`Start: ${startDateTime.toISOString()}, End: ${endDateTime.toISOString()}`);

    // Chercher les événements à ce moment
    console.log('📅 Calling Google Calendar API...');
    const response = await calendar.events.list({
      calendarId: googleCalendarConfig.calendarId,
      timeMin: startDateTime.toISOString(),
      timeMax: endDateTime.toISOString(),
      singleEvents: true,
    });

    console.log('✅ Google Calendar API response received');
    const events = response.data.items || [];
    console.log(`Found ${events.length} events for this time slot`);
    
    if (events.length > 0) {
      console.log('Events found:', events.map(e => ({ summary: e.summary, start: e.start })));
    }
    
    // Si des événements existent, le créneau n'est pas disponible
    const available = events.length === 0;
    console.log(`🎯 FINAL RESULT: Slot ${date} ${time} is ${available ? 'AVAILABLE' : 'BUSY'}`);
    return available;
  } catch (error) {
    console.error('❌ ERREUR dans isTimeSlotAvailable:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    // En cas d'erreur, considérer comme non disponible pour éviter les doubles réservations
    console.log('🚫 Returning FALSE due to error');
    return false;
  }
}

// Créer un événement de réservation
export async function createAppointmentEvent(appointmentData: {
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  reason: string;
  message?: string;
}) {
  try {
    const calendar = createCalendarClient();
    
    const { date, time, clientName, clientEmail, clientPhone, reason, message } = appointmentData;
    
    // Convertir en datetime
    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 heure

    // Créer l'événement
    const event = {
      summary: `RDV - ${clientName}`,
      description: `
Client: ${clientName}
Email: ${clientEmail}
Téléphone: ${clientPhone}
Motif: ${reason}
${message ? `Message: ${message}` : ''}

Réservation confirmée et payée (60€)
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Paris',
      },
      attendees: [
        { email: clientEmail, displayName: clientName },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24h avant
          { method: 'popup', minutes: 60 }, // 1h avant
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: googleCalendarConfig.calendarId,
      requestBody: event,
    });

    return {
      success: true,
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
    };
  } catch (error) {
    console.error('Erreur création événement:', error);
    return {
      success: false,
      error: 'Erreur lors de la création du rendez-vous',
    };
  }
}

// Obtenir les créneaux occupés pour une date donnée
export async function getBusySlots(date: string): Promise<string[]> {
  try {
    const calendar = createCalendarClient();
    
    // Essayons d'abord de lister tous les calendriers pour débugger
    try {
      const calendarList = await calendar.calendarList.list();
      console.log('Available calendars:');
      calendarList.data.items?.forEach(cal => {
        console.log(`- ${cal.id}: ${cal.summary} (primary: ${cal.primary})`);
      });
    } catch (calErr) {
      console.error('Error listing calendars:', calErr);
    }
    
    // Début et fin de la journée
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    console.log(`Checking calendar for date: ${date}`);
    console.log(`Time range: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);
    console.log(`Calendar ID: ${googleCalendarConfig.calendarId}`);

    const response = await calendar.events.list({
      calendarId: googleCalendarConfig.calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    const busySlots: string[] = [];

    console.log(`Found ${events.length} events for ${date}`);
    events.forEach((event, index) => {
      console.log(`Event ${index + 1}:`, {
        summary: event.summary,
        start: event.start,
        dateTime: event.start?.dateTime,
        date: event.start?.date
      });
    });

    events.forEach(event => {
      if (event.start?.dateTime) {
        // Événement avec heure précise - Convertir en timezone France
        const startTime = new Date(event.start.dateTime);
        
        // Convertir en heure française (Europe/Paris)
        const frenchTime = new Intl.DateTimeFormat('fr-FR', {
          timeZone: 'Europe/Paris',
          hour: '2-digit',
          hour12: false
        }).format(startTime);
        
        console.log(`Event "${event.summary}" at ${event.start.dateTime} → ${frenchTime}:00 (France time)`);
        busySlots.push(`${frenchTime}:00`);
      } else if (event.start?.date) {
        // Événement "toute la journée" - bloquer tous les créneaux
        const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
        busySlots.push(...TIME_SLOTS);
      }
    });

    console.log(`Busy slots found: ${JSON.stringify(busySlots)}`);
    return Array.from(new Set(busySlots)); // Supprimer les doublons
  } catch (error) {
    console.error('Erreur récupération créneaux occupés:', error);
    return [];
  }
}