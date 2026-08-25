import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data/mockProducts';

export async function GET() {
  const products = getAllProducts();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yanti-titanium.ua';

  const xmlItems = products
    .map((product) => {
      const defaultVariant = product.variants[0];
      const price = product.base_price + (defaultVariant?.price_adjustment || 0);

      return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.title}]]></g:title>
      <g:description><![CDATA[${product.description}]]></g:description>
      <g:link>${baseUrl}/product/${product.slug}</g:link>
      <g:image_link>${product.images[0]}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${price}.00 UAH</g:price>
      <g:brand>YANTI TITANIUM</g:brand>
      <g:condition>new</g:condition>
      <g:material>${product.material}</g:material>
      <g:google_product_category>192</g:google_product_category>
      <g:product_type><![CDATA[Прикраси > Пірсинг > ${product.category_name}]]></g:product_type>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>YANTI TITANIUM Feed</title>
    <link>${baseUrl}</link>
    <description>Google Merchant Center XML Feed for YANTI TITANIUM Jewelry</description>
    ${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
