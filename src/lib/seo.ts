import { Metadata } from 'next';
import { initialSettings } from './data/initial-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://desisigns.ca';

export function constructMetadata({
  title,
  description,
  image = '/og-image.jpg',
  canonicalUrl,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const fullTitle = title
    ? `${title} | Desi Signs Edmonton`
    : initialSettings.seoGlobalTitle;
  const fullDesc = description || initialSettings.seoGlobalDescription;
  const url = canonicalUrl
    ? canonicalUrl.startsWith('http')
      ? canonicalUrl
      : `${SITE_URL}${canonicalUrl}`
    : SITE_URL;

  return {
    title: fullTitle,
    description: fullDesc,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: fullDesc,
      url,
      siteName: 'Desi Signs',
      locale: 'en_CA',
      type: 'website',
      images: [
        {
          url: image.startsWith('http') ? image : `${SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDesc,
      images: [image.startsWith('http') ? image : `${SITE_URL}${image}`],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  };
}

// LocalBusiness / SignCompany JSON-LD
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'Desi Signs',
    legalName: 'Desi Signs Ltd.',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80',
    description: initialSettings.seoGlobalDescription,
    telephone: initialSettings.phone,
    email: initialSettings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: initialSettings.address,
      addressLocality: initialSettings.city,
      addressRegion: 'AB',
      postalCode: initialSettings.postalCode,
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '53.5461',
      longitude: '-113.4938',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
    areaServed: initialSettings.serviceArea.map((city) => ({
      '@type': 'AdministrativeArea',
      name: city,
    })),
    priceRange: '$$$',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Commercial Signage Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Channel Letter Signs',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '3D Dimensional Architectural Letters',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Freestanding Pylon & Monument Signs',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Storefront Fascia Signage',
          },
        },
      ],
    },
  };
}

// Service JSON-LD
export function getServiceSchema(service: {
  title: string;
  description?: string;
  shortDescription?: string;
  slug: string;
  image: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description || service.shortDescription || '',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Desi Signs',
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'State',
      name: 'Alberta',
    },
    url: `${SITE_URL}/services/${service.slug}`,
    image: service.image,
  };
}

// Article JSON-LD for Blog
export function getArticleSchema(blog: {
  title: string;
  description: string;
  slug: string;
  publishedDate: string;
  author: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    ...(blog.image ? { image: [blog.image.startsWith('http') ? blog.image : `${SITE_URL}${blog.image}`] } : {}),
    datePublished: blog.publishedDate,
    dateModified: blog.publishedDate,
    author: {
      '@type': 'Person',
      name: blog.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Desi Signs',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${blog.slug}`,
    },
  };
}

// BreadcrumbList JSON-LD
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

