export function kruimelSchema(site: URL | undefined, items: { naam: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ naam: 'Home', href: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.naam,
      item: new URL(it.href, site).href,
    })),
  };
}

export function faqSchema(faq: { vraag: string; antwoord: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.vraag,
      acceptedAnswer: { '@type': 'Answer', text: f.antwoord },
    })),
  };
}
