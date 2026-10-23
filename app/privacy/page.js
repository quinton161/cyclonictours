import WebflowPage from '@/components/webflow-page';
import { pages } from '@/lib/pages';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(pages['/privacy']);
export default function PrivacyPage() { return <WebflowPage route="/privacy" />; }
