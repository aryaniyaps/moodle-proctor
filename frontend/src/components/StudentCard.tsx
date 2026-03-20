import type { Student } from "@app-types/index";
import { StatusBadge } from "./StatusBadge";

interface Props {
  student: Student;
}

export const StudentCard = ({ student }: Props) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-sm font-semibold">Video Feed</div>
        </div>
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-green-500 text-white text-[10px] font-semibold flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          Live
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gray-700 text-white text-[10px]">
          {student.exam}
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 text-xs uppercase tracking-wide">Student</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{student.name}</p>
          </div>
          <StatusBadge status={student.status} />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 border-t border-gray-100 pt-2">
          <span>ID: <span className="font-medium text-gray-900">{student.id}</span></span>
          <span
            className={[
              "font-medium",
              student.connection === "Excellent"
                ? "text-green-600"
                : student.connection === "Good"
                ? "text-green-500"
                : student.connection === "Fair"
                ? "text-amber-600"
                : "text-red-600"
            ].join(" ")}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {student.connection}
          </span>
        </div>
      </div>
    </div>
  );
};

