"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { Product } from "@/types/product";

// Layout
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

// Home sections — in order
import HeroSection         from "@/components/home/HeroSection";
import FeaturesBar         from "@/components/home/FeaturesBar";
import CategoriesSection   from "@/components/home/CategoriesSection";
import FlashSaleSection    from "@/components/home/FlashSaleSection";
import CtaBanners          from "@/components/home/CtaBanners";
import PromoBanners        from "@/components/home/PromoBanners";
import FeaturedProducts    from "@/components/home/FeaturedProducts";
import NewArrivals         from "@/components/home/NewArrivals";
import BrandsSection       from "@/components/home/BrandsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection   from "@/components/home/NewsletterSection";

export default function Home() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]         = useState("");
  const [cartOpen, setCartOpen]     = useState(false);

  const featuredRef = useRef<HTMLDivElement>(null);

  // Fetch paginated products for Featured section
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api.getProducts(page, 8, search || undefined);
        setProducts(data.items);
        setTotalPages(data.pages);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, search]);

  // Fetch a larger set once for Flash Sale & New Arrivals
  useEffect(() => {
    (async () => {
      try {
        const data = await api.getProducts(1, 24);
        setAllProducts(data.items);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const scrollToFeatured = () =>
    featuredRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      {/* ── Header / Navbar ── */}
      <Navbar
        onSearchChange={(q) => { setSearch(q); setPage(1); }}
        searchValue={search}
        onCartOpen={() => setCartOpen(true)}
      />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="flex-1">
        {/* 1. Hero Banner */}
        <HeroSection onShopNow={scrollToFeatured} />

        {/* Trust bar */}
        <FeaturesBar />

        {/* 2. Categories */}
        <CategoriesSection />

        {/* 3. Flash Sale */}
        <FlashSaleSection products={allProducts} />

        {/* CTA Banners */}
        <CtaBanners />

        {/* Promo Banners — 2 small + 1 wide */}
        <PromoBanners />

        {/* 4. Featured Products */}
        <div ref={featuredRef}>
          <FeaturedProducts
            products={products}
            loading={loading}
            page={page}
            totalPages={totalPages}
            search={search}
            onPageChange={setPage}
            onClearSearch={() => { setSearch(""); setPage(1); }}
          />
        </div>

        {/* 5. New Arrivals */}
        <NewArrivals products={allProducts} />

        {/* Brands marquee */}
        <BrandsSection />

        {/* 6. Testimonials */}
        <TestimonialsSection />

        {/* 7. Newsletter */}
        <NewsletterSection />
      </main>

      {/* ── Footer ── */}
      <Footer />
    </>
  );
}
