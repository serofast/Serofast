import { supabase } from "../lib/supabase";

// UUID helper
const isValidUuid = (str) =>
  typeof str === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

/* ── Activity Audit Logging ───────────────────────────────── */
export async function logAdminAction({
  action = "UPDATE",
  targetType = "System",
  targetId = null,
  targetLabel = "",
  module = "System",
  details = {},
  actorName = "Admin",
  actorEmail = "admin@serofast.com",
}) {
  if (!supabase) return null;
  try {
    const { data } = await supabase.from("audit_logs").insert([
      {
        action,
        target_type: targetType,
        target_id: String(targetId || ""),
        target_label: targetLabel || targetType,
        module,
        details,
        actor_name: actorName,
        actor_email: actorEmail,
      },
    ]);
    return data;
  } catch (err) {
    console.warn("Audit log write skipped:", err);
    return null;
  }
}

/* ── 1. Categories Management ─────────────────────────────── */
export async function fetchAdminCategoriesList() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function saveAdminCategory(categoryData) {
  if (!supabase) return null;
  try {
    const isEdit = Boolean(categoryData.id && isValidUuid(categoryData.id));
    const payload = {
      name: categoryData.name,
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      group_name: categoryData.group_name || categoryData.parent || "all",
      image_url: categoryData.image_url || categoryData.image || "",
      items_count: categoryData.items_count || "0 items",
      bg_color: categoryData.bg_color || "#EFF6FF",
    };

    let response;
    if (isEdit) {
      response = await supabase
        .from("categories")
        .update(payload)
        .eq("id", categoryData.id)
        .select()
        .single();
    } else {
      response = await supabase.from("categories").insert([payload]).select().single();
    }

    if (response.data) {
      await logAdminAction({
        action: isEdit ? "UPDATE" : "CREATE",
        targetType: "Category",
        targetId: response.data.id,
        targetLabel: response.data.name,
        module: "Catalog",
      });
      return response.data;
    }
  } catch (e) {
    console.error("Error saving category:", e);
  }
  return null;
}

export async function deleteAdminCategory(categoryId) {
  if (!supabase || !categoryId) return false;
  try {
    const { error } = await supabase.from("categories").delete().eq("id", categoryId);
    if (!error) {
      await logAdminAction({
        action: "DELETE",
        targetType: "Category",
        targetId: categoryId,
        module: "Catalog",
      });
      return true;
    }
  } catch {}
  return false;
}

/* ── 2. Products & Inventory Management ──────────────────── */
export async function fetchAdminWarehouseCatalog() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("warehouse_products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function saveAdminWarehouseProduct(productData) {
  if (!supabase) return null;
  try {
    const isEdit = Boolean(productData.id && isValidUuid(productData.id));
    const payload = {
      title: productData.title || productData.name,
      category: productData.category || productData.categoryName || "General",
      base_price: Number(productData.base_price || productData.price) || 0,
      retail_price: Number(productData.retail_price || productData.price) || 0,
      image_url: productData.image_url || (productData.images && productData.images[0]?.url) || "",
      description: productData.description || "",
      warehouse_stock: Number(productData.warehouse_stock ?? productData.stock) || 0,
      sku: productData.sku || `SF-${Date.now().toString(36).toUpperCase()}`,
    };

    let response;
    if (isEdit) {
      response = await supabase
        .from("warehouse_products")
        .update(payload)
        .eq("id", productData.id)
        .select()
        .single();
    } else {
      response = await supabase.from("warehouse_products").insert([payload]).select().single();
    }

    if (response.data) {
      await logAdminAction({
        action: isEdit ? "UPDATE" : "CREATE",
        targetType: "Product",
        targetId: response.data.id,
        targetLabel: response.data.title,
        module: "Catalog",
      });
      return response.data;
    }
  } catch (e) {
    console.error("Error saving product:", e);
  }
  return null;
}

export async function deleteAdminWarehouseProduct(productId) {
  if (!supabase || !productId) return false;
  try {
    const { error } = await supabase.from("warehouse_products").delete().eq("id", productId);
    if (!error) {
      await logAdminAction({
        action: "DELETE",
        targetType: "Product",
        targetId: productId,
        module: "Catalog",
      });
      return true;
    }
  } catch {}
  return false;
}

