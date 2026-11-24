// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

const MIYAGI_SELL = 'https://miyagisanchez.com/mx/vende';

// Static site: the forward-deployed-product homepage plus legal pages, English only (it serves US teams).
// Redirects cover every URL the old sites served (including the retired /es twin, /work, /academy, /hire),
// each pointing at its final destination in one hop; the adapter turns them into Vercel 301s.
export default defineConfig({
  site: 'https://despachobonsai.com',
  trailingSlash: 'never',
  adapter: vercel(),
  build: { inlineStylesheets: 'always' },
  redirects: {
    '/index.html': '/',
    '/privacy.html': '/privacy',
    '/terms.html': '/terms',
    '/cookies.html': '/cookies',
    '/bonsai-academy.html': '/',
    '/bonsai-academy': '/',
    '/bonsai-os.html': '/',
    '/bonsai-os': '/',
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
    '/screencast.html': '/',
    '/screencast': '/',
    '/work': '/',
    '/academy': '/',
    '/hire': '/',
    '/es': '/',
    '/es/work': '/',
    '/es/academy': '/',
    '/es/hire': '/',
    '/es/privacy': '/privacy',
    '/es/terms': '/terms',
    '/es/cookies': '/cookies',
  },
});
