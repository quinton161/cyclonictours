import fs from 'node:fs/promises';
import path from 'node:path';
const manifest=JSON.parse(await fs.readFile('content/template-manifest.json','utf8'));
await fs.mkdir('public/scripts',{recursive:true});
const sources=[...new Set(Object.values(manifest).flatMap(p=>p.scripts.filter(s=>s.type==='src').map(s=>s.value)))];
for(const source of sources){
 const filename=path.basename(new URL(source).pathname);
 try{await fs.access(`public/scripts/${filename}`);continue;}catch{}
 const response=await fetch(source,{signal:AbortSignal.timeout(45000)});
 if(!response.ok)throw new Error(`Runtime download failed: ${response.status}`);
 await fs.writeFile(`public/scripts/${filename}`,Buffer.from(await response.arrayBuffer()));
 console.log('Saved original runtime:',filename);
}
await fs.mkdir('public/fonts',{recursive:true});
const response=await fetch('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&display=swap',{headers:{'User-Agent':'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36'},signal:AbortSignal.timeout(45000)});
if(!response.ok)throw new Error('Font stylesheet unavailable');
let css=await response.text();
for(const source of [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))]){
 const filename=path.basename(new URL(source).pathname);
 const font=await fetch(source,{signal:AbortSignal.timeout(45000)});
 if(!font.ok)throw new Error('Font unavailable');
 await fs.writeFile(`public/fonts/${filename}`,Buffer.from(await font.arrayBuffer()));
 css=css.replaceAll(source,`/fonts/${filename}`);
}
await fs.writeFile('public/fonts/fonts.css',css);
for(const [name,folder] of [['Montserrat','montserrat'],['OpenSans','opensans']]){
 const license=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${folder}/OFL.txt`,{signal:AbortSignal.timeout(45000)});
 if(!license.ok)throw new Error(`Font licence unavailable: ${name}`);
 await fs.writeFile(`public/fonts/${name}-OFL.txt`,await license.text());
}
console.log('Saved locally served Google Fonts. Font licences remain with their authors.');
