"use client";

import { FiActivity, FiAlertTriangle, FiCheckCircle, FiFileText, FiShield, FiUsers } from "react-icons/fi";

import { StatusBadge } from "@components/StatusBadge";
import { useAttempts, useReports, useTeacherStats } from "@/hooks/useTeacherData";
import {
  formatDateTime,
  getAttemptStatusLabel,
  getAttemptTimestamp,
  getDisplayName,
  getRiskStatus
} from "@/lib/dashboard";

export default function DashboardOverviewPage() {
  const { stats, isLoading: statsLoading } = useTeacherStats();
  const { attempts, isLoading: attemptsLoading } = useAttempts({
    limit: 12
  });
  const { reports, isLoading: reportsLoading } = useReports({
    limit: 12
  });

  const loading = statsLoading || attemptsLoading || reportsLoading;
  const cleanCount = attempts.filter((attempt) => attempt.violationCount === 0).length;
  const watchlistStudents = attempts
    .filter((attempt) => attempt.violationCount > 0)
    .sort((a, b) => b.violationCount - a.violationCount)
    .slice(0, 5);

  const recentAlerts = attempts
    .filter((attempt) => attempt.violationCount > 0)
    .sort((a, b) => {
      return new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime();
    })
    .slice(0, 5);

  const recentActivity = attempts
    .slice()
    .sort((a, b) => {
      return new Date(b.startedAt || b.submittedAt || 0).getTime() - new Date(a.startedAt || a.submittedAt || 0).getTime();
    })
    .slice(0, 6);

  const reportSummary = {
    completed: reports.filter((report) => report.status === "submitted").length,
    processing: reports.filter((report) => report.status === "in_progress").length,
    pending: reports.filter((report) => report.status === "not_started").length,
    failed: reports.filter((report) => report.status === "terminated").length
  };

  const healthRate = attempts.length > 0 ? Math.round((cleanCount / attempts.length) * 100) : 100;

  const summaryCards = [
    {
      label: "Students monitored",
      value: stats?.students.active ?? 0,
      note: "Live participant sessions right now",
      icon: <FiUsers className="h-5 w-5" />
    },
    {
      label: "Open alerts",
      value: stats?.violations.inLast24Hours ?? 0,
      note: "Incidents captured in the last 24 hours",
      icon: <FiAlertTriangle className="h-5 w-5" />
    },
    {
      label: "Reports ready",
      value: reportSummary.completed,
      note: "Evidence packs already submitted",
      icon: <FiFileText className="h-5 w-5" />
    },
    {
      label: "Healthy sessions",
      value: `${healthRate}%`,
      note: "Attempts currently running without violations",
      icon: <FiShield className="h-5 w-5" />
    }
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article key={card.label} className="metric-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="dashboard-kicker">{card.label}</p>
                <p className="metric-value">{loading ? "..." : card.value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                {card.icon}
              </div>
            </div>
            <p className="metric-note">{card.note}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
        <article className="surface-panel section-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="eyebrow-pill">Operational pulse</span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                What needs attention first
              </h2>
              <p className="section-copy mt-3 max-w-3xl">
                The overview keeps the live risk picture and top watchlist together so you can
                decide where to jump next without scanning the entire system.
              </p>
            </div>
            <div className="info-chip">
              <FiCheckCircle className="h-3.5 w-3.5" />
              Backend-connected workspace
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="surface-card rounded-[24px] px-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Latest alerts
                </h3>
                <span className="info-chip">{loading ? "..." : recentAlerts.length} in focus</span>
              </div>

              <div className="mt-4 space-y-3">
                {recentAlerts.length === 0 && !loading ? (
                  <div className="empty-state">No alert activity has been recorded yet.</div>
                ) : null}

                {recentAlerts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/90 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold leading-6 text-slate-950">
                          {attempt.violationCount === 1
                            ? "1 violation recorded for this attempt."
                            : `${attempt.violationCount} violations recorded for this attempt.`}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          <span className="font-semibold text-slate-800">{getDisplayName(attempt)}</span>
                          {" · "}
                          {attempt.examName}
                        </p>
                      </div>
                      <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        {getAttemptTimestamp(attempt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card rounded-[24px] px-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Watchlist
                </h3>
                <span className="info-chip">
                  <FiActivity className="h-3.5 w-3.5" />
                  Priority review
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {watchlistStudents.length === 0 && !loading ? (
                  <div className="empty-state">No students currently need watchlist attention.</div>
                ) : null}

                {watchlistStudents.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/90 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{getDisplayName(attempt)}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {attempt.examName}
                          {" · "}
                          {attempt.violationCount} recorded violations
                        </p>
                      </div>
                      <StatusBadge status={getRiskStatus(attempt.violationCount)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="surface-panel section-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="eyebrow-pill">Reporting pulse</span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                Evidence workflow
              </h2>
              <p className="section-copy mt-3">
                Submitted, in-progress, and terminated attempts roll up here so you can gauge
                report pressure without leaving the overview.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <FiFileText className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="metric-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Submitted
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                {loading ? "..." : reportSummary.completed}
              </p>
            </div>
            <div className="metric-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                In progress
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                {loading ? "..." : reportSummary.processing}
              </p>
            </div>
            <div className="metric-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                Not started
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                {loading ? "..." : reportSummary.pending}
              </p>
            </div>
            <div className="metric-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                Terminated
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                {loading ? "..." : reportSummary.failed}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-200 bg-white/85 px-4 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Highest alert reports
            </h3>
            <div className="mt-4 space-y-3">
              {reports
                .slice()
                .sort((a, b) => b.violationCount - a.violationCount)
                .slice(0, 4)
                .map((report) => (
                  <div
                    key={report.attemptId}
                    className="flex items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50/90 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{report.studentName}</p>
                      <p className="mt-1 text-sm text-slate-500">{report.examName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-slate-950">{report.violationCount}</p>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Alerts
                      </p>
                    </div>
                  </div>
                ))}

              {!loading && reports.length === 0 ? (
                <div className="empty-state px-4 py-8">No report output has been generated yet.</div>
              ) : null}
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <article className="surface-panel table-shell">
          <div className="border-b border-slate-200/80 px-6 py-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow-pill">Recent activity</span>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                  Latest attempt movement
                </h2>
              </div>
              <p className="section-copy max-w-xl">
                A compact stream of recent attempts keeps the command center useful without turning
                it into another full monitoring page.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto scroll-thin">
            <table className="min-w-full">
              <thead className="table-head">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Exam</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Started</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-6 py-10 text-sm text-slate-500" colSpan={4}>
                      Loading recent attempt activity...
                    </td>
                  </tr>
                ) : recentActivity.length === 0 ? (
                  <tr>
                    <td className="px-6 py-10 text-sm text-slate-500" colSpan={4}>
                      No recent attempt activity is available yet.
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((attempt) => (
                    <tr key={attempt.id} className="table-row">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-950">{getDisplayName(attempt)}</p>
                        <p className="mt-1 text-xs text-slate-400">{attempt.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <p className="font-medium text-slate-700">{attempt.examName}</p>
                        <p className="mt-1 text-xs text-slate-400">{attempt.courseName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                            {getAttemptStatusLabel(attempt.status)}
                          </span>
                          <StatusBadge status={getRiskStatus(attempt.violationCount)} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDateTime(attempt.startedAt || attempt.submittedAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-panel section-card">
          <span className="eyebrow-pill">Health summary</span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            Session posture
          </h2>
          <p className="section-copy mt-3">
            Quick markers for whether the current exam window is running smoothly or beginning to
            drift into heavier review work.
          </p>

          <div className="mt-6 space-y-3">
            <div className="surface-card rounded-[24px] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Clean attempts</p>
                  <p className="mt-1 text-sm text-slate-500">Attempts currently free of violations</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight text-slate-950">
                  {loading ? "..." : cleanCount}
                </p>
              </div>
            </div>

            <div className="surface-card rounded-[24px] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Active load</p>
                  <p className="mt-1 text-sm text-slate-500">Attempts currently in progress</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight text-slate-950">
                  {loading ? "..." : stats?.overview.activeAttempts ?? 0}
                </p>
              </div>
            </div>

            <div className="surface-card rounded-[24px] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Terminated attempts</p>
                  <p className="mt-1 text-sm text-slate-500">Sessions already closed by policy or issue</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight text-slate-950">
                  {loading ? "..." : stats?.overview.terminatedAttempts ?? 0}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
