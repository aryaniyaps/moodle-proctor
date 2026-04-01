"use client";

import { FiAlertTriangle, FiShield, FiUsers } from "react-icons/fi";

import { AlertPanel } from "@components/AlertPanel";
import { useAttempts } from "@/hooks/useTeacherData";

export default function AlertsPage() {
  const { attempts, isLoading } = useAttempts({
    limit: 25
  });

  const flagged = attempts.filter((attempt) => attempt.violationCount > 0);
  const highPriority = attempts.filter((attempt) => attempt.violationCount >= 5).length;

  const stats = [
    {
      label: "Flagged attempts",
      value: flagged.length,
      icon: <FiAlertTriangle className="h-5 w-5" />
    },
    {
      label: "High priority",
      value: highPriority,
      icon: <FiShield className="h-5 w-5" />
    },
    {
      label: "Reviewed population",
      value: attempts.length,
      icon: <FiUsers className="h-5 w-5" />
    }
  ];

  return (
    <section className="space-y-6">
      <article className="surface-panel section-card">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="eyebrow-pill">Review focus</span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Work the queue from highest signal first
            </h2>
            <p className="section-copy mt-3">
              This page strips the workflow down to alert pressure and the actual review queue so
              triage stays fast.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="metric-card min-w-[10rem]">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-sm font-medium">{stat.label}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    {stat.icon}
                  </span>
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                  {isLoading ? "..." : stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <AlertPanel />
    </section>
  );
}
