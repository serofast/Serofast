// ============================================================================
// SEROFAST HYPERLOCAL MARKETPLACE - REAL-TIME WAREHOUSE & DELIVERY SERVICE
// Direct Integration with public.orders & public.order_items
// ============================================================================
import { supabase } from "../lib/supabase";
import { logAdminAction } from "./adminSupabaseService";

export const DELIVERY_STAGES = {
  ORDER_PLACED: { key: "ORDER_PLACED", label: "Order Received", badge: "amber", desc: "Order placed by customer, awaiting warehouse packing" },
  PACKED: { key: "PACKED", label: "Packed & Verified", badge: "blue", desc: "Items picked from warehouse and packaged" },
  SHIPPED: { key: "SHIPPED", label: "In Transit / Dispatched", badge: "indigo", desc: "Handed over to delivery runner / courier" },
  OUT_FOR_DELIVERY: { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", badge: "purple", desc: "Runner is on the way to campus destination" },
  DELIVERED: { key: "DELIVERED", label: "Delivered", badge: "emerald", desc: "Successfully received by customer" },
  CANCELLED: { key: "CANCELLED", label: "Cancelled", badge: "rose", desc: "Delivery cancelled or returned" },
};

/**
 * Normalizes order status strings to standard stage keys
 */
export function normalizeDeliveryStatus(status) {
  if (!status) return "ORDER_PLACED";
  const st = String(status).trim().toUpperCase();
  if (st === "PENDING" || st === "ORDER_PLACED" || st === "CONFIRMED" || st === "PROCESSING") return "ORDER_PLACED";
  if (st === "PACKED") return "PACKED";
  if (st === "SHIPPED" || st === "IN_TRANSIT" || st === "DISPATCHED") return "SHIPPED";
  if (st === "OUT_FOR_DELIVERY") return "OUT_FOR_DELIVERY";
  if (st === "DELIVERED" || st === "COMPLETED") return "DELIVERED";
  if (st === "CANCELLED" || st === "FAILED") return "CANCELLED";
  return st;
}

/**
 * Fetches all orders for delivery dispatch oversight from public.orders
 */
/**
 * Fetches all orders for delivery dispatch oversight from public.orders
 */
/**
 * Fetches all orders for delivery dispatch oversight from public.orders
 */
export async function fetchAdminDeliveries() {
  if (!supabase) return [];
  try {
    // 1. Query orders table directly (0 chance of 400 Bad Request error)
    const { data: orders, error: ordersErr } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersErr) {
      console.warn("Orders fetch error:", ordersErr.message);
      return [];
    }

    if (!orders || orders.length === 0) return [];

    // 2. Fetch shops map in parallel for shop names
    let shopMap = {};
    try {
      const { data: shops } = await supabase.from("shops").select("*");
      if (shops && shops.length > 0) {
        shops.forEach((s) => {
          shopMap[s.id] = s;
        });
      }
    } catch {}

    // 3. Map orders into clean delivery objects
    return orders.map((o, idx) => {
      const rawStatus = normalizeDeliveryStatus(o.order_status || o.status);
      const addressText =
        o.address ||
        (typeof o.shipping_address === "object" ? o.shipping_address?.address || o.shipping_address?.street : "") ||
        "Main Campus Hostel Block";

      const shop = shopMap[o.shop_id];

      return {
        id: `DEL-${o.id ? String(o.id).slice(0, 6).toUpperCase() : idx + 1}`,
        order_id: o.id,
        order_number: o.order_number || o.id,
        status: rawStatus,
        courier_name: "SeroFast Hyperlocal Express",
        tracking_number: o.tracking_number || `SF-TRK-${(o.order_number || o.id || "").slice(-4)}`,
        runner_name: "Campus Courier Lead",
        runner_phone: "+91 98765 43210",
        customer_name: o.customer_name || (typeof o.shipping_address === "object" ? o.shipping_address?.name : "") || "Hostel Resident",
        delivery_address: addressText,
        customer_phone: o.customer_phone || "+91 99887 76655",
        total_amount: Number(o.total_amount) || 0,
        shop_name: shop?.name || "Campus Merchant Store",
        estimated_delivery: o.estimated_delivery,
        created_at: o.created_at || new Date().toISOString(),
        updated_at: o.updated_at || new Date().toISOString(),
        orders: { ...o, shops: shop },
      };
    });
  } catch (err) {
    console.warn("Orders delivery fetch notice:", err?.message);
  }
  return [];
}

/**
 * Fetches a single delivery/order details with linked line items
 */
