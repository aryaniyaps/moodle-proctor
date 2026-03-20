import { AlertPanel } from "@components/AlertPanel";
import { StudentsGrid } from "@components/StudentsGrid";

export default function DashboardOverviewPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3">
        <StudentsGrid />
      </div>
      {/* <div className="lg:col-span-1">
        <AlertPanel />
      </div> */}
    </div>
  );
}

