import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(), 'original-html');
const files = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
}
walk(root);

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
  const tags = [...head.matchAll(/<(?:link|meta|script)[^>]*>/g)].map((m) =>
    m[0]
      .replace(/(content|href|src)="[^"]*"/g, '$1="..."')
  );
  console.log('=== ' + path.relative(root, f));
  console.log([...new Set(tags)].join('\n'));
}
