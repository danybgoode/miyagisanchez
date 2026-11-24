// Every indexable page. English only: the site serves US teams, and the old /es twin redirects here.
import type { APIRoute } from 'astro';

const PATHS = ['/', '/privacy', '/terms', '/cookies'];
const SITE = 'https://despachobonsai.com';

export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PATHS.map(p => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
