"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiLogOut,
  FiMonitor,
  FiSettings,
  FiUsers
} from "react-icons/fi";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <FiActivity className="h-4 w-4" /> },
  { label: "Live Monitoring", href: "/dashboard/monitoring", icon: <FiMonitor className="h-4 w-4" /> },
  { label: "AI Alerts", href: "/dashboard/alerts", icon: <FiAlertTriangle className="h-4 w-4" /> },
  { label: "Students", href: "/dashboard/students", icon: <FiUsers className="h-4 w-4" /> },
  { label: "Reports", href: "/dashboard/reports", icon: <FiBarChart2 className="h-4 w-4" /> },
  { label: "Settings", href: "/dashboard/settings", icon: <FiSettings className="h-4 w-4" /> }
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Add real logout logic here later
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-64 bg-white py-6 gap-6 border-r border-gray-200 shadow-sm z-50">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4">
        <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          PV
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900">ProctorVision</span>
          <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">
            Teacher
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              ].join(" ")}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <FiLogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};