import { MobileDashboardNav } from "@components/MobileDashboardNav";
import { TopNavbar } from "@components/TopNavbar";
import { Sidebar } from "@components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-shell flex min-h-screen w-full">
      <Sidebar />
      <main className="min-h-screen flex-1 lg:pl-[19.5rem]">
        <div className="mx-auto flex w-full max-w-[1640px] flex-col gap-5 px-4 py-4 md:px-6 md:py-6 xl:px-8">
          <MobileDashboardNav />
          <TopNavbar />
          <div>{children}</div>
        </div>
      </main>
    </div>
  );
}
