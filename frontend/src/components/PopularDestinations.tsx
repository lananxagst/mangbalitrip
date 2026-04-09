import { MapPin, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDestinations } from "../hooks/useDestinations";

export default function PopularDestinations() {
  const { t } = useTranslation();
  const { data: destinations, loading } = useDestinations();
  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="text-primary-500" size={22} />
            <h2 className="text-2xl font-bold text-gray-900">{t("destinations.title")}</h2>
          </div>
          <button className="flex items-center gap-1.5 border border-gray-300 hover:border-primary-500 hover:text-primary-500 text-gray-700 text-sm font-medium px-5 py-2 rounded-full transition-all">
            {t("destinations.seeMore")} <ArrowRight size={14} />
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[4/3]"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="text-white font-bold text-lg drop-shadow-lg">{dest.name}</span>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
