import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  X,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  ShieldCheck,
  Package,
  Sparkles,
} from "lucide-react";
import { placeCustomerOrder } from "../../services/checkoutService";

const DEFAULT_SAMPLE_ITEMS = [
  {
    title: "Oversized Vintage Campus Hoodie",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400",
    price: 1249,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Charcoal Black", "Forest Green", "Heather Grey"],
  },
  {
    title: "Campus Varsity Bomber Jacket",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    price: 2449,
    sizes: ["M", "L", "XL"],
    colors: ["Crimson Red", "Navy Blue"],
  },
  {
    title: "Heavyweight Cotton Essential Tee",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400",
    price: 899,
    sizes: ["S", "M", "L"],
    colors: ["Off-White", "Washed Olive"],
  },
];

export default function FastCheckoutModal({ isOpen, onClose, initialItem }) {
  const navigate = useNavigate();
  const selectedItem = initialItem || DEFAULT_SAMPLE_ITEMS[0];

  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState(selectedItem.colors?.[0] || "Charcoal Black");
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [hostelAddress, setHostelAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [placing, setPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  const itemPrice = Number(selectedItem.price || 1249);
  const subtotal = itemPrice * quantity;
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim() || !customerPhone.trim() || !hostelAddress.trim()) {
      setErrorMsg("Please fill in your name, phone number, and hostel room address.");
      return;
    }

    setPlacing(true);
    try {
      const res = await placeCustomerOrder({
        customerName,
        customerPhone,
        hostelAddress,
        paymentMethod,
        items: [
          {
            title: selectedItem.title,
            image: selectedItem.image,
            price: itemPrice,
            quantity,
            size: selectedSize,
            color: selectedColor,
          },
        ],
        deliveryFee,
      });

      if (res.success) {
        setPlacedOrder(res);
      } else {
        setErrorMsg(res.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      setErrorMsg(err.message || "An error occurred during checkout.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in font-sans font-sansation">
      <div className="w-full max-w-lg bg-white rounded-[28px] p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 max-h-[92vh] overflow-y-auto">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-brandRed" size={20} />
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                {placedOrder ? "Order Placed Successfully!" : "Fast Campus Checkout"}
              </h3>
              <span className="text-[11px] text-slate-400">
                {placedOrder ? "Dispatched to central warehouse" : "Same-day delivery to your hostel drop"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── If Order Successfully Placed ─────────────────────────────── */}
        {placedOrder ? (
          <div className="text-center py-6 space-y-4 animate-fade-in">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-brandRed block">
                #{placedOrder.orderNumber}
              </span>
              <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                Your Order is in the Warehouse Queue!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Our central warehouse team has received your order and is preparing to box it right now.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">AWB Tracking:</span>
                <span className="font-mono font-bold text-slate-900">{placedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deliver To:</span>
                <span className="font-semibold text-slate-900">{hostelAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="font-extrabold text-brandRed">₹{total} ({paymentMethod})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/track/${placedOrder.orderNumber}`);
              }}
              className="w-full h-12 rounded-xl bg-brandRed text-white text-xs font-bold hover:brightness-110 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Watch Live Real-Time Tracking</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          /* ── Checkout Form ───────────────────────────────────────────── */
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-brandRed font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Selected Product Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{selectedItem.title}</h4>
                  <span className="text-xs font-extrabold text-brandRed">₹{itemPrice}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 border border-slate-200 bg-white rounded-lg px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-slate-500 hover:text-slate-900 px-1 font-bold"
                >
                  -
                </button>
                <span className="font-bold text-xs">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-slate-500 hover:text-slate-900 px-1 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Size & Color Picker */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Size
                </label>
                <div className="flex gap-1.5">
                  {(selectedItem.sizes || ["S", "M", "L", "XL"]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`flex-1 h-9 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        selectedSize === sz
                          ? "border-brandRed bg-brandRed text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Color
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs font-medium outline-none focus:border-brandRed bg-white"
                >
                  {(selectedItem.colors || ["Charcoal Black", "Crimson Red", "Navy Blue"]).map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-10 pl-8 pr-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-brandRed"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Phone Number (For Delivery Call)
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98401 23456"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full h-10 pl-8 pr-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-brandRed"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Hostel Drop Location & Room No.
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hostel Block 4, Room 218, North Campus"
                    value={hostelAddress}
                    onChange={(e) => setHostelAddress(e.target.value)}
                    className="w-full h-10 pl-8 pr-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-brandRed"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Payment Option
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    paymentMethod === "UPI"
                      ? "border-brandRed bg-red-50/50 text-brandRed"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <CreditCard size={14} />
                  <span>UPI / Instant Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    paymentMethod === "COD"
                      ? "border-brandRed bg-red-50/50 text-brandRed"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Banknote size={14} />
                  <span>Cash on Delivery</span>
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 text-xs space-y-1.5 border border-slate-200/60">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Campus Express Delivery:</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-1.5 mt-1">
                <span>Total Amount:</span>
                <span className="text-brandRed">₹{total}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={placing}
              className="w-full h-12 rounded-xl bg-brandRed text-white text-xs font-bold hover:brightness-110 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {placing ? (
                "Placing Campus Order in Database..."
              ) : (
                <>
                  <span>Place Order · ₹{total}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
