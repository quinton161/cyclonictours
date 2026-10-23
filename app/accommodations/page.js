import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const page = pages["/accommodations"];

export const metadata = pageMetadata(page);

export default function AccommodationsPage() {
  return <WebflowPage route={"/accommodations"} />;
}
