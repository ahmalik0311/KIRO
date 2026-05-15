"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  onShopNow: () => void;
}

const SLIDES = [
  {
    badge: "NEW COLLECTION 2026",
    line1: "STEP INTO THE",
    line2: "FUTURE",
    line2Color: "var(--color-accent)",
    sub: "Experience unparalleled comfort and futuristic design. Our latest drop combines performance technology with street-ready aesthetics.",
    cta: "Shop Now",
    // Dark dramatic running shoe on black bg — matches screenshot perfectly
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=90&fit=crop",
    bgWord: "FUTURE",
    accentGlow: "rgba(255,107,53,0.18)",
  },
  {
    badge: "PREMIUM SERIES",
    line1: "BORN FOR",
    line2: "THE STREETS",
    line2Color: "var(--color-gold)",
    sub: "Crafted for those who move fast and look sharp. Every detail engineered for performance and style.",
    cta: "Explore Now",
    // Bold orange/black sneaker
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=90&fit=crop",
    bgWord: "STREETS",
    accentGlow: "rgba(200,169,107,0.15)",
  },
  {
    badge: "CLOUD FOAM SERIES",
    line1: "FEEL THE",
    line2: "DIFFERENCE",
    line2Color: "var(--color-accent)",
    sub: "Ultra-lightweight Cloud Foam technology delivers all-day comfort without compromising on style.",
    cta: "Shop Collection",
    // White clean sneaker
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=90&fit=crop",
    bgWord: "COMFORT",
    accentGlow: "rgba(255,107,53,0.12)",
  },
];

export default function HeroSection({ onShopNow }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const t = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(t);
  }, [isHovered]);

  const go = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };
  const prev = () => go((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => go((current + 1) % SLIDES.length);

  const slide = SLIDES[current];

  const textVariants = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 30 : -30 }),
    center: { opacity: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -30 : 30 }),
  };

  const imgVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80, rotate: d > 0 ? 20 : -20 }),
    center: { opacity: 1, x: 0, rotate: 12 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80, rotate: d > 0 ? -20 : 20 }),
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0a0a0a", minHeight: "90vh" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Animated background glow ── */}
      <motion.div
        key={`glow-${current}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${slide.accentGlow} 0%, transparent 70%)`,
          transform: "translate(20%, 20%)",
        }}
      />

      {/* ── Giant background word ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bgword-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none overflow-hidden"
        >
          <span
            className="font-black uppercase leading-none"
            style={{
              fontSize: "clamp(80px, 14vw, 200px)",
              color: "rgba(255,255,255,0.03)",
              letterSpacing: "-0.02em",
            }}
          >
            {slide.bgWord}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* ── Main content ── */}
      <div
        className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-0"
        style={{ minHeight: "90vh" }}
      >
        {/* LEFT — Text */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`text-${current}`}
            custom={direction}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="py-20 lg:py-0 z-10"
          >
            {/* Badge */}
            <div
              className="inline-flex items-center px-3 py-1 rounded text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border"
              style={{
                borderColor: "var(--color-accent)",
                color: "var(--color-accent)",
                backgroundColor: "transparent",
              }}
            >
              {slide.badge}
            </div>

            {/* Headline */}
            <h1
              className="font-black leading-[0.95] tracking-tight mb-6"
              style={{ fontSize: "clamp(42px, 6vw, 88px)" }}
            >
              <span className="block" style={{ color: "#ffffff" }}>
                {slide.line1}
              </span>
              <span
                className="block italic"
                style={{ color: slide.line2Color }}
              >
                {slide.line2}
              </span>
            </h1>

            <p
              className="text-sm sm:text-base leading-relaxed mb-10 max-w-sm"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {slide.sub}
            </p>

            {/* CTA */}
            <button
              onClick={onShopNow}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 active:scale-95"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#fff",
                boxShadow: "0 0 40px rgba(255,107,53,0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-accent-hover)";
                e.currentTarget.style.boxShadow = "0 0 60px rgba(255,107,53,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
                e.currentTarget.style.boxShadow = "0 0 40px rgba(255,107,53,0.4)";
              }}
            >
              {slide.cta}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Stats */}
            <div className="flex gap-8 mt-14">
              {[
                { value: "500+", label: "Styles" },
                { value: "50K+", label: "Customers" },
                { value: "4.9★", label: "Rating" },
              ].map((s, i) => (
                <div key={s.label}>
                  {i > 0 && (
                    <div
                      className="absolute h-8 w-px -left-4 top-1/2 -translate-y-1/2"
                      style={{ backgroundColor: "var(--color-border)" }}
                    />
                  )}
                  <p
                    className="text-xl font-black"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* RIGHT — Shoe image (tilted card like screenshot) */}
        <div className="relative flex items-center justify-center lg:justify-end py-10 lg:py-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`img-${current}`}
              custom={direction}
              variants={imgVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
              style={{ transform: "rotate(12deg)" }}
            >
              {/* Card container — tilted like screenshot */}
              <div
                className="relative overflow-hidden rounded-3xl shadow-2xl"
                style={{
                  width: "clamp(280px, 38vw, 520px)",
                  height: "clamp(280px, 38vw, 520px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 80px ${slide.accentGlow}`,
                }}
              >
                <Image
                  src={slide.image}
                  alt="Featured shoe"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 80vw, 40vw"
                />
                {/* Inner glow overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 70% 70%, ${slide.accentGlow}, transparent 60%)`,
                  }}
                />
              </div>

              {/* Glow behind card */}
              <div
                className="absolute inset-0 rounded-3xl -z-10 blur-3xl scale-90"
                style={{ backgroundColor: slide.accentGlow }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Slide controls ── */}
      <div className="absolute bottom-8 left-6 sm:left-12 flex items-center gap-5 z-20">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full border flex items-center justify-center transition-all"
          style={{
            borderColor: "rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.5)",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-accent)";
            e.currentTarget.style.color = "var(--color-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          }}
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? "28px" : "8px",
                height: "8px",
                backgroundColor:
                  i === current ? "var(--color-accent)" : "rgba(255,255,255,0.2)",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-9 h-9 rounded-full border flex items-center justify-center transition-all"
          style={{
            borderColor: "rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.5)",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-accent)";
            e.currentTarget.style.color = "var(--color-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          }}
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Slide counter */}
        <span
          className="text-xs font-bold tabular-nums ml-2"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Progress bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        <motion.div
          key={current}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5.5, ease: "linear" }}
          className="h-full"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
      </div>
    </section>
  );
}
