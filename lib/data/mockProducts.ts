import { Product, Category, AnodizationOption, CompatibleTop } from '@/types/product';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-labrets',
    name: 'Лабрети',
    slug: 'labrets',
    description: 'Титанові лабрети з внутрішнім різьбленням та безрізьбові (ASTM F-136).',
    image: '/images/products/labrets/lr-basic-12.webp',
    sort_order: 1,
  },
  {
    id: 'cat-clickers',
    name: 'Клікери та Кільця',
    slug: 'clickers',
    description: 'Сегментні кільця-клікери та циркуляри для септуму, хеліксу, дейсу та носа.',
    image: '/images/products/clickers/ck-basic.webp',
    sort_order: 2,
  },
  {
    id: 'cat-navel',
    name: 'Банани в пупок',
    slug: 'curved-barbells',
    description: 'Вигнуті штанги та преміальні банани в пупок з кристалами та опалами.',
    image: '/images/products/bananas/bn-12.webp',
    sort_order: 3,
  },
  {
    id: 'cat-tops',
    name: 'Накрутки та Топи',
    slug: 'tops-and-ends',
    description: 'Кристальні топи, кластери, опали та фігурні накрутки на різьбу 1.2 мм та 1.6 мм.',
    image: '/images/products/tops/tp-065.webp',
    sort_order: 4,
  },
  {
    id: 'cat-barbells',
    name: 'Штанги та Циркуляри',
    slug: 'straight-barbells',
    description: 'Прямі та циркулярні титанові штанги для язика, індастріал та сосків.',
    image: '/images/products/barbells/bb-12.webp',
    sort_order: 5,
  },
];

export const ANODIZATION_OPTIONS: AnodizationOption[] = [
  { id: 'natural', name: 'Natural Silver', hex_code: '#D1D5DB', voltage: '0V (Базовий титан)', price_extra: 0, is_active: true },
  { id: 'champagne', name: 'Champagne Gold', hex_code: '#E5C158', voltage: '12V-15V', price_extra: 50, is_active: true },
  { id: 'yellow-gold', name: 'Yellow Gold', hex_code: '#F59E0B', voltage: '18V-22V', price_extra: 50, is_active: true },
  { id: 'rose-gold', name: 'Rose Gold', hex_code: '#FB7185', voltage: '25V-28V', price_extra: 50, is_active: true },
  { id: 'bronze', name: 'Bronze', hex_code: '#B45309', voltage: '30V-35V', price_extra: 50, is_active: true },
  { id: 'ice-blue', name: 'Ice Blue', hex_code: '#38BDF8', voltage: '45V-50V', price_extra: 50, is_active: true },
  { id: 'dark-blue', name: 'Dark Blue', hex_code: '#2563EB', voltage: '60V-65V', price_extra: 50, is_active: true },
  { id: 'purple', name: 'Royal Purple', hex_code: '#A855F7', voltage: '75V-80V', price_extra: 50, is_active: true },
  { id: 'teal-green', name: 'Teal Green', hex_code: '#14B8A6', voltage: '90V-95V', price_extra: 50, is_active: true },
];

