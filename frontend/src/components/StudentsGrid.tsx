import { monitoringStudents } from "@mock/data";
import { StudentCard } from "./StudentCard";

export const StudentsGrid = () => {
  return (
    <section className="flex flex-col gap-6 px-4">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900">
            Monitoring Students
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Viewing {monitoringStudents.length} students in real-time
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Normal
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Warning
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Suspicious
          </span>
        </div>
      </div>

      {/* Bigger Responsive Grid */}
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] gap-8">
        {monitoringStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

    </section>
  );
};