import fs from 'node:fs/promises';
import sharp from 'sharp';

// Owner-uploaded images observed under “By owner” on the supplied Google listing.
const entries = [
 ['guide','Guided walks with Cyclonic Tours','Sightseeing','ANWiy9SjmhxxI0HKbtnJAAMrxtGFz8pYaE5wTN1UM7waeIojxWmoRPh8E7p8_S-4Te5UJkUw26NXpTm0WVYHhw7ffSTRaTyzDypmp2VgE4Y9lovu047Gg99RffNrAo4dI1GZQ8wionXIsyTWGWmN'],
 ['buffalo','A buffalo herd on safari','Wildlife','ANWiy9S7k0dV-uNdNMQI5KhgLwUqwrbmQKf4Be96srpmOQ_QEkLx7NV4GmCL5JgLdDWYtxNbqsLsZxV4b4NMqFwjg9eMG9xJqKUP1S2sEJlG7bMCVsjikjFf8tHqaqGV6n-Pv7TuclL47HbrZTU'],
 ['falls','Victoria Falls from the rainforest path','Sightseeing','ANWiy9TC87LgS5ZY9vbwzY9-fCt6IkKoB5eeXXu6-uWAKamRUgta4vE7eKNdKrmHs-dq5kR7NumCMhtjc_kuEuQR8PsQs8HidDlngXdPqO8EQZGJ9HgXrs1lonjkE_5p_4kvheB38ZSM3B6anW0'],
 ['lions','Lioness and cub','Wildlife','ANWiy9RT9TJjNaaenI-B8oaNQd_v2PFoYSM7UVbAeVUy6vsOjg5c3BoDtyVsAbRxMhEnsmxIPlkpj8dfD6Qfmziz4-kePA7Q_9iY20rPn7TMBLftgBTFwFoLMMgJjBwJErWt9zLkgiVAMni4OKJB'],
 ['airport','Travellers at Victoria Falls International Airport','Transfers','ANWiy9S06U_mFEwbfGnZjQIPtmYrls-AgQ6o4I6K4ZpYfWFoLHMbs3ESOY9oClgV22MkVYcR6yuFRJTQO72xSp9hNco8CKWbxMSZ2JcLZVcHXOyZCsnn9EmMuvqc_gzab5yB_AygK6a6CACsxqM'],
 ['visit','Cheetah and a bird in flight','Wildlife','ANWiy9RVwhFlO5VCflVCLnLLM4IrwBkL67AtXuciJBCTqAFLLhOoHiwVmaX0WYmwJJAOZxT1NQ4HElFdI4qPbPCG5r_1xJ-26Od9jnApwov_XuaZPtqAyooRSWT8WlVV0Xb2ffbe1OaJQ5QrpOX8'],
 ['wildlife','Wildlife from the owner’s photo collection','Wildlife','ANWiy9R22pCUBPh-uhyX0O4glvvwASebqW7uEQSSD0rn2xROFlyk9JIv6zqQODCQA2mH0D49L8EOR7pEjP2t2niloh-DSZncnvb7uhNrckmtQOPK0qojjAwdtqxbQglSGY0NxswJDk1KSMaU63yk'],
 ['journey','An elephant encounter by the water','Wildlife','ANWiy9Tx4uLntsjoaOgYarKcCYupt6XN-0ghKsPCk_Gs8tm2uAzX5xo7GgOLtUGgfEd-waKCcI3PJYrsncB2hi8c4keYo3s8UAX9MCF6KLSbsE8UYVAEruhZ33FobeeyxpbPY-DN6o2-mkb-y8Q'],
];
const source='https://www.google.com/maps?cid=18208153585167050167';
await fs.mkdir('public/images/company',{recursive:true});
const photos=[];
for (const [id,title,category,key] of entries) {
 const download=`https://lh3.googleusercontent.com/gps-cs-s/${key}=s1600`;
 const response=await fetch(download);
 if(!response.ok) throw new Error(`${id}: ${response.status}`);
 const input=Buffer.from(await response.arrayBuffer());
 const file=`company/${id}.webp`;
 const result=await sharp(input).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:86}).toFile(`public/images/${file}`);
 photos.push({id,file,title,category,author:'The cyclonic tours',source,download,width:result.width,height:result.height});
 console.log(id,result.width,result.height);
}
await fs.writeFile('content/company-photos.json',JSON.stringify(photos,null,2)+'\n');
