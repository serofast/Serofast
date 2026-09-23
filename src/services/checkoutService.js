// ============================================================================
// SEROFAST CAMPUS MARKETPLACE - CHECKOUT & ORDER PLACEMENT ENGINE
// ============================================================================
import { supabase } from "../lib/supabase";

/**
 * Places a customer order into public.orders and public.order_items
 */
export async function placeCustomerOrder({
  customerName,
  customerPhone,
  hostelAddress,
  items = [],
  paymentMethod = "UPI",
  deliveryFee = 40,
  discountAmount = 0,
}) {
  if (!supabase) {
    return { success: false, error: "Database client unavailable" };
  }

  if (!customerName || !customerPhone || !hostelAddress) {
    return { success: false, error: "Please enter your name, phone number, and hostel delivery address." };
  }

  if (!items || items.length === 0) {
    return { success: false, error: "Your shopping bag is empty." };
  }

  try {
    // 1. Calculate totals
    const subtotal = items.reduce((sum, item) => {
      const price = Number(item.price || item.unit_price || 0);
      const qty = Number(item.quantity || 1);
      return sum + price * qty;
    }, 0);

    const totalAmount = Math.max(0, subtotal + deliveryFee - discountAmount);

    // 2. Generate unique identifiers
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-2026-${randomSuffix}`;
    const trackingNumber = `SF-TRK-${randomSuffix}`;
    const shopId = items[0]?.shop_id || null;

    // 3. Insert Master Order Record
    const orderPayload = {
      order_number: orderNumber,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      address: hostelAddress.trim(),
      shipping_address: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        address: hostelAddress.trim(),
      },
      order_status: "ORDER_PLACED",
      status: "Pending",
      payment_method: paymentMethod,
      payment_status: paymentMethod === "COD" ? "PENDING" : "COMPLETED",
      subtotal: subtotal,
      delivery_fee: deliveryFee,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      tracking_number: trackingNumber,
      shop_id: shopId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: orderData, error: orderErr } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select()
      .single();

    if (orderErr || !orderData) {
      console.error("Order insertion error:", orderErr);
      return { success: false, error: orderErr?.message || "Failed to create order" };
    }

    const orderId = orderData.id;

    // 4. Insert Apparel Line Items into public.order_items
    const lineItemsPayload = items.map((item) => {
      const unitPrice = Number(item.price || item.unit_price || 0);
      const quantity = Number(item.quantity || 1);
      const totalPrice = unitPrice * quantity;

      return {
        order_id: orderId,
        product_title: item.title || item.product_title || item.name || "Campus Apparel Item",
        product_image: item.image || item.product_image || item.image_url || null,
        size: item.size || "M",
        color: item.color || "Standard",
        quantity: quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
      };
    });

    const { error: itemsErr } = await supabase
      .from("order_items")
      .insert(lineItemsPayload);

    if (itemsErr) {
      console.warn("Line items insertion notice:", itemsErr.message);
    }

    return {
      success: true,
      order: orderData,
      orderNumber: orderNumber,
      trackingNumber: trackingNumber,
      trackingUrl: `/track/${orderNumber}`,
    };
  } catch (err) {
    console.error("Checkout execution error:", err);
    return { success: false, error: err.message || "An unexpected checkout error occurred." };
  }
}
