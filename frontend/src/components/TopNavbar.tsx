import { FiBell } from "react-icons/fi";
import { alerts } from "@mock/data";

export const TopNavbar = () => {
  const activeAlerts = alerts.length;

  return (
    <header className="bg-blue-600 text-white shadow-md fixed top-0 left-64 right-0 z-40">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        
        {/* Left */}
        <div>
          <h1 className="text-2xl font-bold">Proctoring Dashboard</h1>
          <p className="text-blue-100 text-sm mt-1">
            Physics Midterm - Group A
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          
          <div className="text-right">
            <p className="text-sm text-blue-100">Exam Time Remaining</p>
            <p className="text-lg font-semibold">01:23:18</p>
          </div>

          <div className="relative">
            <button className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-blue-700 hover:bg-blue-800">
              <FiBell className="h-5 w-5" />
              {activeAlerts > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
                  {activeAlerts}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 pl-6 border-l border-blue-400">
            <div className="h-9 w-9 rounded-lg bg-blue-400 flex items-center justify-center text-xs font-bold">
              A
            </div>
            <div className="text-sm">
              <p className="font-medium">Dr. Alice Nguyen</p>
              <p className="text-blue-100 text-xs">Teacher</p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};