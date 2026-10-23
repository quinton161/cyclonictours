import fs from 'node:fs/promises';
const response=await fetch('https://cdn.prod.website-files.com/68b4aefe0f5b95bfbdc12b0b/css/tripvana-agency.shared.fbd32d0d0.css');
if(!response.ok) throw new Error(`Stylesheet download failed: ${response.status}`);
let css=await response.text();
// Retain the template's layout and animation rules; replace its stock photography.
css=css.replace(/url\(([^)]+)\)/g,(all,url)=>/\.(webp|png|jpe?g)(?:["']|\?|$)/i.test(url)?`url("${/arrow/i.test(url)?'/icons/arrow.svg':'/images/victoria-falls.webp'}")`:all);
await fs.mkdir('public/styles',{recursive:true});
await fs.writeFile('public/styles/template.css',css);
console.log('Preserved template stylesheet locally with replacement photography.');
