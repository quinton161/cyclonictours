import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';

const page = pages["/our-team"];

export const metadata = pageMetadata(page);

export default function OurTeamPage() {
  return <WebflowPage route={"/our-team"} />;
}
