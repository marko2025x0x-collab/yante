export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  sort_order: number;
}

export interface AnodizationOption {
  id: string;
  name: string;
  voltage: string;
  hex_code: string;
  price_extra: number;
  is_active: boolean;
  filter_css?: string; // CSS filter for live jewelry recoloring preview
}

export interface ProductVariant {
  id: string;
  product_id: string;
  gauge: string; // e.g. '1.2mm (16G)', '1.6mm (14G)'
  length_or_diameter: string; // e.g. '6mm', '8mm', '10mm', '12mm'
  price_adjustment: number;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  category_id: string;
  category_slug?: string;
  category_name?: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  base_price: number;
  images: string[];
  is_active: boolean;
  is_bestseller?: boolean;
  material: string; // e.g. 'ASTM F-136 Implant Grade Titanium'
  thread_type: 'Threadless (Безрізьбовий)' | 'Internally Threaded (Внутрішня різьба)' | 'Hinged Segment (Клікер)';
  supports_anodization?: boolean; // Whether this product can be anodized
  variants: ProductVariant[];
  available_colors?: string[];
  seo_title?: string;
  seo_description?: string;
  created_at: string;
}

export interface CompatibleTop {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  crystal: string;
}

export interface CartItem {
  cartItemId: string; // generated unique composite id
  productId: string;
  productTitle: string;
  productSlug: string;
  image: string;
  variantId: string;
  gauge: string;
  size: string;
  anodizationId: string;
  anodizationName: string;
  anodizationHex: string;
  isSterilized: boolean;
  unitPrice: number;
  quantity: number;
}
