'use server';

import { createClient } from '@supabase/supabase-js';
import { CreateOrderPayload, OrderRecord } from '@/types/order';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Optional Supabase client if environment variables are set
const supabase = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Відправка повідомлення у Telegram-чат/канал
 */
async function sendTelegramNotification(orderNumber: number, payload: CreateOrderPayload, totalAmount: number) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log(`[Telegram Mock] Замовлення #${orderNumber} сформовано на суму ${totalAmount} ₴ (Telegram токени не вказано в .env)`);
    return;
  }

  const itemsList = payload.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.productTitle}*\n` +
        `   ▫️ Розмір: \`${item.selectedGauge} | ${item.selectedSize}\`\n` +
        `   ▫️ Анодування: *${item.selectedColor}*\n` +
        `   ▫️ Стерилізація: *${item.isSterilized ? '✅ ТАК (+50 ₴)' : '❌ НІ'}*\n` +
        `   ▫️ Кількість: ${item.quantity} шт. × ${item.unitPrice} ₴`
    )
    .join('\n\n');

  const deliveryInfo =
    payload.deliveryType === 'nova_poshta_warehouse'
      ? `🏢 *Нова Пошта:* м. ${payload.deliveryCity}, ${payload.deliveryWarehouse}`
      : `🛵 *Кур'єр:* м. ${payload.deliveryCity}, ${payload.deliveryWarehouse}`;

  const paymentMap = {
    cod: '💵 Накладений платіж (при отриманні)',
    card: '💳 Онлайн-оплата карткою (WayForPay / LiqPay)',
    iban: '🏦 Оплата за реквізитами IBAN (ФОП)',
  };

  const message =
    `🔥 *НОВЕ ЗАМОВЛЕННЯ #${orderNumber}*\n` +
    `───────────────────────\n` +
    `👤 *Клієнт:* ${payload.customerName} ${payload.customerSurname || ''}\n` +
    `📞 *Телефон:* \`${payload.customerPhone}\`\n` +
    (payload.customerEmail ? `✉️ *Email:* ${payload.customerEmail}\n` : '') +
    `\n📦 *ТОВАРИ:*\n${itemsList}\n\n` +
    `📍 *ДОСТАВКА:*\n${deliveryInfo}\n\n` +
    `💳 *ОПЛАТА:*\n${paymentMap[payload.paymentMethod] || payload.paymentMethod}\n` +
    (payload.customerNotes ? `\n📝 *Коментар:* _${payload.customerNotes}_\n` : '') +
    `───────────────────────\n` +
    `💰 *ДО СПЛАТИ:* *${totalAmount.toLocaleString('uk-UA')} ₴*`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('Помилка виконання запиту до Telegram API:', error);
  }
}

/**
 * Server Action для обробки замовлення
 */
export async function createGuestOrderAction(payload: CreateOrderPayload) {
  try {
    if (!payload.customerName || !payload.customerPhone || !payload.items || payload.items.length === 0) {
      return { success: false, error: "Будь ласка, заповніть обов'язкові контактні дані та додайте товари" };
    }

    let subtotalAmount = 0;
    let sterilizationTotal = 0;

    payload.items.forEach((item) => {
      subtotalAmount += item.unitPrice * item.quantity;
      if (item.isSterilized) {
        sterilizationTotal += 50 * item.quantity;
      }
    });

    const totalAmount = subtotalAmount + sterilizationTotal;
    const generatedOrderNumber = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ord-${Date.now()}-${generatedOrderNumber}`;

    // Якщо підключений Supabase — зберігаємо в PostgreSQL
    if (supabase) {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            customer_name: `${payload.customerName} ${payload.customerSurname || ''}`.trim(),
            customer_phone: payload.customerPhone,
            customer_email: payload.customerEmail || null,
            delivery_type: payload.deliveryType,
            delivery_city: payload.deliveryCity,
            delivery_warehouse: payload.deliveryWarehouse,
            payment_method: payload.paymentMethod,
            payment_status: 'pending',
            order_status: 'new',
            subtotal_amount: subtotalAmount,
            sterilization_total: sterilizationTotal,
            total_amount: totalAmount,
            customer_notes: payload.customerNotes || null,
          })
          .select('id, order_number')
          .single();

        if (orderData && !orderError) {
          const itemsRows = payload.items.map((i) => ({
            order_id: orderData.id,
            product_id: i.productId,
            product_title: i.productTitle,
            selected_gauge: i.selectedGauge,
            selected_size: i.selectedSize,
            selected_color: i.selectedColor,
            is_sterilized: i.isSterilized,
            quantity: i.quantity,
            unit_price: i.unitPrice,
            total_price: (i.unitPrice + (i.isSterilized ? 50 : 0)) * i.quantity,
          }));

          await supabase.from('order_items').insert(itemsRows);
        }
      } catch (dbErr) {
        console.error('Supabase save warning (fallback to direct flow):', dbErr);
      }
    }

    // Відправляємо Telegram сповіщення
    await sendTelegramNotification(generatedOrderNumber, payload, totalAmount);

    const newOrderRecord: OrderRecord = {
      id: orderId,
      order_number: generatedOrderNumber,
      customer_name: `${payload.customerName} ${payload.customerSurname || ''}`.trim(),
      customer_phone: payload.customerPhone,
      customer_email: payload.customerEmail,
      delivery_type: payload.deliveryType,
      delivery_city: payload.deliveryCity,
      delivery_warehouse: payload.deliveryWarehouse,
      payment_method: payload.paymentMethod,
      payment_status: 'pending',
      order_status: 'new',
      subtotal_amount: subtotalAmount,
      sterilization_total: sterilizationTotal,
      total_amount: totalAmount,
      customer_notes: payload.customerNotes,
      items: payload.items.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        order_id: orderId,
        product_id: item.productId,
        product_title: item.productTitle,
        product_slug: item.productSlug,
        image: item.image,
        selected_gauge: item.selectedGauge,
        selected_size: item.selectedSize,
        selected_color: item.selectedColor,
        is_sterilized: item.isSterilized,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: (item.unitPrice + (item.isSterilized ? 50 : 0)) * item.quantity,
      })),
      created_at: new Date().toISOString(),
    };

    return {
      success: true,
      order: newOrderRecord,
      orderNumber: generatedOrderNumber,
    };
  } catch (err: any) {
    console.error('Order creation error:', err);
    return { success: false, error: err.message || 'Виникла помилка при оформленні замовлення' };
  }
}
