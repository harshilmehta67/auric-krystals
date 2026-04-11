"use client";

import { useState, useCallback } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import CartToast from "./CartToast";
import QuizModal from "./QuizModal";
import { QuizOpenProvider } from "./QuizUIContext";
import { useCart } from "./CartProvider";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const { lastAdded, clearLastAdded } = useCart();

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openQuiz = useCallback(() => setQuizOpen(true), []);
  const closeQuiz = useCallback(() => setQuizOpen(false), []);

  return (
    <QuizOpenProvider openQuiz={openQuiz}>
      <Header onCartOpen={openCart} onQuizOpen={openQuiz} />
      <main className="relative z-[1]">{children}</main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={closeCart} />
      <QuizModal open={quizOpen} onClose={closeQuiz} />
      <CartToast data={lastAdded} onClose={clearLastAdded} onCartOpen={openCart} />
    </QuizOpenProvider>
  );
}
