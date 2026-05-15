"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (p: Product) => void;
  removeFromWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  toggleWishlist: (p: Product) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    try { const s = localStorage.getItem("wishlist"); if (s) setWishlist(JSON.parse(s)); } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("wishlist", JSON.stringify(wishlist)); } catch {}
  }, [wishlist]);

  const addToWishlist    = (p: Product) => setWishlist(prev => prev.find(x => x.productId === p.productId) ? prev : [...prev, p]);
  const removeFromWishlist = (id: number) => setWishlist(prev => prev.filter(x => x.productId !== id));
  const isWishlisted     = (id: number) => wishlist.some(x => x.productId === id);
  const toggleWishlist   = (p: Product) => isWishlisted(p.productId) ? removeFromWishlist(p.productId) : addToWishlist(p);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted, toggleWishlist, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
