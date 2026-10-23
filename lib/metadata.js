export function pageMetadata(page) {
  return {
    alternates: { canonical: page.destination || page.route },
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'website',
      images: page.ogImage ? [{ url: page.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: page.ogImage ? [page.ogImage] : undefined,
    },
  };
}