export async function fetchDeliveryDetails(orderIdOrNumber) {
  if (!supabase || !orderIdOrNumber) return null;
  try {
    // 1. Fetch order by id or order_number
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .or(`id.eq.${orderIdOrNumber},order_number.eq.${orderIdOrNumber}`)
      .maybeSingle();

    if (orderErr || !order) {
      console.warn("Order detail fetch notice:", orderErr?.message);
      return null;
    }

    // 2. Fetch linked order_items independently
    let orderItems = [];
    try {
      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);
      orderItems = items || [];
    } catch {}

    // 3. Fetch linked shop independently
    let shop = null;
    if (order.shop_id) {
      try {
        const { data: shopData } = await supabase
          .from("shops")
          .select("*")
          .eq("id", order.shop_id)
          .maybeSingle();
        shop = shopData;
      } catch {}
    }

    const rawStatus = normalizeDeliveryStatus(order.order_status || order.status);
    const addressText =
      order.address ||
      (typeof order.shipping_address === "object" ? order.shipping_address?.address || order.shipping_address?.street : "") ||
      "Main Campus Hostel Block";

    return {
      id: `DEL-${String(order.id).slice(0, 6).toUpperCase()}`,
      order_id: order.id,
      order_number: order.order_number || order.id,
      status: rawStatus,
      courier_name: "SeroFast Hyperlocal Express",
      tracking_number: order.tracking_number || `SF-TRK-${(order.order_number || order.id || "").slice(-4)}`,
      runner_name: "Campus Courier Lead",
      runner_phone: "+91 98765 43210",
      customer_name: order.customer_name || (typeof order.shipping_address === "object" ? order.shipping_address?.name : "") || "Hostel Resident",
      delivery_address: addressText,
      customer_phone: order.customer_phone || "+91 99887 76655",
      total_amount: Number(order.total_amount) || 0,
      shop_name: shop?.name || "Campus Merchant Store",
      estimated_delivery: order.estimated_delivery,
      created_at: order.created_at || new Date().toISOString(),
      updated_at: order.updated_at || new Date().toISOString(),
      orders: {
        ...order,
        order_items: orderItems,
        shops: shop,
      },
    };
  } catch (err) {
    console.warn("Delivery details fetch notice:", err?.message);
  }
  return null;
}

/**
 * Updates an order delivery status, tracking number, or ETA directly in public.orders
 */
/**
 * Updates full order delivery details directly in public.orders table
 */
export async function saveOrderDeliveryFull({
  orderId,
  orderStatus,
  trackingNumber,
  customerName,
  customerPhone,
  deliveryAddress,
  paymentStatus,
  paymentMethod,
  estimatedDelivery,
  totalAmount,
}) {
  if (!supabase || !orderId) return { success: false, error: "Missing order ID" };

  const now = new Date().toISOString();
  const orderPayload = {
    updated_at: now,
  };

  if (orderStatus !== undefined) {
    orderPayload.order_status = orderStatus;
    orderPayload.status = orderStatus === "ORDER_PLACED" ? "Pending" : orderStatus === "DELIVERED" ? "Completed" : orderStatus;
  }
  if (trackingNumber !== undefined) orderPayload.tracking_number = trackingNumber;
  if (customerName !== undefined) orderPayload.customer_name = customerName;
  if (customerPhone !== undefined) orderPayload.customer_phone = customerPhone;
  if (deliveryAddress !== undefined) {
    orderPayload.address = deliveryAddress;
    orderPayload.shipping_address = { address: deliveryAddress, name: customerName, updated_at: now };
  }
  if (paymentStatus !== undefined) orderPayload.payment_status = paymentStatus;
  if (paymentMethod !== undefined) orderPayload.payment_method = paymentMethod;
  if (estimatedDelivery !== undefined) orderPayload.estimated_delivery = estimatedDelivery || null;
  if (totalAmount !== undefined && !isNaN(Number(totalAmount))) {
    orderPayload.total_amount = Number(totalAmount);
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .update(orderPayload)
      .eq("id", orderId)
      .select()
      .single();

    if (!error && data) {
      await logAdminAction({
        action: "UPDATE_ORDER_DELIVERY",
        targetType: "Order",
        targetId: orderId,
        targetLabel: `Updated Order #${data.order_number || orderId}`,
        module: "Delivery",
        details: orderPayload,
      });
      return { success: true, data };
    } else if (error) {
      console.error("Supabase order update error:", error);
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error("Order full update exception:", err);
    return { success: false, error: err?.message };
  }

  return { success: false, error: "Unknown error occurred" };
}

/**
 * Updates an order delivery status, tracking number, or ETA directly in public.orders
 */
export async function updateDeliveryStatus({
  orderId,
  status,
  trackingNumber,
  courierName,
  runnerName,
  runnerPhone,
  notes,
  eta,
}) {
  return saveOrderDeliveryFull({
    orderId,
    orderStatus: status,
    trackingNumber,
    estimatedDelivery: eta,
  });
}

/**
 * Subscribes to real-time order updates via Supabase WebSocket
 */
export function subscribeToRealtimeDeliveries(onEvent) {
  if (!supabase) return () => {};
  try {
    const channelId = `realtime_orders_delivery_${Date.now()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (onEvent) onEvent(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}
