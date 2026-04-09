import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PackageCard from "./PackageCard";
import { useTranslation } from "react-i18next";
import { useTopPicks } from "../hooks/usePackages";

export default function TopPicks() {
  const { t } = useTranslation();
  const { data: topPicks, loading } = useTopPicks();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

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
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Scrollable Cards */}
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-52 h-72 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {topPicks.map((pkg) => (
              <div key={pkg.id} className="flex-shrink-0 w-64 sm:w-72">
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
