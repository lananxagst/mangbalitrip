import { Check, ArrowRight } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useDriverPackages } from "../hooks/useDriverPackages";

export default function DriverPackages() {
  const { openDriverBooking } = useBooking();
  const { data: driverPackages, loading } = useDriverPackages();
  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(p);

  return (
    <section id="packages" className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-primary-500/20 text-primary-400 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 border border-primary-500/30">
            Private Driver Packages
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Choose Your Perfect Ride
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Professional private drivers for every occasion — from airport transfers to multi-day adventures across Bali.
          </p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-80 bg-white/10 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {driverPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                pkg.isHighlighted
                  ? "bg-primary-500 text-white ring-4 ring-primary-400/50 scale-105"
                  : "bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/15"
              }`}
            >
              {pkg.isHighlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  ⭐ Most Popular
                </span>
              )}

              {/* Icon */}
              <div className="text-4xl mb-4">{pkg.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
              <p className={`text-sm mb-4 leading-relaxed ${pkg.isHighlighted ? "text-orange-100" : "text-gray-400"}`}>
                {pkg.description}
              </p>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-extrabold">{formatPrice(pkg.price)}</span>
                </div>
                <span className={`text-xs ${pkg.isHighlighted ? "text-orange-100" : "text-gray-400"}`}>
                  / {pkg.duration}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check
                      size={14}
                      className={`flex-shrink-0 ${pkg.isHighlighted ? "text-yellow-300" : "text-green-400"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => openDriverBooking({ title: pkg.title, price: pkg.price, duration: pkg.duration })}
                className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  pkg.isHighlighted
                    ? "bg-white text-primary-600 hover:bg-orange-50"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                Book Now <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
