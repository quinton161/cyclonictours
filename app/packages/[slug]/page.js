import { notFound } from 'next/navigation';
import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const slugs = [
  "african-safari",
  "bali-bliss",
  "cappadocia-dreams",
  "cavo-tagoo-mykonos-greece",
  "dubai-city-explorer",
  "gstaad-palace-switzerland-europe",
  "maldives-honeymoon-special",
  "swiss-alps-explorer",
  "ubud-jungle-retreat-in-bali"
];

export const dynamicParams = false;

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = pages["/packages/" + slug];
  if (!page) return {};
  return pageMetadata(page);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const route = "/packages/" + slug;
  const page = pages[route];
  if (!page) notFound();
  return <WebflowPage route={route} />;
}
