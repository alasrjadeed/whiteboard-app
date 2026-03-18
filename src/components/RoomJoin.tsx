import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  LogIn, 
  User as UserIcon,
  ChevronRight,
  Presentation,
  Lock
} from 'lucide-react';
import { cn } from '../lib/utils';

interface RoomJoinProps {
  name: string;
  setName: (name: string) => void;
  roomId: string;
  setRoomId: (id: string) => void;
  role: 'teacher' | 'student' | null;
  setRole: (role: 'teacher' | 'student' | null) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  forceRole?: 'teacher' | 'student';
  isWaiting?: boolean;
}

export const RoomJoin: React.FC<RoomJoinProps> = ({
  name, setName, roomId, setRoomId, role, setRole, onCreateRoom, onJoinRoom, forceRole, isWaiting
}) => {
  const activeRole = forceRole || role;

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
            <p className="text-black/60">The teacher has locked the room. Please wait while they approve your request to join.</p>
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
              {activeRole === 'teacher' ? 'Create Class' : 'Join Class'}
            </h1>
          </div>
          <p className="text-white/60 text-sm">
            {activeRole === 'teacher' 
              ? 'Start a new session for your students' 
              : 'Enter a room code to join the session'}
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-1">Your Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              />
            </div>
          </div>

          {!forceRole && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onCreateRoom}
                disabled={!name}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-black/10 hover:border-black/40 hover:bg-stone-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-3 bg-black text-white rounded-xl group-hover:scale-110 transition-transform">
                  <Plus size={24} />
                </div>
                <span className="font-bold text-sm">Create Class</span>
              </button>

              <button
                onClick={() => setRole('student')}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all group",
                  role === 'student' ? "border-black bg-stone-50" : "border-black/5 hover:border-black/20"
                )}
              >
                <div className="p-3 bg-stone-100 rounded-xl group-hover:scale-110 transition-transform">
                  <LogIn size={24} />
                </div>
                <span className="font-bold text-sm">Join Class</span>
              </button>
            </div>
          )}

          <AnimatePresence>
            {(activeRole === 'student' || forceRole === 'student') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-1">Room Code</label>
                  <input
                    type="text"
                    placeholder="e.g. AB12CD"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    className="w-full px-4 py-4 bg-stone-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-mono text-center text-xl tracking-widest"
                  />
                </div>
                <button
                  onClick={onJoinRoom}
                  disabled={!name || !roomId}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors disabled:opacity-50"
                >
                  Enter Room <ChevronRight size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {forceRole === 'teacher' && (
            <button
              onClick={onCreateRoom}
              disabled={!name}
              className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              Start Class <ChevronRight size={20} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
