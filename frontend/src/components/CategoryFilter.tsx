import { useRef, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCategories } from "../hooks/usePackages";

interface Props {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  const { t } = useTranslation();
  const { data: categories } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  return (
    <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 z-10 bg-white shadow-md rounded-full p-1.5 text-gray-600 hover:text-primary-500 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex items-center gap-2 overflow-x-auto py-4 scroll-smooth scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onChange(cat)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap ${
                  active === cat
                    ? "bg-gray-900 text-white border-gray-900 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm"
                }`}
              >
                {t(`categories.${cat}`, cat)}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 z-10 bg-white shadow-md rounded-full p-1.5 text-gray-600 hover:text-primary-500 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
