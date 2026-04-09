import { Heart, Star, Clock, CalendarCheck } from "lucide-react";
import type { Package } from "../data/packages";
import { useBooking } from "../context/BookingContext";

interface Props {
  pkg: Package;
  size?: "md" | "lg";
}

export default function PackageCard({ pkg, size = "md" }: Props) {
  const { openBooking } = useBooking();
  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p);

  const badgeColor =
    pkg.badge === "Top Pick"
      ? "bg-yellow-400 text-yellow-900"
      : pkg.badge === "Popular"
      ? "bg-gray-900 text-white"
      : "";

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group ${size === "lg" ? "h-full" : ""}`}>
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${size === "lg" ? "h-44 sm:h-52" : "h-36 sm:h-44"}`}
          loading="lazy"
        />
        {/* Badge */}
        {pkg.badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${badgeColor}`}>
            {pkg.badge}
          </span>
        )}
        {/* Wishlist */}
        <button className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 rounded-full p-1.5 transition-all shadow-sm">
          <Heart size={14} />
        </button>
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {pkg.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <span className="font-medium text-gray-700">{pkg.type}</span>
          <span>·</span>
          <Clock size={11} />
          <span>{pkg.duration}</span>
        </div>

        <div className="text-xs text-gray-500 mb-2">
          From{" "}
          <span className="font-bold text-gray-900 text-sm">{formatPrice(pkg.price)}</span>
          <span> / person</span>
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(pkg.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-800">{pkg.rating.toFixed(2)}</span>
          <span className="text-xs text-gray-500">· {pkg.reviews.toLocaleString()} reviews</span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); openBooking(pkg); }}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all"
        >
          <CalendarCheck size={13} /> Book Now
        </button>
      </div>
    </div>
  );
}
