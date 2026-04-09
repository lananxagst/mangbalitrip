import { useState, useEffect, useRef } from "react";
import { Globe, DollarSign, User, Heart, Menu, X, Plane, LogOut, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { useAuth } from "../context/AuthContext";

const LANGUAGES = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "id", label: "ID", flag: "🇮🇩" },
  { code: "zh", label: "ZH", flag: "🇨🇳" },
  { code: "ja", label: "JA", flag: "🇯🇵" },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { user, openAuthModal, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [currency, setCurrency] = useState("IDR");
  const langRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const handleLangChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setLangOpen(false);
  };

  const handleCurrencyChange = (c: string) => {
    setCurrency(c);
    setCurrencyOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) setCurrencyOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs tracking-wider">MBT</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-gray-900 text-sm leading-tight block">MANGBALI</span>
              <span className="text-primary-500 font-semibold text-xs tracking-widest">TRIP</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#airport-transfer"
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-200"
            >
              <Plane size={14} />
              {t("nav.bookAirport")}
            </a>

            <button className="text-gray-600 hover:text-primary-500 transition-colors">
              <Heart size={20} />
            </button>

            {/* Language */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => { setLangOpen((v) => !v); setCurrencyOpen(false); }}
                className="flex items-center gap-1 text-gray-700 hover:text-primary-500 text-sm font-medium transition-colors"
              >
                <Globe size={16} />
                {currentLang.flag} {currentLang.label}
                <span className="text-xs">{langOpen ? "▴" : "▾"}</span>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[140px] z-50">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLangChange(l.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2 ${
                        i18n.language === l.code ? "text-primary-600 font-semibold bg-orange-50" : "text-gray-700"
                      }`}
                    >
                      <span>{l.flag}</span> {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => { setCurrencyOpen((v) => !v); setLangOpen(false); }}
                className="flex items-center gap-1 text-gray-700 hover:text-primary-500 text-sm font-medium transition-colors"
              >
                <DollarSign size={16} />
                {currency}
                <span className="text-xs">{currencyOpen ? "▴" : "▾"}</span>
              </button>
              {currencyOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[120px] z-50">
                  {["IDR", "USD", "EUR", "SGD"].map((c) => (
                    <button
                      key={c}
                      onClick={() => handleCurrencyChange(c)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        currency === c ? "text-primary-600 font-semibold bg-orange-50" : "text-gray-700"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen((v) => !v)}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-500 text-sm font-medium transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={14} className={`transition-transform ${userOpen ? "rotate-180" : ""}`} />
                </button>
                {userOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg py-2 min-w-[180px] z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { logout(); setUserOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="flex items-center gap-1.5 border border-gray-200 hover:border-primary-400 hover:text-primary-500 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full transition-all"
              >
                <User size={15} /> Log In
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4">
          {/* Book Airport CTA */}
          <a
            href="#airport-transfer"
            className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-full w-full justify-center"
            onClick={() => setIsOpen(false)}
          >
            <Plane size={14} />
            {t("nav.bookAirport")}
          </a>

          {/* Language selector */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Globe size={12} /> Language
            </p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { handleLangChange(l.code); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                    i18n.language === l.code
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Currency selector */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <DollarSign size={12} /> Currency
            </p>
            <div className="flex flex-wrap gap-2">
              {["IDR", "USD", "EUR", "SGD"].map((c) => (
                <button
                  key={c}
                  onClick={() => { handleCurrencyChange(c); }}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    currency === c
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Divider + user */}
          <div className="border-t border-gray-100 pt-3">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="flex items-center gap-1.5 text-red-500 text-sm font-medium"
                >
                  <LogOut size={15} /> Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { openAuthModal("login"); setIsOpen(false); }}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:border-primary-400 hover:text-primary-500 transition-all"
              >
                <User size={15} /> Log In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
