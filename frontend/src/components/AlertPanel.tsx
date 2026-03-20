import { alerts, students } from "@mock/data";
import type { Alert } from "@app-types/index";
import { FiAlertTriangle, FiMic, FiMonitor, FiSmartphone } from "react-icons/fi";

const alertIcon = (type: Alert["type"]) => {
  switch (type) {
    case "multiple_faces":
      return <FiAlertTriangle className="h-4 w-4 text-red-600" />;
    case "phone_detected":
      return <FiSmartphone className="h-4 w-4 text-amber-600" />;
    case "left_screen":
      return <FiMonitor className="h-4 w-4 text-red-600" />;
    case "background_voice":
      return <FiMic className="h-4 w-4 text-blue-600" />;
  }
};

const severityPill = (severity: Alert["severity"]) => {
  if (severity === "high") {
    return "bg-red-100 text-red-700 border-red-300";
  }
  if (severity === "medium") {
    return "bg-amber-100 text-amber-700 border-amber-300";
  }
  return "bg-blue-100 text-blue-700 border-blue-300";
};

export const AlertPanel = () => {
  return (
    <aside className="bg-white rounded-lg flex flex-col h-full max-h-[600px] border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-blue-50">
        <div className="flex items-center gap-3">
          <FiAlertTriangle className="h-5 w-5 text-amber-600" />
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-gray-900">
              AI Alerts
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Real-time anomalies during exam
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
          {alerts.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-3 space-y-3">
        {alerts.map((alert) => {
          const student = students.find((s) => s.id === alert.studentId);
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-lg bg-gray-50 border border-gray-200 p-3 hover:shadow-sm transition-shadow"
            >
              <div className="mt-0.5 flex-shrink-0">{alertIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {alert.message}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                    {alert.timestamp}
                  </span>
                </div>
                {student && (
                  <p className="text-xs text-gray-600 mt-2">
                    <span className="font-medium">{student.name}</span> · {student.id}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${severityPill(
                      alert.severity
                    )}`}
                  >
                    {alert.severity === "high"
                      ? "High"
                      : alert.severity === "medium"
                      ? "Medium"
                      : "Low"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {alerts.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-8">
            No alerts at the moment
          </div>
        )}
      </div>
    </aside>
  );
};

