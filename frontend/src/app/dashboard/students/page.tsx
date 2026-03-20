import { students } from "@mock/data";
import { StatusBadge } from "@components/StatusBadge";

export default function StudentsPage() {
  return (
    <section className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 bg-blue-50 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-gray-900">
            Students
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            All students registered for the examination session
          </p>
        </div>
        <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1.5 rounded">
          {students.length} Total
        </span>
      </div>

      <div className="overflow-x-auto scroll-thin">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              <th className="text-left px-6 py-3 font-semibold">Student Name</th>
              <th className="text-left px-6 py-3 font-semibold">ID</th>
              <th className="text-left px-6 py-3 font-semibold">Exam</th>
              <th className="text-left px-6 py-3 font-semibold">Status</th>
              <th className="text-left px-6 py-3 font-semibold">Connection</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr
                key={student.id}
                className={[
                  "border-b border-gray-100 hover:bg-blue-50 transition-colors",
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                ].join(" ")}
              >
                <td className="px-6 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {student.name}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {student.id}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {student.exam}
                </td>
                <td className="px-6 py-3">
                  <StatusBadge status={student.status} />
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {student.connection}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

