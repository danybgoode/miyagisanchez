// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

const MIYAGI_SELL = 'https://miyagisanchez.com/mx/vende';

// Static site with one server route (/api/cal, which holds the Cal.com key). Every page and its /es/ twin are
// prerendered. Redirects cover every URL the old static site served; the adapter turns them into 301s.
// Hosted on Cloudflare Workers (static assets + the one route), deployed by .github/workflows/deploy.yml.
// No sessions and no Images binding: nothing here uses either, and each would make the deploy provision one.
export default defineConfig({
  site: 'https://despachobonsai.com',
  trailingSlash: 'never',
  adapter: cloudflare({ imageService: 'passthrough' }),
  session: false,
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
