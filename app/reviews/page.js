import WebflowPage from '@/components/webflow-page';
import { pageMetadata } from '@/lib/metadata';
import { pages } from '@/lib/pages';
export const metadata = pageMetadata(pages['/reviews']);
export default function ReviewsPage(){return <WebflowPage route="/reviews"/>;}
