"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

function Input({ icon: Icon, type = "text", placeholder, value, onChange, error, rightEl }: {
  icon: React.ElementType; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; error?: string; rightEl?: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative flex items-center">
        <Icon className="absolute left-4 w-4 h-4 pointer-events-none" style={{ color: "var(--color-text-faint)" }} />
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full pl-11 pr-11 py-3.5 rounded-xl border text-sm outline-none transition-colors"
          style={{ backgroundColor: "var(--color-bg)", borderColor: error ? "var(--color-accent)" : "var(--color-border)", color: "var(--color-text)" }}
          onFocus={e => (e.currentTarget.style.borderColor = "var(--color-accent)")}
          onBlur={e => (e.currentTarget.style.borderColor = error ? "var(--color-accent)" : "var(--color-border)")}
        />
        {rightEl && <div className="absolute right-3">{rightEl}</div>}
      </div>
      {error && <p className="text-xs mt-1 ml-1" style={{ color: "var(--color-accent)" }}>{error}</p>}
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [cartOpen, setCartOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "register" && !form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (mode !== "forgot") {
      if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
      if (mode === "register" && form.password !== form.confirm) e.confirm = "Passwords don't match";
    }
    setErrors(e); return !Object.keys(e).length;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setDone(true);
  };

  const TABS = [{ key: "login", label: "Sign In" }, { key: "register", label: "Create Account" }] as const;

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: "var(--color-bg)" }}>

        {/* Background glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px]" style={{ backgroundColor: "var(--color-accent-glow)" }} />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[120px]" style={{ backgroundColor: "var(--color-gold-dim)" }} />
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-0.5 mb-8">
            <span className="text-3xl font-black tracking-tighter" style={{ color: "var(--color-accent)" }}>JUTAY</span>
            <span className="text-3xl font-black tracking-tighter" style={{ color: "var(--color-gold)" }}>.CO</span>
          </Link>

          <div className="rounded-3xl border overflow-hidden" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>

            {/* Tabs */}
            {mode !== "forgot" && (
              <div className="grid grid-cols-2 border-b" style={{ borderColor: "var(--color-border)" }}>
                {TABS.map(t => (
                  <button key={t.key} onClick={() => { setMode(t.key); setDone(false); setErrors({}); }}
                    className="py-4 text-sm font-bold border-b-2 transition-colors"
                    style={{
                      borderBottomColor: mode === t.key ? "var(--color-accent)" : "transparent",
                      color: mode === t.key ? "var(--color-accent)" : "var(--color-text-muted)",
                      backgroundColor: "transparent",
                    }}>
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            <div className="p-7">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(34,197,94,0.12)" }}>
                      <CheckCircle className="w-8 h-8" style={{ color: "#22c55e" }} />
                    </div>
                    <h3 className="text-lg font-black mb-2" style={{ color: "var(--color-text)" }}>
                      {mode === "forgot" ? "Reset Link Sent!" : mode === "register" ? "Account Created!" : "Welcome Back!"}
                    </h3>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
                      {mode === "forgot" ? `Check ${form.email} for reset instructions.` : mode === "register" ? "Your account is ready. Start shopping!" : "You're now signed in."}
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
                      style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}>
                      Go to Home <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.form key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    onSubmit={submit} noValidate className="space-y-4">

                    {mode === "forgot" && (
                      <div className="mb-2">
                        <button type="button" onClick={() => setMode("login")} className="text-xs mb-4 flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                          ← Back to Sign In
                        </button>
                        <h3 className="text-xl font-black mb-1" style={{ color: "var(--color-text)" }}>Reset Password</h3>
                        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Enter your email and we'll send a reset link.</p>
                      </div>
                    )}

                    {mode === "register" && (
                      <Input icon={User} placeholder="Full Name" value={form.name} onChange={v => set("name", v)} error={errors.name} />
                    )}

                    <Input icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={v => set("email", v)} error={errors.email} />

                    {mode === "register" && (
                      <Input icon={Phone} type="tel" placeholder="Phone number" value={form.phone} onChange={v => set("phone", v)} />
                    )}

                    {mode !== "forgot" && (
                      <Input icon={Lock} type={showPass ? "text" : "password"} placeholder="Password" value={form.password} onChange={v => set("password", v)} error={errors.password}
                        rightEl={
                          <button type="button" onClick={() => setShowPass(v => !v)} style={{ color: "var(--color-text-faint)" }}>
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                      />
                    )}

                    {mode === "register" && (
                      <Input icon={Lock} type={showPass2 ? "text" : "password"} placeholder="Confirm password" value={form.confirm} onChange={v => set("confirm", v)} error={errors.confirm}
                        rightEl={
                          <button type="button" onClick={() => setShowPass2(v => !v)} style={{ color: "var(--color-text-faint)" }}>
                            {showPass2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                      />
                    )}

                    {mode === "login" && (
                      <div className="flex justify-end">
                        <button type="button" onClick={() => { setMode("forgot"); setDone(false); }} className="text-xs" style={{ color: "var(--color-accent)" }}>
                          Forgot password?
                        </button>
                      </div>
                    )}

                    <button type="submit" disabled={loading}
                      className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 mt-2"
                      style={{ backgroundColor: "var(--color-accent)", color: "#fff", boxShadow: "var(--shadow-accent)" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}>
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Please wait...</>
                        : mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Send Reset Link"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-2">
                      <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
                      <span className="text-xs" style={{ color: "var(--color-text-faint)" }}>or continue with</span>
                      <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
                    </div>

                    {/* Social buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {["Google", "Facebook"].map(s => (
                        <button key={s} type="button"
                          className="flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-colors"
                          style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)", backgroundColor: "var(--color-bg)" }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--color-text-muted)")}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--color-border)")}>
                          {s === "Google" ? "🇬" : "🇫"} {s}
                        </button>
                      ))}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: "var(--color-text-faint)" }}>
            By continuing you agree to our{" "}
            <Link href="/policies/terms" className="underline" style={{ color: "var(--color-text-muted)" }}>Terms</Link>
            {" & "}
            <Link href="/policies/privacy" className="underline" style={{ color: "var(--color-text-muted)" }}>Privacy Policy</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
