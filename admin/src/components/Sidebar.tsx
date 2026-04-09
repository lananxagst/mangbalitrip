import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Package, MapPin, BookOpen, Car, Users, LogOut,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/packages", icon: Package, label: "Packages" },
  { to: "/driver-packages", icon: Car, label: "Driver Packages" },
  { to: "/destinations", icon: MapPin, label: "Destinations" },
  { to: "/guides", icon: BookOpen, label: "Travel Guides" },
  { to: "/users", icon: Users, label: "Users" },
];

export default function Sidebar() {
  const { user, logout } = useAdminAuth();
  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-gray-900 flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xs">MBT</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">MangBali</p>
            <p className="text-primary-400 text-xs font-semibold tracking-widest">ADMIN</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors py-1.5"
        >
          <LogOut size={15} /> Log Out
        </button>
      </div>
    </aside>
  );
}
