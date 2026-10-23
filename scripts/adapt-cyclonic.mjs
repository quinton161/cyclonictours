import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { tours } from '../content/tours.js';
import { photos, photoById } from '../content/photos.js';
import { heroPhotos } from '../content/hero-photos.js';
import { reviews, reviewSource, reviewSnapshot } from '../content/reviews.js';
import nextEnv from '@next/env';

// Load the same local environment files as Next.js before reading public config.
nextEnv.loadEnvConfig(process.cwd());
const { site, faqs } = await import('../content/site.js');

const out = 'content/cyclonic';
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync('public/icons', { recursive: true });
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image = (id) => `/images/${photoById[id]?.file || photoById.falls.file}`;
const wordmark = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="66" viewBox="0 0 260 66"><path d="M8 43c20-38 29-38 45-9M6 47c19-12 31-12 50-1M13 54h35" fill="none" stroke="#c5a46d" stroke-width="3" stroke-linecap="round"/><text x="66" y="31" font-family="Georgia,serif" font-weight="bold" font-size="28" fill="white">Cyclonic</text><text x="68" y="51" font-family="Arial,sans-serif" font-size="11" letter-spacing="5" fill="#e1d4bc">TOURS</text></svg>`;
fs.writeFileSync('public/icons/wordmark.svg', wordmark);
fs.writeFileSync('public/icons/wordmark-dark.svg', wordmark.replace('fill="white"','fill="#18392b"').replace('fill="#e1d4bc"','fill="#63745d"'));
fs.writeFileSync('public/icon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#18392b"/><path d="M10 40c17-32 25-32 40-7M10 45c16-11 29-11 45 0M19 52h26" fill="none" stroke="#c5a46d" stroke-width="3" stroke-linecap="round"/></svg>`);
fs.writeFileSync('public/icons/arrow.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#18392b" stroke-width="1.5"><path d="M5 19 19 5M5 5h14v14"/></svg>');
fs.writeFileSync('public/icons/close.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#18392b" stroke-width="1.5"><path d="m5 5 14 14M5 19 19 5"/></svg>');
fs.writeFileSync('public/icons/pin.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#c5a46d" stroke-width="1.5"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>');

