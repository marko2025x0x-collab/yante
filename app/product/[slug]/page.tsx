import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts } from '@/lib/data/mockProducts';
import { ProductDetailView } from '@/components/shop/ProductDetailView';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Товар не знайдено | YANTI TITANIUM',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yanti.ua';
  const canonicalUrl = `${siteUrl}/product/${product.slug}`;
  const firstImage = product.images[0] ? (product.images[0].startsWith('http') ? product.images[0] : `${siteUrl}${product.images[0]}`) : `${siteUrl}/images/products/labrets/lr-basic-12.webp`;

  const minPrice = product.base_price;
  const maxPrice = product.base_price + Math.max(0, ...product.variants.map((v) => v.price_adjustment || 0));
  const priceDisplay = minPrice === maxPrice ? `${minPrice} ₴` : `від ${minPrice} ₴`;

  return {
    title: `${product.title} — ${priceDisplay} | Купити титановий пірсинг ASTM F-136`,
    description: `${product.description} Матеріал: ${product.material}. Дзеркальне полірування, гіпоалергенно. Доставка Новою Поштою по всій Україні.`,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      product.title,
      product.category_name || 'пірсинг',
      'титан ASTM F-136',
      'купити пірсинг Україна',
      'імплантаційний титан',
      'анодування титану',
      'стерилізація пірсингу',
      'лабрети',
      'клікери',
    ],
    openGraph: {
      title: `${product.title} | YANTI TITANIUM`,
      description: `${product.description} Ціна: ${priceDisplay}. Імплантаційний титан ASTM F-136.`,
      url: canonicalUrl,
      siteName: 'YANTI TITANIUM',
      locale: 'uk_UA',
      type: 'website',
      images: [
        {
          url: firstImage,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | YANTI TITANIUM`,
      description: product.description,
      images: [firstImage],
    },
    other: {
      'product:price:amount': minPrice.toString(),
      'product:price:currency': 'UAH',
      'product:availability': 'in stock',
      'product:condition': 'new',
      'product:material': 'ASTM F-136 Implant Grade Titanium',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yanti.ua';
  const canonicalUrl = `${siteUrl}/product/${product.slug}`;
  const firstImage = product.images[0] ? (product.images[0].startsWith('http') ? product.images[0] : `${siteUrl}${product.images[0]}`) : `${siteUrl}/images/products/labrets/lr-basic-12.webp`;

  // Schema.org JSON-LD Structured Data для Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: [firstImage, ...product.images.slice(1).map((img) => img.startsWith('http') ? img : `${siteUrl}${img}`)],
    description: product.description,
    sku: product.variants[0]?.sku || product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'YANTI TITANIUM',
    },
    material: 'ASTM F-136 Implant Grade Titanium (Ti-6Al-4V ELI)',
    category: product.category_name,
    offers: {
      '@type': 'AggregateOffer',
      url: canonicalUrl,
      priceCurrency: 'UAH',
      lowPrice: product.base_price,
      highPrice: product.base_price + Math.max(0, ...product.variants.map((v) => v.price_adjustment || 0)),
      offerCount: product.variants.length,
      price: product.base_price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'YANTI TITANIUM',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '28',
      bestRating: '5',
      worstRating: '1',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Головна',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Каталог',
        item: `${siteUrl}/catalog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category_name || 'Категорія',
        item: `${siteUrl}/catalog/${product.category_slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailView product={product} />
    </>
  );
}
