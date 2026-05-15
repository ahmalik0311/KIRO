"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Ahmed Raza",
    city: "Lahore",
    rating: 5,
    text: "Absolutely love the quality! Got the Cloud Foam in black and it's incredibly comfortable. Delivery was super fast too. Will definitely order again.",
    avatar: "AR",
    avatarBg: "var(--color-accent)",
    verified: true,
  },
  {
    name: "Fatima Khan",
    city: "Karachi",
    rating: 5,
    text: "Best online shoe store in Pakistan. The prices are unbeatable and the shoes are 100% authentic. Customer support was also very helpful.",
    avatar: "FK",
    avatarBg: "var(--color-gold)",
    verified: true,
  },
  {
    name: "Usman Ali",
    city: "Islamabad",
    rating: 5,
    text: "Ordered 3 pairs and all arrived in perfect condition within 2 days. The grey Cloud Foam is my daily go-to now. Highly recommended!",
    avatar: "UA",
    avatarBg: "var(--color-accent)",
    verified: true,
  },
  {
    name: "Sara Malik",
    city: "Faisalabad",
    rating: 5,
    text: "Amazing experience from start to finish. The website is easy to use, checkout was smooth, and the shoes look exactly like the pictures.",
    avatar: "SM",
    avatarBg: "var(--color-gold)",
    verified: true,
  },
];

const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "2,400+", label: "Reviews" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function TestimonialsSection() {
  return (
    <section
      className="border-t"
      style={{
        backgroundColor: "var(--color-bg-soft)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            Customer Reviews
          </p>
          <h2 className="text-3xl font-black mb-4" style={{ color: "var(--color-text)" }}>
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" style={{ color: "var(--color-gold)" }} />
            ))}
            <span className="ml-2 text-sm font-bold" style={{ color: "var(--color-text-muted)" }}>
              4.9 / 5 from 2,400+ reviews
            </span>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-14 rounded-2xl overflow-hidden border"
          style={{ borderColor: "var(--color-border)" }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center py-6 px-4 text-center"
              style={{ backgroundColor: "var(--color-card)" }}
            >
              <p className="text-2xl font-black" style={{ color: "var(--color-accent)" }}>
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 rounded-2xl border flex flex-col"
              style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
              }}
            >
              {/* Quote */}
              <Quote
                className="absolute top-5 right-5 w-7 h-7 opacity-10"
                style={{ color: "var(--color-accent)" }}
              />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: "var(--color-gold)" }} />
                ))}
              </div>

              {/* Text */}
              <p
                className="text-sm leading-relaxed flex-1 mb-5"
                style={{ color: "var(--color-text-muted)" }}
              >
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ backgroundColor: review.avatarBg }}
                >
                  {review.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                      {review.name}
                    </p>
                    {review.verified && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: "var(--color-accent-dim)",
                          color: "var(--color-accent)",
                        }}
                      >
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: "var(--color-text-faint)" }}>
                    {review.city}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