function load(source) {
  return cheerio.load(fs.readFileSync(`original-html/${source}`, 'utf8'));
}
function button($, element, text, href, enquire) {
  const el = $(element);
  el.attr('href', href || '#enquiry');
  if (enquire) el.attr('data-enquire', enquire === true ? '' : enquire);
  const labels = el.find('.button-2-text, .button-text, .button-text-02, .button-03-text');
  if (labels.length) labels.text(text);
  else {
    const leaves = el.find('div').filter((_, node) => !$(node).children().length && $(node).text().trim());
    if (leaves.length) leaves.text(text);
    else el.text(text);
  }
}
function filterBar(kind, categories) {
  return `<div class="ct-filters" role="group" aria-label="Filter ${kind}">${['All', ...categories].map((category) => `<button type="button" class="ct-filter" data-filter="${kind}" data-value="${category}" aria-pressed="${category === 'All'}">${category}</button>`).join('')}</div>`;
}
function cards($, selector, selected = tours) {
  $(selector).each((_, list) => {
    const template = $(list).children().first().clone();
    $(list).empty().attr('data-filter-list', 'tours');
    selected.forEach((tour) => {
      const card = template.clone().attr('data-category', tour.category);
      card.find('.packages-item-link').attr('href', `/tours/${tour.slug}`);
      card.find('.package-item-name').text(tour.name);
      card.find('.package-item-price').text(tour.price || 'Request a quotation');
      card.find('.booking-open').text(tour.confirmed ? 'Enquire for availability' : 'Experience idea');
      card.find('.package-short-desp').text(tour.description);
      card.find('img.packages-item-image, .packages-overflow img').attr({ src: image(tour.image), alt: photoById[tour.image]?.title || tour.name }).removeAttr('srcset').removeAttr('sizes').attr('data-local-photo', '');
      card.find('.button-2-text').text('View Details');
      card.append(`<button type="button" class="ct-card-enquiry" data-enquire="${tour.slug}">Enquire on WhatsApp <span aria-hidden="true">↗</span></button>`);
      $(list).append(card);
    });
  });
}
function galleryMarkup(limit = photos.length) {
  return `<div class="ct-gallery" data-filter-list="gallery">${photos.slice(0, limit).map((photo) => `<button type="button" class="ct-gallery-item" data-category="${photo.category}" data-photo="${photo.id}" aria-label="View ${escape(photo.title)}"><img src="/images/${photo.file}" alt="${escape(photo.title)}" width="960" height="720" loading="lazy" data-local-photo/><span>${escape(photo.title)} <span aria-hidden="true">↗</span></span></button>`).join('')}</div>`;
}
function faq($) {
  $('.faq-all-lists').each((_, list) => {
    const templates = $(list).children('.faq-list-wrap').toArray().map((el) => $(el).clone());
    if (!templates.length) return;
    $(list).empty();
    faqs.forEach(([question, answer], index) => {
      const item = templates[index % templates.length].clone();
      // Keep the template's animation bindings for the four original accordion types.
      item.find('.faq-ques').text(question);
      item.find('.faq-para').text(answer);
      item.find('.faq-question').attr({ role: 'button', tabindex: '0', 'aria-expanded': 'false' });
      $(list).append(item);
    });
  });
}
function common($, route) {
  $('body script, .reserve-now-popup, .review-section:not([data-verified-reviews]), .review-box:not([data-verified-reviews]), .guest-speech-section, .team-section, .package-review-card, .subscribe-section, .gavisor-rating, .gavisor-block, .gavisor-wrapper').remove();
  // Remove demo ratings even when they use a different container class.
  $('.gavisor-image').parent().remove();
  $('.nav-dropdown').remove();
  $('.w-nav-button').attr('aria-label','Toggle navigation').append('<svg class="ct-menu-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14M5 16h14" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>');
  $('.nav-menu').html([['/', 'Home'], ['/about', 'About Us'], ['/tours', 'Our Tours'], ['/gallery', 'Gallery'], ['/reviews', 'Reviews'], ['/contact', 'Contact Us']].map(([href, text]) => `<a href="${href}" class="nav-link ${route === '/' ? 'transparent-nav-link' : ''} ${href === route ? 'w--current' : ''}" ${href === route ? 'aria-current="page"' : ''}>${text}</a>`).join(''));
  $('.navbar-brand, .footer-logo-link').attr({ href: '/', 'aria-label': 'Cyclonic Tours home' });
  const onDark = route === '/' || route === '/about';
  $('.navbar').toggleClass('ct-on-dark',onDark);
  $('img.tripvana-logo').attr({ src: onDark ? '/icons/wordmark.svg' : '/icons/wordmark-dark.svg', alt: 'Cyclonic Tours', width: '210', height: '54' }).removeAttr('srcset').attr('data-local-photo','');
  $('img.footer-logo').attr({ src:'/icons/wordmark.svg',alt:'Cyclonic Tours',width:'240',height:'61' }).removeAttr('srcset').attr('data-local-photo','');
  $('a').each((_, el) => {
    if (/Book Now|Book Tour/.test($(el).text())) button($, el, 'Book on WhatsApp', null, true);
  });
  $('.nav-buttons-block .button-01').each((_, el) => {
    const original = $(el);
    const replacement = $('<button type="button" data-enquire></button>').attr('class', original.attr('class')).html(original.html());
    if (original.attr('data-w-id')) replacement.attr('data-w-id',original.attr('data-w-id'));
    replacement.find('.button-text, .button-text-02').text('Book on WhatsApp');
    original.replaceWith(replacement);
  });
  $('.footer-para').text('Discover the extraordinary in Victoria Falls and beyond. Your next adventure begins with a conversation.');
  $('.footer-social-links').html(site.socialLinks.map((link) => `<a class="page-link" href="${escape(link.url)}" target="_blank" rel="noopener noreferrer">${escape(link.label)}</a>`).join(''));
  $('.footer-right').html(`<div class="footer-pages-links"><div class="pages-title">Explore</div><div class="pages-link-flex"><a class="page-link" href="/">Home</a><a class="page-link" href="/about">About Us</a><a class="page-link" href="/tours">Our Tours</a><a class="page-link" href="/gallery">Gallery</a></div></div><div class="footer-pages-links"><div class="pages-title">Plan your visit</div><div class="pages-link-flex"><a class="page-link" href="/contact">Contact Us</a><a class="page-link" href="/reviews">Guest Reviews</a><a class="page-link" href="/faq">FAQs</a><a class="page-link" href="#enquiry" data-enquire>WhatsApp enquiry</a><a class="page-link" href="/privacy">Privacy</a></div></div><div class="footer-pages-links last"><div class="pages-title">Find us</div><div class="pages-link-flex"><p class="page-link">${escape(site.address)}<br/>${escape(site.phone)}</p><a class="page-link" href="/photo-credits">Photo credits</a></div></div>`);
  $('.footer-bottom').html(`<p class="copyright-text">© ${new Date().getFullYear()} Cyclonic Tours. All rights reserved.</p><p class="copyright-text">Designed & developed by Cadrie Studio</p>`);
  faq($);
  $('.faq-section h2, .faq-wrapper h2').text('A little clarity before the adventure.');
  $('.faq-section a.button-03').each((_, el) => button($, el, 'Ask Cyclonic Tours', null, true));
  $('.planning-section h2').text('Your Next Adventure Starts Here');
  $('.planning-section a').each((_, el) => button($, el, 'Plan Your Trip on WhatsApp', null, true));
  // Keep animation classes and IDs; substitute only the visible assets.
  $('img').each((index, el) => {
    const img = $(el);
    if (img.is('[data-local-photo]')) { img.removeAttr('data-local-photo'); return; }
    const hint = `${img.attr('class')} ${img.attr('alt')}`;
    if (/arrow/i.test(hint)) img.attr({ src: '/icons/arrow.svg', alt: '' });
    else if (/cross/i.test(hint)) img.attr({ src: '/icons/close.svg', alt: '' });
    else if (/icon|star/i.test(hint)) img.attr({ src: '/icons/pin.svg', alt: '' });
    else {
      const photo = photos[index % photos.length];
      img.attr({ src: `/images/${photo.file}`, alt: photo.title });
    }
    img.removeAttr('srcset').removeAttr('sizes');
    if (!img.closest('.home-hero-section, .about-hero-section').length) img.attr('loading', 'lazy');
  });
  $('[style]').each((_, el) => $(el).attr('style', $(el).attr('style').replace(/url\([^)]*\)/g, `url('${image('falls')}')`)));
  $('a[href]').each((_, el) => {
    const a = $(el); const href = a.attr('href');
    if (/pixoora|webflow\.com|tripvana|pixopay|facebook|instagram|linkedin/i.test(href)) { a.remove(); return; }
    if (/^mailto:/i.test(href) || (/^tel:/i.test(href) && href !== 'tel:+263772619171')) { a.remove(); return; }
    if (/index\.html$/.test(href)) a.attr('href', '/');
    else if (/about\.html$/.test(href)) a.attr('href', '/about');
    else if (/gallery\.html$/.test(href)) a.attr('href', '/gallery');
    else if (/contact\.html$/.test(href)) a.attr('href', '/contact');
    else if (/faq\.html$/.test(href)) a.attr('href', '/faq');
    else if (/\.html(?:#.*)?$/.test(href)) a.attr('href', '/tours');
  });
  // A single semantic page heading, without changing the template's heading styles.
  if (!$('h1').length) {
    const heading = $('h2').first();
    const semanticHeading = $('<h1></h1>').attr(heading.attr()).html(heading.html());
    semanticHeading.attr('style',`${heading.attr('style') || ''};font-size:clamp(32px,4vw,56px);line-height:1.15`);
    heading.replaceWith(semanticHeading);
  }
  $('body').find('form').remove();
  return $('body').html();
}

function home($) {
  verifiedReviews($);
  $('.home-hero-section h1').text('Discover the Extraordinary with Cyclonic Tours');
  const heroHeading = $('.home-hero-section h1');
  $('.home-hero-section a').filter((_,el)=>/Book Your Tour/.test($(el).text())).each((_, el) => {
    button($, el, 'Explore Our Tours', '/tours');
  });
  $('.home-hero-slider-content').each((index, el) => {
    const tour = tours[index % 3];
    $(el).attr('href', `/tours/${tour.slug}`);
    $(el).find('.large-paragraph').text(tour.name);
    $(el).find('.price').text('Explore this experience');
    $(el).find('.overflow-hidden img').attr({src:image(tour.image), alt:photoById[tour.image].title, 'data-local-photo':''}).removeAttr('srcset');
  });
  $('.tour-activities-section .subtitle-text').text('Victoria Falls & Beyond');
  const lines = ['Based in Victoria Falls,', 'inspired by Africa’s wild beauty.', 'Meet Cyclonic Tours —', 'and imagine your next adventure.'];
  $('.activities-title.mob').text('Based in Victoria Falls, inspired by Africa’s wild beauty. Meet Cyclonic Tours and imagine your next adventure.');
  $('.activities-title').not('.mob').each((index, el) => $(el).text(lines[index % lines.length]));
  // The scrolling introduction remains; replace the unrelated destination tabs.
  $('.tour-activities-section .w-tabs').replaceWith(`<div class="ct-introduction"><p>From safari adventures and wildlife tours to airport transfers, hotel bookings and customised African travel packages, Cyclonic Tours helps you plan your time in Victoria Falls and beyond.</p><a class="ct-text-link" href="/about">Get to know Cyclonic Tours ↗</a></div>`);
  const steps = [
    ['Explore Tours', 'Discover destination ideas around Victoria Falls, Zimbabwe and beyond.'],
    ['Choose Your Experience', 'Tell us which experience interests you, your dates and who is travelling.'],
    ['Send a WhatsApp Enquiry', 'Review and send your enquiry to ask about availability, pricing and details.'],
    ['Receive Confirmation', 'Confirm the arrangements directly with Cyclonic Tours before your trip.'],
  ];
  $('.booking-process-section h2').text('From a little inspiration to your next adventure.');
  $('.booking-slider-content').each((i, el) => { $(el).find('h5').text(steps[i % 4][0]); $(el).find('p').text(steps[i % 4][1]); });
  $('.packages-section .subtitle-text').text('Our Tours & Activities');
  $('.packages-section h2').text('Wild encounters. Waterfall moments. Your kind of escape.');
  cards($, '.collection-list-packages', tours);
  $('.packages-section .collection-list-wrapper-packages').before('<p class="ct-catalogue-note">Explore our services. Request availability, your personal itinerary and a quotation for your dates.</p>');
  const why = `<section class="ct-why"><div class="container"><div class="subtitle-text">Why start with Cyclonic Tours?</div><h2>A personal start to your African adventure.</h2><div class="ct-why-grid">${[['Your interests first','Share your travel style, pace and the experiences you hope to enjoy.'],['One simple enquiry','Ask your questions directly, with no account to create.'],['A place to begin','Explore destination ideas from a Victoria Falls base.'],['Clarity before you book','Confirm your itinerary, price and arrangements before committing.']].map(([a,b],i)=>`<article><span class="ct-step">0${i+1}</span><h3>${a}</h3><p>${b}</p></article>`).join('')}</div></div></section>`;
  $('.booking-process-section').before(why);
  $('.blog-section .subtitle-text').text('A Glimpse of the Journey');
  $('.blog-section h2').text('Landscapes that stay with you.');
  $('.blog-section .collection-list-wrapper-packages').replaceWith(galleryMarkup(3));
  $('.blog-section a.button-03, .blog-section a.button-02').each((_,el)=>button($,el,'Explore the Gallery','/gallery'));
  $('.faq-section').after('<section class="ct-final-cta"><div class="container"><p class="ct-eyebrow">Victoria Falls · Zimbabwe</p><h2>Your Next Adventure Starts Here</h2><a href="#enquiry" class="ct-solid-button" data-enquire>Plan Your Trip on WhatsApp ↗</a></div></section>');
}
function about($) {
  $('.about-hero-title').text('Extraordinary places. Personal journeys.');
  $('.about-hero-section .center-align.white-text').text('Meet Cyclonic Tours, a tour operator based in Victoria Falls, Zimbabwe. A conversation is the beginning of your next adventure.');
  $('.featured-stays-section').remove();
  $('.about-section .subtitle-text').text('About Cyclonic Tours');
  $('.about-title').text('Inspired by Victoria Falls. Open to adventure.');
  $('.about-section p.large-paragraph').eq(0).text('The cyclonic tours is a tour operator based in Mkhosana Township, Victoria Falls, Zimbabwe. Its services include safari adventures, wildlife tours, airport transfers, hotel bookings and customised African travel packages.');
  $('.about-section p.large-paragraph').eq(1).text('Guests describe John?s local knowledge, punctual transfers and help arranging excursions around Victoria Falls and Hwange. Share your travel dates and interests to build your own journey with Cyclonic Tours.');
  $('.about-section p.large-paragraph').slice(2).remove();
  $('.about-author, .about-author-designation, .about-author-image').remove();
  const strengths = [['Your travel interests','Tell us what you would love to see and how you prefer to travel.'],['Simple enquiries','Start a conversation through WhatsApp without creating an account.'],['Destination inspiration','Explore Victoria Falls, wildlife escapes and river experiences.'],['Clear next steps','Request availability, a quotation and the details before making a booking.']];
  $('.about-faq-list-wrap').each((i,el)=>{ $(el).find('.faq-ques').text(strengths[i%4][0]); $(el).find('.faq-para').text(strengths[i%4][1]); });
  $('.blog-section .subtitle-text').text('Victoria Falls & Beyond');
  $('.blog-section h2').text('A world of possibilities, closer than you think.');
  $('.blog-section .collection-list-wrapper-packages').replaceWith(galleryMarkup(3));
  $('.blog-section a.button-03, .blog-section a.button-02').each((_,el)=>button($,el,'Explore Our Tours','/tours'));
}
function catalogue($) {
  $('.packages-hero-section .subtitle-text').text('Our Tours');
  $('.packages-hero-section h2').text('Find the experience that speaks to you.');
  const tabs = $('.packages-hero-section .w-tabs').first();
  const originalList = $('.packages-collection-list').first().parent().clone();
  tabs.replaceWith(`${filterBar('tours',[...new Set(tours.map(t=>t.category))])}<p class="ct-catalogue-note">Explore our services. Confirm your itinerary, duration, availability and price directly with Cyclonic Tours.</p>${$.html(originalList)}`);
  cards($, '.packages-collection-list');
}
function detail($, tour) {
  $('.back-button').attr('href','/tours').find('div').text('Back to Our Tours');
  $('.package-name').text(tour.name);
  const meta = [tour.category, tour.duration || 'Duration on enquiry', tour.confirmed ? 'Enquire for availability' : 'Subject to confirmation'];
  $('.package-item-flex').each((i,el)=>$(el).find('div').text(meta[i%3]));
  $('.package-slider-img').each((i,el)=>{
    const photo = [photoById[tour.image],photoById.falls,photoById.guide][i%3];
    $(el).attr({src:`/images/${photo.file}`,alt:photo.title,'data-local-photo':''}).removeAttr('srcset');
  });
  $('.tour-details').html(`<h4>About this experience</h4><p>${escape(tour.description)}</p>${!tour.confirmed ? '<p class="ct-catalogue-note">This is an experience idea. Please confirm that Cyclonic Tours offers this service for your travel dates.</p>' : ''}<p>Photos are from the company?s Google Maps collection. Confirm your exact itinerary and arrangements with your enquiry.</p>`);
  $('.plan-chart').html(`<h5>Your itinerary</h5>${tour.itinerary.length ? `<ol>${tour.itinerary.map(step=>`<li>${escape(step)}</li>`).join('')}</ol>` : '<p>Share your preferred date, interests and group size. Request a proposed itinerary from Cyclonic Tours before booking.</p>'}<h5>Meeting & pickup</h5><p>${escape(tour.pickup || 'Meeting point, pickup time and any transfer arrangements are confirmed directly with Cyclonic Tours.')}</p>`);
  $('.amenities-block').html(`<h5>Included & excluded services</h5>${tour.included.length || tour.excluded.length ? `<p>Included: ${escape(tour.included.join(', '))}</p><p>Excluded: ${escape(tour.excluded.join(', '))}</p>` : '<p>Request the full list of inclusions, exclusions, entry fees, meals and transfers with your quotation.</p>'}<h5>Price & duration</h5><p>${escape(tour.price || 'Request a quotation for your dates and group size.')} ${escape(tour.duration || 'Duration will be confirmed with your itinerary.')}</p><h5>Before you travel</h5><p>${escape(tour.travellerInformation)}</p>`);
  $('.sticky-form').html(`<div class="ct-inline-enquiry" data-enquiry-form="${tour.slug}"><h3>Plan this experience</h3><button class="ct-solid-button" data-enquire="${tour.slug}">Enquire on WhatsApp</button></div>`);
}
function gallery($) {
  $('.accommodations-section h2').text('A glimpse of somewhere extraordinary.');
  const heading = $('.accommodations-section h2');
  const wrapper = heading.closest('.wrapper');
  // Preserve the section's entrance wrapper while removing demo lightbox payloads.
  wrapper.children().not(heading.parentsUntil(wrapper).last()).remove();
  wrapper.append(`<p class="ct-catalogue-note">From The cyclonic tours’ owner-uploaded photographs on Google Maps. <a href="/photo-credits">View photo sources</a>.</p>${filterBar('gallery',[...new Set(photos.map(p=>p.category))])}${galleryMarkup()}`);
}
function contact($) {
  $('.contact-title').text('Let’s start planning something extraordinary.');
  $('.contact-author-info').html('<div class="contact-author-flex"><h6>Cyclonic Tours</h6><p>Victoria Falls, Zimbabwe</p></div>');
  $('.map-image').replaceWith(`<img src="${image('falls')}" class="map-image ct-contact-photo" alt="Victoria Falls waterfall" data-local-photo loading="lazy"/>`);
  $('.contact-form-block').replaceWith('<div class="ct-inline-enquiry" data-enquiry-form=""><h3>Send a travel enquiry</h3><button class="ct-solid-button" data-enquire>Start your enquiry</button></div>');
  const details = [['Find us', site.address], ['Phone & WhatsApp', site.phone], ['Google opening hours', site.hours], ['Plus code', site.plusCode]];
  $('.contact-bottom-card').each((i,el)=>$(el).find('.contact-bottom-flex').html(`<h6>${details[i%4][0]}</h6><p>${escape(details[i%4][1])}</p>`));
  if (site.mapsUrl) $('.contact-bottom-content').after(`<div class="ct-map-block"><iframe title="The cyclonic tours — Victoria Falls location" src="https://maps.google.com/maps?q=-17.9315803,25.8301677&z=16&output=embed" width="1200" height="360" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><a class="ct-text-link" href="${escape(site.mapsUrl)}" target="_blank" rel="noopener noreferrer">Open The cyclonic tours on Google Maps ↗</a><p>Listing checked 23 October 2026. Please arrange your visit or pickup in advance.</p><a class="ct-text-link" href="tel:+263772619171">Call ${site.phone}</a></div>`);
}

function reviewCard(review) {
  return `<article class="ct-review-card"><div class="ct-stars" aria-label="5 out of 5 stars">★★★★★</div><h3>${escape(review.name)}</h3><p>${escape(review.summary || '5-star rating. No written review.')}</p><small>${escape(review.dateLabel)} · Google Maps</small></article>`;
}
function verifiedReviews($) {
  $('.review-section').attr('data-verified-reviews','');
  $('.review-section h2.center-align').text('Real journeys. Stories from our guests.');
  $('.review-top-para').text('5.0 out of 5, based on 21 Google reviews. Checked 23 October 2026.');
  $('.pixooadvisor-block').html(`<div class="ct-stars" aria-label="5 out of 5 stars">★★★★★</div><p class="white-text">Google Maps · 21 reviews</p><p class="ct-review-note">Guest feedback below is summarised, not quoted.</p>`);
  $('.review-slider-bottom a').attr('href','/reviews').find('.button-2-text').text('Read All Reviews');
  $('.review-slide').each((i,el)=>{
    const review=reviews[i];
    $(el).find('.review-card-text').text(review.summary);
    $(el).find('.reviewer-name').text(review.name);
    $(el).find('.review-stars-box').html('<span class="ct-stars" aria-label="5 out of 5 stars">★★★★★</span>');
  });
  $('.review-box').attr('data-verified-reviews','').html(`<a href="/reviews" class="ct-rating-link"><span class="ct-rating-label">Google <strong>5.0</strong></span><span class="ct-stars" aria-label="5 out of 5 stars">★★★★★</span><span>Based on 21 reviews</span></a>`);
}

const definitions = [
  ['/', 'index.html', 'Cyclonic Tours | Victoria Falls & Beyond', home],
  ['/about', 'about.html', 'About Cyclonic Tours | Victoria Falls, Zimbabwe', about],
  ['/tours', 'packages.html', 'Our Tours & Experiences | Cyclonic Tours', catalogue],
  ['/gallery', 'gallery.html', 'Destination Gallery | Cyclonic Tours', gallery],
  ['/contact', 'contact.html', 'Contact & WhatsApp Enquiries | Cyclonic Tours', contact],
  ['/faq', 'faq.html', 'Travel Enquiry FAQs | Cyclonic Tours', ()=>{}],
  ['/reviews', 'faq.html', 'Google Reviews | Cyclonic Tours', ($)=>{
    $('.accommodations-section .wrapper').html(`<div class="ct-reviews-page"><div class="subtitle-text">Guest experiences</div><h1>Reviews from our travellers.</h1><p class="ct-catalogue-note">${reviewSnapshot.rating.toFixed(1)} out of 5 · ${reviewSnapshot.count} Google reviews · Checked ${reviewSnapshot.checkedAt}. These are attributed summaries, not verbatim quotations. Dates are as displayed when checked.</p><a class="ct-text-link" href="${reviewSource}" target="_blank" rel="noopener noreferrer">Read the full reviews on Google Maps ↗</a><div class="ct-reviews-grid">${reviews.map(reviewCard).join('')}</div></div>`);
  }],
  ['/404', '404.html', 'Page Not Found | Cyclonic Tours', ($)=>$('.error-title').text('This trail leads somewhere else.')],
  ...tours.map(tour=>[`/tours/${tour.slug}`, 'packages/african-safari.html', `${tour.name} | Cyclonic Tours`, ($)=>detail($,tour)]),
  ['/privacy', 'faq.html', 'Privacy | Cyclonic Tours', ($)=>{
    $('.accommodations-section .wrapper').html('<div class="ct-legal"><h1>Privacy</h1><p>This website does not require an account and does not collect payments. Your enquiry details are used to prepare a WhatsApp message in your browser. Nothing is sent to Cyclonic Tours until you choose to send the message in WhatsApp.</p><h2>External services</h2><p>WhatsApp processes messages under its own privacy terms. Fonts, photographs and interaction scripts are served by this website’s hosting provider. Some retained animation assets may load from the template’s asset provider.</p><h2>Your information</h2><p>Do not include passport, payment or other sensitive information in the enquiry form. Confirm how your booking information will be handled directly with Cyclonic Tours before providing it.</p><p>For questions about your enquiry, contact Cyclonic Tours on +263 77 261 9171.</p></div>');
  }],
  ['/photo-credits', 'faq.html', 'Photography Credits | Cyclonic Tours', ($)=>{
    $('.accommodations-section .wrapper').html(`<div class="ct-legal"><h1>Photography credits</h1><h2>Wildlife hero photographs</h2><p>Licensed destination photography, illustrating wildlife in Hwange. These are not photographs of Cyclonic Tours guests. Originals are resized to 2880 pixels wide, converted to WebP and cropped for display. Adapted share-alike images retain their source licence.</p>${heroPhotos.map(p=>`<article><img src="/images/${p.file}" alt="${escape(p.title)}" width="420" loading="lazy" data-local-photo/><h2>${escape(p.title)}</h2><p>Photo by ${escape(p.author)}. <a href="${p.source}" target="_blank" rel="noopener noreferrer">Original photograph</a> ? <a href="${p.licenseUrl}" target="_blank" rel="noopener noreferrer">${p.license}</a></p></article>`).join('')}<h2>Company photographs</h2><p>Photographs sourced from the By owner collection on The cyclonic tours’ Google Maps listing, checked 23 October 2026. Copyright remains with the respective rights holders. Images are optimised and cropped for this website.</p>${photos.map(p=>`<article><img src="/images/${p.file}" alt="${escape(p.title)}" width="420" loading="lazy" data-local-photo/><h2>${escape(p.title)}</h2><p>Uploaded by ${escape(p.author)}. <a href="${p.source}" target="_blank" rel="noopener noreferrer">View the company’s Google Maps photo collection</a></p></article>`).join('')}</div>`);
  }],
];

// Keep the existing route modules valid, but retire their unrelated demo content.
const previous = JSON.parse(fs.readFileSync('content/template-manifest.json','utf8'));
const pages = {};
for (const [route, source, title, adapt] of definitions) {
  const $ = load(source);
  const scripts = $('body script[src]').map((_,el)=>({type:'src',value:`/scripts/${path.basename(new URL($(el).attr('src')).pathname)}`})).get();
  const pageId = $('html').attr('data-wf-page');
  const collection = $('html').attr('data-wf-collection') || '';
  const itemSlug = $('html').attr('data-wf-item-slug') || '';
  adapt($);
  const file = (route === '/' ? 'home' : route.slice(1).replaceAll('/','__'))+'.html';
  fs.writeFileSync(path.join(out,file),common($,route));
  pages[route] = {route,source,file,title,description:site.description,ogImage:route === '/' ? '/images/wildlife/home-elephants.webp' : route === '/about' ? '/images/wildlife/about-lion.webp' : image('falls'),pageId,collection,itemSlug,scripts};
}
for (const [route, page] of Object.entries(previous)) {
  if (pages[route]) continue;
  const destination = route.startsWith('/utility-pages/privacy') ? '/privacy' : route.startsWith('/utility-pages/license') ? '/photo-credits' : route.startsWith('/our-team') ? '/about' : '/tours';
  pages[route] = {...page,title:`Cyclonic Tours | Victoria Falls & Beyond`,description:site.description,ogImage:image('falls'),destination};
}
fs.writeFileSync('lib/pages.js', `export const pages = ${JSON.stringify(pages,null,2)};\n`);
console.log(`Adapted ${definitions.length} Cyclonic Tours pages; retired ${Object.keys(pages).length-definitions.length} demo routes.`);
