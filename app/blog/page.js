import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const page = pages["/blog"];

export const metadata = pageMetadata(page);

export default function BlogPage() {
  return <WebflowPage route={"/blog"} />;
}
