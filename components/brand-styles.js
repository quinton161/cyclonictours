'use client';

import { createGlobalStyle } from 'styled-components';

const BrandStyles = createGlobalStyle`
  :root { --ct-green:#18392b; --ct-ivory:#f8f6f0; --ct-gold:#c5a46d; --ct-ink:#202824; --ct-line:#dddcd3; --091733:#18392b; --122242:#18392b; --a0f751:#c5a46d; --656e7f:#566257; --f7f7f7:#f8f6f0; --f8f8f8:#f8f6f0; --inter-tight:'Open Sans',sans-serif; }
  html { scroll-behavior:smooth; }
  body { background:var(--ct-ivory); color:var(--ct-ink); font-family:'Open Sans',sans-serif; }
  h1,h2,h3,h4,h5,h6,.package-item-name,.accommodation-slider-title { font-family:Montserrat,sans-serif; }
  h1,h2 { letter-spacing:-.045em; }
  p { line-height:1.75; }
  a,button,input,select,textarea { -webkit-tap-highlight-color:transparent; }
  button,input,select,textarea { font:inherit; }
  a:focus-visible,button:focus-visible,[role=button]:focus-visible { outline:3px solid var(--ct-gold); outline-offset:5px; }
  [hidden] { display:none !important; }
  .w-webflow-badge { display:none !important; }
  .gradient-body { background:none; }
  .navbar:not(.transparent-navbar),.footer,.about-section,.ct-final-cta { background-color:var(--ct-green); }
  .transparent-nav-menu { background:rgba(24,57,43,.28); backdrop-filter:blur(12px); }
  .nav-menu { gap:2px; }
  .nav-link { white-space:nowrap; padding-left:13px; padding-right:13px; font-size:13px; }
  .nav-link.w--current { color:white; background-color:var(--ct-green); }
  .ct-on-dark .nav-link { color:white; }
  .ct-on-dark .nav-link.w--current { color:var(--ct-green); background-color:var(--ct-ivory); }
  .navbar-brand { width:185px; min-width:185px; }
  .navbar-brand img { width:185px; max-height:58px; object-fit:contain; }
  .nav-buttons-block button { border:0; cursor:pointer; font:inherit; }
  .ct-menu-glyph { position:absolute; width:20px; height:20px; left:50%; top:50%; transform:translate(-50%,-50%); color:var(--ct-green); pointer-events:none; }
  .w-nav-button[aria-expanded=true] .ct-menu-glyph { transform:translate(-50%,-50%) rotate(90deg); transition:transform .3s; }
  .footer-logo { width:240px; height:auto; }
  .button-icon-block,.button-arrow-block,.booking-line-animation { background-color:var(--ct-gold); }
  .button-icon-block,.button-arrow-block { background-image:none !important; }
  .home-hero-section { background-image:linear-gradient(180deg,rgba(6,25,17,.36),rgba(6,25,17,.26)),url('/images/wildlife/home-elephants.webp') !important; background-size:cover; background-position:center 62%; }
  .about-hero-section { background-image:linear-gradient(180deg,rgba(6,25,17,.38),rgba(6,25,17,.48)),url('/images/wildlife/about-lion.webp') !important; background-size:cover; background-position:center 45%; }
  .tour-activities-section,.packages-section { background-image:none !important; }
  .home-hero-section h1.home { max-width:850px; width:100%; font-size:clamp(38px,4.4vw,68px); line-height:1.1; margin-bottom:20px; }
  .ct-hero-description { max-width:620px; text-align:center; color:white; margin:0 auto 24px; font-size:16px; line-height:1.7; }
  .ct-hero-secondary { display:inline-flex; margin:16px auto 0; color:white; border-bottom:1px solid #ffffff88; padding-bottom:5px; }
  .home-hero-section h1,.about-hero-section h1,.about-hero-section p,.home-hero-slider-content .price,.ct-gallery-item>span,.ct-gallery-item>span span { color:#fff !important; }
  .home-hero-slider-content .price { background:rgba(9,30,20,.7); }
  .home-hero-slider-content .overflow-hidden { position:relative; }
  .home-hero-slider-flex { z-index:2; }
  .home-hero-slider-content .overflow-hidden:after { content:''; position:absolute; inset:0; background:linear-gradient(transparent,rgba(0,0,0,.65)); pointer-events:none; }
  .review-section { background:var(--ct-green); }
  .review-section h2,.review-section h5,.review-section h6,.review-section p,.review-section a { color:#fff; }
  .review-section .button-04,.review-section .button-04 .button-2-text { color:var(--ct-green); }
  .review-slider-content { background-color:#204535; }
  .ct-stars { color:var(--ct-gold); font-size:23px; letter-spacing:3px; line-height:1.4; }
  .ct-rating-link { display:grid; gap:8px; color:white; font-size:14px; }
  .ct-rating-label { display:flex; gap:18px; align-items:center; font-size:22px; }
  .ct-rating-label strong { font-size:30px; }
  .ct-review-note { font-size:12px; opacity:.8; }
  .ct-reviews-page { text-align:center; width:100%; }
  .ct-reviews-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; margin-top:50px; text-align:left; }
  .ct-review-card { padding:28px; border:1px solid var(--ct-line); border-radius:18px; background:white; }
  .ct-review-card h3 { font-size:18px; margin:18px 0 12px; }
  .ct-review-card p { font-size:14px; }
  .ct-review-card small { font-size:11px; color:#566257; }
  .ct-map-block { width:100%; margin-top:32px; }
  .ct-map-block iframe { width:100%; border:0; border-radius:20px; }
  .ct-map-block p { font-size:12px; }
  .home-hero-slider-content { color:var(--ct-ink); }
  .home-hero-slider-flex .large-paragraph { font-family:Montserrat,sans-serif; font-size:16px; }
  .price { color:var(--ct-green); font-size:11px; background:var(--ct-ivory); }
  .home-hero-slider-image { object-fit:cover; height:170px; }
  @media(min-width:992px) { .hero-wrapper { min-height:850px; height:max(850px,100svh); } }
  .tour-activities-section,.packages-section,.blog-section,.faq-section,.featured-stays-section { background-color:var(--ct-ivory); }
  .ct-introduction { max-width:720px; margin:40px auto 0; text-align:center; font-size:18px; }
  .ct-text-link { color:var(--ct-green); display:inline-block; margin-top:18px; border-bottom:1px solid var(--ct-gold); padding-bottom:5px; }
  .ct-why { padding:95px 0; background:#eeeee5; }
  .ct-why h2 { max-width:700px; margin:16px 0 40px; }
  .ct-why-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:24px; }
  .ct-why article { border-top:1px solid #bdc6ba; padding-top:22px; }
  .ct-step { color:#8a6935; font-size:13px; letter-spacing:.1em; }
  .ct-why h3 { font-size:20px; margin:22px 0 12px; }
  .ct-why p { font-size:14px; color:#526056; }
  .ct-catalogue-note { max-width:760px; margin:24px auto 36px; color:#566257; text-align:center; font-size:14px; }
  .tour-details .ct-catalogue-note { text-align:left; border-left:3px solid var(--ct-gold); padding-left:18px; }
  .booking-open { background-color:var(--ct-green); font-size:11px; }
  .package-item-price { font-size:13px; color:#5e6b60; }
  .package-short-desp { font-size:14px; }
  .ct-card-enquiry { display:flex; align-items:center; justify-content:space-between; width:100%; margin-top:12px; border:0; border-top:1px solid var(--ct-line); padding:16px 2px; background:none; color:var(--ct-green); font-weight:600; cursor:pointer; text-align:left; }
  .ct-card-enquiry:hover { color:#8a6935; }
  .ct-filters { display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin:30px 0; }
  .ct-filter { border:1px solid #d1d7ce; border-radius:28px; padding:11px 21px; background:transparent; color:var(--ct-green); cursor:pointer; font-size:13px; transition:background .2s,color .2s; }
  .ct-filter[aria-pressed=true],.ct-filter:hover { background:var(--ct-green); color:white; border-color:var(--ct-green); }
  .ct-gallery { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:22px; width:100%; }
  .ct-gallery-item { position:relative; padding:0; background:var(--ct-green); border:0; overflow:hidden; border-radius:18px; cursor:pointer; text-align:left; color:white; }
  .ct-gallery-item img { width:100%; height:340px; object-fit:cover; transition:transform .6s ease; }
  .ct-gallery-item:hover img { transform:scale(1.04); }
  .ct-gallery-item>span { position:absolute; inset:auto 0 0; padding:50px 22px 22px; background:linear-gradient(transparent,#10251be6); font-size:14px; }
  .ct-gallery-item>span>span { float:right; }
  .ct-final-cta { padding:100px 20px; text-align:center; color:white; }
  .ct-final-cta h2 { color:white; max-width:700px; margin:18px auto 32px; }
  .ct-eyebrow { text-transform:uppercase; letter-spacing:.18em; font-size:11px; color:#dfc9a6; }
  .ct-solid-button { display:inline-flex; justify-content:center; align-items:center; gap:10px; padding:16px 24px; background:var(--ct-gold); color:#15291e; border:0; border-radius:30px; text-decoration:none; font-weight:600; cursor:pointer; font-size:14px; }
  .ct-solid-button:hover { background:#d9bc8d; }
  .ct-inline-enquiry { width:100%; min-width:0; padding:28px; border:1px solid #d8dfd4; border-radius:22px; background:#fff; }
  .ct-inline-enquiry h3 { font-size:24px; }
  .ct-enquiry { display:grid; gap:17px; }
  .ct-enquiry label { display:grid; gap:7px; font-size:12px; font-weight:600; color:var(--ct-green); }
  .ct-enquiry input,.ct-enquiry select,.ct-enquiry textarea { width:100%; min-width:0; border:1px solid #cbd3c7; border-radius:9px; padding:12px; background:#fff; color:var(--ct-ink); font-size:14px; font-weight:400; }
  .ct-enquiry input:focus,.ct-enquiry select:focus,.ct-enquiry textarea:focus { outline:2px solid var(--ct-gold); outline-offset:1px; }
  .ct-form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .ct-enquiry p { font-size:12px; line-height:1.7; margin:0; color:#5d695f; }
  .ct-form-status { padding:12px 15px; background:#f4eee1; border-radius:8px; }
  .ct-dialog { width:min(540px,calc(100% - 28px)); max-height:90dvh; padding:32px; border:0; border-radius:22px; color:var(--ct-ink); background:var(--ct-ivory); box-shadow:0 30px 100px #0005; overflow:auto; }
  .ct-dialog::backdrop { background:rgba(9,25,17,.72); backdrop-filter:blur(5px); }
  .ct-dialog h2 { font-size:29px; margin:0 35px 10px 0; }
  .ct-dialog-intro { font-size:13px; line-height:1.7; margin-bottom:22px; }
  .ct-dialog-close { position:absolute; top:16px; right:16px; width:36px; height:36px; border:1px solid #cbd3c7; border-radius:50%; background:white; color:var(--ct-green); cursor:pointer; font-size:24px; }
  .ct-whatsapp-float { position:fixed; z-index:900; right:22px; bottom:22px; display:flex; gap:9px; align-items:center; border:1px solid #ffffff44; border-radius:40px; background:var(--ct-green); color:white; box-shadow:0 8px 30px #0003; padding:14px 20px; font-size:13px; cursor:pointer; }
  .ct-whatsapp-float svg { width:22px; height:22px; }
  .ct-lightbox { width:min(1100px,calc(100% - 24px)); max-width:none; background:#10251b; color:white; }
  .ct-lightbox img { display:block; width:100%; max-height:70dvh; object-fit:contain; }
  .ct-lightbox p { margin:16px 0 0; font-size:13px; }
  .ct-lightbox a { color:var(--ct-gold); }
  .ct-legal { max-width:800px; margin:auto; }
  .ct-legal h1 { font-size:48px; margin-bottom:30px; }
  .ct-legal h2 { font-size:24px; margin-top:32px; }
  .ct-legal article { margin-top:42px; border-top:1px solid var(--ct-line); padding-top:30px; }
  .ct-legal img { border-radius:12px; }
  .ct-legal a { color:var(--ct-green); text-decoration:underline; }
  .contact-form-details { gap:28px; }
  .ct-contact-photo { object-fit:cover; border-radius:20px; }
  .footer-copyright-block { color:#d8e0d4; }
  .footer .page-link { line-height:1.9; }
  .footer-bottom { display:flex; justify-content:space-between; gap:20px; }
  .faq-question[role=button] { cursor:pointer; }
  @media(max-width:991px) {
    .ct-why-grid,.ct-reviews-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .ct-gallery { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .nav-menu { background:var(--ct-green); padding:20px; }
    .navbar-brand img { width:160px; }
    .navbar-brand { width:160px; min-width:160px; }
    .nav-menu .nav-link { color:white; }
    .nav-menu .nav-link.w--current { color:var(--ct-green); background:var(--ct-ivory); }
    .ct-hero-description { max-width:550px; padding:0 12px; font-size:14px; }
  }
  @media(max-width:600px) {
    .hero-wrapper { padding-bottom:310px; }
    .home-hero-section h1.home { font-size:36px; max-width:365px; }
    .ct-hero-description { max-width:350px; font-size:13px; }
    .ct-hero-secondary { font-size:13px; margin-top:12px; }
    .ct-why,.ct-final-cta { padding:65px 0; }
    .ct-why-grid { gap:25px 16px; }
    .ct-why h3 { font-size:17px; }
    .ct-why p { font-size:13px; }
    .ct-gallery,.ct-reviews-grid { grid-template-columns:1fr; gap:16px; }
    .ct-gallery-item img { height:300px; }
    .ct-inline-enquiry { padding:22px; }
    .ct-dialog { padding:25px 20px; }
    .ct-dialog h2 { font-size:26px; }
    .ct-form-row { grid-template-columns:1fr; }
    .ct-whatsapp-float { right:14px; bottom:14px; padding:13px 16px; }
    .footer-bottom { flex-direction:column; }
    .ct-filter { padding:9px 15px; font-size:12px; }
    .ct-legal h1 { font-size:36px; }
  }
  @media(prefers-reduced-motion:reduce) { html { scroll-behavior:auto; } .ct-gallery-item img { transition:none; } }
`;

export default BrandStyles;
