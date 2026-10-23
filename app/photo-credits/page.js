import WebflowPage from '@/components/webflow-page';
import { pages } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(pages['/photo-credits']);
export default function CreditsPage() { return <WebflowPage route="/photo-credits" />; }
