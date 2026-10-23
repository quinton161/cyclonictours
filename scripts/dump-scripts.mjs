import fs from 'node:fs';

const html = fs.readFileSync(process.argv[2], 'utf8');
let i = 0;
for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
  i++;
  const attrs = m[1];
  const content = m[2];
  if (content.length > 800) continue;
  if (content.includes('__next_f')) continue;
  console.log(`--- ${i} ---`);
  console.log(attrs);
  console.log(content.slice(0, 800));
}
