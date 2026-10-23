import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const page = pages["/packages"];

export const metadata = pageMetadata(page);

export default function PackagesPage() {
  return <WebflowPage route={"/packages"} />;
}
