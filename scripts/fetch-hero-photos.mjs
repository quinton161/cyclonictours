import fs from 'node:fs/promises';
import sharp from 'sharp';
import { heroPhotos } from '../content/hero-photos.js';
await fs.mkdir('public/images/wildlife',{recursive:true});
for(const photo of heroPhotos){
 const response=await fetch(photo.download,{headers:{'User-Agent':'CyclonicToursWebsite/1.0 (licensed photography)'}});
 if(!response.ok)throw new Error(`${photo.id}: ${response.status}`);
 const buffer=Buffer.from(await response.arrayBuffer());
 const source=await sharp(buffer).metadata();
 if(source.width<2880)throw new Error(`Source too small: ${photo.id}`);
 const output=await sharp(buffer).rotate().resize({width:2880,withoutEnlargement:true}).webp({quality:88}).toFile(`public/images/${photo.file}`);
 console.log(photo.id,source.width,source.height,'=>',output.width,output.height,output.size);
}
