import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import { pages } from '../lib/pages.js';
import { tours } from '../content/tours.js';
import { buildEnquiryUrl } from '../lib/whatsapp.js';

const active = Object.values(pages).filter(page=>!page.destination);
for (const page of active) {
  const $=cheerio.load(fs.readFileSync(`content/cyclonic/${page.file}`,'utf8'));
  const text=$('body').text().replace(/\s+/g,' ');
  const forbidden=/Tripvana|Pixoora|Pixopay|Bali|Maldives|Cappadocia|Swiss|Gstaad|Mykonos|Clarissa|165 reviews|320\+ reviews|secure payment|30\+ countries|We believe travel should be easy|\$[\d,]+/gi;
  const matches=text.match(forbidden);
  assert.equal(matches,null,`Demo content on ${page.route}: ${matches}`);
  assert.equal($('h1').length,1,`Expected one main heading on ${page.route}`);
  $('img').each((_,el)=>{
    const src=$(el).attr('src');
    assert.ok(src?.startsWith('/'),`External demo image on ${page.route}: ${src}`);
    assert.ok(fs.existsSync(`public${src}`),`Missing image: ${src}`);
    assert.ok($(el).attr('alt') !== undefined,`Missing image alt on ${page.route}`);
  });
  $('a[href]').each((_,el)=>{
    const href=$(el).attr('href');
    if(href.startsWith('/') && !href.startsWith('/images/')) assert.ok(pages[href.split('#')[0]],`Broken link on ${page.route}: ${href}`);
  });
  if(page.route.startsWith('/tours/')) assert.ok($('[data-enquiry-form]').length,`Missing enquiry on ${page.route}`);
  console.log('PAGE',page.route,'words',text.split(' ').length,'images',$('img').length,'animation hooks',$('[data-w-id]').length);
}
const fixture={number:'000000000000',tourName:'Test & Safari',date:'2099-12-31',travellers:3,name:'Test Visitor',notes:'A & B?'};
const url=buildEnquiryUrl(fixture);
assert.ok(url);
const message=new URL(url).searchParams.get('text');
assert.ok(message.includes('Test & Safari') && message.includes('Number of travellers: 3') && message.includes('A & B?'));
assert.equal(buildEnquiryUrl({...fixture,number:''}),null);
assert.equal(buildEnquiryUrl({...fixture,travellers:0}),null);
assert.equal(buildEnquiryUrl({...fixture,name:'   '}),null);
assert.equal(buildEnquiryUrl({...fixture,date:'2000-01-01'}),null);
assert.equal(buildEnquiryUrl({...fixture,date:'2099-02-31'}),null);
console.log('WhatsApp encoding and validation passed using an unsent test fixture.');
console.log(`${active.length} pages and ${tours.length} tour enquiry forms inspected.`);

if (process.argv.includes('--http')) {
  const base = process.env.SITE_URL || 'http://localhost:3000';
  for (const page of Object.values(pages)) {
    const response = await fetch(new URL(page.route,base),{redirect:'manual'});
    if (page.destination) {
      assert.ok([307,308].includes(response.status),`Retired route should redirect: ${page.route} (${response.status})`);
      assert.equal(new URL(response.headers.get('location'),base).pathname,page.destination);
    } else {
      assert.equal(response.status,page.route==='/404'?404:200,`HTTP status for ${page.route}`);
      const document=cheerio.load(await response.text());
      if (page.route === '/404') {
        // Next.js' not-found boundary inherits the root layout metadata.
        assert.match(document('title').text(),/Cyclonic Tours/);
      } else assert.equal(document('title').text(),page.title,`SEO title for ${page.route}`);
    }
  }
  assert.equal((await fetch(new URL('/a-trail-that-does-not-exist',base))).status,404);
  console.log('HTTP checks passed for all company pages, retired demo routes, and custom 404 handling.');
}
