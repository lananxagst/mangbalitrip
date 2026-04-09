import { ShieldCheck, Star, User, BadgeDollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TrustIndicators() {
  const { t } = useTranslation();
  const items = [
    { icon: <ShieldCheck className="w-10 h-10 text-bali-green" strokeWidth={1.5} />, key: "trust.safe" },
    { icon: <Star className="w-10 h-10 text-bali-green" strokeWidth={1.5} />, key: "trust.reviews" },
    { icon: <User className="w-10 h-10 text-bali-green" strokeWidth={1.5} />, key: "trust.expert" },
    { icon: <BadgeDollarSign className="w-10 h-10 text-bali-green" strokeWidth={1.5} />, key: "trust.worth" },
  ];
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-2xl bg-green-50">{item.icon}</div>
              <p className="text-gray-700 font-semibold text-sm leading-snug">{t(item.key)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
