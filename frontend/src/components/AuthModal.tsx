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

  const switchMode = (m: "login" | "register") => { setMode(m); openAuthModal(m); };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-white w-full max-w-[420px] rounded-3xl shadow-2xl overflow-hidden">

        {/* ── Hero gradient top ── */}
        <div className="relative bg-gradient-to-br from-orange-400 via-primary-500 to-amber-500 px-8 pt-8 pb-14 overflow-hidden text-center">
          {/* Decorative circles */}
          <span className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full pointer-events-none" />
          <span className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />
          <span className="absolute top-14 right-6 w-16 h-16 bg-white/5 rounded-full pointer-events-none" />

          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/15 transition-all"
          >
            <X size={18} />
          </button>

          {/* Brand mark */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-xl mb-4">
            <span className="text-primary-500 font-black text-base tracking-wider">MBT</span>
          </div>
          <h2 className="text-white font-bold text-2xl leading-tight">
            {mode === "login" ? "Welcome Back!" : "Join Us Today"}
          </h2>
          <p className="text-orange-100/90 text-sm mt-1.5">
            {mode === "login"
              ? "Sign in to manage your bookings"
              : "Create your MangBali Trip account"}
          </p>

          {/* Wave */}
          <svg
            viewBox="0 0 400 36"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 right-0 w-full h-9 fill-white"
          >
            <path d="M0,18 C80,36 160,0 240,18 C320,36 360,8 400,18 L400,36 L0,36 Z" />
          </svg>
        </div>

        {/* ── Floating tab switcher ── */}
        <div className="relative -mt-5 mx-5 z-10">
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/80 border border-gray-100 p-1.5 flex gap-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? "bg-primary-500 text-white shadow-md shadow-primary-200"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {m === "login" ? "Log In" : "Register"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-3.5">
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-xl">
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {mode === "register" && (
            <Field label="Full Name" required icon={<User size={15} />}>
              <input
                type="text" value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name" required
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400 min-w-0"
              />
            </Field>
          )}

          <Field label="Email" required icon={<Mail size={15} />}>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com" required
              className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400 min-w-0"
            />
          </Field>

          <Field label="Password" required icon={<Lock size={15} />}>
            <input
              type={showPass ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "register" ? "Min. 6 characters" : "Your password"}
              required
              className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400 min-w-0"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors ml-1"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </Field>

          {mode === "register" && (
            <Field label="WhatsApp" icon={<Phone size={15} />} hint="optional">
              <input
                type="tel" value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+62 8xx xxxx xxxx"
                className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400 min-w-0"
              />
            </Field>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-orange-400 hover:from-primary-600 hover:to-orange-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-200 mt-1 text-sm"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading
              ? mode === "login" ? "Signing in…" : "Creating account…"
              : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-500 pt-0.5">
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <button type="button" onClick={() => switchMode("register")} className="text-primary-500 font-semibold hover:underline">Register</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button type="button" onClick={() => switchMode("login")} className="text-primary-500 font-semibold hover:underline">Sign In</button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>,
    document.body
  );
}

/* ── Reusable input wrapper ── */
function Field({
  label, required, hint, icon, children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
        {required && <span className="text-primary-400 normal-case font-bold">*</span>}
        {hint && <span className="text-gray-400 normal-case font-normal tracking-normal">({hint})</span>}
      </label>
      <div className="flex items-center gap-3 bg-gray-50 border border-transparent rounded-xl px-4 py-3 focus-within:bg-white focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all duration-150">
        <span className="text-gray-400 flex-shrink-0">{icon}</span>
        {children}
      </div>
    </div>
  );
}
