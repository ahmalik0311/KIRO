"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/Toast";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, count } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [cartOpen, setCartOpen] = useState(false);

  const moveToCart = (product: typeof wishlist[0]) => {
    addToCart(product);
    removeFromWishlist(product.productId);
    showToast(`${product.title} moved to cart`, "success");
  };

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>

        {/* Header */}
        <div className="border-b" style={{ backgroundColor: "var(--color-bg-soft)", borderColor: "var(--color-border)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--color-accent-dim)" }}>
                <Heart className="w-5 h-5 fill-current" style={{ color: "var(--color-accent)" }} />
              </div>
              <h1 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>My Wishlist</h1>
              {count > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-black" style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}>
                  {count}
                </span>
              )}
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {count === 0 ? "Your wishlist is empty" : `${count} item${count > 1 ? "s" : ""} saved for later`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--color-card)" }}>
                <Heart className="w-12 h-12" style={{ color: "var(--color-text-faint)" }} />
              </div>
              <div>
                <p className="text-xl font-black mb-2" style={{ color: "var(--color-text)" }}>Nothing saved yet</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Browse our collection and heart the items you love</p>
              </div>
              <Link href="/collections/sneakers"
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                style={{ backgroundColor: "var(--color-accent)", color: "#fff", boxShadow: "var(--shadow-accent)" }}>
                Browse Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Move all to cart */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => { wishlist.forEach(p => addToCart(p)); wishlist.forEach(p => removeFromWishlist(p.productId)); showToast("All items moved to cart", "success"); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all"
                  style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)", backgroundColor: "var(--color-accent-dim)" }}>
                  <ShoppingCart className="w-4 h-4" /> Move All to Cart
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <AnimatePresence>
                  {wishlist.map((product, i) => {
                    const price = parseFloat(product.variants[0]?.price || "0");
                    const compareAt = parseFloat(product.variants[0]?.compare_at_price || "0");
                    const discount = compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;
                    return (
                      <motion.div key={product.productId}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.05 }}
                        className="relative rounded-2xl border overflow-hidden group"
                        style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>

                        {discount > 0 && (
                          <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-[11px] font-black"
                            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}>-{discount}%</div>
                        )}

                        <button onClick={() => removeFromWishlist(product.productId)}
                          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                          style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#fff" }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <Link href={`/product/${product.productId}`} className="block relative aspect-square overflow-hidden">
                          <Image src={product.images[0]?.src || "/placeholder.png"} alt={product.title} fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:640px) 100vw, 25vw" />
                        </Link>

                        <div className="p-4">
                          <p className="text-xs mb-0.5" style={{ color: "var(--color-text-faint)" }}>{product.vendor}</p>
                          <Link href={`/product/${product.productId}`}>
                            <p className="text-sm font-bold line-clamp-2 mb-3 transition-colors" style={{ color: "var(--color-text)" }}
                              onMouseEnter={e => (e.currentTarget.style.color = "var(--color-accent)")}
                              onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text)")}>
                              {product.title}
                            </p>
                          </Link>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-base font-black" style={{ color: "var(--color-accent)" }}>Rs. {price.toLocaleString()}</span>
                              {compareAt > price && <span className="block text-xs line-through" style={{ color: "var(--color-text-faint)" }}>Rs. {compareAt.toLocaleString()}</span>}
                            </div>
                            <button onClick={() => moveToCart(product)}
                              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
                              style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
                              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}>
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
