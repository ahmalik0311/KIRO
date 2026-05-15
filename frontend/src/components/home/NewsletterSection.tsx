"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles, Tag, Zap, Bell } from "lucide-react";
import Image from "next/image";

const PERKS = [
  { icon: Zap,      text: "Flash sale alerts before anyone else" },
  { icon: Tag,      text: "Exclusive 20% off your first order"   },
  { icon: Sparkles, text: "New arrivals dropped to your inbox"   },
];

export default function NewsletterSection() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");
  const [focused,   setFocused]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section style={{ padding: "0 30px 56px" }}>
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{ backgroundColor: "#0d0d0d", border: "1px solid #1f1f1f" }}
      >

        {/* ── Background: accent glow left, gold glow right ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 80% at 0% 50%, rgba(255,107,53,0.12) 0%, transparent 70%), " +
              "radial-gradient(ellipse 45% 70% at 100% 50%, rgba(200,169,107,0.10) 0%, transparent 70%)",
          }}
        />

        {/* ── Decorative grid lines ── */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* ── Floating accent orbs ── */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 300, height: 300,
            backgroundColor: "var(--color-accent)",
            filter: "blur(90px)",
            top: "-80px", left: "-80px",
            opacity: 0.15,
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 260, height: 260,
            backgroundColor: "var(--color-gold)",
            filter: "blur(80px)",
            bottom: "-60px", right: "-60px",
            opacity: 0.1,
          }}
        />

        {/* ── Main grid ── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[360px]">

          {/* ════════════════════════════
              LEFT — Text + Form
          ════════════════════════════ */}
          <div className="flex flex-col justify-center px-8 sm:px-12 py-14">

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit mb-6"
              style={{
                borderColor: "var(--color-accent)",
                backgroundColor: "var(--color-accent-dim)",
                color: "var(--color-accent)",
              }}
            >
              <Bell className="w-3 h-3" />
              <span className="text-[11px] font-black uppercase tracking-widest">
                Stay in the Loop
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-black leading-[1.0] tracking-tight mb-4"
              style={{ fontSize: "clamp(32px, 4vw, 56px)", color: "#fff" }}
            >
              GET EXCLUSIVE
              <br />
              <span style={{ color: "var(--color-accent)" }}>DEALS</span>
              {" & "}
              <span style={{ color: "var(--color-gold)" }}>OFFERS</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm leading-relaxed mb-8 max-w-sm"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Join 50,000+ sneaker lovers. Be the first to know about flash sales,
              new drops, and members-only discounts.
            </motion.p>

            {/* Perks */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex flex-col gap-2.5 mb-8"
            >
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--color-accent-dim)" }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
                  </div>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Form */}
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl border w-fit"
                  style={{
                    backgroundColor: "rgba(34,197,94,0.08)",
                    borderColor: "rgba(34,197,94,0.3)",
                  }}
                >
                  <CheckCircle className="w-5 h-5 shrink-0" style={{ color: "#22c55e" }} />
                  <div>
                    <p className="text-sm font-bold text-white">You&apos;re subscribed!</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Check your inbox for your 20% discount code.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col sm:flex-row gap-3 max-w-md"
                >
                  <div className="flex-1">
                    <div
                      className="flex items-center gap-2 rounded-xl px-4 py-3 border transition-all"
                      style={{
                        backgroundColor: "#1a1a1a",
                        borderColor: focused
                          ? "var(--color-accent)"
                          : error
                          ? "rgba(255,107,53,0.5)"
                          : "#2a2a2a",
                        boxShadow: focused
                          ? "0 0 0 3px var(--color-accent-dim)"
                          : "none",
                      }}
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="your@email.com"
                        className="bg-transparent text-sm outline-none w-full"
                        style={{ color: "#fff" }}
                      />
                    </div>
                    {error && (
                      <p className="text-xs mt-1.5 ml-1" style={{ color: "var(--color-accent)" }}>
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all active:scale-95 whitespace-nowrap group"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "#fff",
                      boxShadow: "0 0 30px rgba(255,107,53,0.35)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--color-accent-hover)";
                      e.currentTarget.style.boxShadow = "0 0 45px rgba(255,107,53,0.55)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--color-accent)";
                      e.currentTarget.style.boxShadow = "0 0 30px rgba(255,107,53,0.35)";
                    }}
                  >
                    Subscribe
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>

          {/* ════════════════════════════
              RIGHT — Visual
          ════════════════════════════ */}
          <div className="relative hidden lg:flex items-center justify-center overflow-hidden">

            {/* Vertical accent line */}
            <div
              className="absolute left-0 top-12 bottom-12 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, var(--color-accent), transparent)",
              }}
            />

            {/* Big background number */}
            <span
              className="absolute font-black select-none pointer-events-none"
              style={{
                fontSize: "220px",
                color: "rgba(255,255,255,0.02)",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                right: "-10px",
                bottom: "-20px",
              }}
            >
              20%
            </span>

            {/* Floating shoe */}
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative"
              style={{ width: 340, height: 340 }}
            >
              {/* Shadow blob */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full blur-2xl"
                style={{
                  width: "60%", height: "20px",
                  backgroundColor: "rgba(255,107,53,0.3)",
                }}
              />
              <Image
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=90&fit=crop"
                alt="Exclusive offer shoe"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="340px"
              />
            </motion.div>

            {/* Floating stat cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute top-10 right-8 px-4 py-3 rounded-2xl border"
              style={{
                backgroundColor: "#1a1a1a",
                borderColor: "#2a2a2a",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                Members get
              </p>
              <p className="text-xl font-black" style={{ color: "var(--color-accent)" }}>
                20% OFF
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-10 left-10 px-4 py-3 rounded-2xl border"
              style={{
                backgroundColor: "#1a1a1a",
                borderColor: "#2a2a2a",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                Subscribers
              </p>
              <p className="text-xl font-black" style={{ color: "var(--color-gold)" }}>
                50K+
              </p>
            </motion.div>

          </div>
        </div>

        {/* ── Bottom stats bar ── */}
        <div
          className="relative z-10 grid grid-cols-3 border-t"
          style={{ borderColor: "#1f1f1f" }}
        >
          {[
            { value: "50K+",  label: "Subscribers",      color: "var(--color-accent)" },
            { value: "20%",   label: "First Order Off",  color: "var(--color-gold)"   },
            { value: "24/7",  label: "Customer Support", color: "var(--color-accent)" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-5 text-center"
              style={{
                borderRight: i < 2 ? "1px solid #1f1f1f" : "none",
              }}
            >
              <p className="text-xl font-black" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