export async function adjustInventoryStock(productId, change, reason = "Manual adjustment", type = "Adjustment") {
  if (!supabase || !productId) return false;
  try {
    // 1. Fetch current stock
    const { data: prod } = await supabase
      .from("warehouse_products")
      .select("warehouse_stock, title")
      .eq("id", productId)
      .single();

    if (!prod) return false;
    const previousStock = Number(prod.warehouse_stock) || 0;
    const newStock = Math.max(0, previousStock + Number(change));

    // 2. Update warehouse_stock
    await supabase
      .from("warehouse_products")
      .update({ warehouse_stock: newStock })
      .eq("id", productId);

    // 3. Record in inventory_movements
    await supabase.from("inventory_movements").insert([
      {
        product_id: productId,
        type,
        quantity: Number(change),
        previous_stock: previousStock,
        new_stock: newStock,
        reason,
        performed_by: "Admin",
      },
    ]);

    await logAdminAction({
      action: "STOCK_ADJUSTMENT",
      targetType: "Inventory",
      targetId: productId,
      targetLabel: `${prod.title}: ${change > 0 ? "+" : ""}${change}`,
      module: "Inventory",
      details: { previousStock, newStock, reason },
    });

    return true;
  } catch (e) {
    console.error("Error adjusting inventory:", e);
  }
  return false;
}

export async function fetchAdminInventoryMovements() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("inventory_movements")
      .select("*, warehouse_products(title, sku)")
      .order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch {}
  return [];
}

/* ── 3. Orders, Order Details & Shipments ─────────────────── */
export async function fetchAdminOrderDetails(orderId) {
  if (!supabase || !orderId) return null;
  try {
    // Fetch order with items, shop and profile
    let query = supabase
      .from("orders")
      .select("*, order_items(*), shops(name, address, owner_name, owner_phone), profiles(full_name, email, phone)");

    if (isValidUuid(orderId)) {
      query = query.eq("id", orderId);
    } else {
      query = query.eq("order_number", orderId);
    }

    const { data, error } = await query.maybeSingle();
    if (!error && data) return data;
  } catch {}
  return null;
}

export async function updateAdminOrderStatus(orderId, nextStatus, note = "") {
  if (!supabase || !orderId) return false;
  try {
    const updatePayload = {
      order_status: nextStatus.toUpperCase(),
      status: nextStatus,
      updated_at: new Date().toISOString(),
    };

    let query = supabase.from("orders").update(updatePayload);
    if (isValidUuid(orderId)) {
      query = query.eq("id", orderId);
    } else {
      query = query.eq("order_number", orderId);
    }

    const { data, error } = await query.select().single();
    if (!error && data) {
      await logAdminAction({
        action: "STATUS_CHANGE",
        targetType: "Order",
        targetId: data.id,
        targetLabel: `Order #${data.order_number || data.id} -> ${nextStatus}`,
        module: "Orders",
        details: { status: nextStatus, note },
      });
      return true;
    }
  } catch (e) {
    console.error("Error updating order status:", e);
  }
  return false;
}

