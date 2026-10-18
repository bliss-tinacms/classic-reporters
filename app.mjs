import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Passenger may start Node with the public document root as cwd. Resolve the
// protected runtime environment relative to this startup file first so CMS
// saves remain Tina-first instead of silently falling back to deployed files.
const appRoot = dirname(fileURLToPath(import.meta.url));
const envFiles = [process.env.SITE_ENV_FILE, join(appRoot, '.env'), resolve('.env')].filter(Boolean);

for (const envFile of envFiles) {
  if (!existsSync(envFile)) continue;
  const content = readFileSync(envFile, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const index = line.indexOf('=');
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    value = value.replace(/^['"]|['"]$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
}

const { startServer } = await import('./dist/server/entry.mjs');

startServer();
