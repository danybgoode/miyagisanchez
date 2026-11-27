// Every indexable page. English for US teams, plus /negocios (Spanish, Mexico City owner-operators). The old /es twin redirects home.
import type { APIRoute } from 'astro';

const PATHS = ['/', '/negocios', '/privacy', '/terms', '/cookies'];
const SITE = 'https://despachobonsai.com';

export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PATHS.map(p => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
