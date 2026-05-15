import { Truck, RotateCcw, CreditCard, Headphones } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Enjoy free shipping",
  },
  {
    icon: RotateCcw,
    title: "Easy Return",
    desc: "7 Days Return Policy",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    desc: "Multiple Payment options",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    desc: "Available 24/7",
  },
];

export default function FeaturesBar() {
  return (
    <section
      className="border-y"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="flex flex-col items-center justify-center gap-3 py-8 px-6 text-center"
              style={{
                borderRight:
                  i < FEATURES.length - 1
                    ? `1px solid var(--color-border)`
                    : "none",
                /* On mobile, remove right border on even items (2-col grid) */
              }}
            >
              {/* Large outline icon */}
              <div
                className="w-14 h-14 flex items-center justify-center rounded-full border-2"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-muted)",
                }}
              >
                <Icon className="w-6 h-6" strokeWidth={1.5} />
              </div>

              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {title}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
