"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

/* ─────────────────────────────────────────────
   Banner data
   bg        → card background colour
   tagColor  → small label colour
   img       → Unsplash shoe photo
───────────────────────────────────────────── */
const TOP_BANNERS = [
  {
    tag: "BEST QUALITY",
    headline: "WALK WITH\nASSURANCE!",
    sub: "On orders $100+\nUse Coupon Code: JUTAY10",
    cta: "Shop Now",
    bg: "#1a6b5a",           // deep teal (like screenshot left card)
    tagColor: "#f0c040",
    ctaBg: "var(--color-accent)",
    ctaColor: "#fff",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85&fit=crop",
    imgPosition: "object-right-bottom",
  },
  {
    tag: "SPECIAL EDITION",
    headline: "FASHIONABLY\nSTEPPING AHEAD!",
    sub: "Consequat interdum varius sit amet mattis vulputate enim nulla aliquet. Viverra nam libero justo laoreet.",
    cta: "Shop Collections",
    bg: "#2d4a7a",           // steel blue (like screenshot right card)
    tagColor: "#f0c040",
    ctaBg: "var(--color-accent)",
    ctaColor: "#fff",
    img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=700&q=85&fit=crop",
    imgPosition: "object-right",
  },
];

const WIDE_BANNER = {
  tag: "CLASSY COLLECTION",
  headline: "ONE STYLISH STRIDE\nAT A TIME!",
  sub: "Dignissim sodales ut eu sem integer vitae justo eget magna. Mattis aliquam faucibus purus in massa tempor nec feugiat.",
  cta: "Shop Collections",
  bg: "#2d4a7a",             // same steel blue for the wide card
  tagColor: "#f0c040",
  ctaBg: "var(--color-accent)",
  ctaColor: "#fff",
  img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=85&fit=crop",
};

/* ─────────────────────────────────────────────
   Reusable small banner card
───────────────────────────────────────────── */
function SmallBanner({
  tag, headline, sub, cta,
  bg, tagColor, ctaBg, ctaColor,
  img, imgPosition, delay,
}: typeof TOP_BANNERS[0] & { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl flex items-stretch group"
      style={{ backgroundColor: bg, minHeight: "200px" }}
    >
      {/* Left — text */}
      <div className="relative z-10 flex flex-col justify-center px-7 py-8 flex-1 min-w-0">
        <p
          className="text-[10px] font-black uppercase tracking-[0.2em] mb-3"
          style={{ color: tagColor }}
        >
          {tag}
        </p>
        <h3
          className="font-black leading-tight mb-3 whitespace-pre-line"
          style={{
            color: "#fff",
            fontSize: "clamp(18px, 2vw, 26px)",
            letterSpacing: "-0.01em",
          }}
        >
          {headline}
        </h3>
        <p
          className="text-xs leading-relaxed mb-6 whitespace-pre-line max-w-[200px]"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          {sub}
        </p>
        <button
          className="self-start flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
          style={{ backgroundColor: ctaBg, color: ctaColor }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {cta} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right — shoe image bleeding to edge */}
      <div className="relative w-[45%] shrink-0 overflow-hidden">
        <Image
          src={img}
          alt={headline}
          fill
          className={`${imgPosition} object-cover transition-transform duration-700 group-hover:scale-105`}
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {/* Left fade */}
        <div
          className="absolute inset-y-0 left-0 w-16 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${bg}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export default function PromoBanners() {
  return (
    <section style={{ padding: "40px 30px" }}>
      <div className="flex flex-col gap-4">

        {/* Row 1 — two equal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOP_BANNERS.map((b, i) => (
            <SmallBanner key={b.tag} {...b} delay={i * 0.1} />
          ))}
        </div>

        {/* Row 2 — one full-width card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="relative overflow-hidden rounded-2xl flex items-stretch group"
          style={{ backgroundColor: WIDE_BANNER.bg, minHeight: "220px" }}
        >
          {/* Left — text */}
          <div className="relative z-10 flex flex-col justify-center px-8 py-10 w-full sm:w-[45%] lg:w-[38%]">
            <p
              className="text-[10px] font-black uppercase tracking-[0.2em] mb-3"
              style={{ color: WIDE_BANNER.tagColor }}
            >
              {WIDE_BANNER.tag}
            </p>
            <h3
              className="font-black leading-tight mb-4 whitespace-pre-line"
              style={{
                color: "#fff",
                fontSize: "clamp(22px, 2.5vw, 36px)",
                letterSpacing: "-0.01em",
              }}
            >
              {WIDE_BANNER.headline}
            </h3>
            <p
              className="text-sm leading-relaxed mb-7 max-w-xs"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {WIDE_BANNER.sub}
            </p>
            <button
              className="self-start flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all active:scale-95"
              style={{ backgroundColor: WIDE_BANNER.ctaBg, color: WIDE_BANNER.ctaColor }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {WIDE_BANNER.cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right — large shoe image bleeding to edge */}
          <div className="absolute right-0 top-0 bottom-0 w-[60%] sm:w-[58%] lg:w-[62%] overflow-hidden">
            <Image
              src={WIDE_BANNER.img}
              alt={WIDE_BANNER.headline}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 62vw"
            />
            {/* Left fade into card bg */}
            <div
              className="absolute inset-y-0 left-0 w-32 pointer-events-none"
              style={{
                background: `linear-gradient(to right, ${WIDE_BANNER.bg} 0%, transparent 100%)`,
              }}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
