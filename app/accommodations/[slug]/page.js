import { notFound } from 'next/navigation';
import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const slugs = [
  "amangiri-utah-usa",
  "cavo-tagoo-mykonos-greece",
  "gstaad-palace-switzerland-europe",
  "mountain-escape-lodge---nepal",
  "one-only-reethi-rah-maldives",
  "the-mulia-bali-indonesia",
  "ubud-jungle-retreat-in-bali"
];

export const dynamicParams = false;

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = pages["/accommodations/" + slug];
  if (!page) return {};
  return pageMetadata(page);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const route = "/accommodations/" + slug;
  const page = pages[route];
  if (!page) notFound();
  return <WebflowPage route={route} />;
}
