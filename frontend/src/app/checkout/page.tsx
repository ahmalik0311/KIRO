"use client";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, CheckCircle, Truck, Lock, CreditCard, Banknote, ChevronRight } from "lucide-react";

const PROVINCES = ["Punjab","Sindh","Khyber Pakhtunkhwa","Balochistan","Islamabad Capital Territory","Gilgit-Baltistan","Azad Kashmir"];

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{label}</label>
      {children}
      {error && <p className="text-xs" style={{ color: "var(--color-accent)" }}>{error}</p>}
    </div>
  );
}

const iStyle = (err?: string) => ({
  borderColor: err ? "var(--color-accent)" : "var(--color-border)",
  color: "var(--color-text)" as string,
  backgroundColor: "var(--color-bg)" as string,
});

export default function CheckoutPage() {
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const { showToast } = useToast();
  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState<1|2|3>(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber] = useState(() => "JT-" + Math.floor(100000 + Math.random() * 900000));
  const [form, setForm] = useState({
    firstName:"", lastName:"", email:"", phone:"",
    address:"", city:"", province:"", postalCode:"",
    paymentMethod: "cod" as "cod"|"card",
    cardNumber:"", cardExpiry:"", cardCvc:"", cardName:"",
  });
  const [errors, setErrors] = useState<Record<string,string>>({});

  const set = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: "" }));
  };

  const v1 = () => {
    const e: Record<string,string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e); return !Object.keys(e).length;
  };
  const v2 = () => {
    const e: Record<string,string> = {};
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim())    e.city    = "Required";
    if (!form.province)       e.province = "Required";
    setErrors(e); return !Object.keys(e).length;
  };
  const v3 = () => {
    if (form.paymentMethod !== "card") return true;
    const e: Record<string,string> = {};
    if (!form.cardName.trim()) e.cardName = "Required";
    if (!form.cardNumber.replace(/\s/g,"").match(/^\d{16}$/)) e.cardNumber = "Valid 16-digit number";
    if (!form.cardExpiry.match(/^\d{2}\/\d{2}$/)) e.cardExpiry = "MM/YY format";
    if (!form.cardCvc.match(/^\d{3,4}$/)) e.cardCvc = "3-4 digits";
    setErrors(e); return !Object.keys(e).length;
  };

  const next = () => { if (step===1 && v1()) setStep(2); else if (step===2 && v2()) setStep(3); };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!v3()) { showToast("Please fix errors","error"); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    clearCart(); setOrderPlaced(true); setSubmitting(false);
  };

  const fmtCard = (v: string) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp  = (v: string) => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>=3?d.slice(0,2)+"/"+d.slice(2):d; };

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors";

  if (orderPlaced) return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-[80vh] flex items-center justify-center px-4" style={{ backgroundColor:"var(--color-bg)" }}>
        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="text-center max-w-lg w-full">
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.2, type:"spring", stiffness:200 }}
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor:"rgba(34,197,94,0.12)", border:"2px solid rgba(34,197,94,0.3)" }}>
            <CheckCircle className="w-12 h-12" style={{ color:"#22c55e" }} />
          </motion.div>
          <h1 className="text-3xl font-black mb-2" style={{ color:"var(--color-text)" }}>Order Confirmed!</h1>
          <p className="text-sm mb-1" style={{ color:"var(--color-text-muted)" }}>
            Order <span style={{ color:"var(--color-accent)", fontWeight:700 }}>{orderNumber}</span>
          </p>
          <p className="text-sm mb-8" style={{ color:"var(--color-text-muted)" }}>
            Thank you <strong style={{ color:"var(--color-text)" }}>{form.firstName}</strong>! Confirmation sent to{" "}
            <strong style={{ color:"var(--color-text)" }}>{form.email}</strong>
          </p>
          <div className="p-5 rounded-2xl border mb-8 text-left space-y-3" style={{ backgroundColor:"var(--color-card)", borderColor:"var(--color-border)" }}>
            {[
              ["Delivery Address", `${form.address}, ${form.city}, ${form.province}`],
              ["Payment", form.paymentMethod==="cod" ? "Cash on Delivery" : "Credit/Debit Card"],
              ["Estimated Delivery", "3–5 Business Days"],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span style={{ color:"var(--color-text-muted)" }}>{k}</span>
                <span className="font-semibold text-right max-w-[60%]" style={{ color:"var(--color-text)" }}>{v}</span>
              </div>
            ))}
          </div>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all active:scale-95"
            style={{ backgroundColor:"var(--color-accent)", color:"#fff", boxShadow:"var(--shadow-accent)" }}>
            <ShoppingBag className="w-5 h-5" /> Continue Shopping
          </Link>
        </motion.div>
      </main>
      <Footer />
    </>
  );

  if (cart.length === 0) return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4" style={{ backgroundColor:"var(--color-bg)" }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor:"var(--color-card)" }}>
          <ShoppingBag className="w-10 h-10" style={{ color:"var(--color-text-faint)" }} />
        </div>
        <h2 className="text-2xl font-black" style={{ color:"var(--color-text)" }}>Your cart is empty</h2>
        <p style={{ color:"var(--color-text-muted)" }}>Add some products before checking out.</p>
        <Link href="/" className="px-8 py-3 rounded-xl font-bold text-sm" style={{ backgroundColor:"var(--color-accent)", color:"#fff" }}>
          Shop Now
        </Link>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="min-h-screen" style={{ backgroundColor:"var(--color-bg)" }}>

        {/* Header */}
        <div className="border-b" style={{ backgroundColor:"var(--color-bg-soft)", borderColor:"var(--color-border)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-5 transition-colors"
              style={{ color:"var(--color-text-muted)" }}
              onMouseEnter={e=>(e.currentTarget.style.color="var(--color-text)")}
              onMouseLeave={e=>(e.currentTarget.style.color="var(--color-text-muted)")}>
              <ArrowLeft className="w-4 h-4" /> Back to Shopping
            </Link>
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {["Contact","Shipping","Payment"].map((s,i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                      style={{
                        backgroundColor: step>i+1 ? "#22c55e" : step===i+1 ? "var(--color-accent)" : "var(--color-card)",
                        color: step>=i+1 ? "#fff" : "var(--color-text-faint)",
                        border: step<=i+1 ? `2px solid ${step===i+1?"var(--color-accent)":"var(--color-border)"}` : "none",
                      }}>
                      {step>i+1 ? "✓" : i+1}
                    </div>
                    <span className="text-sm font-semibold hidden sm:block"
                      style={{ color: step===i+1 ? "var(--color-text)" : "var(--color-text-faint)" }}>{s}</span>
                  </div>
                  {i<2 && <ChevronRight className="w-4 h-4" style={{ color:"var(--color-text-faint)" }} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={submit} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

              {/* Left — Steps */}
              <div className="lg:col-span-3 space-y-6">
                <AnimatePresence mode="wait">

                  {/* Step 1 — Contact */}
                  {step===1 && (
                    <motion.div key="s1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                      className="p-6 rounded-2xl border space-y-5"
                      style={{ backgroundColor:"var(--color-card)", borderColor:"var(--color-border)" }}>
                      <h2 className="text-lg font-black" style={{ color:"var(--color-text)" }}>Contact Information</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="First Name" error={errors.firstName}>
                          <input value={form.firstName} onChange={e=>set("firstName",e.target.value)} placeholder="Ali"
                            className={inputClass} style={iStyle(errors.firstName)}
                            onFocus={e=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                            onBlur={e=>(e.currentTarget.style.borderColor=errors.firstName?"var(--color-accent)":"var(--color-border)")} />
                        </Field>
                        <Field label="Last Name" error={errors.lastName}>
                          <input value={form.lastName} onChange={e=>set("lastName",e.target.value)} placeholder="Khan"
                            className={inputClass} style={iStyle(errors.lastName)}
                            onFocus={e=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                            onBlur={e=>(e.currentTarget.style.borderColor=errors.lastName?"var(--color-accent)":"var(--color-border)")} />
                        </Field>
                        <Field label="Email" error={errors.email}>
                          <input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="ali@example.com"
                            className={inputClass} style={iStyle(errors.email)}
                            onFocus={e=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                            onBlur={e=>(e.currentTarget.style.borderColor=errors.email?"var(--color-accent)":"var(--color-border)")} />
                        </Field>
                        <Field label="Phone" error={errors.phone}>
                          <input type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+92 300 1234567"
                            className={inputClass} style={iStyle(errors.phone)}
                            onFocus={e=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                            onBlur={e=>(e.currentTarget.style.borderColor=errors.phone?"var(--color-accent)":"var(--color-border)")} />
                        </Field>
                      </div>
                      <button type="button" onClick={next}
                        className="w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-95"
                        style={{ backgroundColor:"var(--color-accent)", color:"#fff", boxShadow:"var(--shadow-accent)" }}>
                        Continue to Shipping →
                      </button>
                    </motion.div>
                  )}

                  {/* Step 2 — Shipping */}
                  {step===2 && (
                    <motion.div key="s2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                      className="p-6 rounded-2xl border space-y-5"
                      style={{ backgroundColor:"var(--color-card)", borderColor:"var(--color-border)" }}>
                      <h2 className="text-lg font-black" style={{ color:"var(--color-text)" }}>Shipping Address</h2>
                      <Field label="Street Address" error={errors.address}>
                        <input value={form.address} onChange={e=>set("address",e.target.value)} placeholder="House #, Street, Area"
                          className={inputClass} style={iStyle(errors.address)}
                          onFocus={e=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                          onBlur={e=>(e.currentTarget.style.borderColor=errors.address?"var(--color-accent)":"var(--color-border)")} />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="City" error={errors.city}>
                          <input value={form.city} onChange={e=>set("city",e.target.value)} placeholder="Lahore"
                            className={inputClass} style={iStyle(errors.city)}
                            onFocus={e=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                            onBlur={e=>(e.currentTarget.style.borderColor=errors.city?"var(--color-accent)":"var(--color-border)")} />
                        </Field>
                        <Field label="Province" error={errors.province}>
                          <select value={form.province} onChange={e=>set("province",e.target.value)}
                            className={inputClass}
                            style={{ borderColor:errors.province?"var(--color-accent)":"var(--color-border)", color:form.province?"var(--color-text)":"var(--color-text-faint)", backgroundColor:"var(--color-bg)" }}>
                            <option value="">Select province...</option>
                            {PROVINCES.map(p=><option key={p} value={p}>{p}</option>)}
                          </select>
                        </Field>
                        <Field label="Postal Code">
                          <input value={form.postalCode} onChange={e=>set("postalCode",e.target.value)} placeholder="54000"
                            className={inputClass} style={{ borderColor:"var(--color-border)", color:"var(--color-text)", backgroundColor:"var(--color-bg)" }}
                            onFocus={e=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                            onBlur={e=>(e.currentTarget.style.borderColor="var(--color-border)")} />
                        </Field>
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={()=>setStep(1)}
                          className="px-6 py-3.5 rounded-xl font-bold text-sm border transition-all"
                          style={{ borderColor:"var(--color-border)", color:"var(--color-text-muted)", backgroundColor:"transparent" }}>
                          ← Back
                        </button>
                        <button type="button" onClick={next}
                          className="flex-1 py-3.5 rounded-xl font-black text-sm transition-all active:scale-95"
                          style={{ backgroundColor:"var(--color-accent)", color:"#fff" }}>
                          Continue to Payment →
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 — Payment */}
                  {step===3 && (
                    <motion.div key="s3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                      className="p-6 rounded-2xl border space-y-5"
                      style={{ backgroundColor:"var(--color-card)", borderColor:"var(--color-border)" }}>
                      <h2 className="text-lg font-black" style={{ color:"var(--color-text)" }}>Payment Method</h2>
                      <div className="grid grid-cols-2 gap-3">
                        {(["cod","card"] as const).map(m => (
                          <button key={m} type="button" onClick={()=>set("paymentMethod",m)}
                            className="p-4 rounded-xl border-2 text-left transition-all"
                            style={{
                              borderColor: form.paymentMethod===m ? "var(--color-accent)" : "var(--color-border)",
                              backgroundColor: form.paymentMethod===m ? "var(--color-accent-dim)" : "var(--color-bg)",
                            }}>
                            <div className="flex items-center gap-2 mb-1">
                              {m==="cod"
                                ? <Banknote className="w-5 h-5" style={{ color:"var(--color-accent)" }} />
                                : <CreditCard className="w-5 h-5" style={{ color:"var(--color-gold)" }} />}
                              <span className="text-sm font-bold" style={{ color:"var(--color-text)" }}>
                                {m==="cod" ? "Cash on Delivery" : "Card Payment"}
                              </span>
                            </div>
                            <p className="text-xs" style={{ color:"var(--color-text-muted)" }}>
                              {m==="cod" ? "Pay when you receive" : "Visa, Mastercard, etc."}
                            </p>
                          </button>
                        ))}
                      </div>

                      {form.paymentMethod==="card" && (
                        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} className="space-y-4 overflow-hidden">
                          <Field label="Cardholder Name" error={errors.cardName}>
                            <input value={form.cardName} onChange={e=>set("cardName",e.target.value)} placeholder="Ali Khan"
                              className={inputClass} style={iStyle(errors.cardName)}
                              onFocus={e=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                              onBlur={e=>(e.currentTarget.style.borderColor=errors.cardName?"var(--color-accent)":"var(--color-border)")} />
                          </Field>
                          <Field label="Card Number" error={errors.cardNumber}>
                            <input value={form.cardNumber} onChange={e=>set("cardNumber",fmtCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19}
                              className={inputClass} style={iStyle(errors.cardNumber)}
                              onFocus={e=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                              onBlur={e=>(e.currentTarget.style.borderColor=errors.cardNumber?"var(--color-accent)":"var(--color-border)")} />
                          </Field>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Expiry" error={errors.cardExpiry}>
                              <input value={form.cardExpiry} onChange={e=>set("cardExpiry",fmtExp(e.target.value))} placeholder="MM/YY" maxLength={5}
                                className={inputClass} style={iStyle(errors.cardExpiry)}
                                onFocus={e=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                                onBlur={e=>(e.currentTarget.style.borderColor=errors.cardExpiry?"var(--color-accent)":"var(--color-border)")} />
                            </Field>
                            <Field label="CVC" error={errors.cardCvc}>
                              <input value={form.cardCvc} onChange={e=>set("cardCvc",e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="123" maxLength={4}
                                className={inputClass} style={iStyle(errors.cardCvc)}
                                onFocus={e=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                                onBlur={e=>(e.currentTarget.style.borderColor=errors.cardCvc?"var(--color-accent)":"var(--color-border)")} />
                            </Field>
                          </div>
                          <p className="flex items-center gap-2 text-xs" style={{ color:"var(--color-text-faint)" }}>
                            <Lock className="w-3 h-3" /> Your payment info is encrypted and secure.
                          </p>
                        </motion.div>
                      )}

                      <div className="flex gap-3">
                        <button type="button" onClick={()=>setStep(2)}
                          className="px-6 py-3.5 rounded-xl font-bold text-sm border transition-all"
                          style={{ borderColor:"var(--color-border)", color:"var(--color-text-muted)", backgroundColor:"transparent" }}>
                          ← Back
                        </button>
                        <button type="submit" disabled={submitting}
                          className="flex-1 py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                          style={{ backgroundColor:"var(--color-accent)", color:"#fff", boxShadow:"var(--shadow-accent)" }}>
                          {submitting
                            ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                            : <><Truck className="w-4 h-4" /> Place Order</>}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right — Order Summary */}
              <div className="lg:col-span-2">
                <div className="sticky top-24 p-5 rounded-2xl border space-y-4"
                  style={{ backgroundColor:"var(--color-card)", borderColor:"var(--color-border)" }}>
                  <h3 className="font-black text-base" style={{ color:"var(--color-text)" }}>Order Summary</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {cart.map(item => (
                      <div key={item.productId} className="flex gap-3 items-center">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor:"var(--color-bg)" }}>
                          <Image src={item.images[0]?.src||"/placeholder.png"} alt={item.title} fill className="object-cover" />
                          <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-black rounded-full flex items-center justify-center"
                            style={{ backgroundColor:"var(--color-accent)", color:"#fff" }}>{item.quantity}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color:"var(--color-text)" }}>{item.title}</p>
                          <p className="text-[10px]" style={{ color:"var(--color-text-faint)" }}>{item.vendor}</p>
                        </div>
                        <p className="text-sm font-black shrink-0" style={{ color:"var(--color-accent)" }}>
                          Rs. {(parseFloat(item.variants[0].price)*item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-2 text-sm" style={{ borderColor:"var(--color-border)" }}>
                    <div className="flex justify-between" style={{ color:"var(--color-text-muted)" }}>
                      <span>Subtotal ({totalItems} items)</span>
                      <span style={{ color:"var(--color-text)" }}>Rs. {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between" style={{ color:"var(--color-text-muted)" }}>
                      <span>Shipping</span>
                      <span className="font-bold" style={{ color:"#22c55e" }}>Free</span>
                    </div>
                    <div className="flex justify-between font-black text-base border-t pt-3"
                      style={{ borderColor:"var(--color-border)", color:"var(--color-text)" }}>
                      <span>Total</span>
                      <span style={{ color:"var(--color-accent)" }}>Rs. {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="flex items-center justify-center gap-1.5 text-xs" style={{ color:"var(--color-text-faint)" }}>
                    <Lock className="w-3 h-3" /> Secure 256-bit SSL checkout
                  </p>
                </div>
              </div>

            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
