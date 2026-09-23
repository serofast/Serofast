import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  PackageCheck,
  MapPin,
  Clock,
  CheckCircle2,
  Search,
  Eye,
  RefreshCw,
  Edit2,
  X,
  Check,
  Save,
  Bell,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  fetchAdminDeliveries,
  updateDeliveryStatus,
  subscribeToRealtimeDeliveries,
  DELIVERY_STAGES,
} from "../../../../services/deliveryService";
import { Toast, StatusBadge, Card } from "../../shared/ui";

const TABS = [
  { id: "ALL", label: "All Deliveries" },
  { id: "ORDER_PLACED", label: "Needs Packing", icon: PackageCheck },
  { id: "PACKED", label: "Ready to Dispatch", icon: Truck },
  { id: "SHIPPED", label: "In Transit", icon: Truck },
  { id: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: MapPin },
  { id: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

const STATUS_OPTIONS = [
  { value: "ORDER_PLACED", label: "ORDER_PLACED (Needs Packing)", color: "text-amber-700 bg-amber-50" },
  { value: "PACKED", label: "PACKED (Packed in Box)", color: "text-blue-700 bg-blue-50" },
  { value: "SHIPPED", label: "SHIPPED (In Transit)", color: "text-indigo-700 bg-indigo-50" },
  { value: "OUT_FOR_DELIVERY", label: "OUT_FOR_DELIVERY (Out for Delivery)", color: "text-purple-700 bg-purple-50" },
  { value: "DELIVERED", label: "DELIVERED (Delivered)", color: "text-emerald-700 bg-emerald-50" },
  { value: "CANCELLED", label: "CANCELLED (Cancelled)", color: "text-rose-700 bg-rose-50" },
];

/**
 * Web Audio API synthesized order chime (no external audio assets required)
 */
function playOrderChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.1);
      osc.stop(ctx.currentTime + index * 0.1 + 0.4);
    });
  } catch (e) {
    console.warn("Audio chime notice:", e);
  }
}

