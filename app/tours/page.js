import WebflowPage from '@/components/webflow-page';
import { pages } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(pages['/tours']);
export default function ToursPage() { return <WebflowPage route="/tours" />; }
