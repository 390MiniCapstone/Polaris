import { GoogleEvent } from '@/constants/GoogleEvent';

const useless = 'test';

export async function fetchCalendars(accessToken: string) {
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/users/me/calendarList',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data.items;
}

export async function fetchNextEvent(
  accessToken: string,
  calendarId: string
): Promise<GoogleEvent | null> {
  const now = new Date().toISOString();

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?timeMin=${now}&singleEvents=true&orderBy=startTime&maxResults=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  if (response.ok && data.items?.length > 0) {
    return data.items[0] as GoogleEvent;
  }
  return null;
}
