"use client";

import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Loader2, SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Featured",           value: "featured"   },
  { label: "Price: Low → High",  value: "price_asc"  },
  { label: "Price: High → Low",  value: "price_desc" },
  { label: "Name: A → Z",        value: "name_asc"   },
];

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  page: number;
  totalPages: number;
  search: string;
  onPageChange: (p: number) => void;
  onClearSearch: () => void;
  onCartOpen: () => void;
}

export default function ProductGrid({
  products,
  loading,
  page,
  totalPages,
  search,
  onPageChange,
  onClearSearch,
}: ProductGridProps) {
  const [sortBy,    setSortBy]    = useState("featured");
  const [sortOpen,  setSortOpen]  = useState(false);

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price_asc")  return parseFloat(a.variants[0]?.price || "0") - parseFloat(b.variants[0]?.price || "0");
    if (sortBy === "price_desc") return parseFloat(b.variants[0]?.price || "0") - parseFloat(a.variants[0]?.price || "0");
    if (sortBy === "name_asc")   return a.title.localeCompare(b.title);
    return 0;
  });

  const currentLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-accent)" }}>
            Our Collection
          </p>
          <h2 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>
            {search ? `Results for "${search}"` : "Latest Arrivals"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Product count */}
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {loading ? "Loading…" : `${sorted.length} products`}
          </span>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-muted)",
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {currentLabel}
              <ChevronDown
                className="w-4 h-4 transition-transform"
                style={{ transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {sortOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl border shadow-xl z-20 overflow-hidden"
                style={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm transition-colors"
                    style={{
                      color: sortBy === opt.value ? "var(--color-accent)" : "var(--color-text-muted)",
                      fontWeight: sortBy === opt.value ? 700 : 400,
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-bg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--color-accent)" }} />
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
          <SearchX className="w-12 h-12" style={{ color: "var(--color-text-faint)" }} />
          <p className="text-lg font-bold" style={{ color: "var(--color-text)" }}>No products found</p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Try a different search term
          </p>
          <button
            onClick={onClearSearch}
            className="px-6 py-2 rounded-xl text-sm font-bold transition-colors"
            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {sorted.map((product, i) => (
            <motion.div
              key={product.productId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!search && totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-3 mt-14">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-30"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className="w-10 h-10 rounded-xl border text-sm font-bold transition-all"
              style={{
                backgroundColor: p === page ? "var(--color-accent)" : "var(--color-card)",
                borderColor: p === page ? "var(--color-accent)" : "var(--color-border)",
                color: p === page ? "#fff" : "var(--color-text-muted)",
              }}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-30"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
