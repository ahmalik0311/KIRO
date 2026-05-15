import Link from "next/link";
import { Mail, Globe, MessageCircle, Share2 } from "lucide-react";

const SOCIAL = [
  { icon: Globe,          label: "Instagram", href: "#" },
  { icon: MessageCircle,  label: "Twitter",   href: "#" },
  { icon: Share2,         label: "Facebook",  href: "#" },
  { icon: Mail,           label: "Email",     href: "#" },
];

const LINKS = {
  Shop:    ["All Products", "New Arrivals", "Best Sellers", "Sale"],
  Support: ["FAQ", "Shipping Policy", "Returns", "Contact Us"],
  Company: ["About Us", "Careers", "Press", "Blog"],
};

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-1 mb-5">
              <span className="text-2xl font-black" style={{ color: "var(--color-accent)" }}>JUTAY</span>
              <span className="text-2xl font-black" style={{ color: "var(--color-gold)" }}>.CO</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "var(--color-text-muted)" }}>
              Pakistan&apos;s leading source of in-vogue and elegant footwear. Embrace your style at pocket-friendly prices.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-muted)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-accent)";
                    e.currentTarget.style.color = "var(--color-accent)";
                    e.currentTarget.style.backgroundColor = "var(--color-accent-dim)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.color = "var(--color-text-muted)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-sm font-black uppercase tracking-wider mb-5" style={{ color: "var(--color-text)" }}>
                {heading}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="/"
                      className="text-sm transition-colors"
                      style={{ color: "var(--color-text-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          className="mt-12 p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--color-bg)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold" style={{ color: "var(--color-text)" }}>
                Get exclusive deals in your inbox
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                Subscribe and save up to 20% on your first order.
              </p>
            </div>
            <form
              className="flex gap-2 w-full sm:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                style={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-faint)",
          }}
        >
          <p>© {new Date().getFullYear()} Jutay.co. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <Link
                key={l}
                href="/"
                className="transition-colors"
                style={{ color: "var(--color-text-faint)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-faint)")}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
