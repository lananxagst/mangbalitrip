import { useState } from "react";
import { Search, CheckCircle, Tag, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

const suggestions = [
  "Ubud Tour",
  "Bali Waterfall",
  "Mount Batur Trek",
  "Tanah Lot",
  "Airport Transfer",
  "Seminyak Beach",
];

export default function Hero() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1677829177642-30def98b0963?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/30">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {t("hero.badge")}
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4 drop-shadow-2xl">
          {t("hero.title")}
          <span className="text-primary-400"> {t("hero.titleHighlight")}</span>
        </h1>

        <p className="text-white/90 text-lg sm:text-xl mb-8 font-light tracking-wide">
          {t("hero.subtitle")}
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-visible px-4 py-1">
            <Search className="text-gray-400 flex-shrink-0" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder={t("hero.searchPlaceholder")}
              className="flex-1 px-3 py-3.5 text-gray-800 placeholder-gray-400 bg-transparent outline-none text-base"
            />
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-3 sm:px-6 py-2.5 rounded-xl transition-colors text-sm flex-shrink-0 flex items-center gap-1.5">
              <Search size={16} className="sm:hidden" />
              <span className="hidden sm:inline">{t("hero.searchBtn")}</span>
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
              {filtered.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => setQuery(s)}
                  className="w-full text-left px-5 py-3 text-gray-700 hover:bg-orange-50 hover:text-primary-600 flex items-center gap-3 text-sm transition-colors"
                >
                  <Search size={14} className="text-gray-400" />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-white text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-400" />
            <span className="font-medium">{t("hero.instantConfirmation")}</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw size={18} className="text-purple-400" />
            <span className="font-medium">{t("hero.freeCancellation")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-orange-400" />
            <span className="font-medium">{t("hero.bestPrice")}</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-0.5 h-8 bg-white/40 rounded-full" />
      </div>
    </section>
  );
}
