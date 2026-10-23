import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const page = pages["/faq"];

export const metadata = pageMetadata(page);

export default function FaqPage() {
  return <WebflowPage route={"/faq"} />;
}
