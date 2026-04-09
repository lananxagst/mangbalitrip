import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PackageCard from "./PackageCard";
import { useTranslation } from "react-i18next";
import { useTopPicks } from "../hooks/usePackages";

const GAP = 16; // gap-4

export default function TopPicks() {
  const { t } = useTranslation();
  const { data: topPicks, loading } = useTopPicks();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  const getCardWidth = useCallback(() => {
    const first = scrollRef.current?.children[0] as HTMLElement | undefined;
    return first ? first.offsetWidth + GAP : 288 + GAP;
  }, []);

  const syncState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 4);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 4);
    setActiveIdx(Math.round(scrollLeft / getCardWidth()));
  }, [getCardWidth]);

  useEffect(() => {
    syncState();
  }, [topPicks, syncState]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? getCardWidth() : -getCardWidth(),
      behavior: "smooth",
    });
    resetAutoSlide();
  };

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);

  const scrollToIndex = useCallback((i: number) => {
    scrollRef.current?.scrollTo({ left: i * getCardWidth(), behavior: "smooth" });
  }, [getCardWidth]);

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (pausedRef.current || !scrollRef.current || topPicks.length < 2) return;
      const el = scrollRef.current;
      const cardW = getCardWidth();
      const maxScroll = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + cardW > maxScroll - 4
        ? 0
        : el.scrollLeft + cardW;
      el.scrollTo({ left: next, behavior: "smooth" });
    }, 3500);
  }, [getCardWidth, topPicks.length]);

  const resetAutoSlide = () => {
    startAutoSlide();
  };

  useEffect(() => {
    if (topPicks.length > 1) startAutoSlide();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [topPicks.length, startAutoSlide]);

  return (
    <section className="py-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("topPicks.title")}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canLeft}
                className={`p-2 rounded-full border transition-all duration-200 ${
                  canLeft
                    ? "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm"
                    : "border-gray-100 text-gray-300 cursor-default"
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canRight}
                className={`p-2 rounded-full border transition-all duration-200 ${
                  canRight
                    ? "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm"
                    : "border-gray-100 text-gray-300 cursor-default"
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Carousel */}
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-full sm:w-72 h-72 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div
                ref={scrollRef}
                onScroll={syncState}
                onMouseEnter={() => { pausedRef.current = true; }}
                onMouseLeave={() => { pausedRef.current = false; }}
                onTouchStart={() => { pausedRef.current = true; }}
                onTouchEnd={() => { pausedRef.current = false; resetAutoSlide(); }}
                className="flex gap-4 overflow-x-auto pb-1"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  scrollSnapType: "x mandatory",
                }}
              >
                {topPicks.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex-shrink-0 w-full sm:w-72"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <PackageCard pkg={pkg} />
                  </div>
                ))}
              </div>

              {/* Dot indicators */}
              {topPicks.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-5">
                  {topPicks.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { scrollToIndex(i); resetAutoSlide(); }}
                      className={`rounded-full transition-all duration-300 ${
                        i === activeIdx
                          ? "w-5 h-2 bg-primary-500"
                          : "w-2 h-2 bg-gray-200 hover:bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
