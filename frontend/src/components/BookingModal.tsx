import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Calendar,
  Users,
  MapPin,
  User,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  ChevronRight,
  Star,
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import LocationAutocomplete from "./LocationAutocomplete";

function StepBar({ step }: { step: number }) {
  const { t } = useTranslation();
  const STEPS = [t("booking.steps.details"), t("booking.steps.contact"), t("booking.steps.confirm")];
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const active = num === step;
        const done = num < step;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? "bg-bali-green text-white"
                    : active
                    ? "bg-primary-500 text-white ring-4 ring-primary-100"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? <CheckCircle size={14} /> : num}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  active ? "text-primary-600" : done ? "text-bali-green" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-14 h-0.5 rounded-full transition-all ${
                  done ? "bg-bali-green" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BookingModal() {
  const { t } = useTranslation();
  const {
    isOpen,
    selectedPackage,
    selectedDriverPackage,
    form,
    step,
    closeBooking,
    setStep,
    updateForm,
  } = useBooking();

  const pkg = selectedPackage;
  const drvPkg = selectedDriverPackage;

  const title = pkg?.title ?? drvPkg?.title ?? "";
  const price = pkg?.price ?? drvPkg?.price ?? 0;
  const duration = pkg?.duration ?? drvPkg?.duration ?? "";
  const image = pkg?.image ?? null;
  const type = pkg?.type ?? "Private Driver";

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(p);

  const totalPrice = price * form.passengers;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isStep1Valid = form.date && form.pickupLocation;
  const isStep2Valid = form.name && form.whatsapp;

  const handleConfirm = () => {
    const msg = encodeURIComponent(
      `Hello! I'd like to book:\n\n` +
      `📦 *${title}*\n` +
      `📅 Date: ${form.date}\n` +
      `👥 Passengers: ${form.passengers}\n` +
      `📍 Pickup: ${form.pickupLocation}\n` +
      `👤 Name: ${form.name}\n` +
      `📱 WhatsApp: ${form.whatsapp}\n` +
      `📧 Email: ${form.email || "-"}\n` +
      `💬 Notes: ${form.specialRequests || "-"}\n\n` +
      `💰 Total: ${formatPrice(totalPrice)}\n\n` +
      `Please confirm my booking. Thank you!`
    );
    window.open(`https://wa.me/6281234567890?text=${msg}`, "_blank");
    closeBooking();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeBooking}
      />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t("booking.title")}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{t("booking.subtitle")}</p>
            </div>
            <button
              onClick={closeBooking}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <X size={18} />
            </button>
          </div>
          <StepBar step={step} />
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* ── STEP 1: Details ── */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Package Summary */}
              <div className="flex gap-3 bg-orange-50 rounded-2xl p-3.5 border border-orange-100">
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{title}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{type}</span>
                    {duration && (
                      <>
                        <span>·</span>
                        <Clock size={11} />
                        <span>{duration}</span>
                      </>
                    )}
                  </div>
                  <p className="text-primary-600 font-bold text-sm mt-1">{formatPrice(price)} / person</p>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">
                  {t("booking.dateLabel")} *
                </label>
                <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                  <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="date"
                    value={form.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => updateForm({ date: e.target.value })}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">
                  {t("booking.passengersLabel")} *
                </label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
                  <Users size={16} className="text-gray-400" />
                  <div className="flex items-center gap-4 flex-1 justify-between">
                    <button
                      onClick={() => updateForm({ passengers: Math.max(1, form.passengers - 1) })}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary-400 hover:text-primary-500 flex items-center justify-center font-bold text-lg text-gray-600 transition-all"
                    >
                      −
                    </button>
                    <span className="font-bold text-gray-900 text-base w-8 text-center">
                      {form.passengers}
                    </span>
                    <button
                      onClick={() => updateForm({ passengers: Math.min(20, form.passengers + 1) })}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary-400 hover:text-primary-500 flex items-center justify-center font-bold text-lg text-gray-600 transition-all"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">{t("booking.maxPassengers")}</span>
                </div>
              </div>

              {/* Pickup */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">
                  {t("booking.pickupLabel")} *
                </label>
                <LocationAutocomplete
                  value={form.pickupLocation}
                  onChange={(val) => updateForm({ pickupLocation: val })}
                  placeholder={t("booking.pickupPlaceholder")}
                />
              </div>

              {/* Total Preview */}
              <div className="bg-gray-50 rounded-xl p-3.5 flex items-center justify-between">
                <span className="text-sm text-gray-600">{t("booking.estimatedTotal")}</span>
                <div className="text-right">
                  <p className="font-extrabold text-gray-900 text-lg">{formatPrice(totalPrice)}</p>
                  <p className="text-xs text-gray-400">{form.passengers} × {formatPrice(price)}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Contact ── */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-sm text-gray-500">{t("booking.contactNote")}</p>

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">
                  {t("booking.nameLabel")} *
                </label>
                <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                  <User size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={t("booking.namePlaceholder")}
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">
                  {t("booking.whatsappLabel")} *
                </label>
                <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                  <Phone size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="tel"
                    placeholder={t("booking.whatsappPlaceholder")}
                    value={form.whatsapp}
                    onChange={(e) => updateForm({ whatsapp: e.target.value })}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">
                  {t("booking.emailLabel")} <span className="text-gray-400 font-normal normal-case">{t("booking.emailOptional")}</span>
                </label>
                <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                  <Mail size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder={t("booking.emailPlaceholder")}
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">
                  {t("booking.notesLabel")} <span className="text-gray-400 font-normal normal-case">{t("booking.notesOptional")}</span>
                </label>
                <div className="flex items-start gap-2.5 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                  <MessageSquare size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <textarea
                    rows={3}
                    placeholder={t("booking.notesPlaceholder")}
                    value={form.specialRequests}
                    onChange={(e) => updateForm({ specialRequests: e.target.value })}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Booking Summary Card */}
              <div className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-2xl p-4 border border-orange-100">
                <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-3">{t("booking.packageSummary")}</p>
                <h3 className="font-bold text-gray-900 text-base leading-snug mb-3">{title}</h3>

                <div className="space-y-2 text-sm">
                  {[
                    { icon: <Calendar size={13} />, label: "Date", value: form.date },
                    { icon: <Users size={13} />, label: "Passengers", value: `${form.passengers} person${form.passengers > 1 ? "s" : ""}` },
                    { icon: <MapPin size={13} />, label: "Pickup", value: form.pickupLocation },
                    { icon: <User size={13} />, label: "Name", value: form.name },
                    { icon: <Phone size={13} />, label: "WhatsApp", value: form.whatsapp },
                    ...(form.email ? [{ icon: <Mail size={13} />, label: "Email", value: form.email }] : []),
                    ...(form.specialRequests ? [{ icon: <MessageSquare size={13} />, label: "Notes", value: form.specialRequests }] : []),
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-2.5">
                      <span className="text-primary-500 mt-0.5 flex-shrink-0">{row.icon}</span>
                      <span className="text-gray-500 w-16 flex-shrink-0">{row.label}</span>
                      <span className="text-gray-900 font-medium flex-1 break-words">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between bg-gray-900 text-white rounded-2xl px-5 py-4">
                <div>
                  <p className="text-gray-400 text-xs">{t("booking.totalPayment")}</p>
                  <p className="text-2xl font-extrabold">{formatPrice(totalPrice)}</p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>{form.passengers} person{form.passengers > 1 ? "s" : ""}</p>
                  <p>{formatPrice(price)} / person</p>
                </div>
              </div>

              {/* Trust Note */}
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-green-50 rounded-xl p-3 border border-green-100">
                <CheckCircle size={14} className="text-bali-green flex-shrink-0" />
                <span>{t("booking.freeCancel")}</span>
              </div>

              {/* Rating note */}
              {pkg && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span><strong className="text-gray-800">{pkg.rating}</strong> · {pkg.reviews.toLocaleString()} verified reviews</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-white">
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                {t("booking.back")}
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep((step + 1) as 2 | 3)}
                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {t("booking.continue")} <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                className="flex-1 bg-bali-green hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {t("booking.confirmWhatsapp")}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </button>
            )}
          </div>

          {step === 1 && (
            <p className="text-center text-xs text-gray-400 mt-3">
              {t("booking.noCredit")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
