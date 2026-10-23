import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const page = pages["/404"];

export const metadata = pageMetadata(page);

export default function Page404Page() {
  return <WebflowPage route={"/404"} />;
}
