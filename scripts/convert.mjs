import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const root = process.cwd();
const srcRoot = path.join(root, 'original-html');
const contentDir = path.join(root, 'content', 'pages');
const appDir = path.join(root, 'app');
const libDir = path.join(root, 'lib');
const componentsDir = path.join(root, 'components');

function mkdir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function routeForSource(relPosix) {
  if (relPosix === 'index.html') return '/';
  let m = relPosix.match(/^packages\/(.+)\.html$/);
  if (m) return `/packages/${m[1]}`;
  m = relPosix.match(/^blog-posts\/(.+)\.html$/);
  if (m) return `/blog/${m[1]}`;
  m = relPosix.match(/^hotel-accommodations\/(.+)\.html$/);
  if (m) return `/accommodations/${m[1]}`;
  m = relPosix.match(/^utility-pages\/(.+)\.html$/);
  if (m) return `/utility-pages/${m[1]}`;
  m = relPosix.match(/^(.+)\.html$/);
  if (m) return `/${m[1]}`;
  return null;
}

function fileKeyForRoute(route) {
  if (route === '/') return 'home';
  return route.slice(1).replace(/\//g, '__');
}

function rewriteHref(href, sourceRel) {
  if (!href) return null;
  if (/^(https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(href)) return null;
  if (href.startsWith('#')) return null;

  let pathPart = href;
  let hash = '';
  const hashIndex = href.indexOf('#');
  if (hashIndex >= 0) {
    hash = href.slice(hashIndex);
    pathPart = href.slice(0, hashIndex);
  }

  let query = '';
  const queryIndex = pathPart.indexOf('?');
  if (queryIndex >= 0) {
    query = pathPart.slice(queryIndex);
    pathPart = pathPart.slice(0, queryIndex);
  }

  if (!pathPart) return null;

  const dir = path.posix.dirname(sourceRel);
  const resolved = pathPart.startsWith('/')
    ? path.posix.normalize(pathPart.slice(1))
    : path.posix.normalize(path.posix.join(dir, pathPart));
  const targetRoute = routeForSource(resolved);
  if (!targetRoute) return null;
  return targetRoute + query + hash;
}

function extractPage(file) {
  const rel = toPosix(path.relative(srcRoot, file));
  const route = routeForSource(rel);
  if (!route) throw new Error(`No route for ${rel}`);

  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html);

  const title = $('title').first().text().trim();
  const description = $('meta[name="description"]').attr('content') || '';
  const ogImage = $('meta[property="og:image"]').attr('content') || '';
  const htmlEl = $('html');
  const pageId = htmlEl.attr('data-wf-page') || '';
  const collection = htmlEl.attr('data-wf-collection') || '';
  const itemSlug = htmlEl.attr('data-wf-item-slug') || '';

  const scripts = [];

  $('body script').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src');
    const type = ($el.attr('type') || '').toLowerCase();

    if (src) {
      scripts.push({ type: 'src', value: src });
      $el.remove();
      return;
    }

    if (type === 'application/json' || type === 'text/x-wf-template') {
      return;
    }

    const code = $el.html() || '';
    if (code.trim()) scripts.push({ type: 'code', value: code });
    $el.remove();
  });

  $('body [href]').each((_, el) => {
    const $el = $(el);
    const next = rewriteHref($el.attr('href'), rel);
    if (next !== null) $el.attr('href', next);
  });

  const bodyHtml = $('body').html() || '';
  const key = fileKeyForRoute(route);

  return {
    route,
    source: rel,
    key,
    title,
    description,
    ogImage,
    pageId,
    collection,
    itemSlug,
    scripts,
    bodyHtml,
  };
}

function pageMetadata(page) {
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'website',
      images: page.ogImage ? [{ url: page.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: page.ogImage ? [page.ogImage] : undefined,
    },
  };
}

