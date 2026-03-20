import type { StudentStatus } from "@app-types/index";

interface Props {
  status: StudentStatus;
}

const statusConfig: Record<StudentStatus, { label: string; className: string; dotColor: string }> = {
  normal: {
    label: "Normal",
    className: "bg-green-100 text-green-700 border-green-300",
    dotColor: "bg-green-500"
  },
  warning: {
    label: "Warning",
    className: "bg-amber-100 text-amber-700 border-amber-300",
    dotColor: "bg-amber-500"
  },
  suspicious: {
    label: "Suspicious",
    className: "bg-red-100 text-red-700 border-red-300",
    dotColor: "bg-red-500"
  }
};

export const StatusBadge = ({ status }: Props) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-semibold ${config.className}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
};

