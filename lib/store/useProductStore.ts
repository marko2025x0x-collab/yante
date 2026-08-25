'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Category, ProductVariant } from '@/types/product';
import { PRODUCTS, CATEGORIES } from '@/lib/data/mockProducts';

export interface HeroBannerConfig {
  imageUrl: string;
  leftTitle: string;
  leftSlug: string;
  rightTitle: string;
  rightSlug: string;
}

interface ProductStoreState {
  products: Product[];
  categories: Category[];
  heroBanner: HeroBannerConfig;
  
  // Керування товарами
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  importProductsFromCsv: (csvText: string, overwriteExisting?: boolean) => { added: number; updated: number };
  importProductsFromJson: (jsonText: string, overwriteExisting?: boolean) => { added: number; updated: number };
  
  // Керування головним Hero-банером
  updateHeroBanner: (banner: Partial<HeroBannerConfig>) => void;
  
  // Отримання
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (categorySlug: string) => Product[];
  resetToDefaults: () => void;
}

export const defaultHeroBanner: HeroBannerConfig = {
  imageUrl: '/images/hero-macro.jpg',
  leftTitle: 'Титановий лабрет із внутрішнім\nрізьбленням та кристальним топом',
  leftSlug: 'titanium-basic-labret',
  rightTitle: 'Титанове кільце-клікер\nіз CZ pave',
  rightSlug: 'titanium-clicker-ring-cz-pave',
};

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set, get) => ({
      products: PRODUCTS,
      categories: CATEGORIES,
      heroBanner: defaultHeroBanner,

      addProduct: (product) => {
        set((state) => ({
          products: [product, ...state.products.filter((p) => p.id !== product.id)],
        }));
      },

      updateProduct: (id, updated) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      updateHeroBanner: (banner) => {
        set((state) => ({
          heroBanner: { ...state.heroBanner, ...banner },
        }));
      },

      resetToDefaults: () => {
        set({
          products: PRODUCTS,
          categories: CATEGORIES,
          heroBanner: defaultHeroBanner,
        });
      },

      importProductsFromJson: (jsonText: string, overwriteExisting = true) => {
        let addedCount = 0;
        let updatedCount = 0;

        try {
          const parsed = JSON.parse(jsonText);
          const rawItems = Array.isArray(parsed) ? parsed : [parsed];
          const newProducts: Product[] = [];

          rawItems.forEach((item: any, idx: number) => {
            // Категорія за мапінгом
            const categoryMap: Record<string, { id: string; slug: string; name: string }> = {
              labrets: { id: 'cat-labrets', slug: 'labrets', name: 'Лабрети' },
              bananas: { id: 'cat-navel', slug: 'curved-barbells', name: 'Банани' },
              barbells: { id: 'cat-barbells', slug: 'straight-barbells', name: 'Штанги' },
              circulars: { id: 'cat-clickers', slug: 'clickers', name: 'Клікери та Кільця' },
              clickers: { id: 'cat-clickers', slug: 'clickers', name: 'Клікери та Кільця' },
              clickers_designer: { id: 'cat-clickers', slug: 'clickers', name: 'Клікери та Кільця' },
              tops_12: { id: 'cat-tops', slug: 'tops-and-ends', name: 'Накрутки та Топи' },
              tops_16: { id: 'cat-tops', slug: 'tops-and-ends', name: 'Накрутки та Топи' },
              navel: { id: 'cat-navel', slug: 'curved-barbells', name: 'Банани в пупок' },
            };

            const catInfo = categoryMap[item.category] || {
              id: `cat-${item.category || 'general'}`,
              slug: item.category || 'all',
              name: item.title || 'Прикраси',
            };

            // 1. Одиночний товар з `sku_prefix`
            if (item.sku_prefix) {
              const prodId = `prod-${item.sku_prefix.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
              const slug = item.title
                ? item.title.toLowerCase().replace(/[^\w\u0400-\u04FF]+/g, '-').replace(/^-+|-+$/g, '')
                : prodId;

              const variants: ProductVariant[] = [];

              if (Array.isArray(item.sizes)) {
                item.sizes.forEach((s: string, sIdx: number) => {
                  variants.push({
                    id: `${prodId}-v-${sIdx + 1}`,
                    product_id: prodId,
                    gauge: item.gauge || '1.2 мм',
                    length_or_diameter: s,
                    price_adjustment: 0,
                    stock: 30,
                    sku: `${item.sku_prefix.split('-')[0] || 'SKU'}-${(sIdx + 1).toString().padStart(3, '0')}`,
                  });
                });
              } else if (Array.isArray(item.variants)) {
                item.variants.forEach((v: any, vIdx: number) => {
                  const sizeLabel = v.size || v.diameters?.join('/') || v.lengths?.join('/') || `${item.gauge || ''} ${v.ball_size ? `кулька ${v.ball_size}` : ''}`;
                  variants.push({
                    id: `${prodId}-v-${vIdx + 1}`,
                    product_id: prodId,
                    gauge: v.gauge || item.gauge || '1.2 мм',
                    length_or_diameter: sizeLabel,
                    price_adjustment: v.price ? v.price - (item.base_price || 200) : 0,
                    stock: 25,
                    sku: `${item.sku_prefix.split('-')[0] || 'SKU'}-${(vIdx + 1).toString().padStart(3, '0')}`,
                  });
                });
              } else {
                variants.push({
                  id: `${prodId}-v-default`,
                  product_id: prodId,
                  gauge: item.gauge || '1.2 мм',
                  length_or_diameter: 'Базовий',
                  price_adjustment: 0,
                  stock: 30,
                  sku: item.sku_prefix,
                });
              }

              newProducts.push({
                id: prodId,
                title: item.title,
                slug: slug || prodId,
                category_id: catInfo.id,
                category_slug: catInfo.slug,
                category_name: catInfo.name,
                description: `Преміальна прикраса з імплантаційного титану ${item.material || 'ASTM F-136'}. ${item.gauge ? `Калібр ${item.gauge}.` : ''} Дзеркальне полірування, гіпоалергенно.`,
                features: [
                  `Матеріал: ${item.material || 'ASTM F-136 Titanium'}`,
                  item.thread_type ? `Тип різьби: ${item.thread_type}` : 'Різьба: Внутрішня сумісність',
                  item.ball_size ? `Розмір кульок/топа: ${item.ball_size}` : 'Високоточна фіксація',
                ],
                base_price: item.base_price || 200,
                images: [item.image_url || '/images/product-labret.jpg'],
                is_active: true,
                supports_anodization: item.allow_anodization !== false,
                material: item.material || 'ASTM F-136 Titanium',
                thread_type: item.thread_type?.includes('Безрізьб')
                  ? 'Threadless (Безрізьбовий)'
                  : item.thread_type?.includes('Клікер')
                  ? 'Hinged Segment (Клікер)'
                  : 'Internally Threaded (Внутрішня різьба)',
                variants: variants,
                created_at: new Date().toISOString(),
              });
            }
            // 2. Груповий блок `sku_group` (напр. TP-065-070, TP-DESIGNER-12, CK-DESIGNER, NV-NAVEL-16)
            else if (item.sku_group && Array.isArray(item.items)) {
              const groupId = `prod-group-${item.sku_group.toLowerCase()}`;
              const groupSlug = item.title
                ? item.title.toLowerCase().replace(/[^\w\u0400-\u04FF]+/g, '-').replace(/^-+|-+$/g, '')
                : groupId;

              const variants: ProductVariant[] = item.items.map((sub: any, sIdx: number) => {
                const sizeLabel = sub.size || sub.diameters?.join(', ') || sub.lengths?.join(', ') || sub.name || sub.sku;
                return {
                  id: `${groupId}-v-${sub.sku || sIdx + 1}`,
                  product_id: groupId,
                  gauge: item.thread || item.gauge || '1.2 мм',
                  length_or_diameter: `${sub.sku} (${sizeLabel})`,
                  price_adjustment: sub.price ? sub.price - (item.items[0]?.price || 100) : 0,
                  stock: 20,
                  sku: sub.sku,
                };
              });

              newProducts.push({
                id: groupId,
                title: item.title,
                slug: groupSlug || groupId,
                category_id: catInfo.id,
                category_slug: catInfo.slug,
                category_name: catInfo.name,
                description: `Колекція титанових прикрас ASTM F-136 (${item.title}). Всі артикули виготовлені з імплантаційного титану з преміальними вставками.`,
                features: [
                  'Матеріал: Імплантаційний титан ASTM F-136',
                  item.thread ? `Різьба: ${item.thread}` : 'Універсальна сумісність',
                  'Преміальні кристали CZ 5A / Опали',
                ],
                base_price: item.items[0]?.price || 100,
                images: [
                  item.items[0]?.image_url || '/images/product-crystal-top.jpg',
                  '/images/hero-macro.jpg',
                ],
                is_active: true,
                supports_anodization: true,
                material: 'ASTM F-136 Titanium',
                thread_type: item.sku_group.includes('CK')
                  ? 'Hinged Segment (Клікер)'
                  : 'Internally Threaded (Внутрішня різьба)',
                variants: variants,
                created_at: new Date().toISOString(),
              });
            }
          });

          set((state) => {
            let updatedList = [...state.products];

            newProducts.forEach((newProd) => {
              const existingIndex = updatedList.findIndex((p) => p.slug === newProd.slug || p.id === newProd.id);
              if (existingIndex >= 0) {
                if (overwriteExisting) {
                  updatedList[existingIndex] = {
                    ...updatedList[existingIndex],
                    ...newProd,
                  };
                  updatedCount++;
                }
              } else {
                updatedList.push(newProd);
                addedCount++;
              }
            });

            return { products: updatedList };
          });

        } catch (err) {
          console.error('Failed to parse JSON for import', err);
        }

        return { added: addedCount, updated: updatedCount };
      },

      importProductsFromCsv: (csvText: string, overwriteExisting = true) => {
        let addedCount = 0;
        let updatedCount = 0;

        const lines = csvText.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return { added: 0, updated: 0 };

        const parsedProductsMap: Record<string, Partial<Product>> = {};
        let currentCategory = 'Базові';
        let currentCategorySlug = 'labrets';
        let lastPrice = 200;

        for (const line of lines) {
          if (line.includes('БАЗОВІ')) {
            currentCategory = 'Базові';
            currentCategorySlug = 'labrets';
            continue;
          } else if (line.includes('НАКРУТКИ НА РІЗЬБУ 1.2')) {
            currentCategory = 'Накрутки та Топи';
            currentCategorySlug = 'tops-and-ends';
            continue;
          } else if (line.includes('Клікери') || line.includes('КЛІКЕРИ')) {
            currentCategory = 'Клікери та Кільця';
            currentCategorySlug = 'clickers';
            continue;
          } else if (line.includes('БАНАН В ПУПОК')) {
            currentCategory = 'Банани в пупок';
            currentCategorySlug = 'curved-barbells';
            continue;
          } else if (line.includes('НАКРУТКИ НА РІЗЬБУ 1.6')) {
            currentCategory = 'Накрутки 1.6';
            currentCategorySlug = 'tops-and-ends';
            continue;
          } else if (line.includes('ДОДАТКОВО')) {
            break;
          }

          const parts = line.split(',');
          if (parts.length < 3) continue;

          const rawSku = parts[1]?.trim() || '';
          const rawSize = parts[2]?.replace(/"/g, '').trim() || '';
          const rawPrice = parts[3]?.replace(/[^\d]/g, '').trim() || '';

          if (!rawSku && !rawSize) continue;

          if (rawPrice) {
            lastPrice = parseInt(rawPrice, 10);
          }

          const skuPrefix = rawSku.split('-')[0] || 'PR';
          let familyTitle = 'Прикраса для пірсингу';
          let familyImage = '/images/product-labret.jpg';
          let defaultThread: Product['thread_type'] = 'Internally Threaded (Внутрішня різьба)';

          if (skuPrefix === 'LR') {
            familyTitle = 'Титановий лабрет класичний (LR)';
            familyImage = '/images/product-labret.jpg';
            currentCategorySlug = 'labrets';
            currentCategory = 'Лабрети';
          } else if (skuPrefix === 'BN' || skuPrefix === 'NV') {
            familyTitle = 'Титановий банан (Navel/Curved)';
            familyImage = '/images/product-banana.jpg';
            currentCategorySlug = 'curved-barbells';
            currentCategory = 'Банани';
          } else if (skuPrefix === 'BB') {
            familyTitle = 'Титанова штанга (Barbell)';
            familyImage = '/images/product-labret.jpg';
            currentCategorySlug = 'straight-barbells';
            currentCategory = 'Штанги';
          } else if (skuPrefix === 'CK') {
            familyTitle = 'Титанове кільце-клікер (Clicker)';
            familyImage = '/images/product-clicker.jpg';
            currentCategorySlug = 'clickers';
            currentCategory = 'Клікери та Кільця';
            defaultThread = 'Hinged Segment (Клікер)';
          } else if (skuPrefix === 'TP') {
            familyTitle = 'Титановий топ/накрутка з каменем';
            familyImage = '/images/product-crystal-top.jpg';
            currentCategorySlug = 'tops-and-ends';
            currentCategory = 'Накрутки та Топи';
            defaultThread = 'Threadless (Безрізьбовий)';
          } else if (skuPrefix === 'CR') {
            familyTitle = 'Титановий циркуляр (Circular)';
            familyImage = '/images/product-clicker.jpg';
            currentCategorySlug = 'clickers';
            currentCategory = 'Клікери та Кільця';
          }

          const productKey = `${skuPrefix}-${currentCategorySlug}`;

          if (!parsedProductsMap[productKey]) {
            parsedProductsMap[productKey] = {
              id: `imported-${skuPrefix.toLowerCase()}-${Date.now().toString().slice(-4)}`,
              title: familyTitle,
              slug: `imported-${skuPrefix.toLowerCase()}-titanium`,
              category_id: `cat-${currentCategorySlug}`,
              category_slug: currentCategorySlug,
              category_name: currentCategory,
              description: `Сертифікована титанова прикраса для пірсингу ASTM F-136. Імпортовано з каталогу YANTI. Високоякісне дзеркальне полірування.`,
              features: [
                'Матеріал: Імплантаційний титан ASTM F-136',
                `Тип різьби / замка: ${defaultThread}`,
                'Гіпоалергенно для свіжих та загоєних проколів',
              ],
              base_price: lastPrice || 200,
              images: [familyImage],
              is_active: true,
              supports_anodization: true,
              material: 'ASTM F-136 Implant Grade Titanium',
              thread_type: defaultThread,
              variants: [],
              created_at: new Date().toISOString(),
            };
          }

          if (rawSize) {
            const gaugeMatch = rawSize.match(/^[\d.,]+/);
            const gaugeStr = gaugeMatch ? `${gaugeMatch[0]}mm` : '1.2mm';
            
            parsedProductsMap[productKey].variants?.push({
              id: `v-${rawSku || Math.random().toString(36).substr(2, 6)}`,
              product_id: parsedProductsMap[productKey].id || 'imported',
              gauge: gaugeStr,
              length_or_diameter: rawSize,
              price_adjustment: 0,
              stock: 30,
              sku: rawSku,
            });
          }
        }

        const newProductsList = Object.values(parsedProductsMap) as Product[];

        set((state) => {
          let updatedList = [...state.products];

          newProductsList.forEach((newProd) => {
            const existingIndex = updatedList.findIndex((p) => p.slug === newProd.slug);
            if (existingIndex >= 0) {
              if (overwriteExisting) {
                updatedList[existingIndex] = {
                  ...updatedList[existingIndex],
                  ...newProd,
                  variants: [...(updatedList[existingIndex].variants || []), ...(newProd.variants || [])],
                };
                updatedCount++;
              }
            } else {
              updatedList.push(newProd);
              addedCount++;
            }
          });

          return { products: updatedList };
        });

        return { added: addedCount, updated: updatedCount };
      },

      getProductBySlug: (slug) => {
        return get().products.find((p) => p.slug === slug);
      },

      getProductsByCategory: (categorySlug) => {
        return get().products.filter((p) => p.category_slug === categorySlug);
      },
    }),
    {
      name: 'yanti-products-storage-v4',
    }
  )
);