function writePageComponent(route, page) {
  const dir = route === '/' ? appDir : path.join(appDir, ...route.slice(1).split('/'));
  mkdir(dir);
  const name = route === '/' ? 'Page' : `${route.split('/').filter(Boolean).pop().replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())}Page`;
  let functionName = name.replace(/[^A-Za-z0-9_$]/g, '') || 'Page';
  if (/^\d/.test(functionName)) functionName = `Page${functionName}`;
  const metadata = pageMetadata(page);
  const file = path.join(dir, 'page.js');
  const code = `import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const page = pages[${JSON.stringify(route)}];

export const metadata = pageMetadata(page);

export default function ${functionName}() {
  return <WebflowPage route={${JSON.stringify(route)}} />;
}
`;
  fs.writeFileSync(file, code);
}

function writeDetailPage(prefix, slugs) {
  const dir = path.join(appDir, ...prefix.slice(1).split('/'), '[slug]');
  mkdir(dir);
  const file = path.join(dir, 'page.js');
  const code = `import { notFound } from 'next/navigation';
import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const slugs = ${JSON.stringify(slugs, null, 2)};

export const dynamicParams = false;

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = pages[${JSON.stringify(prefix)} + slug];
  if (!page) return {};
  return pageMetadata(page);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const route = ${JSON.stringify(prefix)} + slug;
  const page = pages[route];
  if (!page) notFound();
  return <WebflowPage route={route} />;
}
`;
  fs.writeFileSync(file, code);
}

// Overwrite generated files only. Keep the shared layout and runtime components.
mkdir(contentDir);
mkdir(appDir);
mkdir(libDir);
mkdir(componentsDir);

const files = walk(srcRoot).sort();
const pages = {};
const redirects = [];
const groups = {
  '/packages/': [],
  '/blog/': [],
  '/accommodations/': [],
  '/utility-pages/': [],
};

for (const file of files) {
  const page = extractPage(file);
  pages[page.route] = {
    route: page.route,
    source: page.source,
    file: `${page.key}.html`,
    title: page.title,
    description: page.description,
    ogImage: page.ogImage,
    pageId: page.pageId,
    collection: page.collection,
    itemSlug: page.itemSlug,
    scripts: page.scripts,
  };
  fs.writeFileSync(path.join(contentDir, `${page.key}.html`), page.bodyHtml);

  redirects.push({
    source: `/${page.source}`,
    destination: page.route,
    permanent: true,
  });

  for (const [prefix, list] of Object.entries(groups)) {
    if (page.route.startsWith(prefix) && page.route !== prefix.slice(0, -1)) {
      list.push(page.route.slice(prefix.length));
    }
  }
}

const sortedPages = Object.fromEntries(Object.entries(pages).sort(([a], [b]) => a.localeCompare(b)));

fs.writeFileSync(
  path.join(libDir, 'pages.js'),
  `export const pages = ${JSON.stringify(sortedPages, null, 2)};\n`
);

fs.writeFileSync(
  path.join(libDir, 'redirects.js'),
  `export const redirects = ${JSON.stringify(redirects, null, 2)};\n`
);

fs.writeFileSync(
  path.join(libDir, 'metadata.js'),
  `export function pageMetadata(page) {
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'website',
      images: page.ogImage ? [{ url: page.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: page.ogImage ? [page.ogImage] : undefined,
    },
  };
}
`
);

for (const [route] of Object.entries(sortedPages)) {
  if (
    route.startsWith('/packages/') ||
    route.startsWith('/blog/') ||
    route.startsWith('/accommodations/') ||
    route.startsWith('/utility-pages/')
  ) {
    continue;
  }
  writePageComponent(route, sortedPages[route]);
}

writeDetailPage('/packages/', groups['/packages/']);
writeDetailPage('/blog/', groups['/blog/']);
writeDetailPage('/accommodations/', groups['/accommodations/']);
writeDetailPage('/utility-pages/', groups['/utility-pages/']);

fs.writeFileSync(
  path.join(appDir, 'not-found.js'),
  `import WebflowPage from '@/components/webflow-page';

export default function NotFound() {
  return <WebflowPage route="/404" />;
}
`
);

console.log(`Converted ${files.length} pages.`);
console.log('Groups:', Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.length])));
console.log('Redirects:', redirects.length);
