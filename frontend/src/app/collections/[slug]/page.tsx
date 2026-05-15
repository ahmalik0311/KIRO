"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/types/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import FilterSidebar, { Filters } from "@/components/collection/FilterSidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, LayoutGrid, List,
  ChevronLeft, ChevronRight, X,
  Search, Loader2, PackageSearch,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ─── slug → display label ─── */
const SLUG_LABELS: Record<string, string> = {
  sneakers:       "Sneakers",
  basketball:     "Basketball",
  "t-shirts":     "T-Shirts",
  "7a-premium":   "7A Premium",
  "flip-flops":   "Slides",
  "new-arrival":  "New Arrivals",
  "major-loafers":"Major Loafers",
  oncloud:        "On Cloud",
  runners:        "Runners",
  "aj-iv":        "Air Jordan",
  "12-12-sale":   "Flash Sale",
};

const SORT_OPTIONS = [
  { label: "Featured",          value: "featured"   },
  { label: "Price: Low → High", value: "price_asc"  },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Name: A → Z",       value: "name_asc"   },
  { label: "Name: Z → A",       value: "name_desc"  },
  { label: "Biggest Discount",  value: "discount"   },
];

const LIMIT = 12;

const DEFAULT_FILTERS: Filters = {
  sizes: [], priceMin: "", priceMax: "",
  vendors: [], inStock: false, onSale: false,
};

