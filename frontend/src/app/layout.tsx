import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";
import { ToastProvider } from "@/components/Toast";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jutay.co — Premium Footwear",
  description:
    "Pakistan's leading source of in-vogue and elegant footwear. Shop the latest styles at pocket-friendly prices.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>{children}</ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
