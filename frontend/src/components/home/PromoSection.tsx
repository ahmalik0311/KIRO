"use client";

import { motion } from "framer-motion";
import { ArrowRight, Tag, Zap } from "lucide-react";
import Image from "next/image";

const PROMOS = [
  {
    tag: "Limited Time",
    tagColor: "var(--color-accent)",
    tagBg: "var(--color-accent-dim)",
    title: "Cloud Foam\nCollection",
    desc: "Ultra-light comfort for all-day wear. Up to 41% off on selected styles.",
    cta: "Shop Now",
    ctaStyle: { backgroundColor: "var(--color-accent)", color: "#fff" },
    ctaHover: "var(--color-accent-hover)",
    bg: "var(--color-card)",
    border: "var(--color-border)",
    accentLine: "var(--color-accent)",
    image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/6_3_copy.webp?v=1750914200",
    icon: Zap,
  },
  {
    tag: "Premium",
    tagColor: "var(--color-gold)",
    tagBg: "var(--color-gold-dim)",
    title: "Signature\nEdition",
    desc: "Handcrafted premium footwear for those who demand the best.",
    cta: "Explore",
    ctaStyle: { backgroundColor: "var(--color-gold)", color: "#111" },
    ctaHover: "var(--color-gold-hover)",
    bg: "var(--color-card)",
    border: "var(--color-border)",
    accentLine: "var(--color-gold)",
    image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/4_3_copy.webp?v=1750914310",
    icon: Tag,
  },
];

export default function PromoSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-accent)" }}>
            Special Offers
          </p>
          <h2 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>
            Deals You Can&apos;t Miss
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROMOS.map((promo) => {
          const Icon = promo.icon;
          return (
            <motion.div
              key={promo.title}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative overflow-hidden rounded-2xl border p-8 flex gap-6 items-center cursor-pointer group"
              style={{
                backgroundColor: promo.bg,
                borderColor: promo.border,
              }}
            >
              {/* Accent line */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ backgroundColor: promo.accentLine }}
              />

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                  style={{ backgroundColor: promo.tagBg, color: promo.tagColor }}
                >
                  <Icon className="w-3 h-3" />
                  {promo.tag}
                </div>
                <h3
                  className="text-2xl font-black leading-tight mb-3 whitespace-pre-line"
                  style={{ color: "var(--color-text)" }}
                >
                  {promo.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-text-muted)" }}>
                  {promo.desc}
                </p>
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                  style={promo.ctaStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = promo.ctaHover)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = (promo.ctaStyle as { backgroundColor: string }).backgroundColor)
                  }
                >
                  {promo.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Image */}
              <div className="relative w-32 h-32 shrink-0">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
