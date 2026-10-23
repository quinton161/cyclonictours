import Script from 'next/script';
import StyledRegistry from '@/components/styled-registry';
import BrandStyles from '@/components/brand-styles';
import SiteInteractions from '@/components/site-interactions';
import { site } from '@/content/site';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')),
  title: 'Cyclonic Tours | Victoria Falls & Beyond', description: site.description,
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  openGraph: { title: 'Cyclonic Tours | Victoria Falls & Beyond', description: site.description, type: 'website', images: [{ url: '/images/wildlife/home-elephants.webp' }] },
  twitter: { card: 'summary_large_image', title: 'Cyclonic Tours | Victoria Falls & Beyond', description: site.description, images: ['/images/wildlife/home-elephants.webp'] },
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#18392b' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-wf-domain="tripvana-agency.webflow.io" data-wf-page="68b4af000f5b95bfbdc12b45" data-wf-site="68b4aefe0f5b95bfbdc12b0b" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/styles/template.css" />
        <link href="/fonts/fonts.css" rel="stylesheet" />
        <Script id="w-mod" strategy="beforeInteractive">{`document.documentElement.classList.add('w-mod-js');if('ontouchstart' in window)document.documentElement.classList.add('w-mod-touch');`}</Script>
      </head>
      <body><StyledRegistry><BrandStyles />{children}<SiteInteractions /></StyledRegistry></body>
    </html>
  );
}