export default function ShipmentsPage() {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [incomingOrderAlert, setIncomingOrderAlert] = useState(null);
  const initialLoadRef = useRef(true);
  const prevCountRef = useRef(0);

  // Status edit modal state
  const [editingItem, setEditingItem] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  async function loadData(isRealtimeUpdate = false) {
    try {
      const data = await fetchAdminDeliveries();
      const list = data || [];

      if (isRealtimeUpdate && !initialLoadRef.current) {
        if (list.length > prevCountRef.current) {
          const newest = list[0];
          if (newest) {
            setIncomingOrderAlert(newest);
            if (isAudioEnabled) playOrderChime();
          }
        }
      }

      setDeliveries(list);
      prevCountRef.current = list.length;
      initialLoadRef.current = false;
    } catch (e) {
      console.warn("Failed to load deliveries:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // ── Live Supabase WebSocket Subscription ──────────────────────────────
    const unsub = subscribeToRealtimeDeliveries(() => {
      loadData(true);
    });
    return () => unsub();
  }, [isAudioEnabled]);

  const counts = useMemo(() => {
    const map = { ALL: deliveries.length };
    deliveries.forEach((d) => {
      const st = d.status || "ORDER_PLACED";
      map[st] = (map[st] || 0) + 1;
    });
    return map;
  }, [deliveries]);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((item) => {
      const matchesTab = activeTab === "ALL" || item.status === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.order_number?.toLowerCase().includes(q) ||
        item.id?.toLowerCase().includes(q) ||
        item.tracking_number?.toLowerCase().includes(q) ||
        item.customer_name?.toLowerCase().includes(q) ||
        item.customer_phone?.toLowerCase().includes(q) ||
        item.shop_name?.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [deliveries, activeTab, searchQuery]);

  async function handleQuickAdvance(item, nextStatus) {
    setUpdatingId(item.order_id || item.id);
    try {
      const res = await updateDeliveryStatus({
        orderId: item.order_id || item.id,
        status: nextStatus,
        trackingNumber: item.tracking_number,
      });
      if (res.success) {
        setToast(`Order updated to ${nextStatus}. Saved in Supabase.`);
        loadData();
      } else {
        setToast("Failed to update status.");
      }
    } catch {
      setToast("Error updating stage.");
    } finally {
      setUpdatingId(null);
    }
  }

  function openStatusModal(item) {
    setEditingItem(item);
    setSelectedStatus(item.status || "ORDER_PLACED");
  }

  async function handleSaveStatusModal() {
    if (!editingItem || !selectedStatus) return;
    setSavingStatus(true);
    try {
      const res = await updateDeliveryStatus({
        orderId: editingItem.order_id || editingItem.id,
        status: selectedStatus,
        trackingNumber: editingItem.tracking_number,
      });

      if (res.success) {
        setToast(`Order #${editingItem.order_number || editingItem.id} status changed to ${selectedStatus}.`);
        setEditingItem(null);
        loadData();
      } else {
        setToast("Failed to update status in database.");
      }
    } catch (err) {
      setToast(`Error saving status: ${err.message}`);
    } finally {
      setSavingStatus(false);
    }
  }

  return (
    <div className="space-y-6 font-sans font-sansation max-w-[1400px] mx-auto pb-10">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Warehouse & Delivery Dispatch Hub
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10.5px] font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live WebSocket Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized admin warehouse fulfillment. Pack incoming orders, assign couriers, and edit delivery statuses in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsAudioEnabled(!isAudioEnabled);
              if (!isAudioEnabled) playOrderChime();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-[30px] border text-xs font-semibold transition shadow-2xs cursor-pointer ${
              isAudioEnabled
                ? "bg-red-50 border-red-200 text-brandRed hover:bg-red-100"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
            title="Toggle Live Audio Chime for Incoming Mobile App Orders"
          >
            {isAudioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{isAudioEnabled ? "Chime On" : "Chime Off"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[30px] border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-brandRed" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Incoming Mobile App Order Floating Alert Banner ─────────────── */}
      {incomingOrderAlert && (
        <div className="p-4 rounded-[22px] bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-xl flex items-center justify-between gap-4 animate-bounce-short">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Bell size={20} className="animate-wiggle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider bg-white text-brandRed px-2 py-0.5 rounded-md">
                  New Mobile Order!
                </span>
                <span className="text-xs font-bold font-mono">#{incomingOrderAlert.order_number || incomingOrderAlert.id}</span>
              </div>
              <p className="text-xs text-white/90 mt-0.5">
                Recipient: <strong>{incomingOrderAlert.customer_name}</strong> · Drop: {incomingOrderAlert.delivery_address} · Total: <strong>₹{incomingOrderAlert.total_amount}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                navigate(`/admin/delivery/${encodeURIComponent(incomingOrderAlert.order_id || incomingOrderAlert.id)}`);
                setIncomingOrderAlert(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white text-brandRed text-xs font-extrabold hover:bg-red-50 transition cursor-pointer shadow-xs"
            >
              Pack Now &rarr;
            </button>
            <button
              type="button"
              onClick={() => setIncomingOrderAlert(null)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── KPI Stat Strip ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="p-4 bg-white border border-[#E5E7EB] rounded-[20px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">To Pack</span>
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{counts.ORDER_PLACED || 0}</p>
          <span className="text-[10px] text-slate-400">Warehouse picking queue</span>
        </Card>

        <Card className="p-4 bg-white border border-[#E5E7EB] rounded-[20px]">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ready to Dispatch</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{counts.PACKED || 0}</p>
          <span className="text-[10px] text-slate-400">Packed in boxes</span>
        </Card>

        <Card className="p-4 bg-white border border-[#E5E7EB] rounded-[20px]">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">In Transit</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{counts.SHIPPED || 0}</p>
          <span className="text-[10px] text-slate-400">With courier / runner</span>
        </Card>

        <Card className="p-4 bg-white border border-[#E5E7EB] rounded-[20px]">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Out for Delivery</span>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">{counts.OUT_FOR_DELIVERY || 0}</p>
          <span className="text-[10px] text-slate-400">Near destination</span>
        </Card>

        <Card className="p-4 bg-white border border-[#E5E7EB] rounded-[20px] col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Delivered</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{counts.DELIVERED || 0}</p>
          <span className="text-[10px] text-slate-400">Fulfilled parcels</span>
        </Card>
      </div>

      {/* ── Filter Tabs & Search Bar ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {TABS.map((tab) => {
            const count = counts[tab.id] || 0;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? "bg-brandRed text-white shadow-xs"
                    : "bg-white text-slate-600 border border-[#E5E7EB] hover:bg-slate-50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order, AWB, customer..."
            className="w-full h-10 rounded-[30px] border border-[#E5E7EB] bg-white pl-9 pr-4 text-xs outline-none focus:border-brandRed"
          />
        </div>
      </div>

      {/* ── Deliveries Table ────────────────────────────────────────────── */}
      <Card className="overflow-hidden bg-white border border-[#E5E7EB] rounded-[24px] shadow-2xs">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">
            <RefreshCw size={24} className="animate-spin text-brandRed mx-auto mb-2" />
            Loading live orders from Supabase...
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Truck size={36} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No deliveries found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? "No parcels match your current search query."
                : "Incoming customer orders from public.orders will appear here automatically."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Delivery & Order</th>
                  <th className="py-3 px-4">Destination & Contact</th>
                  <th className="py-3 px-4">Shop / Merchant</th>
                  <th className="py-3 px-4">Courier & AWB</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDeliveries.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      {/* Order & Delivery Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{item.id}</span>
                          <span className="text-[11px] text-brandRed font-mono font-medium">
                            Order #{item.order_number || item.order_id?.slice(0, 8)}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </td>

                      {/* Customer & Address */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col max-w-[210px]">
                          <span className="font-bold text-slate-900 truncate">
                            {item.customer_name || "Hostel Resident"}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 truncate">
                            {item.customer_phone || "+91 99887 76655"}
                          </span>
                          <span className="text-[10.5px] text-slate-400 truncate mt-0.5" title={item.delivery_address}>
                            {item.delivery_address || "Main Campus Hostel"}
                          </span>
                        </div>
                      </td>

                      {/* Shop Name */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-700">{item.shop_name}</span>
                      </td>

                      {/* Courier & AWB */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-medium">{item.courier_name}</span>
                          <span className="text-[10.5px] font-mono text-slate-500">{item.tracking_number}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge value={item.status} />
                      </td>

                      {/* Action Icons: Edit Status & View Details */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openStatusModal(item)}
                            className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-brandRed hover:border-brandRed transition shadow-2xs cursor-pointer"
                            title="Edit Delivery Status"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/delivery/${encodeURIComponent(item.order_id || item.id)}`)
                            }
                            className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-brandRed hover:border-brandRed transition shadow-2xs cursor-pointer"
                            title="View Full Delivery Timeline"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── Edit Status Modal ───────────────────────────────────────────── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 size={16} className="text-brandRed" />
                <h3 className="text-sm font-bold text-slate-900">
                  Edit Delivery Status
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Select new stage for <strong className="text-slate-900">Order #{editingItem.order_number || editingItem.id}</strong>:
            </div>

            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    selectedStatus === opt.value
                      ? "border-brandRed bg-brandRed/5 text-brandRed font-bold"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${
                      opt.value === "ORDER_PLACED" ? "bg-amber-500" :
                      opt.value === "PACKED" ? "bg-blue-500" :
                      opt.value === "SHIPPED" ? "bg-indigo-500" :
                      opt.value === "OUT_FOR_DELIVERY" ? "bg-purple-500" :
                      opt.value === "DELIVERED" ? "bg-emerald-500" : "bg-rose-500"
                    }`} />
                    {opt.label}
                  </span>
                  {selectedStatus === opt.value && <Check size={14} className="text-brandRed" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingStatus}
                onClick={handleSaveStatusModal}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brandRed text-white text-xs font-bold hover:brightness-110 shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                <Save size={13} />
                {savingStatus ? "Saving to Supabase..." : "Save Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
