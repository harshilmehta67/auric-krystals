"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface CarouselProps {
  children: React.ReactNode[];
}

export default function Carousel({ children }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = children.length;

  const getScrollAmount = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 320;
    const card = track.firstElementChild as HTMLElement | null;
    if (!card) return 320;
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    return card.getBoundingClientRect().width + gap;
  }, []);

  const scroll = useCallback(
    (delta: number) => {
      trackRef.current?.scrollBy({
        left: delta * getScrollAmount(),
        behavior: "smooth",
      });
    },
    [getScrollAmount]
  );

  const updateDots = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const amt = getScrollAmount();
    const idx = Math.round(track.scrollLeft / amt);
    setActiveIndex(Math.max(0, Math.min(idx, count - 1)));
  }, [getScrollAmount, count]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handler = () => requestAnimationFrame(updateDots);
    track.addEventListener("scroll", handler);
    return () => track.removeEventListener("scroll", handler);
  }, [updateDots]);

  const goToSlide = useCallback(
    (idx: number) => {
      const track = trackRef.current;
      if (!track) return;
      const cards = track.children;
      if (cards[idx]) {
        (cards[idx] as HTMLElement).scrollIntoView({
          behavior: "smooth",
          inline: "start",
          block: "nearest",
        });
      }
    },
    []
  );

  return (
    <div className="relative">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="ak-carousel__btn"
          aria-label="Previous"
          onClick={() => scroll(-1)}
        >
          <span className="material-symbols-outlined text-2xl">chevron_left</span>
        </button>
        <div className="ak-carousel__viewport flex-1 min-w-0 px-0.5">
          <div
            ref={trackRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth [scrollbar-width:thin]"
          >
            {children.map((child, i) => (
              <div key={i} className="snap-start shrink-0">
                {child}
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="ak-carousel__btn"
          aria-label="Next"
          onClick={() => scroll(1)}
        >
          <span className="material-symbols-outlined text-2xl">chevron_right</span>
        </button>
      </div>
      {count > 1 && (
        <div className="flex justify-center gap-2 mt-3 flex-wrap min-h-[0.5rem]">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`ak-carousel__dot ${
                i === activeIndex ? "ak-carousel__dot--active" : ""
              }`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
