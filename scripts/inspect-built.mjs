import fs from 'node:fs';

const html = fs.readFileSync(process.argv[2], 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
console.log('HEAD TAGS');
for (const m of head.matchAll(/<(?:link|script|meta)[^>]*>/g)) {
  let tag = m[0];
  if (tag.length > 260) tag = tag.slice(0, 260) + '...';
  console.log(tag);
}

console.log('\nTAIL SCRIPTS');
const body = html.match(/<body>([\s\S]*?)<\/body>/)?.[1] || '';
for (const m of body.matchAll(/<script[^>]*>/g)) {
  let tag = m[0];
  if (tag.length > 260) tag = tag.slice(0, 260) + '...';
  console.log(tag);
}
console.log('\nBODY END');
console.log(body.slice(-1200));
