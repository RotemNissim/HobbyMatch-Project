import { google } from 'googleapis';
import { Request, Response, NextFunction } from 'express';

const CLIENT_ID = '365510232766-7chr7rdo0pb7e3j8c7phm80o062ss9s7.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/calendar/callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// פונקציה ליצירת הפנייה לאימות
export const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.readonly'
      ]
    });
    res.redirect(authUrl); 
  } catch (error) {
    next(error);
  }
};

// פונקציה לעיבוד קוד החזרה מגוגל לאחר האימות
export const callback = async (req: Request, res: Response, next: NextFunction) : Promise <Response> => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send('No authorization code found');
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return res.status(200).send('OK');

    // כאן תוכל לשמור את ה-tokens ב-session או במאגר נתונים
    res.send('Google login successful!');
  } catch (error) {
    next(error);
    return res.status(400).send('Google login failed');
  }
};

// פונקציה לקבלת אירועים מקלנדר
export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const events = await calendar.events.list({
      calendarId: 'primary', // או מזהה קלנדר אחר
      timeMin: (new Date()).toISOString(), // אירועים מהזמן הנוכחי
      maxResults: 10, // מספר האירועים להחזיר
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    res.json(events.data.items);
  } catch (error) {
    next(error);
  }
};

// פונקציה ליצירת אירוע חדש
export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const event = {
      summary: 'New Event',
      location: '123 Main St',
      description: 'A new event created via Google Calendar API.',
      start: {
        dateTime: '2025-03-20T10:00:00-07:00', // תאריך ושעה להתחלה
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: '2025-03-20T12:00:00-07:00', // תאריך ושעה לסיום
        timeZone: 'America/Los_Angeles',
      },
    };

    const createdEvent = await calendar.events.insert({
      calendarId: 'primary', // או מזהה קלנדר אחר
      requestBody: event,
    });

    res.json(createdEvent.data);
  } catch (error) {
    next(error);
  }
};
