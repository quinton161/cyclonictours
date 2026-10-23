import { notFound } from 'next/navigation';
import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const slugs = [
  "adventure-seekers-guide-thrilling-activities-abroad",
  "cultural-travel-immersing-yourself-in-local-traditions",
  "discover-the-soul-of-cities",
  "family-friendly-destinations-that-everyone-will-love",
  "how-we-design-intentional-travel",
  "luxury-on-a-budget-affordable-getaways",
  "the-art-of-slow-travel",
  "the-ultimate-honeymoon-destinations-for-2025",
  "top-10-exotic-resorts-around-the-world",
  "travel-smart-packing-tips-youll-actually-use",
  "why-2025-is-the-best-year-for-travel-and-tour",
  "why-guided-tours-make-travel-stress-free"
];

export const dynamicParams = false;

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = pages["/blog/" + slug];
  if (!page) return {};
  return pageMetadata(page);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const route = "/blog/" + slug;
  const page = pages[route];
  if (!page) notFound();
  return <WebflowPage route={route} />;
}
