import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) =>
  new Response(
    site?.hostname === 'example.invalid'
      ? 'User-agent: *\nDisallow: /\n'
      : `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', site)}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
