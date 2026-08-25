export type DeliveryType = 'nova_poshta_warehouse' | 'nova_poshta_courier';
export type PaymentMethod = 'cod' | 'card' | 'iban';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'new' | 'processing' | 'shipped' | 'completed' | 'canceled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_title: string;
  product_slug: string;
  image?: string;
  selected_gauge: string;
  selected_size: string;
  selected_color: string;
  is_sterilized: boolean;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerSurname?: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryType: DeliveryType;
  deliveryCity: string;
  deliveryWarehouse: string;
  paymentMethod: PaymentMethod;
  customerNotes?: string;
  items: {
    productId: string;
    productTitle: string;
    productSlug: string;
    image?: string;
    selectedGauge: string;
    selectedSize: string;
    selectedColor: string;
    isSterilized: boolean;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface OrderRecord {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_type: DeliveryType;
  delivery_city: string;
  delivery_warehouse: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  subtotal_amount: number;
  sterilization_total: number;
  total_amount: number;
  customer_notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}
