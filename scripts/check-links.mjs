#!/usr/bin/env node
/**
 * Internal link + asset checker for the static site.
 * Scans every .html file for local href/src references and verifies the
 * target exists on disk. Ignores external URLs, anchors, mailto/tel/wa.me,
 * and root-absolute paths served by the host (/favicon.svg, /assets/...).
 * Exits non-zero if any reference is broken.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';

const root = process.cwd();

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === '.git' || entry === 'node_modules') continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const files = walk(root);
const attrRe = /(?:href|src)\s*=\s*"([^"]+)"/gi;
let broken = 0;
let checked = 0;

const skip = (url) =>
  url.startsWith('http://') || url.startsWith('https://') ||
  url.startsWith('#') || url.startsWith('mailto:') ||
  url.startsWith('tel:') || url.startsWith('data:') ||
  url.startsWith('//');

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  let m;
  while ((m = attrRe.exec(html))) {
    let url = m[1].trim();
    if (skip(url)) continue;
    url = url.split('#')[0].split('?')[0];
    if (!url) continue;
    // Root-absolute → resolve from project root; else relative to the file.
    const target = url.startsWith('/')
      ? resolve(root, '.' + url)
      : resolve(dirname(file), url);
    checked++;
    if (!existsSync(target)) {
      broken++;
      console.error(`BROKEN  ${file.replace(root + '/', '')}  ->  ${m[1]}`);
    }
  }
}

console.log(`Checked ${checked} local references across ${files.length} HTML files.`);
if (broken) {
  console.error(`\n✖ ${broken} broken reference(s) found.`);
  process.exit(1);
}
console.log('✓ No broken internal links.');
