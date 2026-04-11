import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  title: "Auric Krystals — Crystal Shop & Astrology Services",
  description:
    "Ethically sourced crystals, bracelets, and astrology services. Discover your perfect stone.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="light" lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="ak-page bg-background font-body text-on-surface selection:bg-primary-fixed-dim antialiased">
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>
      </body>
    </html>
  );
}
