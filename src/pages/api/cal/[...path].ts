// Server-side proxy for the booking modal, so the Cal.com key never reaches the browser.
// It forwards only the three calls the modal makes, and only for the site's own event (miyagisan/bonsaitalk):
//   GET  /api/cal/event-types      → that event's types (the client's query string is ignored)
//   GET  /api/cal/slots/available  → free slots, for an allowed eventTypeId
//   POST /api/cal/bookings         → a booking, for an allowed eventTypeId, with only the fields the modal sends
import type { APIRoute } from 'astro';

export const prerender = false;

const API = 'https://api.cal.com/v2';
const USERNAME = 'miyagisan';
const SLUG = 'bonsaitalk';
const VERSION = '2024-06-14';
const ALLOWED_TTL_MS = 10 * 60 * 1000;

let allowed: { ids: Set<number>; at: number } | null = null;

function key(): string {
  const k = process.env.CALCOM_KEY ?? import.meta.env.CALCOM_KEY;
  if (!k) throw new Error('CALCOM_KEY is not set');
  return k;
}

function cal(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(API + path, {
    ...init,
    headers: { Authorization: `Bearer ${key()}`, 'cal-api-version': VERSION, 'Content-Type': 'application/json' },
  });
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const passthrough = async (res: Response) =>
  new Response(await res.text(), { status: res.status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

type EventType = { id: number; slug?: string };

// Cal.com returns every event type on the account (including private ones), whatever the slug filter says,
// so the list is narrowed to the site's own event here and nothing else ever leaves the server.
async function siteEventTypes(): Promise<EventType[]> {
  const data = await (await cal(`/event-types?username=${USERNAME}&slug=${SLUG}`)).json();
  const raw = data?.data;
  const types: EventType[] = Array.isArray(raw)
    ? raw
    : raw?.eventTypeGroups
      ? raw.eventTypeGroups.flatMap((g: { eventTypes?: EventType[] }) => g.eventTypes ?? [])
      : raw?.eventTypes ?? [];
  return types.filter(t => t.slug === SLUG);
}

// The event type ids the modal may book.
async function allowedIds(): Promise<Set<number>> {
  if (allowed && Date.now() - allowed.at < ALLOWED_TTL_MS) return allowed.ids;
  const ids = new Set((await siteEventTypes()).map(t => Number(t.id)));
  allowed = { ids, at: Date.now() };
  return ids;
}

export const GET: APIRoute = async ({ params, url }) => {
  try {
    if (params.path === 'event-types') return json({ status: 'success', data: await siteEventTypes() });
    if (params.path === 'slots/available') {
      const id = Number(url.searchParams.get('eventTypeId'));
      if (!(await allowedIds()).has(id)) return json({ status: 'error', error: 'Unknown event type' }, 400);
      const q = new URLSearchParams({ eventTypeId: String(id) });
      for (const k of ['startTime', 'endTime', 'timeZone']) {
        const v = url.searchParams.get(k);
        if (v) q.set(k, v);
      }
      return passthrough(await cal(`/slots/available?${q}`));
    }
    return json({ status: 'error', error: 'Not found' }, 404);
  } catch (err) {
    console.error('[api/cal]', err);
    return json({ status: 'error', error: 'Booking is temporarily unavailable.' }, 502);
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  if (params.path !== 'bookings') return json({ status: 'error', error: 'Not found' }, 404);
  try {
    const body = await request.json();
    const id = Number(body?.eventTypeId);
    const { name, email, timeZone } = body?.attendee ?? {};
    if (!(await allowedIds()).has(id)) return json({ status: 'error', error: 'Unknown event type' }, 400);
    if (typeof body?.start !== 'string' || typeof name !== 'string' || typeof email !== 'string') {
      return json({ status: 'error', error: 'Name, email and a time are required.' }, 400);
    }
    return passthrough(await cal('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        eventTypeId: id,
        start: body.start,
        attendee: { name: name.slice(0, 200), email: email.slice(0, 320), timeZone: typeof timeZone === 'string' ? timeZone : 'UTC' },
        metadata: {},
      }),
    }));
  } catch (err) {
    console.error('[api/cal]', err);
    return json({ status: 'error', error: 'Booking is temporarily unavailable.' }, 502);
  }
};
