import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal() {
  const { authModalOpen, authMode, closeAuthModal, login, register, openAuthModal } = useAuth();

  const [mode, setMode] = useState<"login" | "register">(authMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(authMode);
    setError(null);
  }, [authMode, authModalOpen]);

  useEffect(() => {
    setError(null);
  }, [mode]);

  if (!authModalOpen) return null;

  const reset = () => {
    setName(""); setEmail(""); setPassword(""); setWhatsapp("");
    setError(null); setShowPass(false);
  };

  const handleClose = () => { reset(); closeAuthModal(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password, whatsapp || undefined);
      }
      reset();
      closeAuthModal();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 px-8 pt-8 pb-6 text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-sm tracking-wider">MBT</span>
          </div>
          <h2 className="text-white font-bold text-xl">
            {mode === "login" ? "Welcome Back!" : "Create Account"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {mode === "login"
              ? "Sign in to manage your bookings"
              : "Join MangBali Trip today"}
          </p>

          {/* Tabs */}
          <div className="flex mt-5 bg-white/10 rounded-xl p-1 gap-1">
            <button
              onClick={() => { setMode("login"); openAuthModal("login"); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === "login"
                  ? "bg-primary-500 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode("register"); openAuthModal("register"); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === "register"
                  ? "bg-primary-500 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Name (register only) */}
          {mode === "register" && (
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                Full Name *
              </label>
              <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                <User size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
              Email *
            </label>
            <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <Mail size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
              Password *
            </label>
            <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <Lock size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Min. 6 characters" : "Your password"}
                required
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* WhatsApp (register only) */}
          {mode === "register" && (
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                WhatsApp <span className="text-gray-400 normal-case font-normal">(optional)</span>
              </label>
              <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                <Phone size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+62 8xx xxxx xxxx"
                  className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading
              ? mode === "login" ? "Signing in..." : "Creating account..."
              : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {/* Switch mode */}
          <p className="text-center text-sm text-gray-500">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-primary-500 font-semibold hover:underline"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary-500 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>,
    document.body
  );
}
