"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/Toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const mainImage     = product.images[0]?.src || "/placeholder.png";
  const price         = product.variants[0]?.price || "0.00";
  const compareAt     = product.variants[0]?.compare_at_price;
  const hasDiscount   = compareAt && parseFloat(compareAt) > parseFloat(price);
  const discountPct   = hasDiscount
    ? Math.round((1 - parseFloat(price) / parseFloat(compareAt!)) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    showToast(`${product.title} added to cart`, "success");
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-accent)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-accent)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Discount badge */}
      {discountPct > 0 && (
        <div
          className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-[11px] font-black"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
        >
          -{discountPct}%
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${product.productId}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={mainImage}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
          >
            <Eye className="w-4 h-4" /> Quick View
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <Link href={`/product/${product.productId}`}>
            <h3
              className="text-sm font-bold leading-snug line-clamp-2 transition-colors"
              style={{ color: "var(--color-text)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            >
              {product.title}
            </h3>
          </Link>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-faint)" }}>
            {product.vendor}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-base font-black" style={{ color: "var(--color-accent)" }}>
              Rs. {parseFloat(price).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="block text-xs line-through" style={{ color: "var(--color-text-faint)" }}>
                Rs. {parseFloat(compareAt!).toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
