// Module hooks so `node --test` can import the app's TypeScript as it is, with no extra package:
// Node 24 strips the types itself; these hooks only resolve "@/x" to the repo root and add the ".ts" /
// ".tsx" / "/index.ts" that the source leaves off (Next's bundler does the same). Registered by
// tests/register.mjs.
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXTS = ['.ts', '.tsx', '.mjs', '.js', '/index.ts', '/index.tsx'];

function find(base) {
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const ext of EXTS) if (existsSync(base + ext)) return base + ext;
  return null;
}

export async function resolve(specifier, context, next) {
  let base = null;
  if (specifier.startsWith('@/')) base = path.join(ROOT, specifier.slice(2));
  else if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.startsWith('file:')) {
    base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
  }
  if (base) {
    const file = find(base);
    if (file) return next(pathToFileURL(file).href, context);
  }
  return next(specifier, context);
}
