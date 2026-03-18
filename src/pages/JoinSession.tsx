import React from 'react';
import { motion } from 'motion/react';
import { LogIn, User as UserIcon, ChevronRight, Presentation, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface JoinSessionProps {
  name: string;
  setName: (name: string) => void;
  roomId: string;
  setRoomId: (id: string) => void;
  onJoinRoom: () => void;
  isWaiting?: boolean;
}

export const JoinSession: React.FC<JoinSessionProps> = ({ name, setName, roomId, setRoomId, onJoinRoom, isWaiting }) => {
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!name.trim() || !roomId.trim()) return;
    onJoinRoom();
  };

  if (isWaiting) {
    return (
      <div className="flex items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-12 text-center space-y-6 border border-black/5"
        >
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Lock className="text-amber-600" size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Waiting for Approval</h2>
            <p className="text-black/60">
              The teacher has locked the room. Please wait while they approve your request to join.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-amber-600 font-bold text-sm">
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-black/5"
      >
        <div className="p-8 bg-black text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <Presentation className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Join Session
            </h1>
          </div>
          <p className="text-white/60 text-sm">
            Enter the room code to join an existing session
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-1">
              Your Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-1">
              Room Code
            </label>
            <input
              type="text"
              placeholder="e.g. AB12CD"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="w-full px-4 py-4 bg-stone-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-mono text-center text-xl tracking-widest"
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <LogIn className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Student Mode</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Join as a student to collaborate on the whiteboard. You may need teacher approval.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={!name || !roomId}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Session <ChevronRight size={20} />
          </button>

          <div className="pt-4 border-t border-black/5">
            <p className="text-sm text-black/40 text-center">
              Want to create your own session?{' '}
              <a href="/new-session" className="text-emerald-600 font-semibold hover:underline">
                Create new session
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
