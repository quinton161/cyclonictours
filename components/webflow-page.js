import fs from 'node:fs';
import path from 'node:path';
import { pages } from '@/lib/pages';
import { redirect } from 'next/navigation';
import WebflowScripts from './webflow-scripts';

const cache = new Map();

function readPage(file) {
  if (process.env.NODE_ENV === 'development') {
    return fs.readFileSync(path.join(process.cwd(), 'content', 'cyclonic', file), 'utf8');
  }
  if (!cache.has(file)) {
    const fullPath = path.join(process.cwd(), 'content', 'cyclonic', file);
    cache.set(file, fs.readFileSync(fullPath, 'utf8'));
  }
  return cache.get(file);
}

export default function WebflowPage({ route }) {
  const page = pages[route];

  if (!page) {
    throw new Error(`Unknown page route: ${route}`);
  }

  if (page.destination) redirect(page.destination);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: readPage(page.file) }} />
      <WebflowScripts scripts={page.scripts} pageId={page.pageId} collection={page.collection} itemSlug={page.itemSlug} />
    </>
  );
}
