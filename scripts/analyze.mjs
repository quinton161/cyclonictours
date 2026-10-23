import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skip = new Set(['node_modules', '.git', '.next', 'scripts']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(root);
const hrefs = new Set();
const assets = new Set();

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/(?:src|srcset|data-src|poster|href)="([^"]+)"/g)) {
    const v = m[1];
    if (/^(https?:|mailto:|tel:|#|javascript:|data:|\/\/)/.test(v)) continue;
    assets.add(v);
  }
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const v = m[1];
    if (/^(https?:|mailto:|tel:|#|javascript:)/.test(v)) continue;
    hrefs.add(v);
  }
}

console.log('FILES');
console.log(files.map((f) => path.relative(root, f)).join('\n'));
console.log('\nLOCAL ASSETS');
console.log([...assets].sort().join('\n'));
console.log('\nINTERNAL HREFS');
console.log([...hrefs].sort().join('\n'));
