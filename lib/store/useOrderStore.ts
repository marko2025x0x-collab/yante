import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderRecord, OrderStatus } from '@/types/order';

interface OrderStore {
  orders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => OrderRecord | undefined;
  getOrderByNumber: (orderNumber: number) => OrderRecord | undefined;
}

const INITIAL_DEMO_ORDERS: OrderRecord[] = [
  {
    id: 'ord-demo-1001',
    order_number: 1001,
    customer_name: 'Олена Ковальчук',
    customer_phone: '+380971234567',
    customer_email: 'olena.piercing@gmail.com',
    delivery_type: 'nova_poshta_warehouse',
    delivery_city: 'Київ',
    delivery_warehouse: 'Відділення № 45 (вул. Велика Васильківська, 72)',
    payment_method: 'card',
    payment_status: 'paid',
    order_status: 'processing',
    subtotal_amount: 1100,
    sterilization_total: 100,
    total_amount: 1200,
    customer_notes: 'Будь ласка, перевірте надійність упаковки. Дякую!',
    items: [
      {
        id: 'item-1',
        order_id: 'ord-demo-1001',
        product_id: 'prod-clicker-pave-cz',
        product_title: 'Сегментний клікер з доріжкою цирконів "Eternity Pavé"',
        product_slug: 'titanium-clicker-eternity-pave-cz',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
        selected_gauge: '1.2mm (16G)',
        selected_size: '8mm',
        selected_color: 'Champagne Gold (65V)',
        is_sterilized: true,
        quantity: 1,
        unit_price: 780,
        total_price: 830,
      },
      {
        id: 'item-2',
        order_id: 'ord-demo-1001',
        product_id: 'prod-labret-threadless-base',
        product_title: 'Титановий лабрет з пласким диском (Threadless Base)',
        product_slug: 'titanium-labret-threadless-base',
        image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=600&auto=format&fit=crop',
        selected_gauge: '1.2mm (16G)',
        selected_size: '8mm',
        selected_color: 'High Polish Silver',
        is_sterilized: true,
        quantity: 1,
        unit_price: 320,
        total_price: 370,
      },
    ],
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'ord-demo-1002',
    order_number: 1002,
    customer_name: 'Дмитро Мельник',
    customer_phone: '+380639876543',
    customer_email: 'dmytro.m@meta.ua',
    delivery_type: 'nova_poshta_warehouse',
    delivery_city: 'Львів',
    delivery_warehouse: 'Поштомат № 11202 (просп. Свободи, 15)',
    payment_method: 'cod',
    payment_status: 'pending',
    order_status: 'new',
    subtotal_amount: 650,
    sterilization_total: 50,
    total_amount: 700,
    customer_notes: 'Зателефонувати перед відправкою',
    items: [
      {
        id: 'item-3',
        order_id: 'ord-demo-1002',
        product_id: 'prod-top-cluster-aurora',
        product_title: 'Безрізьбовий кластер з кристалами "Aurora Borealis" Push-in',
        product_slug: 'titanium-cluster-aurora-borealis',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
        selected_gauge: 'Універсальний',
        selected_size: '11.5x4.5mm',
        selected_color: 'Ice Blue',
        is_sterilized: true,
        quantity: 1,
        unit_price: 650,
        total_price: 700,
      },
    ],
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: INITIAL_DEMO_ORDERS,

      addOrder: (newOrder) => {
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((ord) =>
            ord.id === orderId ? { ...ord, order_status: status, updated_at: new Date().toISOString() } : ord
          ),
        }));
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id === orderId);
      },

      getOrderByNumber: (orderNumber) => {
        return get().orders.find((o) => o.order_number === orderNumber);
      },
    }),
    {
      name: 'yanti-orders-storage',
    }
  )
);
