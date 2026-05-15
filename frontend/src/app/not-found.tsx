import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Big 404 */}
      <p
        className="font-black select-none leading-none mb-4"
        style={{
          fontSize: "clamp(100px, 20vw, 200px)",
          color: "var(--color-card)",
          letterSpacing: "-0.05em",
        }}
      >
        404
      </p>

      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 -mt-8"
        style={{ backgroundColor: "var(--color-accent-dim)", border: "2px solid var(--color-accent)" }}
      >
        <span className="text-3xl">👟</span>
      </div>

      <h1 className="text-2xl font-black mb-3" style={{ color: "var(--color-text)" }}>
        Page Not Found
      </h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--color-text-muted)" }}>
        Looks like this page walked away. Let&apos;s get you back on track.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff", boxShadow: "var(--shadow-accent)" }}
        >
          Back to Home
        </Link>
        <Link
          href="/collections/sneakers"
          className="px-6 py-3 rounded-xl font-bold text-sm border transition-all"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)", backgroundColor: "transparent" }}
        >
          Browse Sneakers
        </Link>
      </div>
    </main>
  );
}
