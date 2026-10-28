// @ts-check
import { defineConfig } from 'astro/config';

// Static site: every page and its /es/ twin are prerendered. Redirects for the old .html URLs live in vercel.json.
export default defineConfig({
  site: 'https://despachobonsai.com',
  trailingSlash: 'never',
  build: { format: 'file' },
});
