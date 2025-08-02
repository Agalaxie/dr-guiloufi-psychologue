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
  try {
    const calendar = createCalendarClient();
    
    // Convertir date + time en datetime ISO
    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 heure

    // Chercher les événements à ce moment
    const response = await calendar.events.list({
      calendarId: googleCalendarConfig.calendarId,
      timeMin: startDateTime.toISOString(),
      timeMax: endDateTime.toISOString(),
      singleEvents: true,
    });

    const events = response.data.items || [];
    
    // Si des événements existent, le créneau n'est pas disponible
    return events.length === 0;
  } catch (error) {
    console.error('Erreur vérification disponibilité:', error);
    // En cas d'erreur, considérer comme non disponible pour éviter les doubles réservations
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
        // Événement avec heure précise
        const startTime = new Date(event.start.dateTime);
        const hour = startTime.getHours().toString().padStart(2, '0');
        busySlots.push(`${hour}:00`);
      } else if (event.start?.date) {
        // Événement "toute la journée" - bloquer tous les créneaux
        const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
        busySlots.push(...TIME_SLOTS);
      }
    });

    console.log(`Busy slots found: ${JSON.stringify(busySlots)}`);
    return [...new Set(busySlots)]; // Supprimer les doublons
  } catch (error) {
    console.error('Erreur récupération créneaux occupés:', error);
    return [];
  }
}