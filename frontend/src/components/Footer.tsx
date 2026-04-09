import { MapPin, Phone, Mail, Share2, MessageCircle, PlayCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const sections = [
    { key: "footer.services",     label: t("footer.services"),     items: t("footer.links.services", { returnObjects: true }) as string[] },
    { key: "footer.destinations", label: t("footer.destinations"), items: t("footer.links.destinations", { returnObjects: true }) as string[] },
    { key: "footer.company",      label: t("footer.company"),      items: t("footer.links.company", { returnObjects: true }) as string[] },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs tracking-wider">MBT</span>
              </div>
              <div>
                <span className="font-bold text-white text-sm leading-tight block">MANGBALI</span>
                <span className="text-primary-400 font-semibold text-xs tracking-widest">TRIP</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary-400 flex-shrink-0" />
                <span>Jl. Raya Ubud No. 88, Bali, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary-400 flex-shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary-400 flex-shrink-0" />
                <span>hello@mangbalitrip.com</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: <Share2 size={18} />, label: "Instagram" },
                { icon: <MessageCircle size={18} />, label: "Facebook" },
                { icon: <PlayCircle size={18} />, label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="p-2.5 bg-white/10 hover:bg-primary-500 rounded-xl transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.key}>
              <h4 className="text-white font-bold text-sm mb-4 tracking-wide">{section.label}</h4>
              <ul className="space-y-2.5">
                {section.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} MangBali Trip. {t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-gray-300 transition-colors">{t("footer.terms")}</a>
            <a href="#" className="hover:text-gray-300 transition-colors">{t("footer.cookies")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
