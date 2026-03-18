import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, User as UserIcon, ChevronRight, Presentation, Minimize2, Maximize2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { RoomSettingsModal } from '../components/RoomSettingsModal';

interface NewSessionProps {
  name: string;
  setName: (name: string) => void;
  onCreateRoom: (settings: { maxStudents: number; duration: number }) => void;
}

export const NewSession: React.FC<NewSessionProps> = ({ name, setName, onCreateRoom }) => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    setShowSettings(true);
  };

  const handleCreateWithSettings = (settings: { maxStudents: number; duration: number }) => {
    onCreateRoom(settings);
  };

  const toggleFullscreen = () => {
    // Only enable fullscreen on user gesture (button click)
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        // Ignore fullscreen errors - they happen when called without user gesture
        console.log('Fullscreen not available (requires user gesture)');
      });
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      exitFullscreen();
    };
  }, []);

  // Auto-enter fullscreen on mount
  useEffect(() => {
    if (!document.fullscreenElement) {
      toggleFullscreen();
    }
    return () => {
      exitFullscreen();
    };
  }, []);

  return (
    <>
      <div className={cn(
        "min-h-screen font-sans transition-colors",
        isFullscreen ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gray-50"
      )}>
        {/* Fullscreen Toggle Button */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={toggleFullscreen}
            className={cn(
              "p-3 rounded-full shadow-lg transition-all hover:scale-110",
              isFullscreen 
                ? "bg-white/10 text-white hover:bg-white/20" 
                : "bg-gray-900 text-white hover:bg-gray-800"
            )}
            title={isFullscreen ? "Exit fullscreen (ESC)" : "Enter fullscreen (F11)"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
          <button
            onClick={() => {
              exitFullscreen();
              navigate('/');
            }}
            className={cn(
              "p-3 rounded-full shadow-lg transition-all hover:scale-110",
              isFullscreen 
                ? "bg-red-500/80 text-white hover:bg-red-600" 
                : "bg-red-600 text-white hover:bg-red-700"
            )}
            title="Exit"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border transition-all",
              isFullscreen 
                ? "bg-gray-800/90 border-white/10 backdrop-blur-xl" 
                : "bg-white border-gray-200"
            )}
          >
            {/* Header */}
            <div className={cn(
              "p-8 transition-colors",
              isFullscreen ? "bg-gradient-to-r from-emerald-600 to-teal-600" : "bg-black"
            )}>
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  "p-2 rounded-xl",
                  isFullscreen ? "bg-white/20" : "bg-white/10"
                )}>
                  <Presentation className={cn(
                    "w-6 h-6",
                    isFullscreen ? "text-white" : "text-white"
                  )} />
                </div>
                <h1 className={cn(
                  "text-2xl font-bold tracking-tight",
                  isFullscreen ? "text-white" : "text-white"
                )}>
                  Create New Session
                </h1>
              </div>
              <p className={cn(
                "text-sm",
                isFullscreen ? "text-white/80" : "text-white/60"
              )}>
                Start a new collaborative whiteboard session for your students
              </p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className={cn(
                  "text-xs font-bold uppercase tracking-wider ml-1",
                  isFullscreen ? "text-white/60" : "text-black/40"
                )}>
                  Your Name
                </label>
                <div className="relative">
                  <UserIcon className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                    isFullscreen ? "text-white/30" : "text-black/20"
                  )} />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn(
                      "w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 transition-all",
                      isFullscreen 
                        ? "bg-white/10 border border-white/20 text-white placeholder-white/30 focus:ring-white/50" 
                        : "bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:ring-black/20"
                    )}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  />
                </div>
              </div>

              {/* Info Cards */}
              <div className={cn(
                "p-4 rounded-2xl border",
                isFullscreen 
                  ? "bg-emerald-500/10 border-emerald-500/30" 
                  : "bg-emerald-50 border-emerald-100"
              )}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isFullscreen ? "bg-emerald-500/20" : "bg-emerald-500"
                  )}>
                    <Plus className={cn(
                      "w-5 h-5",
                      isFullscreen ? "text-emerald-400" : "text-white"
                    )} />
                  </div>
                  <div>
                    <h3 className={cn(
                      "font-semibold",
                      isFullscreen ? "text-emerald-300" : "text-emerald-900"
                    )}>Teacher Mode</h3>
                    <p className={cn(
                      "text-sm mt-1",
                      isFullscreen ? "text-emerald-400/80" : "text-emerald-700"
                    )}>
                      As a teacher, you can control the session, approve students, and manage room settings.
                    </p>
                  </div>
                </div>
              </div>

              <div className={cn(
                "p-4 rounded-2xl border",
                isFullscreen 
                  ? "bg-blue-500/10 border-blue-500/30" 
                  : "bg-blue-50 border-blue-100"
              )}>
                <h4 className={cn(
                  "font-semibold mb-2",
                  isFullscreen ? "text-blue-300" : "text-blue-900"
                )}>Default Settings:</h4>
                <ul className={cn(
                  "text-sm space-y-1",
                  isFullscreen ? "text-blue-400/80" : "text-blue-700"
                )}>
                  <li>• Max Students: <strong>30</strong> (adjustable)</li>
                  <li>• Duration: <strong>60 minutes</strong> (adjustable)</li>
                  <li>• Auto-save: <strong>Enabled</strong></li>
                </ul>
              </div>

              <button
                onClick={handleCreate}
                disabled={!name}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  isFullscreen 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20" 
                    : "bg-black text-white hover:bg-gray-800"
                )}
              >
                Continue to Settings <ChevronRight size={20} />
              </button>

              <div className={cn(
                "pt-4 border-t text-center",
                isFullscreen ? "border-white/10" : "border-black/5"
              )}>
                <p className={cn(
                  "text-sm",
                  isFullscreen ? "text-white/40" : "text-black/40"
                )}>
                  Already have a session code?{' '}
                  <button
                    onClick={() => {
                      exitFullscreen();
                      navigate('/join-session');
                    }}
                    className={cn(
                      "font-semibold hover:underline",
                      isFullscreen ? "text-emerald-400" : "text-emerald-600"
                    )}
                  >
                    Join existing session
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Fullscreen hint */}
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="px-4 py-2 bg-black/60 backdrop-blur-md text-white text-sm rounded-full flex items-center gap-2">
              <Maximize2 size={14} />
              <span>Press ESC to exit fullscreen</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Room Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <RoomSettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            onCreateRoom={handleCreateWithSettings}
            teacherName={name}
            isFullscreen={isFullscreen}
          />
        )}
      </AnimatePresence>
    </>
  );
};
