'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { useProductStore } from '@/lib/store/useProductStore';
import { useContactStore, ContactInfo } from '@/lib/store/useContactStore';
import { OrderStatus } from '@/types/order';
import { Product } from '@/types/product';
import {
  Package,
  TrendingUp,
  Clock,
  Truck,
  ShieldCheck,
  Search,
  ExternalLink,
  Rss,
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  FileSpreadsheet,
  Layers,
  CheckCircle2,
  RefreshCw,
  Upload,
  Download,
  Eye,
  Sliders,
  Megaphone,
  Copy,
  Check,
  Target,
  BarChart3,
  Share2,
  Zap,
  Phone,
  Mail,
  MapPin,
  Send,
  RotateCcw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const {
    products,
    categories,
    heroBanner,
    addProduct,
    updateProduct,
    deleteProduct,
    updateHeroBanner,
    importProductsFromCsv,
    importProductsFromJson,
  } = useProductStore();

  const { contacts, updateContacts, resetContacts } = useContactStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'marketing' | 'contacts' | 'hero' | 'import'>('orders');
  const [importMode, setImportMode] = useState<'sheet' | 'json'>('json');

  // Фільтри замовлень
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');

  // Фільтри товарів
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');

  // Модалка створення / редагування товару
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category_slug: 'labrets',
    base_price: 200,
    image: '/images/products/labrets/lr-basic-12.webp',
    description: 'Преміальна прикраса з імплантаційного титану ASTM F-136 із дзеркальним поліруванням.',
    material: 'ASTM F-136 Titanium',
    thread_type: 'Internally Threaded (Внутрішня різьба)' as Product['thread_type'],
    supports_anodization: true,
    variants: [
      { id: 'v-1', gauge: '1.2 мм', length_or_diameter: '1.2*8мм', stock: 30, price_adjustment: 0, sku: 'LR-005-08' },
      { id: 'v-2', gauge: '1.2 мм', length_or_diameter: '1.2*10мм', stock: 25, price_adjustment: 0, sku: 'LR-007-10' },
    ],
  });

  // Hero банер форма
  const [heroForm, setHeroForm] = useState(heroBanner);
  const [heroSavedNotification, setHeroSavedNotification] = useState(false);

  // Контакти форма
  const [contactsForm, setContactsForm] = useState<ContactInfo>(contacts);
  const [contactsSavedNotification, setContactsSavedNotification] = useState(false);

  // Маркетинг і реклама стан
  const [marketingSettings, setMarketingSettings] = useState({
    googleTagId: 'G-YANTI9988',
    googleAdsConversionId: 'AW-1122334455',
    googleAdsConversionLabel: 'Purchase_Yanti',
    metaPixelId: '109827364512345',
    metaCapiToken: '',
    tikTokPixelId: '',
  });
  const [marketingSavedNotification, setMarketingSavedNotification] = useState(false);

  // UTM Генератор
  const [utmUrl, setUtmUrl] = useState('https://yanti.ua/catalog');
  const [utmSource, setUtmSource] = useState('facebook');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('spring_sale_labrets');
  const [copiedUtm, setCopiedUtm] = useState(false);
  const [copiedFeed, setCopiedFeed] = useState(false);

  // Калькулятор бюджету реклами
  const [calcBudget, setCalcBudget] = useState(5000);
  const [calcCpc, setCalcCpc] = useState(4.5);
  const [calcConvRate, setCalcConvRate] = useState(3.2);
  const [calcAvgOrder, setCalcAvgOrder] = useState(650);

  // Імпорт з Google Sheets & JSON
  const [googleSheetUrl, setGoogleSheetUrl] = useState(
    'https://docs.google.com/spreadsheets/d/1-bi4h-VPErWBfBPXLCGAu9Ns_v07dgvCIIrp8JPp3pM/export?format=csv'
  );
  const [csvRawText, setCsvRawText] = useState('');
  const [jsonRawText, setJsonRawText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ added: number; updated: number } | null>(null);
  const [overwriteExisting, setOverwriteExisting] = useState(true);

  // Метрики
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total_amount, 0);
  const newOrdersCount = orders.filter((o) => o.order_status === 'new').length;
  const processingCount = orders.filter((o) => o.order_status === 'processing').length;
  const shippedCount = orders.filter((o) => o.order_status === 'shipped').length;

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus !== 'all' && ord.order_status !== filterStatus) return false;
    if (searchOrderQuery.trim()) {
      const q = searchOrderQuery.toLowerCase();
      const matchNum = ord.order_number.toString().includes(q);
      const matchName = ord.customer_name.toLowerCase().includes(q);
      const matchPhone = ord.customer_phone.includes(q);
      const matchCity = ord.delivery_city.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  const filteredProducts = products.filter((prod) => {
    if (selectedProductCategory !== 'all' && prod.category_slug !== selectedProductCategory) return false;
    if (searchProductQuery.trim()) {
      const q = searchProductQuery.toLowerCase();
      const matchTitle = prod.title.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  // Пресети розмірів за таблицею
  const templatePresets = {
    labrets12: [
      { id: 'v-1', gauge: '1.2 мм', length_or_diameter: '1.2*4мм', stock: 45, price_adjustment: 0, sku: 'LR-001-04' },
      { id: 'v-2', gauge: '1.2 мм', length_or_diameter: '1.2*5мм', stock: 50, price_adjustment: 0, sku: 'LR-002-05' },
      { id: 'v-3', gauge: '1.2 мм', length_or_diameter: '1.2*6мм', stock: 60, price_adjustment: 0, sku: 'LR-003-06' },
      { id: 'v-4', gauge: '1.2 мм', length_or_diameter: '1.2*7мм', stock: 40, price_adjustment: 0, sku: 'LR-004-07' },
      { id: 'v-5', gauge: '1.2 мм', length_or_diameter: '1.2*8мм', stock: 75, price_adjustment: 0, sku: 'LR-005-08' },
      { id: 'v-6', gauge: '1.2 мм', length_or_diameter: '1.2*9мм', stock: 35, price_adjustment: 0, sku: 'LR-006-09' },
      { id: 'v-7', gauge: '1.2 мм', length_or_diameter: '1.2*10мм', stock: 50, price_adjustment: 0, sku: 'LR-007-10' },
      { id: 'v-8', gauge: '1.2 мм', length_or_diameter: '1.2*12мм', stock: 30, price_adjustment: 0, sku: 'LR-008-12' },
      { id: 'v-9', gauge: '1.2 мм', length_or_diameter: '1.2*14мм', stock: 20, price_adjustment: 0, sku: 'LR-009-14' },
      { id: 'v-10', gauge: '1.2 мм', length_or_diameter: '1.2*16мм', stock: 15, price_adjustment: 0, sku: 'LR-010-16' },
    ],
    labrets16: [
      { id: 'v-11', gauge: '1.6 мм', length_or_diameter: '1.6*6мм', stock: 25, price_adjustment: 0, sku: 'LR-011-06' },
      { id: 'v-12', gauge: '1.6 мм', length_or_diameter: '1.6*8мм', stock: 30, price_adjustment: 0, sku: 'LR-012-08' },
      { id: 'v-13', gauge: '1.6 мм', length_or_diameter: '1.6*10мм', stock: 25, price_adjustment: 0, sku: 'LR-013-10' },
    ],
    bananas: [
      { id: 'v-b1', gauge: '1.2 мм', length_or_diameter: '1,2*6*3mm', stock: 25, price_adjustment: 0, sku: 'BN-024-06' },
      { id: 'v-b2', gauge: '1.2 мм', length_or_diameter: '1,2*8*3mm', stock: 35, price_adjustment: 0, sku: 'BN-025-08' },
      { id: 'v-b3', gauge: '1.2 мм', length_or_diameter: '1,2*10*3mm', stock: 25, price_adjustment: 0, sku: 'BN-026-10' },
      { id: 'v-b4', gauge: '1.6 мм', length_or_diameter: '1,6*8*4', stock: 20, price_adjustment: 0, sku: 'BN-028-08' },
      { id: 'v-b5', gauge: '1.6 мм', length_or_diameter: '1,6*10*5', stock: 25, price_adjustment: 0, sku: 'BN-029-10' },
    ],
    clickers: [
      { id: 'v-c1', gauge: '1.2 мм', length_or_diameter: '1.2*6mm', stock: 30, price_adjustment: 0, sku: 'CK-057-06' },
      { id: 'v-c2', gauge: '1.2 мм', length_or_diameter: '1.2*8mm', stock: 45, price_adjustment: 0, sku: 'CK-059-08' },
      { id: 'v-c3', gauge: '1.2 мм', length_or_diameter: '1.2*10mm', stock: 40, price_adjustment: 0, sku: 'CK-061-10' },
      { id: 'v-c4', gauge: '1.2 мм', length_or_diameter: '1.2*12mm', stock: 25, price_adjustment: 0, sku: 'CK-063-12' },
    ],
    navel: [
      { id: 'v-n1', gauge: '1.6 мм', length_or_diameter: '1.6*8*4/6мм', stock: 20, price_adjustment: 50, sku: 'NV-167-16' },
      { id: 'v-n2', gauge: '1.6 мм', length_or_diameter: '1.6*10*4/6мм', stock: 35, price_adjustment: 50, sku: 'NV-168-16' },
      { id: 'v-n3', gauge: '1.6 мм', length_or_diameter: '1.6*12*4/6мм', stock: 20, price_adjustment: 50, sku: 'NV-169-16' },
      { id: 'v-n4', gauge: '1.6 мм', length_or_diameter: '1.6*10*5/8мм', stock: 30, price_adjustment: 50, sku: 'NV-170-16' },
    ],
  };

  const handleApplyPreset = (presetKey: keyof typeof templatePresets) => {
    setProductForm((prev) => ({
      ...prev,
      variants: [...templatePresets[presetKey]],
    }));
  };

  const handleAddVariantRow = () => {
    const newId = `v-${Date.now()}`;
    setProductForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: newId,
          gauge: '1.2 мм',
          length_or_diameter: '1.2*8мм',
          stock: 20,
          price_adjustment: 0,
          sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
        },
      ],
    }));
  };

  const handleRemoveVariantRow = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateVariantRow = (index: number, field: string, value: any) => {
    setProductForm((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const handleOpenCreateProduct = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      category_slug: 'labrets',
      base_price: 200,
      image: '/images/products/labrets/lr-basic-12.webp',
      description: 'Преміальна прикраса з імплантаційного титану ASTM F-136.',
      material: 'ASTM F-136 Titanium',
      thread_type: 'Internally Threaded (Внутрішня різьба)',
      supports_anodization: true,
      variants: [
        { id: 'v-1', gauge: '1.2 мм', length_or_diameter: '1.2*8мм', stock: 30, price_adjustment: 0, sku: 'LR-005-08' },
        { id: 'v-2', gauge: '1.2 мм', length_or_diameter: '1.2*10мм', stock: 25, price_adjustment: 0, sku: 'LR-007-10' },
      ],
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      title: prod.title,
      category_slug: prod.category_slug || 'labrets',
      base_price: prod.base_price,
      image: prod.images[0] || '/images/products/labrets/lr-basic-12.webp',
      description: prod.description,
      material: prod.material,
      thread_type: prod.thread_type,
      supports_anodization: prod.supports_anodization !== false,
      variants: prod.variants.map((v) => ({
        id: v.id,
        gauge: v.gauge,
        length_or_diameter: v.length_or_diameter,
        stock: v.stock || 20,
        price_adjustment: v.price_adjustment || 0,
        sku: v.sku || '',
      })),
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const categoryObj = categories.find((c) => c.slug === productForm.category_slug);
    const categoryName = categoryObj ? categoryObj.name : 'Лабрети';

    const slug = productForm.title
      .toLowerCase()
      .replace(/[^a-z0-9а-яіїє]/g, '-')
      .replace(/-+/g, '-')
      .trim() || `product-${Date.now()}`;

    const productPayload: Product = {
      id: editingProductId || `prod-${Date.now()}`,
      title: productForm.title,
      slug: slug,
      category_id: `cat-${productForm.category_slug}`,
      category_slug: productForm.category_slug,
      category_name: categoryName,
      description: productForm.description,
      features: [
        `Матеріал: ${productForm.material}`,
        `Тип різьби / замка: ${productForm.thread_type}`,
        'Дзеркальне ручне полірування Mirror Finish ASTM F-136',
      ],
      base_price: Number(productForm.base_price),
      images: [productForm.image],
      is_active: true,
      supports_anodization: productForm.supports_anodization,
      material: productForm.material,
      thread_type: productForm.thread_type,
      variants: productForm.variants.map((v) => ({
        id: v.id || `v-${Math.random()}`,
        product_id: editingProductId || 'prod',
        gauge: v.gauge,
        length_or_diameter: v.length_or_diameter,
        price_adjustment: Number(v.price_adjustment) || 0,
        stock: Number(v.stock) || 10,
        sku: v.sku,
      })),
      created_at: new Date().toISOString(),
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsProductModalOpen(false);
  };

  const handleSaveHeroBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroBanner(heroForm);
    setHeroSavedNotification(true);
    setTimeout(() => setHeroSavedNotification(false), 3000);
  };

  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    updateContacts(contactsForm);
    setContactsSavedNotification(true);
    setTimeout(() => setContactsSavedNotification(false), 3000);
  };

  const handleResetContacts = () => {
    if (confirm('Скинути контактні дані до початкових значень?')) {
      resetContacts();
      setContactsForm(useContactStore.getState().contacts);
    }
  };

  const handleSaveMarketing = (e: React.FormEvent) => {
    e.preventDefault();
    setMarketingSavedNotification(true);
    setTimeout(() => setMarketingSavedNotification(false), 3000);
  };

  const generatedUtmUrl = `${utmUrl}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}`;

  const handleCopyUtm = () => {
    navigator.clipboard.writeText(generatedUtmUrl);
    setCopiedUtm(true);
    setTimeout(() => setCopiedUtm(false), 2000);
  };

  const handleCopyFeedUrl = () => {
    const feedUrl = `${window.location.origin}/api/feed/google-merchant`;
    navigator.clipboard.writeText(feedUrl);
    setCopiedFeed(true);
    setTimeout(() => setCopiedFeed(false), 2000);
  };

  const handleImportGoogleSheet = async () => {
    if (!googleSheetUrl) return;
    setIsImporting(true);
    setImportResult(null);

    try {
      const res = await fetch(googleSheetUrl);
      if (!res.ok) throw new Error('Не вдалося отримати CSV з Google Таблиці');
      const csvText = await res.text();

      const result = importProductsFromCsv(csvText, overwriteExisting);
      setImportResult(result);
    } catch (err: any) {
      alert(`Помилка синхронізації: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportRawCsv = () => {
    if (!csvRawText.trim()) return;
    const result = importProductsFromCsv(csvRawText, overwriteExisting);
    setImportResult(result);
    setCsvRawText('');
  };

  const handleImportRawJson = () => {
    if (!jsonRawText.trim()) return;
    const result = importProductsFromJson(jsonRawText, overwriteExisting);
    setImportResult(result);
    setJsonRawText('');
  };

  // Розрахунки калькулятора реклами
  const estimatedClicks = Math.floor(calcBudget / (calcCpc || 1));
  const estimatedOrders = Math.floor(estimatedClicks * (calcConvRate / 100));
  const estimatedRevenue = estimatedOrders * calcAvgOrder;
  const estimatedRoas = calcBudget > 0 ? ((estimatedRevenue / calcBudget) * 100).toFixed(0) : 0;
  const estimatedCpa = estimatedOrders > 0 ? (calcBudget / estimatedOrders).toFixed(0) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 select-none">
      
      {/* Шапка адмін-панелі */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            <Sliders size={14} />
            <span>YANTI TITANIUM — Панель керування</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-tight text-slate-950">
            Адміністратор магазину
          </h1>
          <p className="text-xs text-slate-600">
            Керуйте замовленнями, товарами, контактами, SEO та рекламними кампаніями.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/catalog"
            target="_blank"
            className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all"
          >
            <Eye size={14} />
            <span>Вітрина магазину</span>
          </Link>
        </div>
      </div>

      {/* Вкладки навігації адмінки */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none pb-px">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'orders'
              ? 'border-slate-950 text-slate-950 bg-slate-100/60 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package size={15} />
          <span>Замовлення ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'products'
              ? 'border-slate-950 text-slate-950 bg-slate-100/60 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers size={15} />
          <span>Товари та розміри ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'contacts'
              ? 'border-emerald-600 text-emerald-950 bg-emerald-50/60 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Phone size={15} className="text-emerald-600" />
          <span>Контакти та шоурум</span>
        </button>

        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'marketing'
              ? 'border-indigo-600 text-indigo-900 bg-indigo-50/60 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Megaphone size={15} className="text-indigo-600" />
          <span>Реклама та Маркетинг</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'hero'
              ? 'border-slate-950 text-slate-950 bg-slate-100/60 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ImageIcon size={15} />
          <span>Головний банер (Hero)</span>
        </button>

        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'import'
              ? 'border-slate-950 text-slate-950 bg-slate-100/60 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet size={15} className="text-emerald-700" />
          <span>Імпорт з Google Таблиць</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. ВКЛАДКА ЗАМОВЛЕННЯ */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Загальна виручка</span>
                <TrendingUp size={16} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-bold font-mono text-slate-950">{totalRevenue.toLocaleString('uk-UA')} ₴</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Нових замовлень</span>
                <Clock size={16} className="text-amber-600" />
              </div>
              <p className="text-2xl font-bold font-mono text-amber-600">{newOrdersCount}</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>В обробці / Стерилізація</span>
                <ShieldCheck size={16} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold font-mono text-blue-600">{processingCount}</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Відправлено Новою Поштою</span>
                <Truck size={16} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-bold font-mono text-emerald-600">{shippedCount}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                Журнал замовлень ({filteredOrders.length})
              </h2>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Пошук за номером, телефоном, містом..."
                  value={searchOrderQuery}
                  onChange={(e) => setSearchOrderQuery(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                Замовлень не знайдено
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <div key={ord.id} className="p-5 hover:bg-slate-50/70 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">#{ord.order_number}</span>
                          <span className="text-xs text-slate-500">{new Date(ord.created_at).toLocaleString('uk-UA')}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                            {ord.order_status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">
                          {ord.customer_name} ({ord.customer_phone}) — {ord.delivery_city}, {ord.delivery_warehouse}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold text-base text-slate-950">
                          {ord.total_amount.toLocaleString('uk-UA')} ₴
                        </span>

                        <select
                          value={ord.order_status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                        >
                          <option value="new">Новий</option>
                          <option value="processing">Обробка</option>
                          <option value="shipped">Відправлено</option>
                          <option value="completed">Виконано</option>
                          <option value="cancelled">Скасовано</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ВКЛАДКА ТОВАРИ ТА РОЗМІРИ */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Пошук товару..."
                value={searchProductQuery}
                onChange={(e) => setSearchProductQuery(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none shadow-xs w-64"
              />
              <select
                value={selectedProductCategory}
                onChange={(e) => setSelectedProductCategory(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium shadow-xs cursor-pointer"
              >
                <option value="all">Усі категорії</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenCreateProduct}
              className="px-5 py-2.5 bg-slate-950 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus size={14} />
              <span>Створити новий товар</span>
            </button>
          </div>

          {/* Сітка товарів в адмінці */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-4 space-y-3 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900">
                    <Image
                      src={prod.images[0] || '/images/products/labrets/lr-basic-12.webp'}
                      alt={prod.title}
                      fill
                      className="object-cover"
                      sizes="250px"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-mono">
                      {prod.variants.length} розм.
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {prod.category_name}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {prod.title}
                    </h3>
                    <p className="text-xs font-mono font-bold text-slate-950 mt-0.5">
                      ₴{prod.base_price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEditProduct(prod)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit size={12} />
                    <span>Редагувати</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Видалити товар "${prod.title}"?`)) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="Видалити"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ВКЛАДКА РЕДАГУВАННЯ КОНТАКТІВ ТА ШОУРУМУ */}
      {/* ========================================================================= */}
      {activeTab === 'contacts' && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm animate-fadeIn max-w-4xl">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Phone size={16} />
              <span>Керування контактними даними бренду</span>
            </div>
            <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-slate-950">
              Контакти, соцмережі та адреса шоуруму
            </h2>
            <p className="text-xs text-slate-500">
              Усі зміни миттєво оновлюються на сторінці контактів, у футері та у формі замовлення.
            </p>
          </div>

          {contactsSavedNotification && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 font-bold animate-fadeIn">
              <CheckCircle2 size={16} />
              <span>Контактні дані успішно збережено та оновлено на сайті!</span>
            </div>
          )}

          <form onSubmit={handleSaveContacts} className="space-y-6 text-xs">
            
            {/* Телефон та Графік */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Форматований телефон</label>
                <input
                  type="text"
                  required
                  value={contactsForm.phone}
                  onChange={(e) => setContactsForm({ ...contactsForm, phone: e.target.value })}
                  placeholder="+380 (97) 123-45-67"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Телефон для виклику (tel:)</label>
                <input
                  type="text"
                  required
                  value={contactsForm.phoneRaw}
                  onChange={(e) => setContactsForm({ ...contactsForm, phoneRaw: e.target.value })}
                  placeholder="+380971234567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Години роботи</label>
                <input
                  type="text"
                  required
                  value={contactsForm.workingHours}
                  onChange={(e) => setContactsForm({ ...contactsForm, workingHours: e.target.value })}
                  placeholder="Пн-Сб: 10:00 – 19:00, Нд: Вихідний"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Telegram, Instagram, TikTok */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
                  <Send size={13} className="text-sky-600" />
                  <span>Telegram</span>
                </span>
                <input
                  type="text"
                  value={contactsForm.telegramUsername}
                  onChange={(e) => setContactsForm({ ...contactsForm, telegramUsername: e.target.value })}
                  placeholder="@yanti_support_bot"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                />
                <input
                  type="text"
                  value={contactsForm.telegramUrl}
                  onChange={(e) => setContactsForm({ ...contactsForm, telegramUrl: e.target.value })}
                  placeholder="https://t.me/yanti_support_bot"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700"
                />
              </div>

              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 block"></span>
                  <span>Instagram</span>
                </span>
                <input
                  type="text"
                  value={contactsForm.instagramUsername}
                  onChange={(e) => setContactsForm({ ...contactsForm, instagramUsername: e.target.value })}
                  placeholder="yanti_titanium"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                />
                <input
                  type="text"
                  value={contactsForm.instagramUrl}
                  onChange={(e) => setContactsForm({ ...contactsForm, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/yanti_titanium"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700"
                />
              </div>

              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
                  <span className="text-black font-bold">♪</span>
                  <span>TikTok</span>
                </span>
                <input
                  type="text"
                  value={contactsForm.tiktokUsername}
                  onChange={(e) => setContactsForm({ ...contactsForm, tiktokUsername: e.target.value })}
                  placeholder="@yanti_titanium"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                />
                <input
                  type="text"
                  value={contactsForm.tiktokUrl}
                  onChange={(e) => setContactsForm({ ...contactsForm, tiktokUrl: e.target.value })}
                  placeholder="https://tiktok.com/@yanti_titanium"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700"
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Email для оптових студій / B2B</label>
                <input
                  type="email"
                  required
                  value={contactsForm.emailWholesale}
                  onChange={(e) => setContactsForm({ ...contactsForm, emailWholesale: e.target.value })}
                  placeholder="wholesale@yanti-titanium.ua"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Email для клієнтів (загальний)</label>
                <input
                  type="email"
                  required
                  value={contactsForm.emailGeneral}
                  onChange={(e) => setContactsForm({ ...contactsForm, emailGeneral: e.target.value })}
                  placeholder="info@yanti-titanium.ua"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Адреса студії */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Фізична адреса шоуруму / студії</label>
                <input
                  type="text"
                  required
                  value={contactsForm.address}
                  onChange={(e) => setContactsForm({ ...contactsForm, address: e.target.value })}
                  placeholder="м. Київ, вул. Велика Васильківська, 72"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Примітка щодо візиту</label>
                <input
                  type="text"
                  value={contactsForm.addressNote}
                  onChange={(e) => setContactsForm({ ...contactsForm, addressNote: e.target.value })}
                  placeholder="Самовивіз та консультація майстра за попереднім узгодженням"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetContacts}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Скинути за замовчуванням</span>
              </button>

              <button
                type="submit"
                className="px-7 py-3 bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Check size={14} />
                <span>Зберегти та опублікувати контакти</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ВКЛАДКА РЕКЛАМНІ КАМПАНІЇ ТА МАРКЕТИНГ */}
      {/* ========================================================================= */}
      {activeTab === 'marketing' && (
        <div className="space-y-8 animate-fadeIn max-w-5xl">
          
          {/* Заголовок вкладки */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-300">
              <Megaphone size={16} />
              <span>Центр керування рекламою та таргетингом</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wider">
              Налаштування та оптимізація рекламних кампаній
            </h2>
            <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
              Інтегруйте пікселі відстеження Google Ads, Meta (Facebook / Instagram), TikTok, автоматичний XML фід для Google Shopping (Merchant Center) та створюйте UTM-мітки для оптимізації рентабельності (ROAS).
            </p>
          </div>

          {marketingSavedNotification && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 font-bold animate-fadeIn">
              <CheckCircle2 size={16} />
              <span>Налаштування реклами та пікселів успішно збережено!</span>
            </div>
          )}

          {/* 1. GOOGLE SHOPPING (MERCHANT CENTER) ТА GOOGLE ADS */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                  <Rss size={16} />
                  <span>Google Shopping & Merchant Center</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Автоматичний XML-фід для товарної реклами Google
                </h3>
              </div>

              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Активний (Live)
              </span>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 uppercase tracking-wider block">
                Посилання на XML фід для додавання в Google Merchant Center:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? `${window.location.origin}/api/feed/google-merchant` : '/api/feed/google-merchant'}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyFeedUrl}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  {copiedFeed ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedFeed ? 'Скопійовано' : 'Копіювати'}</span>
                </button>
                <Link
                  href="/api/feed/google-merchant"
                  target="_blank"
                  className="p-2.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-slate-700"
                  title="Відкрити фід у новій вкладці"
                >
                  <ExternalLink size={14} />
                </Link>
              </div>
              <p className="text-[11px] text-slate-500">
                Фід автоматично генерує актуальні ціни в ₴, наявність на складі, розміри, калібри, опис та фото всіх товарів для Google Shopping.
              </p>
            </div>

            {/* Google Ads ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Google Tag ID (GA4 / GTM)</label>
                <input
                  type="text"
                  value={marketingSettings.googleTagId}
                  onChange={(e) => setMarketingSettings({ ...marketingSettings, googleTagId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Google Ads Conversion Label</label>
                <input
                  type="text"
                  value={marketingSettings.googleAdsConversionLabel}
                  onChange={(e) => setMarketingSettings({ ...marketingSettings, googleAdsConversionLabel: e.target.value })}
                  placeholder="AW-XXXXXX/Purchase"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. META PIXEL (FACEBOOK & INSTAGRAM ADS) */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-5 shadow-sm text-xs">
            <div className="border-b border-slate-100 pb-3 space-y-0.5">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-indigo-600">
                <Target size={16} />
                <span>Meta Ads (Facebook & Instagram)</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Meta Pixel & Conversions API (CAPI)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Meta Pixel ID *</label>
                <input
                  type="text"
                  value={marketingSettings.metaPixelId}
                  onChange={(e) => setMarketingSettings({ ...marketingSettings, metaPixelId: e.target.value })}
                  placeholder="109827364512345"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">TikTok Pixel ID</label>
                <input
                  type="text"
                  value={marketingSettings.tikTokPixelId}
                  onChange={(e) => setMarketingSettings({ ...marketingSettings, tikTokPixelId: e.target.value })}
                  placeholder="CXXXXXXXXXXXXX"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">
                Статус відстеження подій у пікселях:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>PageView</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>ViewContent</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>AddToCart</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>Purchase (Конверсія)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveMarketing}
              className="px-6 py-2.5 bg-slate-950 hover:bg-black text-white font-bold rounded-xl uppercase tracking-wider shadow-sm cursor-pointer"
            >
              Зберегти ID пікселів
            </button>
          </div>

          {/* 3. UTM-ГЕНЕРАТОР ПОСИЛАНЬ ДЛЯ ТАРГЕТОВАНОЇ РЕКЛАМИ */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-5 shadow-sm text-xs">
            <div className="border-b border-slate-100 pb-3 space-y-0.5">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-600">
                <Share2 size={16} />
                <span>Генератор UTM-посилань</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Створення мічених посилань для кампаній
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Цільова сторінка</label>
                <input
                  type="text"
                  value={utmUrl}
                  onChange={(e) => setUtmUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Джерело (utm_source)</label>
                <select
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="facebook">facebook (Meta Ads)</option>
                  <option value="instagram">instagram (Stories / Reels)</option>
                  <option value="google">google (Search / Shopping)</option>
                  <option value="tiktok">tiktok</option>
                  <option value="telegram">telegram</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Тип трафіку (utm_medium)</label>
                <input
                  type="text"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  placeholder="cpc, stories, reel"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Назва кампанії (utm_campaign)</label>
                <input
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  placeholder="titanium_spring_sale"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider block">
                Готове рекламне посилання:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedUtmUrl}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyUtm}
                  className="px-5 py-2.5 bg-slate-950 hover:bg-black text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                >
                  {copiedUtm ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedUtm ? 'Скопійовано' : 'Копіювати'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. КАЛЬКУЛЯТОР БЮДЖЕТУ ТА ROAS */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-5 shadow-sm text-xs">
            <div className="border-b border-slate-100 pb-3 space-y-0.5">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-emerald-700">
                <BarChart3 size={16} />
                <span>Калькулятор прогнозу рентабельності (ROAS & CPA)</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Моделювання бюджету рекламної кампанії
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Бюджет реклами (₴)</label>
                <input
                  type="number"
                  value={calcBudget}
                  onChange={(e) => setCalcBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Вартість кліку CPC (₴)</label>
                <input
                  type="number"
                  step="0.1"
                  value={calcCpc}
                  onChange={(e) => setCalcCpc(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Конверсія сайту (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={calcConvRate}
                  onChange={(e) => setCalcConvRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Середній чек (₴)</label>
                <input
                  type="number"
                  value={calcAvgOrder}
                  onChange={(e) => setCalcAvgOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Результати підрахунку */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Очікувані кліки</span>
                <span className="text-lg font-bold font-mono text-slate-900">{estimatedClicks}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Замовлень (шт)</span>
                <span className="text-lg font-bold font-mono text-indigo-600">{estimatedOrders}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Орієнтовний CPA (вартість замовлення)</span>
                <span className="text-lg font-bold font-mono text-slate-900">{estimatedCpa} ₴</span>
              </div>
              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-800 uppercase font-bold block">Прогноз ROAS</span>
                <span className="text-lg font-bold font-mono text-emerald-700">{estimatedRoas}%</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ВКЛАДКА ГОЛОВНИЙ БАНЕР (HERO) */}
      {/* ========================================================================= */}
      {activeTab === 'hero' && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm animate-fadeIn max-w-4xl">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-slate-950">
              Налаштування головного банера магазину
            </h2>
            <p className="text-xs text-slate-500">
              Змінюйте фотографію та посилання на головній сторінці.
            </p>
          </div>

          {heroSavedNotification && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 font-bold animate-fadeIn">
              <CheckCircle2 size={16} />
              <span>Банер успішно оновлено та опубліковано на головній сторінці!</span>
            </div>
          )}

          <form onSubmit={handleSaveHeroBanner} className="space-y-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                URL фотографії головного банера:
              </label>
              <input
                type="text"
                value={heroForm.imageUrl}
                onChange={(e) => setHeroForm({ ...heroForm, imageUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Лівий заголовок</label>
                <input
                  type="text"
                  value={heroForm.leftTitle}
                  onChange={(e) => setHeroForm({ ...heroForm, leftTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Правий заголовок</label>
                <input
                  type="text"
                  value={heroForm.rightTitle}
                  onChange={(e) => setHeroForm({ ...heroForm, rightTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
            >
              Зберегти та опублікувати банер
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ВКЛАДКА ІМПОРТ З GOOGLE ТАБЛИЦЬ / JSON / CSV */}
      {/* ========================================================================= */}
      {activeTab === 'import' && (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm animate-fadeIn max-w-4xl">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <FileSpreadsheet size={16} />
              <span>Синхронізація товарного каталогу</span>
            </div>
            <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-slate-950">
              Імпорт товарів з таблиці та JSON
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ви можете в 1 клік імпортувати весь асортимент, структурований JSON каталог, розміри (калібри 1.2/1.6, довжини), артикули та ціни безпосередньо з Google Sheets або JSON-схеми.
            </p>
          </div>

          {/* Перемикач режиму імпорту */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => setImportMode('json')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                importMode === 'json'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              JSON Каталог (Структура з фото)
            </button>
            <button
              type="button"
              onClick={() => setImportMode('sheet')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                importMode === 'sheet'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Google Таблиця (CSV експорт)
            </button>
          </div>

          {/* Результат імпорту */}
          {importResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 size={16} />
                <span>Імпорт успішно завершено!</span>
              </div>
              <p>Додано нових товарів: <strong>{importResult.added}</strong> | Оновлено існуючих: <strong>{importResult.updated}</strong></p>
              <p className="text-[11px] text-emerald-700">Всі розміри, фото та параметри збережено у сховищі каталогу.</p>
            </div>
          )}

          {/* 1. РЕЖИМ JSON */}
          {importMode === 'json' && (
            <div className="space-y-4 text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 uppercase tracking-wider">
                  Вставте JSON-структуру каталогу:
                </label>
              </div>

              <textarea
                rows={10}
                value={jsonRawText}
                onChange={(e) => setJsonRawText(e.target.value)}
                placeholder='[{"sku_prefix": "LR-001-010", "category": "labrets", "title": "Базовий титановий лабрет", ...}]'
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:border-slate-500 focus:bg-white leading-relaxed"
              />

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={overwriteExisting}
                    onChange={(e) => setOverwriteExisting(e.target.checked)}
                    className="rounded border-slate-300 w-4 h-4 accent-slate-900"
                  />
                  <span>Перезаписувати існуючі товари</span>
                </label>

                <button
                  type="button"
                  onClick={handleImportRawJson}
                  disabled={!jsonRawText.trim()}
                  className="px-6 py-3 bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md inline-flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                >
                  <Upload size={14} />
                  <span>Імпортувати JSON товари</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. РЕЖИМ GOOGLE SHEET / CSV */}
          {importMode === 'sheet' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">
                  Посилання на Google Таблицю (CSV Export):
                </label>
                <input
                  type="text"
                  value={googleSheetUrl}
                  onChange={(e) => setGoogleSheetUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:border-slate-500"
                />
                
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                    <input
                      type="checkbox"
                      checked={overwriteExisting}
                      onChange={(e) => setOverwriteExisting(e.target.checked)}
                      className="rounded border-slate-300 w-4 h-4 accent-slate-900"
                    />
                    <span>Оновлювати існуючі товари та додавати нові розміри</span>
                  </label>
                </div>

                <button
                  onClick={handleImportGoogleSheet}
                  disabled={isImporting}
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isImporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                  <span>Синхронізувати з Google Таблиці</span>
                </button>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">
                  Або вставте текст CSV вручну:
                </label>
                <textarea
                  rows={4}
                  value={csvRawText}
                  onChange={(e) => setCsvRawText(e.target.value)}
                  placeholder="фото,артикул,розмір,ціна,наявність..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:border-slate-500 focus:bg-white"
                />

                <button
                  onClick={handleImportRawCsv}
                  disabled={!csvRawText.trim()}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-40 cursor-pointer"
                >
                  Імпортувати вставлений CSV
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* МОДАЛЬНЕ ВІКНО СТВОРЕННЯ / РЕДАГУВАННЯ ТОВАРУ ТА РОЗМІРІВ */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-slate-900 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold uppercase tracking-wider text-slate-950">
                  {editingProductId ? 'Редагувати товар та розміри' : 'Створити новий товар'}
                </h3>
                <p className="text-xs text-slate-500">
                  Налаштуйте фото, параметри матеріалу ASTM F-136 та розмірну сітку.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              {/* Основна інформація */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 uppercase">Назва товару *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    placeholder="Титановий лабрет з кулькою 3 мм"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Категорія *</label>
                  <select
                    value={productForm.category_slug}
                    onChange={(e) => setProductForm({ ...productForm, category_slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none font-medium cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Базова ціна (₴) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.base_price}
                    onChange={(e) => setProductForm({ ...productForm, base_price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Матеріал</label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Тип різьби / замка</label>
                  <select
                    value={productForm.thread_type}
                    onChange={(e) => setProductForm({ ...productForm, thread_type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Internally Threaded (Внутрішня різьба)">Internally Threaded (Внутрішня різьба)</option>
                    <option value="Threadless (Безрізьбовий)">Threadless (Безрізьбовий)</option>
                    <option value="Hinged Segment (Клікер)">Hinged Segment (Клікер)</option>
                  </select>
                </div>
              </div>

              {/* Фотографія товару */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 uppercase">URL фотографії товару *</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                    <Image src={productForm.image} alt="Preview" fill className="object-cover" sizes="48px" />
                  </div>
                  <input
                    type="text"
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="/images/products/labrets/lr-basic-12.webp або URL"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-slate-400 text-[10px]">Швидкі пресети фото:</span>
                  {[
                    { label: 'Лабрет базовий', url: '/images/products/labrets/lr-basic-12.webp' },
                    { label: 'Лабрет з кулькою', url: '/images/products/labrets/lr-ball-12.webp' },
                    { label: 'Банан', url: '/images/products/bananas/bn-12.webp' },
                    { label: 'Штанга', url: '/images/products/barbells/bb-12.webp' },
                    { label: 'Циркуляр', url: '/images/products/circulars/cr-basic.webp' },
                    { label: 'Клікер', url: '/images/products/clickers/ck-basic.webp' },
                    { label: 'Накрутка/Топ', url: '/images/products/tops/tp-065.webp' },
                    { label: 'Банан в пупок', url: '/images/products/navel/nv-161.webp' },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: p.url })}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ТАБЛИЦЯ РОЗМІРІВ, АРТИКУЛІВ ТА ЗАЛИШКІВ */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-bold text-slate-900 uppercase tracking-wider text-xs block">
                      Розмірна сітка, артикули та залишки ({productForm.variants.length} варіантів)
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Вкажіть точні розміри з таблиці або скористайтесь швидким шаблоном.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddVariantRow}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>+ Додати розмір вручну</span>
                    </button>
                  </div>
                </div>

                {/* Швидкі шаблони розмірів з таблиці */}
                <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-600 flex items-center gap-1">
                    <Zap size={11} className="text-amber-500" />
                    <span>Шаблони з таблиці:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('labrets12')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-800 cursor-pointer"
                  >
                    Лабрети 1.2мм (4-16мм)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('labrets16')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-800 cursor-pointer"
                  >
                    Лабрети 1.6мм (6-10мм)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('bananas')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-800 cursor-pointer"
                  >
                    Банани 1.2/1.6мм
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('clickers')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-800 cursor-pointer"
                  >
                    Клікери 1.2мм
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('navel')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-800 cursor-pointer"
                  >
                    Банани в пупок 1.6мм
                  </button>
                </div>

                {/* Таблиця рядків розмірів */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-2.5">Калібр</th>
                        <th className="p-2.5">Розмір за каталогом</th>
                        <th className="p-2.5">Артикул SKU</th>
                        <th className="p-2.5">Доплата (+ ₴)</th>
                        <th className="p-2.5">Залишок (шт)</th>
                        <th className="p-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {productForm.variants.map((v, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.gauge}
                              onChange={(e) => handleUpdateVariantRow(idx, 'gauge', e.target.value)}
                              placeholder="1.2 мм"
                              className="w-20 px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.length_or_diameter}
                              onChange={(e) => handleUpdateVariantRow(idx, 'length_or_diameter', e.target.value)}
                              placeholder="1.2*8мм"
                              className="w-32 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.sku}
                              onChange={(e) => handleUpdateVariantRow(idx, 'sku', e.target.value)}
                              placeholder="LR-005-08"
                              className="w-28 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={v.price_adjustment}
                              onChange={(e) => handleUpdateVariantRow(idx, 'price_adjustment', Number(e.target.value))}
                              className="w-20 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={v.stock}
                              onChange={(e) => handleUpdateVariantRow(idx, 'stock', Number(e.target.value))}
                              className="w-20 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono font-semibold"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariantRow(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                              title="Видалити рядок"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Опис */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Опис виробу для сайту та Google SEO</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-slate-950 hover:bg-black text-white font-bold rounded-xl uppercase tracking-wider shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Check size={14} />
                  <span>Зберегти та опублікувати на сайті</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
