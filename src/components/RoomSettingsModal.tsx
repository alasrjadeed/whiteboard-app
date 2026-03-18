import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Users, Clock, ChevronRight, User as UserIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface RoomSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (settings: { maxStudents: number; duration: number }) => void;
  teacherName: string;
  isFullscreen?: boolean;
}

export const RoomSettingsModal: React.FC<RoomSettingsModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  teacherName,
  isFullscreen = false
}) => {
  const [maxStudents, setMaxStudents] = useState(30);
  const [duration, setDuration] = useState(60); // minutes

  const handleCreate = () => {
    onCreateRoom({ maxStudents, duration });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={cn(
          "w-full max-w-lg p-8 rounded-3xl shadow-2xl relative",
          isFullscreen ? "bg-gray-800 text-white" : "bg-white text-black"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">Room Settings</h3>
          <p className="text-gray-500">Configure your session parameters</p>
        </div>

        <div className="space-y-6">
          {/* Teacher Name Display */}
          <div className={cn(
            "p-4 rounded-2xl flex items-center gap-3",
            "bg-gray-50"
          )}>
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
              {teacherName[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold">{teacherName}</p>
              <p className="text-sm text-gray-500">Teacher</p>
            </div>
          </div>

          {/* Max Students */}
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
              <Users size={16} />
              Maximum Students
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="30"
                value={maxStudents}
                onChange={(e) => setMaxStudents(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-2xl font-bold w-16 text-center">{maxStudents}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Default: 30 (Admin can increase)</p>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
              <Clock size={16} />
              Session Duration (minutes)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-2xl font-bold w-16 text-center">{duration}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Default: 60 minutes (Admin can extend)</p>
          </div>

          {/* Summary */}
          <div className={cn(
            "p-4 rounded-2xl bg-blue-50 border border-blue-100"
          )}>
            <p className="text-sm font-bold text-blue-900 mb-2">Session Summary:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Up to <strong>{maxStudents} students</strong> can join</li>
              <li>• Session expires after <strong>{duration} minutes</strong></li>
              <li>• Auto-save enabled</li>
            </ul>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            Create Session
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
