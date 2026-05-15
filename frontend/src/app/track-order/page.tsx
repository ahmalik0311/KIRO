"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, Truck, CheckCircle, Clock, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const MOCK_ORDERS: Record<string, {
  id: string; date: string; status: "processing" | "shipped" | "out_for_delivery" | "delivered";
  items: { name: string; qty: number; price: number }[];
  address: string; phone: string; total: number;
  timeline: { label: string; time: string; done: boolean }[];
}> = {
  "JT-123456": {
    id: "JT-123456", date: "May 14, 2026", status: "shipped",
    items: [{ name: "ADI ALL LOGO CLOUD FOAM - BLACK", qty: 1, price: 4999 }],
    address: "House 12, Street 5, Gulberg III, Lahore", phone: "+92 300 1234567", total: 4999,
    timeline: [
      { label: "Order Placed",       time: "May 14, 10:30 AM", done: true  },
      { label: "Order Confirmed",    time: "May 14, 11:00 AM", done: true  },
      { label: "Shipped",            time: "May 15, 09:00 AM", done: true  },
      { label: "Out for Delivery",   time: "Expected May 16",  done: false },
      { label: "Delivered",          time: "Expected May 16",  done: false },
    ],
  },
  "JT-654321": {
    id: "JT-654321", date: "May 10, 2026", status: "delivered",
    items: [{ name: "ADI ALL LOGO CLOUD FOAM - GREY", qty: 2, price: 4999 }],
    address: "Flat 3B, Block 7, Clifton, Karachi", phone: "+92 321 9876543", total: 9998,
    timeline: [
      { label: "Order Placed",     time: "May 10, 02:00 PM", done: true },
      { label: "Order Confirmed",  time: "May 10, 02:30 PM", done: true },
      { label: "Shipped",          time: "May 11, 10:00 AM", done: true },
      { label: "Out for Delivery", time: "May 12, 08:00 AM", done: true },
      { label: "Delivered",        time: "May 12, 03:45 PM", done: true },
    ],
  },
};

const STATUS_CONFIG = {
  processing:       { label: "Processing",       color: "var(--color-gold)",   icon: Clock,    step: 1 },
  shipped:          { label: "Shipped",           color: "#3b82f6",             icon: Truck,    step: 2 },
  out_for_delivery: { label: "Out for Delivery",  color: "var(--color-accent)", icon: MapPin,   step: 3 },
  delivered:        { label: "Delivered",         color: "#22c55e",             icon: CheckCircle, step: 4 },
};

export default function TrackOrderPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<typeof MOCK_ORDERS[string] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setNotFound(false); setOrder(null);
    await new Promise(r => setTimeout(r, 900));
    const found = MOCK_ORDERS[query.trim().toUpperCase()];
    if (found) setOrder(found); else setNotFound(true);
    setLoading(false);
  };

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>

        {/* Hero */}
        <div className="relative border-b overflow-hidden" style={{ backgroundColor: "var(--color-bg-soft)", borderColor: "var(--color-border)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 100% at 50% 0%, rgba(255,107,53,0.07), transparent 70%)" }} />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center relative">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "var(--color-accent-dim)", border: "1px solid var(--color-accent)" }}>
              <Package className="w-7 h-7" style={{ color: "var(--color-accent)" }} />
            </div>
            <h1 className="text-4xl font-black mb-3" style={{ color: "var(--color-text)" }}>Track Your Order</h1>
            <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
              Enter your order number to get real-time updates on your delivery.
            </p>

            {/* Search form */}
            <form onSubmit={search} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-faint)" }} />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Order number (e.g. JT-123456)"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-colors"
                  style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--color-border)")} />
              </div>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional)"
                className="sm:w-48 px-4 py-3.5 rounded-xl border text-sm outline-none transition-colors"
                style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--color-border)")} />
              <button type="submit" disabled={loading}
                className="px-6 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                style={{ backgroundColor: "var(--color-accent)", color: "#fff", boxShadow: "var(--shadow-accent)" }}>
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Search className="w-4 h-4" /> Track</>}
              </button>
            </form>
            <p className="text-xs mt-3" style={{ color: "var(--color-text-faint)" }}>Try: JT-123456 or JT-654321</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <AnimatePresence mode="wait">

            {/* Not found */}
            {notFound && (
              <motion.div key="nf" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 rounded-2xl border"
                style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                <Package className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--color-text-faint)" }} />
                <p className="text-lg font-black mb-2" style={{ color: "var(--color-text)" }}>Order Not Found</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Check your order number and try again, or{" "}
                  <a href="/contact" className="underline" style={{ color: "var(--color-accent)" }}>contact support</a>.
                </p>
              </motion.div>
            )}

            {/* Order found */}
            {order && (() => {
              const cfg = STATUS_CONFIG[order.status];
              const StatusIcon = cfg.icon;
              return (
                <motion.div key="found" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

                  {/* Status card */}
                  <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--color-text-faint)" }}>Order</p>
                        <p className="text-xl font-black" style={{ color: "var(--color-text)" }}>{order.id}</p>
                        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>Placed on {order.date}</p>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border"
                        style={{ backgroundColor: `color-mix(in srgb, ${cfg.color} 10%, transparent)`, borderColor: cfg.color }}>
                        <StatusIcon className="w-5 h-5" style={{ color: cfg.color }} />
                        <span className="font-black text-sm" style={{ color: cfg.color }}>{cfg.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                    <h3 className="font-black mb-6" style={{ color: "var(--color-text)" }}>Delivery Timeline</h3>
                    <div className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: "var(--color-border)" }} />
                      <div className="space-y-6">
                        {order.timeline.map((step, i) => (
                          <div key={i} className="flex items-start gap-5 relative">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2"
                              style={{
                                backgroundColor: step.done ? "var(--color-accent)" : "var(--color-bg)",
                                borderColor: step.done ? "var(--color-accent)" : "var(--color-border)",
                              }}>
                              {step.done
                                ? <CheckCircle className="w-4 h-4 text-white" />
                                : <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-border)" }} />}
                            </div>
                            <div className="pt-0.5">
                              <p className="text-sm font-bold" style={{ color: step.done ? "var(--color-text)" : "var(--color-text-faint)" }}>{step.label}</p>
                              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-faint)" }}>{step.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                      <h3 className="font-black text-sm mb-4" style={{ color: "var(--color-text)" }}>Order Items</h3>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm py-2 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
                          <span style={{ color: "var(--color-text-muted)" }}>{item.name} × {item.qty}</span>
                          <span className="font-bold" style={{ color: "var(--color-accent)" }}>Rs. {(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-black pt-3">
                        <span style={{ color: "var(--color-text)" }}>Total</span>
                        <span style={{ color: "var(--color-accent)" }}>Rs. {order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl border space-y-4" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                      <h3 className="font-black text-sm" style={{ color: "var(--color-text)" }}>Delivery Info</h3>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-accent)" }} />
                        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{order.address}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 shrink-0" style={{ color: "var(--color-accent)" }} />
                        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{order.phone}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
