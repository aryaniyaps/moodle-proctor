"use client";

import { FiShield, FiUsers, FiWifi } from "react-icons/fi";

import { StatusBadge } from "@components/StatusBadge";

import { useAttempts } from "@/hooks/useTeacherData";
import {
  formatDateTime,
  getAttemptStatusLabel,
  getDisplayName,
  getRiskStatus
} from "@/lib/dashboard";

const attemptTone: Record<string, string> = {
  in_progress: "border-blue-200 bg-blue-50 text-blue-700",
  submitted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  not_started: "border-amber-200 bg-amber-50 text-amber-700",
  terminated: "border-red-200 bg-red-50 text-red-700"
};

export default function StudentsPage() {
  const { attempts, total, isLoading, error } = useAttempts({
    limit: 50
  });

  const normalCount = attempts.filter((attempt) => attempt.violationCount === 0).length;
  const activeCount = attempts.filter((attempt) => attempt.status === "in_progress").length;
  const flaggedCount = attempts.filter((attempt) => attempt.violationCount > 0).length;

  const summaryCards = [
    {
      label: "Total attempts",
      value: total,
      icon: <FiUsers className="h-5 w-5" />
    },
    {
      label: "Active now",
      value: activeCount,
      icon: <FiWifi className="h-5 w-5" />
    },
    {
      label: "Clean attempts",
      value: normalCount,
      icon: <FiShield className="h-5 w-5" />
    },
    {
      label: "Flagged attempts",
      value: flaggedCount,
      icon: <FiShield className="h-5 w-5" />
    }
  ];

  return (
    <section className="space-y-6">
      <article className="surface-panel section-card">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="eyebrow-pill">Roster management</span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Students and attempt status
            </h2>
            <p className="section-copy mt-3">
              Keep attendance, attempt progress, and risk posture in one compact roster instead of
              splitting the view across multiple noisy widgets.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div key={card.label} className="metric-card min-w-[10rem]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    {card.icon}
                  </span>
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                  {isLoading ? "..." : card.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <section className="surface-panel table-shell">
        {error ? (
          <div className="px-6 py-6">
            <div className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
              {error.message}
            </div>
          </div>
        ) : null}

        <div className="overflow-x-auto scroll-thin">
          <table className="min-w-full">
            <thead className="table-head">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Exam</th>
                <th className="px-6 py-4">Risk</th>
                <th className="px-6 py-4">Attempt state</th>
                <th className="px-6 py-4">Started</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-6 py-10 text-sm text-slate-500" colSpan={5}>
                    Loading student attempts...
                  </td>
                </tr>
              ) : attempts.length === 0 ? (
                <tr>
                  <td className="px-6 py-10 text-sm text-slate-500" colSpan={5}>
                    No attempts have been recorded yet.
                  </td>
                </tr>
              ) : (
                attempts.map((attempt) => (
                  <tr key={attempt.id} className="table-row">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{getDisplayName(attempt)}</p>
                        <p className="mt-1 text-xs text-slate-400">{attempt.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>
                        <p className="font-medium text-slate-700">{attempt.examName}</p>
                        <p className="mt-1 text-xs text-slate-400">{attempt.courseName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={getRiskStatus(attempt.violationCount)} />
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          attemptTone[attempt.status] || "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        {getAttemptStatusLabel(attempt.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDateTime(attempt.startedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