export const PRODUCTS: Product[] = [
  // ==========================================
  // 1. БАЗОВІ ЛАБРЕТИ (LR-001 - LR-013)
  // ==========================================
  {
    id: 'prod-labret-basic',
    title: 'Базовий титановий лабрет (без накрутки)',
    slug: 'titanium-basic-labret',
    category_id: 'cat-labrets',
    category_slug: 'labrets',
    category_name: 'Лабрети',
    description: 'Класичний титановий лабрет ASTM F-136 із плоскою базою та внутрішнім різьбленням. Ідеальний для первинного проколу губи, мочки, хеліксу, трагусу, конча та флету.',
    features: [
      'Матеріал: Імплантаційний титан ASTM F-136 (Ti-6Al-4V ELI)',
      'Тип різьби: Internally Threaded (Внутрішня різьба 0.9мм / 1.2мм)',
      'Діаметр диска: 4.0 мм (анатомічно плоска задня пластина)',
      'Дзеркальне фінішне полірування (Mirror Polish)',
      'Гіпоалергенно для свіжих та загоєних проколів',
    ],
    base_price: 100,
    images: [
      '/images/products/labrets/lr-basic-12.webp',
      '/images/hero-macro.jpg',
    ],
    is_active: true,
    supports_anodization: true,
    material: 'ASTM F-136 Titanium',
    thread_type: 'Internally Threaded (Внутрішня різьба)',
    variants: [
      { id: 'lr-1', product_id: 'prod-labret-basic', gauge: '1.2 мм', length_or_diameter: '1.2*4мм', price_adjustment: 0, stock: 45, sku: 'LR-001-04' },
      { id: 'lr-2', product_id: 'prod-labret-basic', gauge: '1.2 мм', length_or_diameter: '1.2*5мм', price_adjustment: 0, stock: 50, sku: 'LR-002-05' },
      { id: 'lr-3', product_id: 'prod-labret-basic', gauge: '1.2 мм', length_or_diameter: '1.2*6мм', price_adjustment: 0, stock: 60, sku: 'LR-003-06' },
      { id: 'lr-4', product_id: 'prod-labret-basic', gauge: '1.2 мм', length_or_diameter: '1.2*7мм', price_adjustment: 0, stock: 40, sku: 'LR-004-07' },
      { id: 'lr-5', product_id: 'prod-labret-basic', gauge: '1.2 мм', length_or_diameter: '1.2*8мм', price_adjustment: 0, stock: 75, sku: 'LR-005-08' },
      { id: 'lr-6', product_id: 'prod-labret-basic', gauge: '1.2 мм', length_or_diameter: '1.2*9мм', price_adjustment: 0, stock: 35, sku: 'LR-006-09' },
      { id: 'lr-7', product_id: 'prod-labret-basic', gauge: '1.2 мм', length_or_diameter: '1.2*10мм', price_adjustment: 0, stock: 50, sku: 'LR-007-10' },
      { id: 'lr-8', product_id: 'prod-labret-basic', gauge: '1.2 мм', length_or_diameter: '1.2*12мм', price_adjustment: 0, stock: 30, sku: 'LR-008-12' },
      { id: 'lr-9', product_id: 'prod-labret-basic', gauge: '1.2 мм', length_or_diameter: '1.2*14мм', price_adjustment: 0, stock: 20, sku: 'LR-009-14' },
      { id: 'lr-10', product_id: 'prod-labret-basic', gauge: '1.2 мм', length_or_diameter: '1.2*16мм', price_adjustment: 0, stock: 15, sku: 'LR-010-16' },
      { id: 'lr-11', product_id: 'prod-labret-basic', gauge: '1.6 мм', length_or_diameter: '1.6*6мм', price_adjustment: 0, stock: 25, sku: 'LR-011-06' },
      { id: 'lr-12', product_id: 'prod-labret-basic', gauge: '1.6 мм', length_or_diameter: '1.6*8мм', price_adjustment: 0, stock: 30, sku: 'LR-012-08' },
      { id: 'lr-13', product_id: 'prod-labret-basic', gauge: '1.6 мм', length_or_diameter: '1.6*10мм', price_adjustment: 0, stock: 25, sku: 'LR-013-10' },
    ],
    created_at: new Date().toISOString(),
  },

  // ==========================================
  // 2. ЛАБРЕТ З КУЛЬКОЮ 3 ММ (LR-014 - LR-023)
  // ==========================================
  {
    id: 'prod-labret-with-ball',
    title: 'Титановий лабрет із кулькою 3 мм',
    slug: 'titanium-labret-with-ball',
    category_id: 'cat-labrets',
    category_slug: 'labrets',
    category_name: 'Лабрети',
    description: 'Комплект: титановий лабрет ASTM F-136 із внутрішньою різьбою разом із полірованою титановою кулькою 3 мм.',
    features: [
      'Матеріал: Імплантаційний титан ASTM F-136',
      'Розмір кульки: 3.0 мм',
      'Тип різьби: Внутрішня різьба (Internally Threaded)',
      'Надійна фіксація без самовільного розкручування',
    ],
    base_price: 200,
    images: [
      '/images/products/labrets/lr-ball-12.webp',
      '/images/hero-macro.jpg',
    ],
    is_active: true,
    supports_anodization: true,
    material: 'ASTM F-136 Titanium',
    thread_type: 'Internally Threaded (Внутрішня різьба)',
    variants: [
      { id: 'lr-t-1', product_id: 'prod-labret-with-ball', gauge: '1.2 мм', length_or_diameter: '1.2*4*3мм', price_adjustment: 0, stock: 20, sku: 'LR-014-04' },
      { id: 'lr-t-2', product_id: 'prod-labret-with-ball', gauge: '1.2 мм', length_or_diameter: '1.2*5*3мм', price_adjustment: 0, stock: 20, sku: 'LR-015-05' },
      { id: 'lr-t-3', product_id: 'prod-labret-with-ball', gauge: '1.2 мм', length_or_diameter: '1.2*6*3мм', price_adjustment: 0, stock: 35, sku: 'LR-016-06' },
      { id: 'lr-t-4', product_id: 'prod-labret-with-ball', gauge: '1.2 мм', length_or_diameter: '1.2*7*3мм', price_adjustment: 0, stock: 25, sku: 'LR-017-07' },
      { id: 'lr-t-5', product_id: 'prod-labret-with-ball', gauge: '1.2 мм', length_or_diameter: '1.2*8*3мм', price_adjustment: 0, stock: 50, sku: 'LR-018-08' },
      { id: 'lr-t-6', product_id: 'prod-labret-with-ball', gauge: '1.2 мм', length_or_diameter: '1.2*9*3мм', price_adjustment: 0, stock: 20, sku: 'LR-019-09' },
      { id: 'lr-t-7', product_id: 'prod-labret-with-ball', gauge: '1.2 мм', length_or_diameter: '1.2*10*3мм', price_adjustment: 0, stock: 30, sku: 'LR-020-10' },
      { id: 'lr-t-8', product_id: 'prod-labret-with-ball', gauge: '1.2 мм', length_or_diameter: '1.2*12*3мм', price_adjustment: 0, stock: 20, sku: 'LR-021-12' },
      { id: 'lr-t-9', product_id: 'prod-labret-with-ball', gauge: '1.2 мм', length_or_diameter: '1.2*14*3мм', price_adjustment: 0, stock: 15, sku: 'LR-022-14' },
      { id: 'lr-t-10', product_id: 'prod-labret-with-ball', gauge: '1.2 мм', length_or_diameter: '1.2*16*3мм', price_adjustment: 0, stock: 10, sku: 'LR-023-16' },
    ],
    created_at: new Date().toISOString(),
  },

  // ==========================================
  // 3. БАНАНИ ТИТАНОВІ (BN-024 - BN-030)
  // ==========================================
  {
    id: 'prod-curved-banana',
    title: 'Банан титановий (Curved Barbell)',
    slug: 'titanium-curved-barbell-micro',
    category_id: 'cat-navel',
    category_slug: 'curved-barbells',
    category_name: 'Банани',
    description: 'Вигнута штанга з імплантаційного титану ASTM F-136 для брови, дейсу, вертикального лабрету, руки та септуму.',
    features: [
      'Матеріал: Імплантаційний титан ASTM F-136',
      'Тип різьби: Внутрішня різьба',
      'Кульки: 3.0 мм (для 1.2мм) / 4-5 мм (для 1.6мм)',
    ],
    base_price: 200,
    images: [
      '/images/products/bananas/bn-12.webp',
      '/images/products/bananas/bn-16.webp',
    ],
    is_active: true,
    supports_anodization: true,
    material: 'ASTM F-136 Titanium',
    thread_type: 'Internally Threaded (Внутрішня різьба)',
    variants: [
      { id: 'bn-1', product_id: 'prod-curved-banana', gauge: '1.2 мм', length_or_diameter: '1,2*6*3mm', price_adjustment: 0, stock: 25, sku: 'BN-024-06' },
      { id: 'bn-2', product_id: 'prod-curved-banana', gauge: '1.2 мм', length_or_diameter: '1,2*8*3mm', price_adjustment: 0, stock: 35, sku: 'BN-025-08' },
      { id: 'bn-3', product_id: 'prod-curved-banana', gauge: '1.2 мм', length_or_diameter: '1,2*10*3mm', price_adjustment: 0, stock: 25, sku: 'BN-026-10' },
      { id: 'bn-4', product_id: 'prod-curved-banana', gauge: '1.2 мм', length_or_diameter: '1,2*12*3mm', price_adjustment: 0, stock: 20, sku: 'BN-027-12' },
      { id: 'bn-5', product_id: 'prod-curved-banana', gauge: '1.6 мм', length_or_diameter: '1,6*8*4', price_adjustment: 0, stock: 20, sku: 'BN-028-08' },
      { id: 'bn-6', product_id: 'prod-curved-banana', gauge: '1.6 мм', length_or_diameter: '1,6*10*5', price_adjustment: 0, stock: 25, sku: 'BN-029-10' },
      { id: 'bn-7', product_id: 'prod-curved-banana', gauge: '1.6 мм', length_or_diameter: '1,6*12*5', price_adjustment: 0, stock: 20, sku: 'BN-030-12' },
    ],
    created_at: new Date().toISOString(),
  },

  // ==========================================
  // 4. ШТАНГА ТИТАНОВА ПРЯМА (BB-031 - BB-046)
  // ==========================================
  {
    id: 'prod-straight-barbell',
    title: 'Штанга титанова пряма (для язика / індастріал)',
    slug: 'titanium-straight-barbell',
    category_id: 'cat-barbells',
    category_slug: 'straight-barbells',
    category_name: 'Штанги',
    description: 'Пряма титанова штанга з внутрішньою різьбою для язика, сосків, індастріал та мочок. Висока міцність та дзеркальне полірування.',
    features: [
      'Матеріал: Імплантаційний титан ASTM F-136',
      'Калібри: 1.2 мм (кульки 3мм) та 1.6 мм (кульки 4-5мм)',
      'Довжини від 8 мм до 38 мм (індастріал)',
    ],
    base_price: 200,
    images: [
      '/images/products/barbells/bb-12.webp',
      '/images/products/barbells/bb-16.webp',
    ],
    is_active: true,
    supports_anodization: true,
    material: 'ASTM F-136 Titanium',
    thread_type: 'Internally Threaded (Внутрішня різьба)',
    variants: [
      { id: 'bb-1', product_id: 'prod-straight-barbell', gauge: '1.2 мм', length_or_diameter: '1,2*8*3 mm', price_adjustment: 0, stock: 20, sku: 'BB-031-08' },
      { id: 'bb-2', product_id: 'prod-straight-barbell', gauge: '1.2 мм', length_or_diameter: '1,2*10*3 mm', price_adjustment: 0, stock: 25, sku: 'BB-032-10' },
      { id: 'bb-3', product_id: 'prod-straight-barbell', gauge: '1.2 мм', length_or_diameter: '1,2*12*3 mm', price_adjustment: 0, stock: 20, sku: 'BB-033-12' },
      { id: 'bb-4', product_id: 'prod-straight-barbell', gauge: '1.2 мм', length_or_diameter: '1,2*14*3 mm', price_adjustment: 0, stock: 15, sku: 'BB-034-14' },
      { id: 'bb-5', product_id: 'prod-straight-barbell', gauge: '1.6 мм', length_or_diameter: '1,6*10*4mm', price_adjustment: 50, stock: 20, sku: 'BB-035-10' },
      { id: 'bb-6', product_id: 'prod-straight-barbell', gauge: '1.6 мм', length_or_diameter: '1,6*12*4mm', price_adjustment: 50, stock: 20, sku: 'BB-036-12' },
      { id: 'bb-7', product_id: 'prod-straight-barbell', gauge: '1.6 мм', length_or_diameter: '1,6*14*4mm', price_adjustment: 50, stock: 25, sku: 'BB-037-14' },
      { id: 'bb-8', product_id: 'prod-straight-barbell', gauge: '1.6 мм', length_or_diameter: '1,6*16*4mm', price_adjustment: 50, stock: 30, sku: 'BB-038-16' },
      { id: 'bb-9', product_id: 'prod-straight-barbell', gauge: '1.6 мм', length_or_diameter: '1,6*18*5mm', price_adjustment: 50, stock: 25, sku: 'BB-039-18' },
      { id: 'bb-10', product_id: 'prod-straight-barbell', gauge: '1.6 мм', length_or_diameter: '1,6*20*5mm', price_adjustment: 50, stock: 20, sku: 'BB-041-20' },
      { id: 'bb-11', product_id: 'prod-straight-barbell', gauge: '1.6 мм', length_or_diameter: '1,6*34*5mm (Індастріал)', price_adjustment: 50, stock: 15, sku: 'BB-044-34' },
      { id: 'bb-12', product_id: 'prod-straight-barbell', gauge: '1.6 мм', length_or_diameter: '1,6*36*5mm (Індастріал)', price_adjustment: 50, stock: 15, sku: 'BB-045-36' },
      { id: 'bb-13', product_id: 'prod-straight-barbell', gauge: '1.6 мм', length_or_diameter: '1,6*38*5mm (Індастріал)', price_adjustment: 50, stock: 15, sku: 'BB-046-38' },
    ],
    created_at: new Date().toISOString(),
  },

  // ==========================================
  // 5. ЦИРКУЛЯР / ПІДКОВА (CR-047 - CR-053)
  // ==========================================
  {
    id: 'prod-circular-barbell',
    title: 'Циркуляр (підкова) титановий',
    slug: 'titanium-circular-barbell',
    category_id: 'cat-clickers',
    category_slug: 'clickers',
    category_name: 'Клікери та Кільця',
    description: 'Титанова підкова з кульками для септуму, смайлу, вуха та сосків.',
    features: [
      'Матеріал: Імплантаційний титан ASTM F-136',
      'Тип різьби: Внутрішня різьба (кульки 3.0 мм)',
    ],
    base_price: 200,
    images: ['/images/products/circulars/cr-basic.webp'],
    is_active: true,
    supports_anodization: true,
    material: 'ASTM F-136 Titanium',
    thread_type: 'Internally Threaded (Внутрішня різьба)',
    variants: [
      { id: 'cr-1', product_id: 'prod-circular-barbell', gauge: '1.2 мм', length_or_diameter: '1.2*6*3mm', price_adjustment: 0, stock: 20, sku: 'CR-047-06' },
      { id: 'cr-2', product_id: 'prod-circular-barbell', gauge: '1.2 мм', length_or_diameter: '1.2*8*3mm', price_adjustment: 0, stock: 35, sku: 'CR-048-08' },
      { id: 'cr-3', product_id: 'prod-circular-barbell', gauge: '1.2 мм', length_or_diameter: '1.2*10*3mm', price_adjustment: 0, stock: 30, sku: 'CR-049-10' },
      { id: 'cr-4', product_id: 'prod-circular-barbell', gauge: '1.2 мм', length_or_diameter: '1.2*12*3mm', price_adjustment: 0, stock: 20, sku: 'CR-050-12' },
      { id: 'cr-5', product_id: 'prod-circular-barbell', gauge: '1.6 мм', length_or_diameter: '1.6*8*3mm', price_adjustment: 0, stock: 15, sku: 'CR-051-08' },
      { id: 'cr-6', product_id: 'prod-circular-barbell', gauge: '1.6 мм', length_or_diameter: '1.6*10*3mm', price_adjustment: 0, stock: 20, sku: 'CR-052-10' },
      { id: 'cr-7', product_id: 'prod-circular-barbell', gauge: '1.6 мм', length_or_diameter: '1.6*12*3mm', price_adjustment: 0, stock: 15, sku: 'CR-053-12' },
    ],
    created_at: new Date().toISOString(),
  },

  // ==========================================
  // 6. КЛІКЕРИ БАЗОВІ (CK-054 - CK-064)
  // ==========================================
  {
    id: 'prod-clicker-basic',
    title: 'Базове сегментне кільце-клікер',
    slug: 'titanium-clicker-basic-segment',
    category_id: 'cat-clickers',
    category_slug: 'clickers',
    category_name: 'Клікери та Кільця',
    description: 'Гладке поліроване сегментне кільце на надійному клік-замку (Hinged Segment Ring). Легке самостійне відкривання без інструментів.',
    features: [
      'Матеріал: Імплантаційний титан ASTM F-136',
      'Замок: Надійний шарнірний клікер із чітким клацанням',
      'Повна відсутність гострих країв',
    ],
    base_price: 200,
    images: ['/images/products/clickers/ck-basic.webp'],
    is_active: true,
    supports_anodization: true,
    material: 'ASTM F-136 Titanium',
    thread_type: 'Hinged Segment (Клікер)',
    variants: [
      { id: 'ck-b-1', product_id: 'prod-clicker-basic', gauge: '1.0 мм', length_or_diameter: '1.0*6mm', price_adjustment: 0, stock: 25, sku: 'CK-054-06' },
      { id: 'ck-b-2', product_id: 'prod-clicker-basic', gauge: '1.0 мм', length_or_diameter: '1.0*8mm', price_adjustment: 0, stock: 35, sku: 'CK-055-08' },
      { id: 'ck-b-3', product_id: 'prod-clicker-basic', gauge: '1.0 мм', length_or_diameter: '1.0*10mm', price_adjustment: 0, stock: 30, sku: 'CK-056-10' },
      { id: 'ck-b-4', product_id: 'prod-clicker-basic', gauge: '1.2 мм', length_or_diameter: '1.2*6mm', price_adjustment: 0, stock: 40, sku: 'CK-057-06' },
      { id: 'ck-b-5', product_id: 'prod-clicker-basic', gauge: '1.2 мм', length_or_diameter: '1.2*7mm', price_adjustment: 0, stock: 30, sku: 'CK-058-07' },
      { id: 'ck-b-6', product_id: 'prod-clicker-basic', gauge: '1.2 мм', length_or_diameter: '1.2*8mm', price_adjustment: 0, stock: 55, sku: 'CK-059-08' },
      { id: 'ck-b-7', product_id: 'prod-clicker-basic', gauge: '1.2 мм', length_or_diameter: '1.2*9mm', price_adjustment: 0, stock: 30, sku: 'CK-060-09' },
      { id: 'ck-b-8', product_id: 'prod-clicker-basic', gauge: '1.2 мм', length_or_diameter: '1.2*10mm', price_adjustment: 0, stock: 45, sku: 'CK-061-10' },
      { id: 'ck-b-9', product_id: 'prod-clicker-basic', gauge: '1.2 мм', length_or_diameter: '1.2*11mm', price_adjustment: 0, stock: 20, sku: 'CK-062-11' },
      { id: 'ck-b-10', product_id: 'prod-clicker-basic', gauge: '1.2 мм', length_or_diameter: '1.2*12mm', price_adjustment: 0, stock: 25, sku: 'CK-063-12' },
      { id: 'ck-b-11', product_id: 'prod-clicker-basic', gauge: '1.2 мм', length_or_diameter: '1.2*14mm', price_adjustment: 0, stock: 15, sku: 'CK-064-14' },
    ],
    created_at: new Date().toISOString(),
  },

  // ==========================================
  // 7. НАКРУТКИ БАЗОВІ НА РІЗЬБУ 1.2 (TP-065 - TP-070)
  // ==========================================
  {
    id: 'prod-tops-basic-12',
    title: 'Базові накрутки (кульки / диски) на різьбу 1.2 мм',
    slug: 'titanium-basic-tops-12',
    category_id: 'cat-tops',
    category_slug: 'tops-and-ends',
    category_name: 'Накрутки та Топи',
    description: 'Класичні титанові кульки, диски та півсфери з внутрішнім різьбленням 1.2 мм.',
    features: [
      'Матеріал: Імплантаційний титан ASTM F-136',
      'Різьба: Внутрішня 1.2 мм',
      'Розміри від 2.0 мм до 8.0 мм',
    ],
    base_price: 100,
    images: ['/images/products/tops/tp-065.webp'],
    is_active: true,
    supports_anodization: true,
    material: 'ASTM F-136 Titanium',
    thread_type: 'Internally Threaded (Внутрішня різьба)',
    variants: [
      { id: 'tp-b-1', product_id: 'prod-tops-basic-12', gauge: '1.2 мм', length_or_diameter: '1.2*2мм (Кулька)', price_adjustment: 0, stock: 40, sku: 'TP-065-12' },
      { id: 'tp-b-2', product_id: 'prod-tops-basic-12', gauge: '1.2 мм', length_or_diameter: '1.2*2,5мм (Кулька)', price_adjustment: 0, stock: 40, sku: 'TP-066-12' },
      { id: 'tp-b-3', product_id: 'prod-tops-basic-12', gauge: '1.2 мм', length_or_diameter: '1.2*3мм (Кулька)', price_adjustment: 0, stock: 50, sku: 'TP-067-12' },
      { id: 'tp-b-4', product_id: 'prod-tops-basic-12', gauge: '1.2 мм', length_or_diameter: '1.2*3мм (Диск flat)', price_adjustment: 0, stock: 35, sku: 'TP-068-12' },
      { id: 'tp-b-5', product_id: 'prod-tops-basic-12', gauge: '1.2 мм', length_or_diameter: '1.2*6мм (Диск flat)', price_adjustment: 0, stock: 30, sku: 'TP-069-12' },
      { id: 'tp-b-6', product_id: 'prod-tops-basic-12', gauge: '1.2 мм', length_or_diameter: '1.2*8мм (Диск flat)', price_adjustment: 0, stock: 25, sku: 'TP-070-12' },
    ],
    created_at: new Date().toISOString(),
  },

  // ==========================================
  // 8. ДИЗАЙНЕРСЬКІ НАКРУТКИ ТА КРИСТАЛИ 1.2 (TP-071 - TP-129)
  // ==========================================
  {
    id: 'prod-designer-tops-12',
    title: 'Дизайнерські накрутки та кристали (різьба 1.2 мм)',
    slug: 'titanium-designer-tops-12',
    category_id: 'cat-tops',
    category_slug: 'tops-and-ends',
    category_name: 'Накрутки та Топи',
    description: 'Повна колекція дизайнерських накруток з фіанітами 5A, опалами, маркізами, зірками та кластерами на різьбу 1.2 мм.',
    features: [
      'Матеріал: Імплантаційний титан ASTM F-136',
      'Каміння: Cubic Zirconia 5A / Синтетичний Опал',
      'Різьба: Внутрішня 1.2 мм',
    ],
    base_price: 150,
    images: [
      '/images/products/tops/tp-065.webp',
      '/images/hero-macro.jpg',
    ],
    is_active: true,
    supports_anodization: true,
    material: 'ASTM F-136 Titanium',
    thread_type: 'Internally Threaded (Внутрішня різьба)',
    variants: [
      { id: 'tpd-1', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-071 (1.2мм)', price_adjustment: 0, stock: 30, sku: 'TP-071-12' },
      { id: 'tpd-2', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-072 (1.2мм)', price_adjustment: 0, stock: 25, sku: 'TP-072-12' },
      { id: 'tpd-3', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-073 (1.2мм)', price_adjustment: 0, stock: 25, sku: 'TP-073-12' },
      { id: 'tpd-4', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-075 (1.2мм)', price_adjustment: 15, stock: 20, sku: 'TP-075-12' },
      { id: 'tpd-5', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-077 (1.2мм)', price_adjustment: 30, stock: 20, sku: 'TP-077-12' },
      { id: 'tpd-6', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-078 (1.2мм)', price_adjustment: 100, stock: 15, sku: 'TP-078-12' },
      { id: 'tpd-7', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-080 (1.2мм)', price_adjustment: 145, stock: 15, sku: 'TP-080-12' },
      { id: 'tpd-8', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-086 (1.2мм)', price_adjustment: 90, stock: 20, sku: 'TP-086-12' },
      { id: 'tpd-9', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-093 (1.2мм mini)', price_adjustment: 80, stock: 25, sku: 'TP-093-12' },
      { id: 'tpd-10', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-095 (1.2мм)', price_adjustment: 150, stock: 20, sku: 'TP-095-12' },
      { id: 'tpd-11', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-107 (1.2мм)', price_adjustment: 245, stock: 10, sku: 'TP-107-12' },
      { id: 'tpd-12', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-112 (1.2мм)', price_adjustment: 250, stock: 10, sku: 'TP-112-12' },
      { id: 'tpd-13', product_id: 'prod-designer-tops-12', gauge: '1.2 мм', length_or_diameter: 'TP-129 (1.2мм)', price_adjustment: 260, stock: 10, sku: 'TP-129-12' },
    ],
    created_at: new Date().toISOString(),
  },

  // ==========================================
  // 9. ДИЗАЙНЕРСЬКІ КЛІКЕРИ (CK-130 - CK-160)
  // ==========================================
  {
    id: 'prod-clicker-designer',
    title: 'Дизайнерські кільця-клікери (CK-130 ... CK-160)',
    slug: 'titanium-clicker-designer-collection',
    category_id: 'cat-clickers',
    category_slug: 'clickers',
    category_name: 'Клікери та Кільця',
    description: 'Преміальні клікери з фіанітами Pavé, капельними кастами, місяцями та ланцюжками для септуму та хеліксу.',
    features: [
      'Матеріал: Імплантаційний титан ASTM F-136',
      'Замок: Hinged Segment Clicker',
      'Каміння: Micro-set Pavé CZ 5A',
    ],
    base_price: 310,
    images: [
      '/images/products/clickers/ck-basic.webp',
      '/images/hero-macro.jpg',
    ],
    is_active: true,
    supports_anodization: true,
    material: 'ASTM F-136 Titanium',
    thread_type: 'Hinged Segment (Клікер)',
    variants: [
      { id: 'ckd-1', product_id: 'prod-clicker-designer', gauge: '1.2 мм', length_or_diameter: 'CK-133 (1.2*8мм)', price_adjustment: 0, stock: 25, sku: 'CK-133-12' },
      { id: 'ckd-2', product_id: 'prod-clicker-designer', gauge: '1.2 мм', length_or_diameter: 'CK-134 (1.2*8мм)', price_adjustment: 10, stock: 25, sku: 'CK-134-12' },
      { id: 'ckd-3', product_id: 'prod-clicker-designer', gauge: '1.2 мм', length_or_diameter: 'CK-130 (1.2*8мм)', price_adjustment: 50, stock: 35, sku: 'CK-130-12' },
      { id: 'ckd-4', product_id: 'prod-clicker-designer', gauge: '1.2 мм', length_or_diameter: 'CK-131 (1.2*10мм)', price_adjustment: 50, stock: 30, sku: 'CK-131-12' },
      { id: 'ckd-5', product_id: 'prod-clicker-designer', gauge: '1.2 мм', length_or_diameter: 'CK-136 (1.2*8мм)', price_adjustment: 80, stock: 20, sku: 'CK-136-12' },
      { id: 'ckd-6', product_id: 'prod-clicker-designer', gauge: '1.2 мм', length_or_diameter: 'CK-138 (1.2*8мм)', price_adjustment: 65, stock: 20, sku: 'CK-138-12' },
      { id: 'ckd-7', product_id: 'prod-clicker-designer', gauge: '1.2 мм', length_or_diameter: 'CK-142 (1.2*10мм)', price_adjustment: 140, stock: 15, sku: 'CK-142-12' },
      { id: 'ckd-8', product_id: 'prod-clicker-designer', gauge: '1.2 мм', length_or_diameter: 'CK-147 (1.2*6мм)', price_adjustment: 80, stock: 20, sku: 'CK-147-12' },
      { id: 'ckd-9', product_id: 'prod-clicker-designer', gauge: '1.2 мм', length_or_diameter: 'CK-153 (1.2*8мм)', price_adjustment: 160, stock: 15, sku: 'CK-153-12' },
      { id: 'ckd-10', product_id: 'prod-clicker-designer', gauge: '1.2 мм', length_or_diameter: 'CK-155 (1.2*8мм)', price_adjustment: 240, stock: 10, sku: 'CK-155-12' },
      { id: 'ckd-11', product_id: 'prod-clicker-designer', gauge: '1.2 мм', length_or_diameter: 'CK-159 (1.2*8мм)', price_adjustment: 260, stock: 10, sku: 'CK-159-12' },
    ],
    created_at: new Date().toISOString(),
  },

  // ==========================================
  // 10. БАНАНИ В ПУПОК (NV-161 - NV-202)
  // ==========================================
  {
    id: 'prod-navel-banana',
    title: 'Банани для пірсингу пупка (1.6 мм)',
    slug: 'titanium-curved-barbell-navel',
    category_id: 'cat-navel',
    category_slug: 'curved-barbells',
    category_name: 'Банани в пупок',
    description: 'Преміальні банани в пупок ASTM F-136 з одинарними та подвійними фіанітами, каплевидними кастами та квітковими кластерами.',
    features: [
      'Матеріал: Імплантаційний титан ASTM F-136',
      'Каміння: Двокристальний дизайн із цирконієм 5A',
      'Калібр: 1.6 мм (14G) класичний стандарт пірсингу пупка',
      'Тип різьби: Внутрішня різьба (Internally Threaded)',
    ],
    base_price: 250,
    images: ['/images/products/navel/nv-161.webp'],
    is_active: true,
    supports_anodization: true,
    material: 'ASTM F-136 Titanium',
    thread_type: 'Internally Threaded (Внутрішня різьба)',
    variants: [
      { id: 'nv-1', product_id: 'prod-navel-banana', gauge: '1.6 мм', length_or_diameter: 'NV-161 (1.6*8мм)', price_adjustment: 0, stock: 20, sku: 'NV-161-16' },
      { id: 'nv-2', product_id: 'prod-navel-banana', gauge: '1.6 мм', length_or_diameter: 'NV-164 (1.6*8мм)', price_adjustment: 0, stock: 20, sku: 'NV-164-16' },
      { id: 'nv-3', product_id: 'prod-navel-banana', gauge: '1.6 мм', length_or_diameter: 'NV-167 (1.6*8*4/6мм)', price_adjustment: 50, stock: 25, sku: 'NV-167-16' },
      { id: 'nv-4', product_id: 'prod-navel-banana', gauge: '1.6 мм', length_or_diameter: 'NV-168 (1.6*10*4/6мм)', price_adjustment: 50, stock: 35, sku: 'NV-168-16' },
      { id: 'nv-5', product_id: 'prod-navel-banana', gauge: '1.6 мм', length_or_diameter: 'NV-170 (1.6*10*5/8мм)', price_adjustment: 50, stock: 30, sku: 'NV-170-16' },
      { id: 'nv-6', product_id: 'prod-navel-banana', gauge: '1.6 мм', length_or_diameter: 'NV-172 (1.6*10*4/6мм)', price_adjustment: 80, stock: 20, sku: 'NV-172-16' },
      { id: 'nv-7', product_id: 'prod-navel-banana', gauge: '1.6 мм', length_or_diameter: 'NV-180 (1.6*10*4/6мм)', price_adjustment: 150, stock: 15, sku: 'NV-180-16' },
      { id: 'nv-8', product_id: 'prod-navel-banana', gauge: '1.6 мм', length_or_diameter: 'NV-182 (1.6*10*4/6мм)', price_adjustment: 130, stock: 20, sku: 'NV-182-16' },
      { id: 'nv-9', product_id: 'prod-navel-banana', gauge: '1.6 мм', length_or_diameter: 'NV-187 (1.6*10*4/6мм)', price_adjustment: 150, stock: 15, sku: 'NV-187-16' },
      { id: 'nv-10', product_id: 'prod-navel-banana', gauge: '1.6 мм', length_or_diameter: 'NV-199 (1.6*10мм)', price_adjustment: 130, stock: 20, sku: 'NV-199-16' },
      { id: 'nv-11', product_id: 'prod-navel-banana', gauge: '1.6 мм', length_or_diameter: 'NV-200 (1.6*10мм)', price_adjustment: 200, stock: 15, sku: 'NV-200-16' },
      { id: 'nv-12', product_id: 'prod-navel-banana', gauge: '1.6 мм', length_or_diameter: 'NV-201 (1.6*10мм)', price_adjustment: 200, stock: 15, sku: 'NV-201-16' },
    ],
    created_at: new Date().toISOString(),
  },

  // ==========================================
  // 11. НАКРУТКИ НА РІЗЬБУ 1.6 (TP-203 - TP-221)
  // ==========================================
  {
    id: 'prod-top-16-ends',
    title: 'Накрутки та кульки на різьбу 1.6 мм',
    slug: 'titanium-16-ends-tops',
    category_id: 'cat-tops',
    category_slug: 'tops-and-ends',
    category_name: 'Накрутки та Топи',
    description: 'Кульки, кристали та диски з внутрішньою різьбою 1.6 мм для штанг у язик, індастріал, бананів та сосків.',
    features: [
      'Матеріал: Імплантаційний титан ASTM F-136',
      'Різьба: 1.6 мм стандарт',
      'Розміри топа: від 3 мм до 5 мм',
    ],
    base_price: 100,
    images: ['/images/products/tops/tp-203.webp'],
    is_active: true,
    supports_anodization: true,
    material: 'ASTM F-136 Titanium',
    thread_type: 'Internally Threaded (Внутрішня різьба)',
    variants: [
      { id: 'tp16-1', product_id: 'prod-top-16-ends', gauge: '1.6 мм', length_or_diameter: 'TP-203 (1.6*3мм)', price_adjustment: 0, stock: 30, sku: 'TP-203-16' },
      { id: 'tp16-2', product_id: 'prod-top-16-ends', gauge: '1.6 мм', length_or_diameter: 'TP-204 (1.6*4мм)', price_adjustment: 0, stock: 35, sku: 'TP-204-16' },
      { id: 'tp16-3', product_id: 'prod-top-16-ends', gauge: '1.6 мм', length_or_diameter: 'TP-205 (1.6*5мм)', price_adjustment: 0, stock: 40, sku: 'TP-205-16' },
      { id: 'tp16-4', product_id: 'prod-top-16-ends', gauge: '1.6 мм', length_or_diameter: 'TP-207 (1.6*5мм)', price_adjustment: 110, stock: 25, sku: 'TP-207-16' },
      { id: 'tp16-5', product_id: 'prod-top-16-ends', gauge: '1.6 мм', length_or_diameter: 'TP-215 (1.6*5мм Опал)', price_adjustment: 120, stock: 20, sku: 'TP-215-16' },
      { id: 'tp16-6', product_id: 'prod-top-16-ends', gauge: '1.6 мм', length_or_diameter: 'TP-221 (1.6*5мм)', price_adjustment: 120, stock: 20, sku: 'TP-221-16' },
    ],
    created_at: new Date().toISOString(),
  },
];

export const COMPATIBLE_TOPS: CompatibleTop[] = [
  {
    id: 'top-1',
    title: 'Кристальний топ Prong-Set 3mm',
    slug: 'titanium-crystal-top-end',
    image: '/images/products/tops/tp-065.webp',
    price: 100,
    crystal: 'Cubic Zirconia 5A (3.0 мм)',
  },
  {
    id: 'top-2',
    title: 'Топ Трініті з цирконіями 5A',
    slug: 'titanium-designer-tops-12',
    image: '/images/products/tops/tp-065.webp',
    price: 250,
    crystal: '3x CZ Crystal Trinity Cluster',
  },
  {
    id: 'top-3',
    title: 'Опаловий кабошон White Opal 4mm',
    slug: 'titanium-designer-tops-12',
    image: '/images/products/tops/tp-065.webp',
    price: 220,
    crystal: 'Synthetic White Opal 4.0 мм',
  },
];

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.category_slug === categorySlug);
}
