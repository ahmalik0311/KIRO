"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col border-l"
            style={{
              backgroundColor: "var(--color-bg)",
              borderColor: "var(--color-border)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                <h2 className="text-lg font-black" style={{ color: "var(--color-text)" }}>
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-black"
                    style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-muted)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-accent)";
                      e.currentTarget.style.color = "var(--color-accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.color = "var(--color-text-muted)";
                    }}
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl transition-colors"
                  style={{ color: "var(--color-text-muted)" }}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-5">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-card)" }}
                  >
                    <ShoppingCart className="w-9 h-9" style={{ color: "var(--color-text-faint)" }} />
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: "var(--color-text)" }}>Cart is empty</p>
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                      Add some shoes to get started
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {cart.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 p-4 rounded-2xl border"
                      style={{
                        backgroundColor: "var(--color-card)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      {/* Image */}
                      <div
                        className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0"
                        style={{ backgroundColor: "var(--color-bg)" }}
                      >
                        <Image
                          src={item.images[0]?.src || "/placeholder.png"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.productId}`}
                          onClick={onClose}
                          className="text-sm font-bold line-clamp-2 leading-snug transition-colors"
                          style={{ color: "var(--color-text)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-faint)" }}>
                          {item.vendor}
                        </p>
                        <p className="text-sm font-black mt-1" style={{ color: "var(--color-accent)" }}>
                          Rs. {(parseFloat(item.variants[0].price) * item.quantity).toLocaleString()}
                        </p>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors"
                            style={{
                              borderColor: "var(--color-border)",
                              color: "var(--color-text-muted)",
                            }}
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-5 text-center" style={{ color: "var(--color-text)" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors"
                            style={{
                              borderColor: "var(--color-border)",
                              color: "var(--color-text-muted)",
                            }}
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="ml-auto p-1.5 rounded-lg transition-colors"
                            style={{ color: "var(--color-text-faint)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-faint)")}
                            aria-label="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div
                className="px-6 py-5 border-t space-y-4"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between" style={{ color: "var(--color-text-muted)" }}>
                    <span>Subtotal ({totalItems} items)</span>
                    <span style={{ color: "var(--color-text)" }}>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between" style={{ color: "var(--color-text-muted)" }}>
                    <span>Shipping</span>
                    <span style={{ color: "#22c55e" }} className="font-bold">Free</span>
                  </div>
                  <div
                    className="flex justify-between font-black text-base pt-3 border-t"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <span style={{ color: "var(--color-text)" }}>Total</span>
                    <span style={{ color: "var(--color-accent)" }}>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-base transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "#fff",
                    boxShadow: "var(--shadow-accent)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
                >
                  Checkout <ArrowRight className="w-5 h-5" />
                </Link>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-sm transition-colors"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
