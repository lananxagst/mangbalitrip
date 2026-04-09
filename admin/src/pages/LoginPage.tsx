import { useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { Navigate } from "react-router-dom";
import { Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login, user } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">MBT</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">MangBali Trip Management</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-7 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Email</label>
            <div className="flex items-center gap-2.5 bg-gray-700 border border-gray-600 focus-within:border-primary-500 rounded-xl px-4 py-3 transition-colors">
              <Mail size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mangbalitrip.com" required
                className="flex-1 text-sm text-white bg-transparent outline-none placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Password</label>
            <div className="flex items-center gap-2.5 bg-gray-700 border border-gray-600 focus-within:border-primary-500 rounded-xl px-4 py-3 transition-colors">
              <Lock size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type={showPass ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password" required
                className="flex-1 text-sm text-white bg-transparent outline-none placeholder-gray-500"
              />
              <button type="button" onClick={() => setShowPass((v) => !v)} className="text-gray-400 hover:text-white transition-colors">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
