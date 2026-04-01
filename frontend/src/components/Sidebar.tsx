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
  FiShield,
  FiUsers
} from "react-icons/fi";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

export const dashboardNavItems: NavItem[] = [
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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="surface-panel fixed bottom-4 left-4 top-4 z-40 hidden w-[18rem] overflow-y-auto rounded-[30px] scroll-thin lg:flex lg:flex-col">
      <div className="flex items-center gap-4 border-b border-slate-200/70 px-6 pb-6 pt-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-900/15">
          PV
        </div>
        <div className="min-w-0">
          <p className="dashboard-kicker">Teacher Workspace</p>
          <h1 className="truncate text-lg font-semibold text-slate-900">ProctorVision</h1>
          <p className="mt-1 text-sm text-slate-500">Focused control for live exam operations</p>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="overflow-hidden rounded-[26px] bg-slate-950 px-4 py-5 text-white shadow-lg shadow-slate-900/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Workspace Status
          </p>
          <p className="mt-3 text-xl font-semibold">Low-noise command desk</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Review rooms, alerts, and reports without the extra chrome getting in the way.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Monitoring ready
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 px-4 pb-2">
        {dashboardNavItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15"
                  : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-xl border transition-colors",
                  active
                    ? "border-white/10 bg-white/10 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-500 group-hover:border-slate-300 group-hover:bg-white"
                ].join(" ")}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/70 px-4 py-4">
        <div className="mb-3 rounded-[22px] border border-slate-200/80 bg-white/80 px-4 py-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <FiShield className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Workspace Focus
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                Clear hierarchy, quicker triage
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Monitoring, evidence review, and room controls stay one click away.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <FiLogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};
