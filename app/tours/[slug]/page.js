import { notFound } from 'next/navigation';
import WebflowPage from '@/components/webflow-page';
import { pages } from '@/lib/pages';
import { tours } from '@/content/tours';
import { pageMetadata } from '@/lib/metadata';
export const dynamicParams = false;
export function generateStaticParams() { return tours.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return pages[`/tours/${slug}`] ? pageMetadata(pages[`/tours/${slug}`]) : {};
}
export default async function TourPage({ params }) {
  const { slug } = await params;
  if (!pages[`/tours/${slug}`]) notFound();
  return <WebflowPage route={`/tours/${slug}`} />;
}
