"use client";

import { useCallback, useState } from "react";
import { FiActivity, FiPlus, FiShield, FiUsers, FiVideo } from "react-icons/fi";

import { AlertPanel } from "@components/AlertPanel";
import { RoomCreationModal } from "@components/RoomCreationModal";
import { RoomSelector, type ProctoringRoomSummary } from "@components/RoomSelector";
import { StudentsGrid } from "@components/StudentsGrid";
import { useAttempts } from "@/hooks/useTeacherData";

export default function LiveMonitoringPage() {
  const { attempts } = useAttempts({
    status: "in_progress",
    limit: 25
  });

  const [currentRoomCode, setCurrentRoomCode] = useState<string | undefined>(undefined);
  const [currentRoomLabel, setCurrentRoomLabel] = useState<string>("Default live monitoring room");
  const [isRoomSelectorOpen, setIsRoomSelectorOpen] = useState(false);
  const [isRoomCreationOpen, setIsRoomCreationOpen] = useState(false);

  const suspiciousCount = attempts.filter((attempt) => attempt.violationCount >= 5).length;
  const activeRoomCode = currentRoomCode || "exam-monitoring-room";

  const workspaceStats = [
    {
      label: "Students in session",
      value: attempts.length,
      icon: <FiUsers className="h-4 w-4" />
    },
    {
      label: "Open alerts",
      value: attempts.filter((attempt) => attempt.violationCount > 0).length,
      icon: <FiActivity className="h-4 w-4" />
    },
    {
      label: "Priority cases",
      value: suspiciousCount,
      icon: <FiShield className="h-4 w-4" />
    }
  ];

  const handleRoomSelect = useCallback((room: ProctoringRoomSummary) => {
    setCurrentRoomCode(room.roomCode);
    setCurrentRoomLabel(room.examName);
  }, []);

  const handleRoomCreated = useCallback((room: { roomId: number; roomCode: string; inviteLink: string }) => {
    setCurrentRoomCode(room.roomCode);
    setCurrentRoomLabel(`Room ${room.roomCode}`);
    console.log("[Monitoring] Room created:", room);
  }, []);

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <article className="surface-panel section-card">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <span className="eyebrow-pill">Monitoring workspace</span>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                    Stay with the room that needs your eyes
                  </h2>
                  <p className="section-copy mt-3 max-w-2xl">
                    The live monitoring page keeps the room controls, camera wall, and active alert
                    queue together without repeating dashboard clutter.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRoomCreationOpen(true)}
                    className="btn-primary"
                  >
                    <FiPlus className="h-4 w-4" />
                    Create room
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRoomSelectorOpen(true)}
                    className="btn-secondary"
                  >
                    <FiVideo className="h-4 w-4" />
                    Switch room
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="info-chip font-mono uppercase tracking-[0.16em]">
                  Room {activeRoomCode}
                </span>
                <span className="info-chip">{currentRoomLabel}</span>
                <span className="info-chip">
                  <FiShield className="h-3.5 w-3.5" />
                  Live proctoring session
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {workspaceStats.map((stat) => (
                  <div key={stat.label} className="metric-card">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-sm font-medium">{stat.label}</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        {stat.icon}
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <StudentsGrid roomId={activeRoomCode} />
        </div>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <AlertPanel />
        </div>
      </div>

      <RoomSelector
        isOpen={isRoomSelectorOpen}
        onClose={() => setIsRoomSelectorOpen(false)}
        currentRoomCode={currentRoomCode}
        onRoomSelect={handleRoomSelect}
      />

      <RoomCreationModal
        isOpen={isRoomCreationOpen}
        onClose={() => setIsRoomCreationOpen(false)}
        onRoomCreated={handleRoomCreated}
      />
    </section>
  );
}
