"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/Toast";
import { Product } from "@/types/product";

interface FlashSaleSectionProps {
  products: Product[];
}

// Countdown hook
function useCountdown(targetHours: number) {
  const getTarget = () => {
    const t = new Date();
    t.setHours(t.getHours() + targetHours, 0, 0, 0);
    return t.getTime();
  };

  const [target] = useState(getTarget);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black tabular-nums"
        style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider mt-1.5" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </span>
    </div>
  );
}

export default function FlashSaleSection({ products }: FlashSaleSectionProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { h, m, s } = useCountdown(8);

  // Use first 4 products for flash sale display
  const saleProducts = products.slice(0, 4);

  if (saleProducts.length === 0) return null;

  return (
    <section
      className="border-y"
      style={{
        backgroundColor: "var(--color-bg-soft)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--color-accent)" }}
              >
                Limited Time
              </p>
              <h2 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>
                Flash Sale
              </h2>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold" style={{ color: "var(--color-text-muted)" }}>
              Ends in:
            </span>
            <div className="flex items-end gap-2">
              <TimeBlock value={h} label="Hrs" />
              <span className="text-2xl font-black mb-3.5" style={{ color: "var(--color-accent)" }}>:</span>
              <TimeBlock value={m} label="Min" />
              <span className="text-2xl font-black mb-3.5" style={{ color: "var(--color-accent)" }}>:</span>
              <TimeBlock value={s} label="Sec" />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {saleProducts.map((product, i) => {
            const price = parseFloat(product.variants[0]?.price || "0");
            const compareAt = parseFloat(product.variants[0]?.compare_at_price || "0");
            const discount = compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;

            return (
              <motion.div
                key={product.productId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-2xl border overflow-hidden group"
                style={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                {/* Discount badge */}
                {discount > 0 && (
                  <div
                    className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-black"
                    style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                  >
                    -{discount}%
                  </div>
                )}

                {/* Flash badge */}
                <div
                  className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-accent-dim)" }}
                >
                  <Zap className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
                </div>

                {/* Image */}
                <Link href={`/product/${product.productId}`} className="block relative aspect-square overflow-hidden">
                  <Image
                    src={product.images[0]?.src || "/placeholder.png"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </Link>

                {/* Info */}
                <div className="p-4">
                  <Link href={`/product/${product.productId}`}>
                    <p
                      className="text-sm font-bold line-clamp-1 mb-1 transition-colors"
                      style={{ color: "var(--color-text)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                    >
                      {product.title}
                    </p>
                  </Link>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1" style={{ color: "var(--color-text-muted)" }}>
                      <span>Selling fast</span>
                      <span style={{ color: "var(--color-accent)" }}>72% sold</span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--color-border)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: "72%", backgroundColor: "var(--color-accent)" }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-base font-black" style={{ color: "var(--color-accent)" }}>
                        Rs. {price.toLocaleString()}
                      </span>
                      {compareAt > price && (
                        <span className="block text-xs line-through" style={{ color: "var(--color-text-faint)" }}>
                          Rs. {compareAt.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        addToCart(product);
                        showToast(`${product.title} added to cart`, "success");
                      }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
                      style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
