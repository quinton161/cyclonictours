import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const page = pages["/about"];

export const metadata = pageMetadata(page);

export default function AboutPage() {
  return <WebflowPage route={"/about"} />;
}
