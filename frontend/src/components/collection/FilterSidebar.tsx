"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

export interface Filters {
  sizes: string[];
  priceMin: string;
  priceMax: string;
  vendors: string[];
  inStock: boolean;
  onSale: boolean;
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  vendors: string[];
  onClose?: () => void;
}

const ALL_SIZES = ["38","39","40","41","42","43","44","45","46"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b" style={{ borderColor: "var(--color-border)" }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-4 text-sm font-bold"
        style={{ color: "var(--color-text)" }}
      >
        {title}
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{
            color: "var(--color-text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange, vendors, onClose }: FilterSidebarProps) {
  const toggle = <K extends keyof Filters>(key: K, val: string) => {
    const arr = filters[key] as string[];
    onChange({
      ...filters,
      [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val],
    });
  };

  const activeCount =
    filters.sizes.length +
    filters.vendors.length +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0);

  return (
    <aside
      className="w-full rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-black" style={{ color: "var(--color-text)" }}>
            Filters
          </span>
          {activeCount > 0 && (
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
            >
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={() => onChange({ sizes: [], priceMin: "", priceMax: "", vendors: [], inStock: false, onSale: false })}
              className="text-xs font-semibold transition-colors"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--color-accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 rounded-lg" style={{ color: "var(--color-text-muted)" }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="px-5">
        {/* Availability */}
        <Section title="Availability">
          <div className="flex flex-col gap-2">
            {[
              { key: "inStock", label: "In Stock" },
              { key: "onSale",  label: "On Sale"  },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0"
                  style={{
                    borderColor: filters[key as "inStock" | "onSale"] ? "var(--color-accent)" : "var(--color-border)",
                    backgroundColor: filters[key as "inStock" | "onSale"] ? "var(--color-accent)" : "transparent",
                  }}
                  onClick={() => onChange({ ...filters, [key]: !filters[key as "inStock" | "onSale"] })}
                >
                  {filters[key as "inStock" | "onSale"] && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                  onClick={() => onChange({ ...filters, [key]: !filters[key as "inStock" | "onSale"] })}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
        </Section>

        {/* Price Range */}
        <Section title="Price Range">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin}
              onChange={e => onChange({ ...filters, priceMin: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
            <span style={{ color: "var(--color-text-faint)" }}>—</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax}
              onChange={e => onChange({ ...filters, priceMax: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
          </div>
        </Section>

        {/* Sizes */}
        <Section title="Size">
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map(size => {
              const active = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggle("sizes", size)}
                  className="w-10 h-10 rounded-xl text-sm font-bold border transition-all"
                  style={{
                    backgroundColor: active ? "var(--color-accent)" : "var(--color-bg)",
                    borderColor: active ? "var(--color-accent)" : "var(--color-border)",
                    color: active ? "#fff" : "var(--color-text-muted)",
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Brand */}
        <Section title="Brand">
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {vendors.map(vendor => {
              const active = filters.vendors.includes(vendor);
              return (
                <label key={vendor} className="flex items-center gap-3 cursor-pointer">
                  <div
                    className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0"
                    style={{
                      borderColor: active ? "var(--color-accent)" : "var(--color-border)",
                      backgroundColor: active ? "var(--color-accent)" : "transparent",
                    }}
                    onClick={() => toggle("vendors", vendor)}
                  >
                    {active && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-sm truncate"
                    style={{ color: "var(--color-text-muted)" }}
                    onClick={() => toggle("vendors", vendor)}
                  >
                    {vendor}
                  </span>
                </label>
              );
            })}
          </div>
        </Section>
      </div>
    </aside>
  );
}
