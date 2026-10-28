// Every page in both languages, with hreflang alternates.
import type { APIRoute } from 'astro';
import { LANGS, localePath } from '../i18n';

const PATHS = ['/', '/hire', '/work', '/academy', '/privacy', '/terms', '/cookies'];
const SITE = 'https://despachobonsai.com';
const url = (lang: (typeof LANGS)[number], path: string) => SITE + (localePath(lang, path) === '/' ? '/' : localePath(lang, path));

export const GET: APIRoute = () => {
  const entries = PATHS.flatMap(path =>
    LANGS.map(lang => `  <url>
    <loc>${url(lang, path)}</loc>
${LANGS.map(alt => `    <xhtml:link rel="alternate" hreflang="${alt === 'es' ? 'es-MX' : 'en'}" href="${url(alt, path)}"/>`).join('\n')}
  </url>`)
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
