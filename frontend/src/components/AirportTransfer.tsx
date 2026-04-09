import { Plane, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LocationAutocomplete from "./LocationAutocomplete";

export default function AirportTransfer() {
  const { t } = useTranslation();
  const [tripType, setTripType] = useState<"arrival" | "departure">("arrival");
  const [location, setLocation] = useState("");

  const features = [
    { icon: <Plane size={18} />, key: "airportTransfer.features.airports" },
    { icon: <MapPin size={18} />, key: "airportTransfer.features.dropoff" },
    { icon: <Users size={18} />, key: "airportTransfer.features.private" },
    { icon: <Calendar size={18} />, key: "airportTransfer.features.247" },
  ];

  return (
    <section id="airport-transfer" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <div>
            <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              {t("airportTransfer.sectionBadge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {t("airportTransfer.title")}
              <span className="text-primary-500"> {t("airportTransfer.titleHighlight")}</span>{" "}
              {t("airportTransfer.titleSuffix")}
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              {t("airportTransfer.description")}
            </p>

            <div className="space-y-4">
              {features.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-700">
                  <span className="text-primary-500 flex-shrink-0">{item.icon}</span>
                  <span className="text-sm">{t(item.key)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg mb-5">{t("airportTransfer.formTitle")}</h3>

            {/* Trip Type Toggle */}
            <div className="flex bg-white rounded-xl p-1 border border-gray-200 mb-5">
              {(["arrival", "departure"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTripType(type)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    tripType === type
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t(`airportTransfer.${type}`)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
                  {tripType === "arrival" ? t("airportTransfer.dropoffLabel") : t("airportTransfer.pickupLabel")}
                </label>
                <LocationAutocomplete
                  value={location}
                  onChange={setLocation}
                  placeholder={t("airportTransfer.locationPlaceholder")}
                  wrapperClassName="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
                    {t("airportTransfer.dateLabel")}
                  </label>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
                    <Calendar size={16} className="text-gray-400" />
                    <input
                      type="date"
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
                    {t("airportTransfer.passengersLabel")}
                  </label>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
                    <Users size={16} className="text-gray-400" />
                    <select className="flex-1 text-sm text-gray-700 outline-none bg-transparent">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n}>
                          {n} {n > 1 ? t("common.passengers") : t("common.passenger")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg mt-2">
                {t("airportTransfer.searchBtn")} <ArrowRight size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              {t("airportTransfer.guarantee")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