export async function updateAdminOrderShipment(orderId, trackingNumber, courierName = "Delhivery", eta = null) {
  if (!supabase || !orderId) return false;
  try {
    const payload = {
      tracking_number: trackingNumber,
      order_status: "SHIPPED",
      status: "Shipped",
      estimated_delivery: eta || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    let query = supabase.from("orders").update(payload);
    if (isValidUuid(orderId)) {
      query = query.eq("id", orderId);
    } else {
      query = query.eq("order_number", orderId);
    }

    const { data, error } = await query.select().single();
    if (!error && data) {
      await logAdminAction({
        action: "UPDATE_SHIPMENT",
        targetType: "Delivery",
        targetId: data.id,
        targetLabel: `Tracking ${trackingNumber} (${courierName})`,
        module: "Delivery",
      });
      return true;
    }
  } catch {}
  return false;
}

/* ── 4. Returns & Refunds Management ──────────────────────── */
export async function fetchAdminReturnsList() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("returns")
      .select("*, orders(order_number, total_amount), shops(name), profiles(full_name, email)")
      .order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function updateAdminReturnStatus(returnId, status, adminNotes = "") {
  if (!supabase || !returnId) return false;
  try {
    const { data, error } = await supabase
      .from("returns")
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", returnId)
      .select()
      .single();

    if (!error && data) {
      await logAdminAction({
        action: "RETURN_STATUS",
        targetType: "Return",
        targetId: returnId,
        targetLabel: `Return #${data.return_number || returnId} -> ${status}`,
        module: "Returns",
        details: { status, adminNotes },
      });
      return true;
    }
  } catch {}
  return false;
}

export async function fetchAdminRefundsList() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("refunds")
      .select("*, orders(order_number, total_amount), shops(name), profiles(full_name, email)")
      .order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function processAdminRefund(refundId, status = "Completed", gatewayRefundId = "") {
  if (!supabase || !refundId) return false;
  try {
    const { data, error } = await supabase
      .from("refunds")
      .update({
        status,
        gateway_refund_id: gatewayRefundId || `REF-TXN-${Date.now().toString(36).toUpperCase()}`,
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", refundId)
      .select()
      .single();

    if (!error && data) {
      await logAdminAction({
        action: "PROCESS_REFUND",
        targetType: "Refund",
        targetId: refundId,
        targetLabel: `Refund #${data.refund_number || refundId} (₹${data.amount})`,
        module: "Finance",
      });
      return true;
    }
  } catch {}
  return false;
}

/* ── 5. Finance, Transactions, Commission & Payouts ──────── */
export async function fetchAdminTransactionsList() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, orders(order_number), shops(name), profiles(full_name)")
      .order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function fetchAdminCommissionRules() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("commission_rules")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function saveAdminCommissionRule(ruleId, rate) {
  if (!supabase || !ruleId) return false;
  try {
    const { data, error } = await supabase
      .from("commission_rules")
      .update({ rate_percentage: Number(rate), updated_at: new Date().toISOString() })
      .eq("id", ruleId)
      .select()
      .single();

    if (!error && data) {
      await logAdminAction({
        action: "UPDATE_COMMISSION",
        targetType: "Commission",
        targetId: ruleId,
        targetLabel: `${data.scope_name}: ${rate}%`,
        module: "Finance",
      });
      return true;
    }
  } catch {}
  return false;
}

export async function fetchAdminWithdrawalsList() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("withdrawals")
      .select("*, shops(name, avatar_url), shop_owners(full_name, email, phone)")
      .order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function updateAdminWithdrawalStatus(withdrawalId, status, rejectionReason = "", transactionRef = "") {
  if (!supabase || !withdrawalId) return false;
  try {
    const payload = {
      status,
      rejection_reason: rejectionReason,
      transaction_ref: transactionRef || (status === "Completed" ? `TXN-PAYOUT-${Date.now().toString(36).toUpperCase()}` : null),
      processed_at: status === "Completed" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("withdrawals")
      .update(payload)
      .eq("id", withdrawalId)
      .select()
      .single();

    if (!error && data) {
      await logAdminAction({
        action: "PAYOUT_STATUS",
        targetType: "Withdrawal",
        targetId: withdrawalId,
        targetLabel: `Payout #${data.payout_number || withdrawalId} -> ${status}`,
        module: "Finance",
        details: { status, rejectionReason },
      });
      return true;
    }
  } catch {}
  return false;
}

/* ── 6. Marketing (Coupons, Banners, Campaigns, CMS) ─────── */
export async function saveAdminCoupon(couponData) {
  if (!supabase) return null;
  try {
    const isEdit = Boolean(couponData.id && isValidUuid(couponData.id));
    const payload = {
      code: couponData.code.trim().toUpperCase(),
      discount_type: couponData.type?.toUpperCase() || "FLAT",
      discount_value: Number(couponData.value) || 0,
      min_order_value: Number(couponData.minOrder) || 0,
      is_active: couponData.status === "Active" || couponData.is_active === true,
      valid_until: couponData.end ? new Date(couponData.end).toISOString() : null,
    };

    let response;
    if (isEdit) {
      response = await supabase
        .from("coupons")
        .update(payload)
        .eq("id", couponData.id)
        .select()
        .single();
    } else {
      response = await supabase.from("coupons").insert([payload]).select().single();
    }

    if (response.data) {
      await logAdminAction({
        action: isEdit ? "UPDATE" : "CREATE",
        targetType: "Coupon",
        targetId: response.data.id,
        targetLabel: response.data.code,
        module: "Marketing",
      });
      return response.data;
    }
  } catch (e) {
    console.error("Error saving coupon:", e);
  }
  return null;
}

export async function deleteAdminCoupon(couponId) {
  if (!supabase || !couponId) return false;
  try {
    const { error } = await supabase.from("coupons").delete().eq("id", couponId);
    if (!error) {
      await logAdminAction({
        action: "DELETE",
        targetType: "Coupon",
        targetId: couponId,
        module: "Marketing",
      });
      return true;
    }
  } catch {}
  return false;
}

export async function saveAdminBanner(bannerData) {
  if (!supabase) return null;
  try {
    const isEdit = Boolean(bannerData.id && isValidUuid(bannerData.id));
    const payload = {
      title: bannerData.title,
      subtitle: bannerData.subtitle || "",
      badge_text: bannerData.placement || bannerData.badge_text || "Special Offer",
      target_route: bannerData.target_route || "/shops",
      is_active: bannerData.status === "Active" || bannerData.is_active === true,
      sort_order: Number(bannerData.priority ?? bannerData.sort_order) || 0,
    };

    let response;
    if (isEdit) {
      response = await supabase
        .from("banners")
        .update(payload)
        .eq("id", bannerData.id)
        .select()
        .single();
    } else {
      response = await supabase.from("banners").insert([payload]).select().single();
    }

    if (response.data) {
      await logAdminAction({
        action: isEdit ? "UPDATE" : "CREATE",
        targetType: "Banner",
        targetId: response.data.id,
        targetLabel: response.data.title,
        module: "Marketing",
      });
      return response.data;
    }
  } catch {}
  return null;
}

export async function deleteAdminBanner(bannerId) {
  if (!supabase || !bannerId) return false;
  try {
    const { error } = await supabase.from("banners").delete().eq("id", bannerId);
    if (!error) {
      await logAdminAction({
        action: "DELETE",
        targetType: "Banner",
        targetId: bannerId,
        module: "Marketing",
      });
      return true;
    }
  } catch {}
  return false;
}

export async function fetchAdminCampaigns() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function saveAdminCampaign(campaignData) {
  if (!supabase) return null;
  try {
    const isEdit = Boolean(campaignData.id && isValidUuid(campaignData.id));
    const payload = {
      name: campaignData.name,
      audience: campaignData.audience || "All Customers",
      budget: Number(campaignData.budget) || 0,
      reach: Number(campaignData.reach) || 0,
      discount_percentage: Number(campaignData.discount_percentage) || null,
      status: campaignData.status || "Active",
      starts_at: campaignData.starts_at ? new Date(campaignData.starts_at).toISOString() : null,
      ends_at: campaignData.ends_at ? new Date(campaignData.ends_at).toISOString() : null,
    };

    let response;
    if (isEdit) {
      response = await supabase
        .from("campaigns")
        .update(payload)
        .eq("id", campaignData.id)
        .select()
        .single();
    } else {
      response = await supabase.from("campaigns").insert([payload]).select().single();
    }

    if (response.data) {
      await logAdminAction({
        action: isEdit ? "UPDATE" : "CREATE",
        targetType: "Campaign",
        targetId: response.data.id,
        targetLabel: response.data.name,
        module: "Marketing",
      });
      return response.data;
    }
  } catch {}
  return null;
}

export async function fetchAdminHomepageSections() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("homepage_sections")
      .select("*")
      .order("priority", { ascending: true });
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function updateAdminHomepageSection(sectionId, updates) {
  if (!supabase || !sectionId) return false;
  try {
    const { data, error } = await supabase
      .from("homepage_sections")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", sectionId)
      .select()
      .single();

    if (!error && data) {
      await logAdminAction({
        action: "UPDATE_CMS",
        targetType: "HomepageSection",
        targetId: sectionId,
        targetLabel: data.name,
        module: "Marketing",
      });
      return true;
    }
  } catch {}
  return false;
}

/* ── 7. Support Tickets & Thread Messages ─────────────────── */
export async function fetchAdminSupportTicketDetails(ticketId) {
  if (!supabase || !ticketId) return null;
  try {
    let query = supabase
      .from("support_tickets")
      .select("*, support_messages(*), profiles(full_name, email, phone), shops(name)");

    if (isValidUuid(ticketId)) {
      query = query.eq("id", ticketId);
    } else {
      query = query.eq("ticket_number", ticketId);
    }

    const { data, error } = await query.maybeSingle();
    if (!error && data) return data;
  } catch {}
  return null;
}

export async function addAdminSupportMessage(ticketId, messageText, isInternal = false) {
  if (!supabase || !ticketId || !messageText.trim()) return null;
  try {
    const { data, error } = await supabase
      .from("support_messages")
      .insert([
        {
          ticket_id: ticketId,
          sender_type: "admin",
          sender_name: "SeroFast Support Lead",
          message: messageText.trim(),
          is_internal_note: isInternal,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      // Update ticket updated_at and status
      await supabase
        .from("support_tickets")
        .update({ status: isInternal ? undefined : "IN_PROGRESS", updated_at: new Date().toISOString() })
        .eq("id", ticketId);
      return data;
    }
  } catch {}
  return null;
}

export async function updateAdminTicketStatus(ticketId, status, assignedTo = null) {
  if (!supabase || !ticketId) return false;
  try {
    const payload = { status, updated_at: new Date().toISOString() };
    if (assignedTo) payload.assigned_to = assignedTo;

    const { data, error } = await supabase
      .from("support_tickets")
      .update(payload)
      .eq("id", ticketId)
      .select()
      .single();

    if (!error && data) {
      await logAdminAction({
        action: "TICKET_STATUS",
        targetType: "SupportTicket",
        targetId: ticketId,
        targetLabel: `Ticket #${data.ticket_number || ticketId} -> ${status}`,
        module: "Support",
      });
      return true;
    }
  } catch {}
  return false;
}

/* ── 8. Risk Alerts, Roles, Audit Logs & System Settings ──── */
export async function fetchAdminRiskAlerts() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("risk_alerts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function updateAdminRiskAlertStatus(alertId, status) {
  if (!supabase || !alertId) return false;
  try {
    const { data, error } = await supabase
      .from("risk_alerts")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", alertId)
      .select()
      .single();

    if (!error && data) {
      await logAdminAction({
        action: "RISK_ALERT_STATUS",
        targetType: "RiskAlert",
        targetId: alertId,
        targetLabel: `${data.type} -> ${status}`,
        module: "Risk",
      });
      return true;
    }
  } catch {}
  return false;
}

export async function fetchAdminRolesList() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function updateAdminRolePermissions(roleId, permissions) {
  if (!supabase || !roleId) return false;
  try {
    const { data, error } = await supabase
      .from("roles")
      .update({ permissions, updated_at: new Date().toISOString() })
      .eq("id", roleId)
      .select()
      .single();

    if (!error && data) {
      await logAdminAction({
        action: "UPDATE_ROLE_PERMISSIONS",
        targetType: "Role",
        targetId: roleId,
        targetLabel: data.name,
        module: "System",
      });
      return true;
    }
  } catch {}
  return false;
}

export async function fetchAdminAuditLogs() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function fetchAdminSystemSettings() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("system_settings")
      .select("*")
      .order("group_key", { ascending: true });
    if (!error && data) return data;
  } catch {}
  return [];
}

export async function saveAdminSystemSetting(settingKey, value) {
  if (!supabase || !settingKey) return false;
  try {
    const { data, error } = await supabase
      .from("system_settings")
      .update({ value: JSON.stringify(value), updated_at: new Date().toISOString() })
      .eq("setting_key", settingKey)
      .select()
      .single();

    if (!error && data) {
      await logAdminAction({
        action: "UPDATE_SETTING",
        targetType: "Settings",
        targetId: settingKey,
        targetLabel: `${data.label}: ${value}`,
        module: "System",
      });
      return true;
    }
  } catch {}
  return false;
}

export async function fetchAdminUsersList() {
  if (!supabase) return [];
  try {
    // Profiles where role is admin or staff
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "admin")
      .order("created_at", { ascending: false });
    if (!error && data?.length) return data;
  } catch {}
  return [];
}

/* ── 9. Real-time Subscription Utility ────────────────────── */
export function subscribeAdminRealtime(tableName, onEvent) {
  if (!supabase || !tableName) return () => {};
  try {
    const channelName = `realtime_admin_${tableName}_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
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
