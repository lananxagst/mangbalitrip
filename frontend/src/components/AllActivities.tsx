import { useState } from "react";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import PackageCard from "./PackageCard";
import { useTranslation } from "react-i18next";
import { usePackages } from "../hooks/usePackages";

interface Props {
  activeCategory: string;
}

export default function AllActivities({ activeCategory }: Props) {
  const { t } = useTranslation();
  const { data: allActivities, loading } = usePackages(activeCategory);
  const [visibleCount, setVisibleCount] = useState(10);

  const visible = allActivities.slice(0, visibleCount);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t("activities.title")}</h2>
            <p className="text-gray-500 text-sm mt-1">{allActivities.length} {t("activities.found")}</p>
          </div>
          <button className="flex items-center gap-2 border border-gray-200 hover:border-gray-400 text-gray-700 text-sm font-medium px-4 py-2 rounded-full transition-all">
            <SlidersHorizontal size={14} />
            {t("activities.filter")}
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1,2,3,4,5,6,7,8,9,10].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : visible.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {visible.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>

            {/* Load More / See All */}
            {visibleCount < allActivities.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((c) => c + 10)}
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  {t("activities.seeMore")} <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">{t("activities.noResults")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
