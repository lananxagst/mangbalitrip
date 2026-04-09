import { BookOpen, Clock, Eye, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTravelGuides } from "../hooks/useTravelGuides";

const categoryColors: Record<string, string> = {
  "Island News": "bg-orange-500",
  "Travel Tips & Guides": "bg-primary-500",
};

export default function TravelGuide() {
  const { t } = useTranslation();
  const { data: travelGuides, loading } = useTravelGuides();
  return (
    <section className="py-14 bg-orange-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-primary-500 rounded-xl mt-0.5">
              <BookOpen className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t("guide.title")}</h2>
              <p className="text-gray-500 text-sm">{t("guide.subtitle")}</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 border border-gray-300 hover:border-primary-500 hover:text-primary-500 text-gray-700 text-sm font-medium px-5 py-2 rounded-full transition-all">
            {t("guide.seeMore")} <ArrowRight size={14} />
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {travelGuides.map((guide) => (
            <article
              key={guide.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span
                  className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full ${
                    categoryColors[guide.category] ?? "bg-gray-700"
                  }`}
                >
                  {guide.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
                  {guide.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {guide.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} /> {guide.views}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
