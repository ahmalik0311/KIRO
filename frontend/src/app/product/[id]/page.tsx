"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/types/product";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, ArrowLeft, Star, Shield,
  Truck, RefreshCw, Heart, Share2,
  ChevronLeft, ChevronRight, Minus, Plus, Check,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";

/* ─── Skeleton loader ─── */
function Skeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square rounded-3xl" style={{ backgroundColor: "var(--color-card)" }} />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded-full" style={{ backgroundColor: "var(--color-card)" }} />
          <div className="h-10 w-3/4 rounded-xl" style={{ backgroundColor: "var(--color-card)" }} />
          <div className="h-6 w-1/3 rounded-xl" style={{ backgroundColor: "var(--color-card)" }} />
          <div className="h-32 rounded-xl" style={{ backgroundColor: "var(--color-card)" }} />
          <div className="h-14 rounded-2xl" style={{ backgroundColor: "var(--color-card)" }} />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product,       setProduct]       = useState<Product | null>(null);
  const [related,       setRelated]       = useState<Product[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize,  setSelectedSize]  = useState<string | null>(null);
  const [quantity,      setQuantity]      = useState(1);
  const [cartOpen,      setCartOpen]      = useState(false);
  const [wishlisted,    setWishlisted]    = useState(false);
  const [addedAnim,     setAddedAnim]     = useState(false);
  const [tab,           setTab]           = useState<"desc" | "details" | "reviews">("desc");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setSelectedImage(0);
    setQuantity(1);
    api.getProduct(id as string)
      .then(data => {
        setProduct(data);
        const first = data?.variants?.find(v => v.available);
        if (first) setSelectedSize(first.title);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Related products
    api.getProducts(1, 20)
      .then(d => setRelated(d.items.filter(p => p.productId !== Number(id)).slice(0, 4)))
      .catch(console.error);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.options[0]?.values?.length > 0 && !selectedSize) {
      showToast("Please select a size first", "error");
      return;
    }
    for (let i = 0; i < quantity; i++) addToCart(product);
    showToast(`${product.title} added to cart`, "success");
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2000);
    setCartOpen(true);
  };

  if (loading) return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main style={{ backgroundColor: "var(--color-bg)" }}><Skeleton /></main>
      <Footer />
    </>
  );

  if (!product) return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "var(--color-bg)" }}>
        <p className="text-5xl">👟</p>
        <h2 className="text-2xl font-black" style={{ color: "var(--color-text)" }}>Product Not Found</h2>
        <Link href="/" className="px-6 py-3 rounded-xl font-bold text-sm" style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}>
          Back to Home
        </Link>
      </main>
      <Footer />
    </>
  );

  const currentVariant = product.variants.find(v => v.title === selectedSize) ?? product.variants[0];
  const price      = parseFloat(currentVariant.price);
  const compareAt  = currentVariant.compare_at_price ? parseFloat(currentVariant.compare_at_price) : 0;
  const discount   = compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;
  const totalPrice = price * quantity;

  const REVIEWS = [
    { name: "Ahmed R.", city: "Lahore",    rating: 5, text: "Absolutely love the quality! Super comfortable and looks great.", date: "2 days ago"  },
    { name: "Sara M.",  city: "Karachi",   rating: 5, text: "Perfect fit, fast delivery. Will definitely order again!",       date: "1 week ago" },
    { name: "Usman A.", city: "Islamabad", rating: 4, text: "Great shoes, exactly as described. Highly recommended.",         date: "2 weeks ago"},
  ];

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main style={{ backgroundColor: "var(--color-bg)" }}>

        {/* ── Breadcrumb ── */}
        <div
          className="border-b"
          style={{ backgroundColor: "var(--color-bg-soft)", borderColor: "var(--color-border)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-faint)" }}>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/collections/sneakers" className="hover:text-white transition-colors">Sneakers</Link>
              <span>/</span>
              <span className="line-clamp-1" style={{ color: "var(--color-text-muted)" }}>{product.title}</span>
            </nav>
          </div>
        </div>

        {/* ── Main Product Section ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

            {/* ════ LEFT: Image Gallery ════ */}
            <div className="flex flex-col gap-4">
              {/* Main image */}
              <div
                className="relative aspect-square rounded-3xl overflow-hidden border group"
                style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[selectedImage]?.src || "/placeholder.png"}
                      alt={product.title}
                      fill
                      className="object-contain p-6"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Discount badge */}
                {discount > 0 && (
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black z-10"
                    style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                  >
                    -{discount}% OFF
                  </div>
                )}

                {/* Prev/Next arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(i => (i - 1 + product.images.length) % product.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(i => (i + 1) % product.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.slice(0, 5).map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(idx)}
                      className="relative aspect-square rounded-xl overflow-hidden border-2 transition-all"
                      style={{
                        borderColor: selectedImage === idx ? "var(--color-accent)" : "var(--color-border)",
                        backgroundColor: "var(--color-card)",
                        transform: selectedImage === idx ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <Image src={img.src} alt={product.title} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ════ RIGHT: Product Info ════ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col"
            >
              {/* Vendor + actions */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                  style={{
                    color: "var(--color-gold)",
                    borderColor: "var(--color-gold)",
                    backgroundColor: "var(--color-gold-dim)",
                  }}
                >
                  {product.vendor}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWishlisted(v => !v)}
                    className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all"
                    style={{
                      borderColor: wishlisted ? "var(--color-accent)" : "var(--color-border)",
                      backgroundColor: wishlisted ? "var(--color-accent-dim)" : "var(--color-card)",
                      color: wishlisted ? "var(--color-accent)" : "var(--color-text-muted)",
                    }}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast("Link copied!", "info"); }}
                    className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)", color: "var(--color-text-muted)" }}
                    aria-label="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1
                className="font-black leading-tight mb-4"
                style={{ fontSize: "clamp(22px, 3vw, 36px)", color: "var(--color-text)" }}
              >
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: "var(--color-gold)" }} />
                  ))}
                </div>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  4.9 (48 reviews)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
                  In Stock
                </span>
              </div>

              {/* Price */}
              <div
                className="flex items-baseline gap-4 p-4 rounded-2xl border mb-6"
                style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
              >
                <span className="text-4xl font-black" style={{ color: "var(--color-accent)" }}>
                  Rs. {price.toLocaleString()}
                </span>
                {compareAt > price && (
                  <span className="text-lg line-through" style={{ color: "var(--color-text-faint)" }}>
                    Rs. {compareAt.toLocaleString()}
                  </span>
                )}
                {discount > 0 && (
                  <span
                    className="ml-auto text-sm font-black px-3 py-1 rounded-full"
                    style={{ backgroundColor: "var(--color-accent-dim)", color: "var(--color-accent)" }}
                  >
                    Save Rs. {(compareAt - price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Size selector */}
              {product.variants.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                      Select Size
                    </span>
                    {selectedSize && (
                      <span className="text-sm font-bold" style={{ color: "var(--color-accent)" }}>
                        EU {selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(variant => {
                      const isSelected = selectedSize === variant.title;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => variant.available && setSelectedSize(variant.title)}
                          disabled={!variant.available}
                          className="relative w-12 h-12 rounded-xl border-2 text-sm font-bold transition-all"
                          style={{
                            backgroundColor: isSelected ? "var(--color-accent)" : "var(--color-card)",
                            borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
                            color: isSelected ? "#fff" : variant.available ? "var(--color-text-muted)" : "var(--color-text-faint)",
                            opacity: variant.available ? 1 : 0.4,
                            cursor: variant.available ? "pointer" : "not-allowed",
                            textDecoration: variant.available ? "none" : "line-through",
                          }}
                        >
                          {variant.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex gap-3 mb-6">
                {/* Qty */}
                <div
                  className="flex items-center rounded-xl border overflow-hidden shrink-0"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
                >
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-11 h-14 flex items-center justify-center transition-colors"
                    style={{ color: "var(--color-text-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-black" style={{ color: "var(--color-text)" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-11 h-14 flex items-center justify-center transition-colors"
                    style={{ color: "var(--color-text-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 h-14 rounded-xl font-black text-base transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: addedAnim ? "#22c55e" : "var(--color-accent)",
                    color: "#fff",
                    boxShadow: addedAnim ? "0 0 30px rgba(34,197,94,0.4)" : "var(--shadow-accent)",
                  }}
                  onMouseEnter={e => { if (!addedAnim) e.currentTarget.style.backgroundColor = "var(--color-accent-hover)"; }}
                  onMouseLeave={e => { if (!addedAnim) e.currentTarget.style.backgroundColor = "var(--color-accent)"; }}
                >
                  <AnimatePresence mode="wait">
                    {addedAnim ? (
                      <motion.span key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                        <Check className="w-5 h-5" /> Added!
                      </motion.span>
                    ) : (
                      <motion.span key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart · Rs. {totalPrice.toLocaleString()}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* Buy Now */}
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm border transition-all mb-6"
                style={{
                  borderColor: "var(--color-gold)",
                  color: "var(--color-gold)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-gold-dim)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Buy Now — Checkout Instantly
              </Link>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Truck,     label: "Free Shipping", sub: "All over Pakistan", color: "var(--color-accent)" },
                  { icon: Shield,    label: "100% Authentic", sub: "Genuine product",  color: "var(--color-gold)"   },
                  { icon: RefreshCw, label: "Easy Returns",  sub: "7-day policy",      color: "var(--color-accent)" },
                ].map(({ icon: Icon, label, sub, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl border text-center"
                    style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "var(--color-text)" }}>{label}</p>
                      <p className="text-[10px]" style={{ color: "var(--color-text-faint)" }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* SKU */}
              <p className="text-xs" style={{ color: "var(--color-text-faint)" }}>
                SKU: <span style={{ color: "var(--color-text-muted)" }}>{currentVariant.sku || "N/A"}</span>
              </p>
            </motion.div>
          </div>

          {/* ── Tabs: Description / Details / Reviews ── */}
          <div className="mt-16 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex gap-0 border-b" style={{ borderColor: "var(--color-border)" }}>
              {(["desc", "details", "reviews"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="px-6 py-4 text-sm font-bold border-b-2 transition-colors capitalize"
                  style={{
                    borderBottomColor: tab === t ? "var(--color-accent)" : "transparent",
                    color: tab === t ? "var(--color-accent)" : "var(--color-text-muted)",
                  }}
                >
                  {t === "desc" ? "Description" : t === "details" ? "Details" : "Reviews (48)"}
                </button>
              ))}
            </div>

            <div className="py-8">
              {tab === "desc" && (
                <div
                  className="prose max-w-2xl text-sm leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                  dangerouslySetInnerHTML={{ __html: product.body_html || "<p>Premium quality footwear crafted for comfort and style.</p>" }}
                />
              )}

              {tab === "details" && (
                <div className="max-w-lg">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["Brand",    product.vendor],
                        ["Type",     product.product_type || "Footwear"],
                        ["Material", "Premium Synthetic"],
                        ["Sole",     "Rubber"],
                        ["Closure",  "Lace-up"],
                        ["Origin",   "Pakistan"],
                      ].map(([k, v]) => (
                        <tr key={k} className="border-b" style={{ borderColor: "var(--color-border)" }}>
                          <td className="py-3 pr-8 font-semibold" style={{ color: "var(--color-text-muted)" }}>{k}</td>
                          <td className="py-3" style={{ color: "var(--color-text)" }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === "reviews" && (
                <div className="space-y-4 max-w-2xl">
                  {REVIEWS.map(r => (
                    <div
                      key={r.name}
                      className="p-5 rounded-2xl border"
                      style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
                            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                          >
                            {r.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{r.name}</p>
                            <p className="text-xs" style={{ color: "var(--color-text-faint)" }}>{r.city} · {r.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: "var(--color-gold)" }} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Related Products ── */}
          {related.length > 0 && (
            <div className="mt-8 border-t pt-12" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "var(--color-accent)" }}>
                    You May Also Like
                  </p>
                  <h2 className="text-2xl font-black" style={{ color: "var(--color-text)" }}>Related Products</h2>
                </div>
                <Link
                  href="/collections/sneakers"
                  className="text-sm font-bold transition-colors"
                  style={{ color: "var(--color-text-muted)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--color-accent)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {related.map(p => <ProductCard key={p.productId} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
