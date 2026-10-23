# Cyclonic Tours

Next.js website for The cyclonic tours in Victoria Falls. The template layout, original Webflow animation IDs, sliders and mobile navigation are retained.

## Run

```sh
npm install
npm run dev
```

Use `npm.cmd` in PowerShell if script execution policy blocks npm.ps1. Production: `npm run build`, then `npm start`. Dev uses `.next-dev`, production `.next`. A second dev server can use `CYCLONIC_DEV_OUTPUT=.next-qa`.

## Content

- `content/site.js`: official listing phone, WhatsApp, address, map link and hours.
- `content/tours.js`: six service categories supported by the owner's description and guest reviews. Prices, duration and individual availability are confirmed by enquiry.
- `content/reviews.js`: 21 real reviewer names, ratings, relative dates and attributed summaries. These are summaries, not verbatim quotations.
- `content/photos.js` and `content/company-photos.json`: owner-uploaded Google Maps photos stored locally as optimised WebP images.
- `scripts/import-company-photos.mjs`: maintenance importer for the selected owner photos. Downloads are already included and are not needed at build time.
- `scripts/adapt-cyclonic.mjs`: generates the company pages from `original-html`. Preserve this directory and `content/template-manifest.json` for the prebuild step.
- `components/brand-styles.js`: brand styling and responsive additions.
- `components/site-interactions.js`: enquiry forms, filters, accessible dialogs and gallery lightbox.

Run `npm run convert` after content changes. `content/cyclonic` and `lib/pages.js` are generated.

## Sources

Business details, services, 5.0/21 review snapshot and photos were checked on **23 October 2026** against the supplied [Google Maps listing](https://www.google.com/maps?cid=18208153585167050167). Review summaries retain reviewer attribution and link to the source. Photo copyright remains with the respective rights holders. `/photo-credits` explains the source. This is a local content snapshot, not a continuously updating Google API feed.

Primary listing number: **+263 77 261 9171**; WhatsApp: `https://wa.me/263772619171`. Address: Stand 6578, Mkhosana Township, Victoria Falls, Zimbabwe. Google lists opening hours as 24 hours; visitors should arrange visits and pickups in advance. No official email or logo was found on the listing. The current wordmark is a provisional original graphic. No unverified prices or credentials are published.

## Enquiries

Forms validate the experience, visitor name, future date and traveller count, then prepare an encoded WhatsApp message. The visitor reviews and sends the message themselves. No payment or reservation is automatically confirmed. `NEXT_PUBLIC_WHATSAPP_NUMBER` may override the default verified listing number. Set `NEXT_PUBLIC_SITE_URL` to the final public URL before deployment.

## Verification

`npm run verify:content` checks generated headings, local assets, internal links, removed demo content and message validation using an unsent fixture. Browser checks cover desktop/mobile layout, navigation, the restored reviews slider, filters, lightbox and enquiry forms. The original animation scripts are served locally and initialised after hydration; preserve the `IX2_PAGE_UPDATE` lifecycle in `components/webflow-scripts.js`.

Hero photography now uses separately licensed high-resolution wildlife images from Hwange, not Google Maps: Christine Donaldson (CC0) and Daughter#3 (CC BY-SA 2.0). See `content/hero-photos.js` for sources and `/photo-credits` for attribution. The home introduction and tour catalogue section have plain backgrounds.
