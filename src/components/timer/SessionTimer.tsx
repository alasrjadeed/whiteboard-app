import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Play, Pause, RotateCcw, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SessionTimerProps {
  roomId: string;
  socket: any;
  initialDuration?: number; // in minutes
  onSessionExpire?: () => void;
  isTeacher?: boolean;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({
  roomId,
  socket,
  initialDuration = 60,
  onSessionExpire,
  isTeacher = false
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialDuration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [customDuration, setCustomDuration] = useState(initialDuration);
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningShown = useRef(false);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format time as readable string
  const formatTimeReadable = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins > 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins}m ${secs}s`;
    }
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Get progress percentage
  const getProgress = () => {
    return ((initialDuration * 60 - timeRemaining) / (initialDuration * 60)) * 100;
  };

  // Get color based on time remaining
  const getColor = () => {
    if (timeRemaining > 300) return 'text-emerald-600';
    if (timeRemaining > 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBgColor = () => {
    if (timeRemaining > 300) return 'bg-emerald-500';
    if (timeRemaining > 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Start timer
  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    
    if (socket && isTeacher) {
      socket.emit('timer-control', {
        roomId,
        action: 'start',
        timeRemaining
      });
    }
  };

  // Pause timer
  const handlePause = () => {
    setIsPaused(true);
    
    if (socket && isTeacher) {
      socket.emit('timer-control', {
        roomId,
        action: 'pause',
        timeRemaining
      });
    }
  };

  // Reset timer
  const handleReset = () => {
    setTimeRemaining(customDuration * 60);
    setIsRunning(false);
    setIsPaused(false);
    setHasEnded(false);
    warningShown.current = false;
    
    if (socket && isTeacher) {
      socket.emit('timer-control', {
        roomId,
        action: 'reset',
        duration: customDuration * 60
      });
    }
  };

  // End session early
  const handleEndSession = () => {
    if (window.confirm('End this session early? All students will be notified.')) {
      setTimeRemaining(0);
      setHasEnded(true);
      setIsRunning(false);
      
      if (socket && isTeacher) {
        socket.emit('session-end', { roomId });
      }
      
      if (onSessionExpire) {
        onSessionExpire();
      }
    }
  };

  // Set custom duration
  const handleSetDuration = () => {
    setTimeRemaining(customDuration * 60);
    setShowSettings(false);
    
    if (socket && isTeacher) {
      socket.emit('timer-control', {
        roomId,
        action: 'set-duration',
        duration: customDuration * 60
      });
    }
  };

  // Timer countdown
  useEffect(() => {
    if (isRunning && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up!
            setHasEnded(true);
            setIsRunning(false);

            if (socket && isTeacher) {
              socket.emit('session-end', { roomId });
            }

            if (onSessionExpire) {
              onSessionExpire();
            }

            return 0;
          }

          // Show warning at 5 minutes, 3 minutes, and 1 minute
          if (prev === 300 || prev === 180 || prev === 60) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 8000);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeRemaining, socket, roomId, isTeacher, onSessionExpire]);

  // Listen for timer updates from teacher
  useEffect(() => {
    if (!socket) return;

    const handleTimerUpdate = ({ action, time, duration }: { action: string, time?: number, duration?: number }) => {
      if (action === 'start') {
        setIsRunning(true);
        setIsPaused(false);
        if (time) setTimeRemaining(time);
      } else if (action === 'pause') {
        setIsPaused(true);
      } else if (action === 'reset') {
        setIsRunning(false);
        setIsPaused(false);
        if (duration) setTimeRemaining(duration);
      } else if (action === 'set-duration') {
        if (duration) {
          setTimeRemaining(duration);
          setCustomDuration(Math.floor(duration / 60));
        }
      } else if (action === 'end') {
        setTimeRemaining(0);
        setHasEnded(true);
        setIsRunning(false);
      }
    };

    const handleSessionEnded = () => {
      setTimeRemaining(0);
      setHasEnded(true);
      setIsRunning(false);
      
      if (onSessionExpire) {
        onSessionExpire();
      }
    };

    socket.on('timer-update', handleTimerUpdate);
    socket.on('session-ended', handleSessionEnded);

    return () => {
      socket.off('timer-update', handleTimerUpdate);
      socket.off('session-ended', handleSessionEnded);
    };
  }, [socket, onSessionExpire]);

  // Sync timer with server on mount
  useEffect(() => {
    if (!socket || !isTeacher) return;

    socket.emit('timer-sync', { roomId });

    const handleTimerSync = ({ time, isRunning: running, isPaused: paused }: { time: number, isRunning: boolean, isPaused: boolean }) => {
      setTimeRemaining(time);
      setIsRunning(running);
      setIsPaused(paused);
    };

    socket.on('timer-sync', handleTimerSync);

    return () => {
      socket.off('timer-sync', handleTimerSync);
    };
  }, [socket, roomId, isTeacher]);

  return (
    <div className="space-y-4" data-timer-container>
      {/* Timer Display */}
      <div className={cn(
        "p-6 rounded-2xl border-2 transition-all",
        hasEnded ? "bg-red-50 border-red-200" :
        timeRemaining <= 60 ? "bg-red-50 border-red-200" :
        timeRemaining <= 300 ? "bg-amber-50 border-amber-200" :
        "bg-emerald-50 border-emerald-200"
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-3 rounded-xl", getBgColor())}>
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Session Timer</h3>
              <p className="text-sm text-gray-500">
                {hasEnded ? 'Session ended' : isRunning ? isPaused ? 'Paused' : 'Running' : 'Not started'}
              </p>
            </div>
          </div>
          
          {isTeacher && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>

        {/* Time Display */}
        <div className="text-center mb-4">
          <div className={cn("text-5xl font-bold mb-2", getColor())}>
            {formatTime(timeRemaining)}
          </div>
          <p className="text-sm text-gray-600">
            {formatTimeReadable(timeRemaining)} remaining
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full transition-all", getBgColor())}
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Controls */}
        {isTeacher && (
          <div className="flex items-center justify-center gap-2">
            {!isRunning ? (
              <button
                onClick={handleStart}
                disabled={hasEnded}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={18} />
                Start
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors"
              >
                <Pause size={18} />
                Pause
              </button>
            )}
            
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={18} />
              Reset
            </button>
            
            <button
              onClick={handleEndSession}
              disabled={hasEnded}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
              End Session
            </button>
          </div>
        )}

        {!isTeacher && (
          <div className="text-center text-sm text-gray-600">
            {isRunning ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Timer running
              </span>
            ) : hasEnded ? (
              <span className="flex items-center justify-center gap-2 text-red-600">
                <AlertTriangle size={16} />
                Session has ended
              </span>
            ) : (
              <span>Waiting for teacher to start</span>
            )}
          </div>
        )}
      </div>

      {/* Warning Notification */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-amber-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 cursor-pointer hover:bg-amber-600 transition-colors"
            onClick={() => {
              setShowWarning(false);
              // Scroll to timer
              document.querySelector('[data-timer-container]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          >
            <AlertTriangle size={24} />
            <div>
              <p className="font-bold">Session Ending Soon!</p>
              <p className="text-sm">
                {timeRemaining > 60
                  ? `${Math.floor(timeRemaining / 60)} minutes remaining - Click to view timer`
                  : `${timeRemaining} seconds remaining - Click to view timer`
                }
              </p>
            </div>
            <button className="ml-2 p-2 hover:bg-white/20 rounded-full transition-colors">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && isTeacher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Timer Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(parseInt(e.target.value) || 0)}
                    min="1"
                    max="480"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 30-90 minutes
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCustomDuration(15)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm"
                  >
                    15 min
                  </button>
                  <button
                    onClick={() => setCustomDuration(30)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm"
                  >
                    30 min
                  </button>
                  <button
                    onClick={() => setCustomDuration(45)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm"
                  >
                    45 min
                  </button>
                  <button
                    onClick={() => setCustomDuration(60)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm"
                  >
                    60 min
                  </button>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSetDuration}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
