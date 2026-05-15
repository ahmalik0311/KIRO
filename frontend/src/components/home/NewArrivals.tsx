"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/Toast";
import { Product } from "@/types/product";

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // Last 5 products as "new arrivals"
  const newProducts = [...products].reverse().slice(0, 5);

  if (newProducts.length === 0) return null;

  const [featured, ...rest] = newProducts;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-gold)" }}>
            Just Dropped
          </p>
          <h2 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>
            New Arrivals
          </h2>
        </div>
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1 text-sm font-bold transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Featured large card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 relative rounded-2xl border overflow-hidden group cursor-pointer"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
            minHeight: "420px",
          }}
        >
          {/* NEW badge */}
          <div
            className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-black"
            style={{ backgroundColor: "var(--color-gold)", color: "#111" }}
          >
            NEW
          </div>

          <Link href={`/product/${featured.productId}`} className="block relative h-64 overflow-hidden">
            <Image
              src={featured.images[0]?.src || "/placeholder.png"}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>

          <div className="p-6">
            <p className="text-xs font-bold mb-1" style={{ color: "var(--color-gold)" }}>
              {featured.vendor}
            </p>
            <Link href={`/product/${featured.productId}`}>
              <h3
                className="text-xl font-black mb-2 transition-colors"
                style={{ color: "var(--color-text)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text)")}
              >
                {featured.title}
              </h3>
            </Link>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xl font-black" style={{ color: "var(--color-accent)" }}>
                Rs. {parseFloat(featured.variants[0]?.price || "0").toLocaleString()}
              </span>
              <button
                onClick={() => {
                  addToCart(featured);
                  showToast(`${featured.title} added to cart`, "success");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
              >
                <ShoppingCart className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </motion.div>

        {/* Small cards grid */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
          {rest.map((product, i) => {
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
                {/* NEW badge */}
                <div
                  className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-[10px] font-black"
                  style={{ backgroundColor: "var(--color-gold)", color: "#111" }}
                >
                  NEW
                </div>

                {discount > 0 && (
                  <div
                    className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full text-[10px] font-black"
                    style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                  >
                    -{discount}%
                  </div>
                )}

                {/* Image */}
                <Link href={`/product/${product.productId}`} className="block relative aspect-square overflow-hidden">
                  <Image
                    src={product.images[0]?.src || "/placeholder.png"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                  >
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                      style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </div>
                  </div>
                </Link>

                <div className="p-3">
                  <p
                    className="text-xs font-bold line-clamp-1 mb-1"
                    style={{ color: "var(--color-text)" }}
                  >
                    {product.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black" style={{ color: "var(--color-accent)" }}>
                      Rs. {price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => {
                        addToCart(product);
                        showToast(`${product.title} added to cart`, "success");
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
                      style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
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