/* ─── Product list item (list-view row) ─── */
function ProductRow({ product }: { product: Product }) {
  const { addToCart } = require("@/hooks/useCart").useCart();
  const { showToast } = require("@/components/Toast").useToast();
  const price     = product.variants[0]?.price || "0";
  const compareAt = product.variants[0]?.compare_at_price;
  const discount  = compareAt && parseFloat(compareAt) > parseFloat(price)
    ? Math.round((1 - parseFloat(price) / parseFloat(compareAt)) * 100) : 0;

  return (
    <div
      className="flex gap-4 p-4 rounded-2xl border group transition-all"
      style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--color-accent)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--color-border)")}
    >
      <Link href={`/product/${product.productId}`} className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: "var(--color-bg)" }}>
        <Image src={product.images[0]?.src || "/placeholder.png"} alt={product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="96px" />
        {discount > 0 && (
          <span className="absolute top-1.5 left-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}>
            -{discount}%
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link href={`/product/${product.productId}`}>
            <p className="text-sm font-bold line-clamp-1 transition-colors" style={{ color: "var(--color-text)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--color-accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text)")}
            >{product.title}</p>
          </Link>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-faint)" }}>{product.vendor}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {product.variants.slice(0, 6).map(v => (
              <span key={v.id} className="text-[10px] px-2 py-0.5 rounded-lg border font-medium"
                style={{ borderColor: "var(--color-border)", color: v.available ? "var(--color-text-muted)" : "var(--color-text-faint)", textDecoration: v.available ? "none" : "line-through" }}>
                {v.title}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-base font-black" style={{ color: "var(--color-accent)" }}>Rs. {parseFloat(price).toLocaleString()}</span>
            {compareAt && parseFloat(compareAt) > parseFloat(price) && (
              <span className="ml-2 text-xs line-through" style={{ color: "var(--color-text-faint)" }}>Rs. {parseFloat(compareAt).toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={() => { addToCart(product); showToast(`${product.title} added to cart`, "success"); }}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function CollectionPage() {
  const params = useParams();
  const slug   = (params?.slug as string) || "";
  const label  = SLUG_LABELS[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [cartOpen,    setCartOpen]    = useState(false);
  const [view,        setView]        = useState<"grid" | "list">("grid");
  const [sortBy,      setSortBy]      = useState("featured");
  const [sortOpen,    setSortOpen]    = useState(false);
  const [filters,     setFilters]     = useState<Filters>(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search,      setSearch]      = useState("");
  const [page,        setPage]        = useState(1);

  /* Fetch all products once */
  useEffect(() => {
    setLoading(true);
    api.getProducts(1, 200)
      .then(d => setAllProducts(d.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* Unique vendors */
  const vendors = useMemo(() =>
    [...new Set(allProducts.map(p => p.vendor).filter(Boolean))].sort(),
    [allProducts]
  );

  /* Filter + sort */
  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.vendor?.toLowerCase().includes(q)
      );
    }
    if (filters.inStock)
      list = list.filter(p => p.variants.some(v => v.available));
    if (filters.onSale)
      list = list.filter(p => {
        const v = p.variants[0];
        return v?.compare_at_price && parseFloat(v.compare_at_price) > parseFloat(v.price);
      });
    if (filters.priceMin)
      list = list.filter(p => parseFloat(p.variants[0]?.price || "0") >= parseFloat(filters.priceMin));
    if (filters.priceMax)
      list = list.filter(p => parseFloat(p.variants[0]?.price || "0") <= parseFloat(filters.priceMax));
    if (filters.vendors.length)
      list = list.filter(p => filters.vendors.includes(p.vendor));
    if (filters.sizes.length)
      list = list.filter(p =>
        p.variants.some(v => filters.sizes.includes(v.title) && v.available)
      );

    switch (sortBy) {
      case "price_asc":  list.sort((a,b) => parseFloat(a.variants[0]?.price||"0") - parseFloat(b.variants[0]?.price||"0")); break;
      case "price_desc": list.sort((a,b) => parseFloat(b.variants[0]?.price||"0") - parseFloat(a.variants[0]?.price||"0")); break;
      case "name_asc":   list.sort((a,b) => a.title.localeCompare(b.title)); break;
      case "name_desc":  list.sort((a,b) => b.title.localeCompare(a.title)); break;
      case "discount":
        list.sort((a,b) => {
          const disc = (p: Product) => {
            const v = p.variants[0];
            return v?.compare_at_price ? (1 - parseFloat(v.price)/parseFloat(v.compare_at_price)) : 0;
          };
          return disc(b) - disc(a);
        });
        break;
    }
    return list;
  }, [allProducts, search, filters, sortBy]);

  /* Pagination */
  const totalPages = Math.ceil(filtered.length / LIMIT);
  const paginated  = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const handleFilterChange = useCallback((f: Filters) => {
    setFilters(f);
    setPage(1);
  }, []);

  /* Active filter chips */
  const chips: { label: string; clear: () => void }[] = [
    ...filters.sizes.map(s => ({ label: `Size: ${s}`, clear: () => handleFilterChange({ ...filters, sizes: filters.sizes.filter(x => x !== s) }) })),
    ...filters.vendors.map(v => ({ label: v, clear: () => handleFilterChange({ ...filters, vendors: filters.vendors.filter(x => x !== v) }) })),
    ...(filters.inStock ? [{ label: "In Stock", clear: () => handleFilterChange({ ...filters, inStock: false }) }] : []),
    ...(filters.onSale  ? [{ label: "On Sale",  clear: () => handleFilterChange({ ...filters, onSale: false  }) }] : []),
    ...(filters.priceMin ? [{ label: `Min: Rs.${filters.priceMin}`, clear: () => handleFilterChange({ ...filters, priceMin: "" }) }] : []),
    ...(filters.priceMax ? [{ label: `Max: Rs.${filters.priceMax}`, clear: () => handleFilterChange({ ...filters, priceMax: "" }) }] : []),
  ];

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile filter drawer backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 overflow-y-auto lg:hidden"
            style={{ backgroundColor: "var(--color-bg)" }}
          >
            <div className="p-4">
              <FilterSidebar filters={filters} onChange={handleFilterChange} vendors={vendors} onClose={() => setSidebarOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>

        {/* ── Breadcrumb + Hero Banner ── */}
        <div
          className="relative overflow-hidden border-b"
          style={{ backgroundColor: "var(--color-bg-soft)", borderColor: "var(--color-border)" }}
        >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 100% at 100% 50%, rgba(255,107,53,0.08), transparent 70%)" }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-faint)" }}>
              <Link href="/" className="transition-colors hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/" className="transition-colors hover:text-white">Collections</Link>
              <span>/</span>
              <span style={{ color: "var(--color-accent)" }}>{label}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--color-accent)" }}>
                  Collection
                </p>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: "var(--color-text)" }}>
                  {label}
                </h1>
                <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {loading ? "Loading…" : `${filtered.length} products`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div
          className="sticky top-[60px] z-30 border-b"
          style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 h-14">

              {/* Filter toggle (mobile) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold shrink-0"
                style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {chips.length > 0 && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}>
                    {chips.length}
                  </span>
                )}
              </button>

              {/* Search */}
              <div
                className="flex items-center gap-2 flex-1 max-w-xs rounded-xl border px-3 py-2"
                style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
              >
                <Search className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-faint)" }} />
                <input
                  type="text"
                  placeholder="Search in collection..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="bg-transparent text-sm outline-none w-full"
                  style={{ color: "var(--color-text)" }}
                />
                {search && (
                  <button onClick={() => { setSearch(""); setPage(1); }} style={{ color: "var(--color-text-faint)" }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {/* Sort */}
                <div className="relative">
                  <button
                    onClick={() => setSortOpen(v => !v)}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold"
                    style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                  >
                    {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                    <ChevronLeft className="w-3.5 h-3.5 -rotate-90" />
                  </button>
                  {sortOpen && (
                    <div
                      className="absolute right-0 top-full mt-1 w-52 rounded-2xl border shadow-2xl z-50 overflow-hidden"
                      style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                    >
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setSortOpen(false); setPage(1); }}
                          className="w-full text-left px-4 py-3 text-sm transition-colors"
                          style={{
                            color: sortBy === opt.value ? "var(--color-accent)" : "var(--color-text-muted)",
                            fontWeight: sortBy === opt.value ? 700 : 400,
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-bg)")}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View toggle */}
                <div className="flex items-center rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                  {(["grid", "list"] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className="w-9 h-9 flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: view === v ? "var(--color-accent)" : "var(--color-card)",
                        color: view === v ? "#fff" : "var(--color-text-muted)",
                      }}
                      aria-label={v}
                    >
                      {v === "grid" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-3">
                {chips.map(chip => (
                  <button
                    key={chip.label}
                    onClick={chip.clear}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                    style={{ backgroundColor: "var(--color-accent-dim)", borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
                  >
                    {chip.label}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                <button
                  onClick={() => handleFilterChange(DEFAULT_FILTERS)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border transition-colors"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Body: Sidebar + Grid ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-7">

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-60 shrink-0">
              <div className="sticky top-[130px]">
                <FilterSidebar filters={filters} onChange={handleFilterChange} vendors={vendors} />
              </div>
            </div>

            {/* Products */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--color-accent)" }} />
                </div>
              ) : paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                  <PackageSearch className="w-14 h-14" style={{ color: "var(--color-text-faint)" }} />
                  <p className="text-lg font-bold" style={{ color: "var(--color-text)" }}>No products found</p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Try adjusting your filters or search term</p>
                  <button
                    onClick={() => { handleFilterChange(DEFAULT_FILTERS); setSearch(""); }}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold"
                    style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : view === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {paginated.map((product, i) => (
                      <motion.div
                        key={product.productId}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.03, duration: 0.25 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {paginated.map((product, i) => (
                      <motion.div
                        key={product.productId}
                        layout
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <ProductRow product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && !loading && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-xl border flex items-center justify-center disabled:opacity-30 transition-colors"
                    style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | "…")[]>((acc, p, i, arr) => {
                      if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…" ? (
                        <span key={`ellipsis-${i}`} className="w-10 text-center text-sm" style={{ color: "var(--color-text-faint)" }}>…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className="w-10 h-10 rounded-xl border text-sm font-bold transition-all"
                          style={{
                            backgroundColor: p === page ? "var(--color-accent)" : "var(--color-card)",
                            borderColor: p === page ? "var(--color-accent)" : "var(--color-border)",
                            color: p === page ? "#fff" : "var(--color-text-muted)",
                          }}
                        >
                          {p}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-10 h-10 rounded-xl border flex items-center justify-center disabled:opacity-30 transition-colors"
                    style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
