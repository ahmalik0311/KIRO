"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, X, ChevronDown, Zap } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onSearchChange?: (q: string) => void;
  searchValue?: string;
  onCartOpen?: () => void;
}

const MEN_SUBMENU = [
  { label: "Basketball", href: "/collections/basketball" },
  { label: "T-shirts",   href: "/collections/t-shirts"   },
  { label: "Sneakers",   href: "/collections/sneakers"   },
  { label: "7a Premium", href: "/collections/7a-premium" },
  { label: "Slides",     href: "/collections/flip-flops" },
];

const NAV_LINKS = [
  { label: "New Arrival",   href: "/collections/new-arrival"  },
  { label: "Major Loafers", href: "/collections/major-loafers"},
  { label: "On Cloud",      href: "/collections/oncloud"      },
  { label: "Runners",       href: "/collections/runners"      },
  { label: "Air Jordan",    href: "/collections/aj-iv"        },
  { label: "Flash Sale",    href: "/collections/12-12-sale", flash: true },
];

export default function Navbar({ onSearchChange, searchValue = "", onCartOpen }: NavbarProps) {
  const { totalItems } = useCart();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menOpen,    setMenOpen]    = useState(false);
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState<string | null>(null);
  const menRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menRef.current && !menRef.current.contains(e.target as Node)) {
        setMenOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: "var(--color-bg)" }}>

      {/* ══════════════════════════════════════════
          TOP BAR — announcement strip
      ══════════════════════════════════════════ */}
      <div
        className="hidden sm:flex items-center justify-center gap-2 py-2 text-xs font-medium"
        style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
      >
        <Zap className="w-3 h-3 fill-white" />
        Free shipping on all orders across Pakistan &nbsp;·&nbsp; Easy 7-day returns
        <Zap className="w-3 h-3 fill-white" />
      </div>

      {/* ══════════════════════════════════════════
          MAIN NAV ROW
      ══════════════════════════════════════════ */}
      <div
        className="border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[60px] gap-6">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center shrink-0 select-none">
              <span
                className="text-[22px] font-black tracking-tighter leading-none"
                style={{ color: "var(--color-accent)" }}
              >
                JUTAY
              </span>
              <span
                className="text-[22px] font-black tracking-tighter leading-none"
                style={{ color: "var(--color-gold)" }}
              >
                .CO
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center flex-1 gap-0.5">

              {/* Men dropdown */}
              <div
                ref={menRef}
                className="relative"
                onMouseEnter={() => setMenOpen(true)}
                onMouseLeave={() => setMenOpen(false)}
              >
                <button
                  className="flex items-center gap-1 h-[60px] px-3.5 text-[13px] font-semibold border-b-2 transition-colors"
                  style={{
                    color: menOpen ? "var(--color-text)" : "var(--color-text-muted)",
                    borderBottomColor: menOpen ? "var(--color-accent)" : "transparent",
                  }}
                >
                  Men
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{ transform: menOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                {/* Mega dropdown */}
                <AnimatePresence>
                  {menOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 rounded-b-2xl rounded-tr-2xl border border-t-0 overflow-hidden shadow-2xl"
                      style={{
                        backgroundColor: "var(--color-card)",
                        borderColor: "var(--color-border)",
                        minWidth: "200px",
                        boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
                      }}
                    >
                      {/* Accent top line */}
                      <div className="h-0.5 w-full" style={{ backgroundColor: "var(--color-accent)" }} />

                      <div className="py-2">
                        {MEN_SUBMENU.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMenOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium transition-all"
                            style={{ color: "var(--color-text-muted)" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "var(--color-text)";
                              e.currentTarget.style.paddingLeft = "24px";
                              e.currentTarget.style.backgroundColor = "var(--color-bg)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "var(--color-text-muted)";
                              e.currentTarget.style.paddingLeft = "20px";
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: "var(--color-accent)" }}
                            />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Regular links */}
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="flex items-center h-[60px] px-3.5 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap"
                  style={{
                    color: l.flash ? "var(--color-accent)" : "var(--color-text-muted)",
                    borderBottomColor: "transparent",
                    fontWeight: l.flash ? 700 : 600,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = l.flash ? "var(--color-accent-hover)" : "var(--color-text)";
                    e.currentTarget.style.borderBottomColor = l.flash ? "var(--color-accent)" : "var(--color-text-muted)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = l.flash ? "var(--color-accent)" : "var(--color-text-muted)";
                    e.currentTarget.style.borderBottomColor = "transparent";
                  }}
                >
                  {l.flash && <Zap className="w-3 h-3 mr-1 fill-current" />}
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* ── Search bar (desktop) ── */}
            <div
              className="hidden lg:flex items-center gap-2 rounded-xl px-3.5 py-2 border ml-auto"
              style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                width: "220px",
              }}
            >
              <Search className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-faint)" }} />
              <input
                type="text"
                placeholder="Search shoes..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="bg-transparent text-sm outline-none w-full"
                style={{ color: "var(--color-text)" }}
              />
            </div>

            {/* ── Right icons ── */}
            <div className="flex items-center gap-0.5 lg:ml-0 ml-auto">
              {/* Mobile search */}
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                style={{ color: "var(--color-text-muted)" }}
                onClick={() => { setSearchOpen((v) => !v); setMenuOpen(false); }}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={onCartOpen}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                style={{ color: "var(--color-text-muted)" }}
                aria-label="Cart"
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] text-[10px] font-black rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                    >
                      {totalItems > 9 ? "9+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                style={{ color: "var(--color-text-muted)" }}
                onClick={() => { setMenuOpen((v) => !v); setSearchOpen(false); }}
                aria-label="Menu"
              >
                <AnimatePresence mode="wait">
                  {menuOpen ? (
                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE SEARCH BAR
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-b"
            style={{
              backgroundColor: "var(--color-bg)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="px-4 py-3">
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 border"
                style={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <Search className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-faint)" }} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search shoes..."
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                  style={{ color: "var(--color-text)" }}
                />
                {searchValue && (
                  <button onClick={() => onSearchChange?.("")} style={{ color: "var(--color-text-faint)" }}>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          MOBILE FULL-SCREEN MENU
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-b overflow-y-auto"
            style={{
              backgroundColor: "var(--color-bg)",
              borderColor: "var(--color-border)",
              maxHeight: "calc(100vh - 100px)",
            }}
          >
            <div className="px-4 py-4 space-y-1">

              {/* Men accordion */}
              <div>
                <button
                  onClick={() => setMobileMenuExpanded((v) => v === "men" ? null : "men")}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-colors"
                  style={{
                    color: "var(--color-text)",
                    backgroundColor: mobileMenuExpanded === "men" ? "var(--color-card)" : "transparent",
                  }}
                >
                  Men
                  <ChevronDown
                    className="w-4 h-4 transition-transform duration-200"
                    style={{
                      color: "var(--color-text-muted)",
                      transform: mobileMenuExpanded === "men" ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {mobileMenuExpanded === "men" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="ml-3 mt-1 mb-2 rounded-xl overflow-hidden border"
                        style={{
                          backgroundColor: "var(--color-card)",
                          borderColor: "var(--color-border)",
                        }}
                      >
                        {MEN_SUBMENU.map((item, i) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors"
                            style={{
                              color: "var(--color-text-muted)",
                              borderTop: i > 0 ? `1px solid var(--color-border)` : "none",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: "var(--color-accent)" }}
                            />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Regular links */}
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    color: l.flash ? "var(--color-accent)" : "var(--color-text-muted)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-card)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {l.flash && <Zap className="w-3.5 h-3.5 fill-current shrink-0" />}
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
