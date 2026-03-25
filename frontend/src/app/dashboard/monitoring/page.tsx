"use client";

import { useState, useCallback } from "react";
import { AlertPanel } from "@components/AlertPanel";
import { StudentsGrid } from "@components/StudentsGrid";
import { RoomSelector } from "@components/RoomSelector";
import { RoomCreationModal } from "@components/RoomCreationModal";
import { FiList, FiPlus } from "react-icons/fi";

export default function LiveMonitoringPage() {
  const [currentRoomId, setCurrentRoomId] = useState<number | undefined>(undefined);
  const [isRoomSelectorOpen, setIsRoomSelectorOpen] = useState(false);
  const [isRoomCreationOpen, setIsRoomCreationOpen] = useState(false);

  // Handle room switch
  const handleRoomSelect = useCallback((roomId: number) => {
    setCurrentRoomId(roomId);
    // Note: Room switching logic with 2s debounce is handled inside RoomSelector
  }, []);

  // Handle room creation
  const handleRoomCreated = useCallback((room: { roomId: number; roomCode: string; inviteLink: string }) => {
    setCurrentRoomId(room.roomId);
    // Automatically switch to the newly created room
    console.log('[Monitoring] Room created:', room);
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Room Control Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Live Monitoring</h1>
          {currentRoomId && (
            <span className="text-sm text-gray-600">
              Room <span className="font-semibold text-blue-600">#{currentRoomId}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRoomSelectorOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiList className="h-4 w-4" />
            Switch Room
          </button>
          <button
            onClick={() => setIsRoomCreationOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            Create Room
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 p-6 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <StudentsGrid roomId={currentRoomId} />
        </div>
        <div className="w-80 flex-shrink-0">
          <AlertPanel roomId={currentRoomId} />
        </div>
      </div>

      {/* Room Selector Modal */}
      <RoomSelector
        isOpen={isRoomSelectorOpen}
        onClose={() => setIsRoomSelectorOpen(false)}
        currentRoomId={currentRoomId}
        onRoomSelect={handleRoomSelect}
      />

      {/* Room Creation Modal */}
      <RoomCreationModal
        isOpen={isRoomCreationOpen}
        onClose={() => setIsRoomCreationOpen(false)}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
}

