"use client";

import { usePathname } from "next/navigation";
import { FiActivity, FiBell, FiCheckCircle, FiClock, FiUsers } from "react-icons/fi";

import { useTeacherStats } from "@/hooks/useTeacherData";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Operations Dashboard",
    subtitle: "Track exam health, keep the live room in view, and move quickly on anything risky."
  },
  "/dashboard/monitoring": {
    title: "Live Monitoring",
    subtitle: "Stay with the active room, watch connection quality, and keep the camera wall under control."
  },
  "/dashboard/alerts": {
    title: "Alerts Review",
    subtitle: "Work through suspicious behavior in priority order with enough context to decide quickly."
  },
  "/dashboard/students": {
    title: "Participant Roster",
    subtitle: "Check who is active, how each attempt is progressing, and which sessions need attention."
  },
  "/dashboard/reports": {
    title: "Exam Reports",
    subtitle: "Review evidence output, submission outcomes, and follow-up work in one clean queue."
  },
  "/dashboard/settings": {
    title: "Workspace Settings",
    subtitle: "Shape the desk around your monitoring habits, escalation flow, and reporting cadence."
  }
};

export const TopNavbar = () => {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? pageMeta["/dashboard"];
  const { stats, isLoading, error } = useTeacherStats();

  const summaryCards = [
    {
      label: "Live students",
      value: stats?.students.active ?? 0,
      icon: <FiUsers className="h-4 w-4" />
    },
    {
      label: "Alert queue",
      value: stats?.violations.inLast24Hours ?? 0,
      icon: <FiBell className="h-4 w-4" />
    },
    {
      label: "Ongoing exams",
      value: stats?.exams.ongoing ?? 0,
      icon: <FiActivity className="h-4 w-4" />
    },
    {
      label: "Completed attempts",
      value: stats?.overview.completedAttempts ?? 0,
      icon: <FiCheckCircle className="h-4 w-4" />
    }
  ];

  const generatedAt = stats?.generatedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }).format(new Date(stats.generatedAt))
    : null;

  return (
    <header className="surface-panel section-card">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <span className="eyebrow-pill">Exam command center</span>
          <h1 className="dashboard-title mt-4">{meta.title}</h1>
          <p className="section-copy mt-3 max-w-2xl">{meta.subtitle}</p>
        </div>

        <div className="flex w-full flex-col gap-3 xl:max-w-[36rem] xl:items-end">
          <div className="flex flex-wrap gap-2 xl:justify-end">
            <span className="info-chip">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {error ? "Connection interrupted" : isLoading ? "Syncing workspace" : "Workspace online"}
            </span>
            <span className="info-chip">
              <FiClock className="h-3.5 w-3.5" />
              {generatedAt ? `Updated ${generatedAt}` : "Waiting for first sync"}
            </span>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2">
            {summaryCards.map((card) => (
              <div key={card.label} className="metric-card">
                <div className="flex items-center justify-between gap-3">
                  <span className="metric-label">{card.label}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    {card.icon}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <p className="text-2xl font-semibold tracking-tight text-slate-950">
                    {isLoading ? "..." : card.value}
                  </p>
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Live
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
