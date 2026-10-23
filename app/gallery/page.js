import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const page = pages["/gallery"];

export const metadata = pageMetadata(page);

export default function GalleryPage() {
  return <WebflowPage route={"/gallery"} />;
}
