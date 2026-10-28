// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

const MIYAGI_SELL = 'https://miyagisanchez.com/mx/vende';

// Static site with one server route (/api/cal, which holds the Cal.com key). Every page and its /es/ twin are
// prerendered. Redirects cover every URL the old static site served; the adapter turns them into Vercel 301s.
export default defineConfig({
  site: 'https://despachobonsai.com',
  trailingSlash: 'never',
  adapter: vercel(),
  redirects: {
    '/index.html': '/',
    '/privacy.html': '/privacy',
    '/terms.html': '/terms',
    '/cookies.html': '/cookies',
    '/bonsai-academy.html': '/academy',
    '/bonsai-academy': '/academy',
    '/bonsai-os.html': '/academy',
    '/bonsai-os': '/academy',
    '/bonsai-commerce.html': MIYAGI_SELL,
    '/bonsai-commerce': MIYAGI_SELL,
    '/commerce.html': MIYAGI_SELL,
    '/commerce': MIYAGI_SELL,
    '/agency.html': '/',
    '/agency': '/',
    '/creators.html': '/',
    '/creators': '/',
    '/merchants.html': '/',
    '/merchants': '/',
    '/executive-agent.html': '/',
    '/executive-agent': '/',
    '/screencast.html': '/work',
    '/screencast': '/work',
  },
});
