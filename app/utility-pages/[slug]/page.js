import { notFound } from 'next/navigation';
import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const slugs = [
  "changelog",
  "license",
  "privacy-policy",
  "style-guide"
];

export const dynamicParams = false;

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = pages["/utility-pages/" + slug];
  if (!page) return {};
  return pageMetadata(page);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const route = "/utility-pages/" + slug;
  const page = pages[route];
  if (!page) notFound();
  return <WebflowPage route={route} />;
}
