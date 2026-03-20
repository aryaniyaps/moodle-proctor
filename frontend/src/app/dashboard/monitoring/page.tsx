import { AlertPanel } from "@components/AlertPanel";
import { StudentsGrid } from "@components/StudentsGrid";

export default function LiveMonitoringPage() {
  return (
    <div className="flex w-full gap-6 p-6">
      <div className="flex-1">
        <StudentsGrid />
      </div>
      <div className="w-80 flex-shrink-0">
        <AlertPanel />
      </div> 
    </div>
  );
}

