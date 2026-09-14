/**
 * Minimal static server for the smoke tests.
 *
 * `astro preview` delegates to the Netlify CLI when the Netlify adapter is in
 * use, which is too heavy (and too network-dependent) for CI. This serves the
 * real production build and reproduces the two Netlify behaviours the tests
 * care about: the root redirect from `netlify.toml`, and 404.html served with
 * an actual 404 status.
 *
 * It intentionally does NOT emulate the Keystatic SSR function — that is
 * verified by hand in dev, per SETUP.md.
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const ROOT = new URL('../apps/site/dist/', import.meta.url).pathname;
const PORT = Number(process.env.PORT ?? 4321);
const DEFAULT_LOCALE = 'de';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

function resolve(pathname) {
  // Block traversal before touching the filesystem.
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const candidate = join(ROOT, safe);
  if (!candidate.startsWith(ROOT)) return null;

  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;

  const asIndex = join(candidate, 'index.html');
  if (existsSync(asIndex)) return asIndex;

  const asHtml = `${candidate.replace(/\/$/, '')}.html`;
  if (existsSync(asHtml)) return asHtml;

  return null;
}

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  // Mirrors the root redirect in apps/site/netlify.toml.
  if (pathname === '/') {
    res.writeHead(302, { location: `/${DEFAULT_LOCALE}/` });
    res.end();
    return;
  }

  const file = resolve(pathname);

  if (!file) {
    const notFound = join(ROOT, '404.html');
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    if (existsSync(notFound)) {
      createReadStream(notFound).pipe(res);
    } else {
      res.end('Not found');
    }
    return;
  }

  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`[smoke] serving ${ROOT} on http://localhost:${PORT}`);
});
