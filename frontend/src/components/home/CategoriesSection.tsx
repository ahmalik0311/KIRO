"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const CATEGORIES = [
  {
    name: "Running",
    count: "120+ styles",
    image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/6_3_copy.webp?v=1750914200",
    accent: "var(--color-accent)",
    bg: "var(--color-accent-dim)",
  },
  {
    name: "Casual",
    count: "200+ styles",
    image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/4_3_copy.webp?v=1750914310",
    accent: "var(--color-gold)",
    bg: "var(--color-gold-dim)",
  },
  {
    name: "Formal",
    count: "80+ styles",
    image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/11_3_copy.webp?v=1750914263",
    accent: "var(--color-accent)",
    bg: "var(--color-accent-dim)",
  },
  {
    name: "Sports",
    count: "150+ styles",
    image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/6_4_copy.webp?v=1750914200",
    accent: "var(--color-gold)",
    bg: "var(--color-gold-dim)",
  },
  {
    name: "Sneakers",
    count: "300+ styles",
    image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/4_4_copy.webp?v=1750914310",
    accent: "var(--color-accent)",
    bg: "var(--color-accent-dim)",
  },
];

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--color-accent)" }}
          >
            Browse By
          </p>
          <h2 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>
            Shop by Category
          </h2>
        </div>
        <button
          className="hidden sm:flex items-center gap-1 text-sm font-bold transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          View All →
        </button>
      </div>

      {/* Grid — first card is large, rest are small */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ gridTemplateRows: "auto" }}>
        {/* Large card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl border cursor-pointer group"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
            minHeight: "320px",
          }}
        >
          <Image
            src={CATEGORIES[0].image}
            alt={CATEGORIES[0].name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(17,17,17,0.95) 0%, rgba(17,17,17,0.3) 60%, transparent 100%)",
            }}
          />
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{
                backgroundColor: CATEGORIES[0].bg,
                color: CATEGORIES[0].accent,
              }}
            >
              {CATEGORIES[0].count}
            </div>
            <h3 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>
              {CATEGORIES[0].name}
            </h3>
            <p
              className="text-sm mt-1 font-medium flex items-center gap-1 transition-colors"
              style={{ color: CATEGORIES[0].accent }}
            >
              Shop Now →
            </p>
          </div>
        </motion.div>

        {/* Small cards */}
        {CATEGORIES.slice(1).map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.03 }}
            className="relative overflow-hidden rounded-2xl border cursor-pointer group"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              minHeight: "150px",
            }}
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-50"
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(17,17,17,0.95) 0%, rgba(17,17,17,0.2) 100%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-xs font-bold mb-0.5" style={{ color: cat.accent }}>
                {cat.count}
              </p>
              <h3 className="text-lg font-black" style={{ color: "var(--color-text)" }}>
                {cat.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
