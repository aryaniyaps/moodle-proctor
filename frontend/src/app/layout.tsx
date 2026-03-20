import type { Metadata } from "next";
import { TopNavbar } from "@components/TopNavbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProctorVision – Teacher Dashboard",
  description: "Modern teacher monitoring console for online proctoring exams."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <TopNavbar />
        <div className="min-h-screen bg-white">
          <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
        </div>
      </body>
    </html>
  );
}

