import { examReports } from "@mock/data";

export const ReportTable = () => {
  return (
    <section className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 bg-blue-50 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-gray-900">
            Exam Reports
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Post-exam evidence packages and AI summaries
          </p>
        </div>
        <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1.5 rounded">
          {examReports.length} Total
        </span>
      </div>

      <div className="overflow-x-auto scroll-thin">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              <th className="text-left px-6 py-3 font-semibold">Student</th>
              <th className="text-left px-6 py-3 font-semibold">Exam</th>
              <th className="text-center px-6 py-3 font-semibold">Alerts</th>
              <th className="text-left px-6 py-3 font-semibold">Status</th>
              <th className="text-right px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {examReports.map((report, idx) => (
              <tr
                key={report.id}
                className={[
                  "border-b border-gray-100 hover:bg-blue-50 transition-colors",
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                ].join(" ")}
              >
                <td className="px-6 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {report.studentName}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {report.exam}
                </td>
                <td className="px-6 py-3 text-center text-sm font-medium text-gray-900 whitespace-nowrap">
                  {report.alertsCount}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border",
                      report.uploadStatus === "Completed"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : report.uploadStatus === "Processing"
                        ? "bg-blue-100 text-blue-700 border-blue-300"
                        : report.uploadStatus === "Pending"
                        ? "bg-amber-100 text-amber-700 border-amber-300"
                        : "bg-red-100 text-red-700 border-red-300"
                    ].join(" ")}
                  >
                    {report.uploadStatus}
                  </span>
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-800 font-medium mr-4">
                    View
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 font-medium">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

