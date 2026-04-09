import { useEffect, useState } from "react";
import { Package, MapPin, BookOpen, Car, Users } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

interface Stats {
  packages: number;
  destinations: number;
  guides: number;
  driverPackages: number;
  users: number;
}

const CARDS = [
  { key: "packages",       label: "Packages",        icon: Package,  color: "bg-orange-500" },
  { key: "driverPackages", label: "Driver Packages",  icon: Car,      color: "bg-blue-500"   },
  { key: "destinations",   label: "Destinations",     icon: MapPin,   color: "bg-green-500"  },
  { key: "guides",         label: "Travel Guides",    icon: BookOpen, color: "bg-purple-500" },
  { key: "users",          label: "Registered Users", icon: Users,    color: "bg-pink-500"   },
];

export default function DashboardPage() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, [token]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your MangBali Trip data</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {CARDS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-4`}>
              <Icon size={18} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats ? stats[key as keyof Stats] : "—"}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
