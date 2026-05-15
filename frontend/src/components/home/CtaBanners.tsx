"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const BANNERS = [
  {
    tag: "LIMITED EDITION",
    line1: "UNMATCHED",
    line2: "CRAFTSMANSHIP",
    line2Color: "var(--color-accent)",
    desc: "Every stitch, every curve, and every material is chosen with obsession. Experience the pinnacle of footwear engineering.",
    cta: "Explore the Series",
    ctaBg: "var(--color-accent)",
    ctaHover: "var(--color-accent-hover)",
    ctaColor: "#fff",
    // White premium sneaker on marble — matches screenshot 2
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=90&fit=crop",
    tagColor: "var(--color-gold)",
    border: "rgba(255,255,255,0.07)",
    glow: "rgba(255,107,53,0.08)",
  },
  {
    tag: "FLASH DEAL",
    line1: "UP TO 41%",
    line2: "OFF TODAY",
    line2Color: "var(--color-gold)",
    desc: "Don't miss our biggest sale of the season. Premium footwear at prices that won't last. Shop before it's gone.",
    cta: "Grab the Deal",
    ctaBg: "var(--color-gold)",
    ctaHover: "var(--color-gold-hover)",
    ctaColor: "#111",
    // Bold colorful sneaker
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=90&fit=crop",
    tagColor: "var(--color-accent)",
    border: "rgba(255,255,255,0.07)",
    glow: "rgba(200,169,107,0.08)",
  },
];

export default function CtaBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-5">
        {BANNERS.map((b, i) => (
          <motion.div
            key={b.line2}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl flex flex-col sm:flex-row items-center cursor-pointer"
            style={{
              backgroundColor: "#141414",
              border: `1px solid ${b.border}`,
              minHeight: "200px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,107,53,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = b.border;
            }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 80% 50%, ${b.glow}, transparent 60%)`,
              }}
            />

            {/* LEFT — Text */}
            <div className="relative z-10 flex-1 px-8 sm:px-12 py-10 sm:py-12">
              {/* Tag */}
              <p
                className="text-[11px] font-black uppercase tracking-[0.25em] mb-4"
                style={{ color: b.tagColor }}
              >
                {b.tag}
              </p>

              {/* Headline */}
              <h3
                className="font-black leading-[0.95] tracking-tight mb-4"
                style={{ fontSize: "clamp(28px, 3.5vw, 52px)" }}
              >
                <span className="block" style={{ color: "#ffffff" }}>
                  {b.line1}
                </span>
                <span className="block italic" style={{ color: b.line2Color }}>
                  {b.line2}
                </span>
              </h3>

              <p
                className="text-sm leading-relaxed mb-8 max-w-xs"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {b.desc}
              </p>

              {/* CTA */}
              <button
                className="group/btn inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold transition-all duration-300 active:scale-95"
                style={{
                  backgroundColor: b.ctaBg,
                  color: b.ctaColor,
                  boxShadow:
                    b.ctaBg === "var(--color-accent)"
                      ? "0 0 30px rgba(255,107,53,0.35)"
                      : "0 0 30px rgba(200,169,107,0.25)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = b.ctaHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = b.ctaBg)}
              >
                {b.cta}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>

            {/* RIGHT — Image */}
            <div
              className="relative shrink-0 w-full sm:w-[340px] lg:w-[420px]"
              style={{ height: "240px" }}
            >
              <Image
                src={b.image}
                alt={b.line2}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 420px"
              />
              {/* Fade left edge into card bg */}
              <div
                className="absolute inset-y-0 left-0 w-24 pointer-events-none"
                style={{
                  background: "linear-gradient(to right, #141414, transparent)",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
