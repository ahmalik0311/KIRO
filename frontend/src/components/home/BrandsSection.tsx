"use client";

import { motion } from "framer-motion";

const BRANDS = ["Adidas", "Nike", "Puma", "Reebok", "New Balance", "Vans", "Converse", "Skechers"];

export default function BrandsSection() {
  return (
    <section
      className="border-y overflow-hidden"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p
          className="text-center text-xs font-bold uppercase tracking-widest mb-8"
          style={{ color: "var(--color-text-faint)" }}
        >
          Trusted Brands
        </p>

        {/* Marquee */}
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="flex gap-12 whitespace-nowrap"
          >
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span
                key={i}
                className="text-2xl font-black uppercase tracking-widest shrink-0 transition-colors cursor-default"
                style={{ color: "var(--color-text-faint)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-faint)")}
              >
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
