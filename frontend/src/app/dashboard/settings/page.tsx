import { FiLayout, FiShield, FiSliders, FiZap } from "react-icons/fi";

const settingsCards = [
  {
    title: "Alert sensitivity",
    description: "Balance how aggressively suspicious behavior is surfaced while live monitoring is underway.",
    detail: "Best when you want a calm queue without losing high-signal incidents.",
    icon: <FiSliders className="h-5 w-5" />
  },
  {
    title: "Desk layout presets",
    description: "Save tighter layouts for triage, wider layouts for camera review, or balanced desk presets.",
    detail: "Useful when one proctor shifts between overview and deep review work.",
    icon: <FiLayout className="h-5 w-5" />
  },
  {
    title: "Escalation policy",
    description: "Define how fast alerts should rise, stay pinned, or hand off to supervisors during exams.",
    detail: "Keeps the incident queue aligned with the actual operating policy.",
    icon: <FiShield className="h-5 w-5" />
  },
  {
    title: "Automation handoffs",
    description: "Prepare follow-up actions for evidence assembly, report creation, and post-exam cleanup.",
    detail: "Useful once reporting workflows become more operationally mature.",
    icon: <FiZap className="h-5 w-5" />
  }
];

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <article className="surface-panel section-card">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="eyebrow-pill">Workspace controls</span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Shape the desk around how your team monitors
            </h2>
            <p className="section-copy mt-3">
              This page now reflects the calmer dashboard system and frames the next settings areas
              around real monitoring workflows instead of placeholder filler.
            </p>
          </div>

          <div className="surface-card rounded-[24px] px-5 py-4 xl:max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Default profile
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-950">Balanced monitoring desk</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Prioritizes a clear queue, stable camera wall, and concise reporting surfaces.
            </p>
          </div>
        </div>
      </article>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsCards.map((card) => (
          <article key={card.title} className="surface-panel section-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              {card.icon}
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">{card.title}</h3>
            <p className="section-copy mt-3">{card.description}</p>
            <div className="mt-5 rounded-[22px] border border-slate-200 bg-white/80 px-4 py-4 text-sm leading-6 text-slate-600">
              {card.detail}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
