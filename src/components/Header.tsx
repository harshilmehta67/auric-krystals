"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";

interface HeaderProps {
  onCartOpen: () => void;
  onQuizOpen: () => void;
}

export default function Header({ onCartOpen, onQuizOpen }: HeaderProps) {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [badgeBounce, setBadgeBounce] = useState(false);
  const prevTotalRef = useRef(totalItems);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 32);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.classList.add("overflow-hidden");
      // Focus the close button so the SR announces the drawer and tab order is sane.
      const t = setTimeout(() => drawerCloseRef.current?.focus(), 30);
      return () => {
        clearTimeout(t);
        document.body.classList.remove("overflow-hidden");
      };
    }
    document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileNavOpen]);

  // Esc closes the mobile drawer and returns focus to the hamburger.
  useEffect(() => {
    if (!mobileNavOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileNavOpen(false);
        hamburgerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  function closeDrawer() {
    setMobileNavOpen(false);
    // Defer so the drawer's hidden class lands before refocus moves the ring.
    setTimeout(() => hamburgerRef.current?.focus(), 0);
  }

  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      setBadgeBounce(true);
      const t = setTimeout(() => setBadgeBounce(false), 600);
      return () => clearTimeout(t);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className={`ak-site-header fixed top-0 left-0 right-0 z-50 ${
        scrolled ? "ak-site-header--scrolled" : ""
      }`}
    >
      <div className="ak-site-header__sub">
        <div className="ak-site-header__inner flex flex-row items-center justify-center sm:justify-between gap-2 sm:gap-4 px-4 sm:px-8 lg:px-10 py-1.5 sm:py-2">
          <span className="ak-site-header__sub-text truncate text-center sm:text-left max-w-[85vw] sm:max-w-none">
            Ethically sourced · Hand-selected specimens
          </span>
          <span className="ak-site-header__sub-text hidden sm:inline shrink-0 text-primary/80">
            Astrology &amp; crystal guidance
          </span>
        </div>
      </div>
      <nav className="ak-site-header__inner flex justify-between items-center w-full px-4 sm:px-8 lg:px-10 py-3 sm:py-4 relative">
        <Link
          href="/"
          aria-label="Auric Krystals — home"
          className="flex items-center min-w-0 group basis-[40%] sm:basis-[38%] md:basis-[34%] lg:basis-[32%] shrink-0"
        >
          <Image
            src="/assets/auric-krystals-logo.png"
            alt="Auric Krystals"
            width={1267}
            height={206}
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 32vw, 42vw"
            className="h-12 sm:h-14 md:h-16 w-auto max-w-full object-contain object-left transition-opacity group-hover:opacity-90"
            priority
          />
        </Link>

        <div className="ak-nav-desktop hidden md:flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(link.href)
                  ? "text-primary border-b-2 border-amber-500 font-medium"
                  : "hover:text-primary transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={onQuizOpen}
            className="ak-quiz-pill"
            aria-label="Take the crystal quiz"
          >
            Crystal Quiz
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            ref={hamburgerRef}
            type="button"
            className="md:hidden p-2.5 rounded-xl text-primary hover:bg-primary-fixed/40 transition-colors"
            aria-label="Open menu"
            aria-expanded={mobileNavOpen}
            aria-controls="ak-mobile-drawer"
            onClick={() => setMobileNavOpen(true)}
          >
            <span className="material-symbols-outlined text-2xl" aria-hidden="true">menu</span>
          </button>
          <button
            type="button"
            onClick={onCartOpen}
            className="relative p-2.5 rounded-xl text-primary hover:bg-primary-fixed/40 transition-colors"
            aria-label={totalItems > 0 ? `Open cart, ${totalItems} item${totalItems === 1 ? "" : "s"}` : "Open cart"}
          >
            <span className="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {totalItems > 0 ? `${totalItems} item${totalItems === 1 ? "" : "s"} in cart` : "Cart empty"}
            </span>
            {totalItems > 0 && (
              <span
                aria-hidden="true"
                className={`absolute -top-0.5 -right-0.5 w-5 h-5 bg-secondary text-on-secondary text-[10px] font-bold rounded-full flex items-center justify-center transition-transform ${
                  badgeBounce ? "animate-cart-bounce" : ""
                }`}
              >
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile nav drawer */}
        <div
          id="ak-mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={`fixed inset-0 z-[60] ${mobileNavOpen ? "" : "hidden"} md:hidden`}
          aria-hidden={!mobileNavOpen}
        >
          <div
            className="absolute inset-0 bg-black/45 ak-nav-blur"
            onClick={closeDrawer}
          />
          <div className="ak-site-header__drawer absolute right-0 top-0 h-full w-[min(100%,18rem)] sm:w-80 shadow-2xl flex flex-col p-6 border-l border-outline-variant/25">
            <div className="flex justify-between items-center mb-8">
              <span className="font-headline text-primary text-lg">Explore</span>
              <button
                ref={drawerCloseRef}
                type="button"
                onClick={closeDrawer}
                className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeDrawer}
                  className={
                    isActive(link.href)
                      ? "py-3 px-4 rounded-xl bg-primary-fixed/50 text-primary font-medium"
                      : "py-3 px-4 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
                  }
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  onQuizOpen();
                }}
                className="mt-3 ak-quiz-pill self-start"
              >
                Crystal Quiz
              </button>
            </nav>
          </div>
        </div>
      </nav>
    </header>
  );
}
