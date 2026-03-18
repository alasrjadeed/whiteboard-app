import React, { useState } from 'react';
import {
  Pencil,
  Eraser,
  Trash2,
  Download,
  Undo,
  Redo,
  Square,
  Circle as CircleIcon,
  Minus,
  Type,
  MousePointer2,
  Lock,
  Unlock,
  Send,
  Eye,
  EyeOff,
  Moon,
  Sun,
  QrCode,
  Sigma,
  PieChart,
  Grid3X3,
  Ruler,
  Triangle,
  ChevronDown,
  Bell,
  RotateCcw,
  BookOpen,
  FileText,
  BarChart2,
  Youtube,
  Smile,
  Image as ImageIcon,
  HardDrive
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ToolbarProps {
  tool: string;
  setTool: (tool: string) => void;
  color: string;
  setColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDownload: () => void;
  onSaveToUSB?: () => void;
  onAutoSave?: () => void;
  // Teacher specific
  isTeacher?: boolean;
  isLocked?: boolean;
  onToggleLock?: () => void;
  onPushBoard?: () => void;
  onClearAll?: () => void;
  hideNames?: boolean;
  onTogglePrivacy?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onShowQR?: () => void;
  waitingCount?: number;
  onShowWaiting?: () => void;
  onShowTemplates?: () => void;
  onShowNotes?: () => void;
  onShowPoll?: () => void;
  onShowVideo?: () => void;
  onShowStatus?: () => void;
  onShowImageUpload?: () => void;
  isRecording?: boolean;
  setIsRecording?: (recording: boolean) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tool, setTool, color, setColor, strokeWidth, setStrokeWidth,
  onUndo, onRedo, onClear, onDownload,
  onSaveToUSB, onAutoSave,
  isTeacher, isLocked, onToggleLock, onPushBoard, onClearAll, hideNames, onTogglePrivacy,
  darkMode, onToggleDarkMode, onShowQR, waitingCount, onShowWaiting,
  onShowTemplates, onShowNotes, onShowPoll, onShowVideo, onShowStatus, onShowImageUpload,
  isRecording, setIsRecording
}) => {
  const [showMath, setShowMath] = useState(false);
  return (
    <div className={cn(
      "flex flex-wrap items-center justify-between p-2 border-b transition-colors",
      darkMode ? "bg-stone-900 border-white/10 text-white" : "bg-stone-50 border-black/5 text-black"
    )}>
      <div className="flex items-center gap-1 flex-wrap">
        <button
          onClick={() => setTool('pen')}
          className={cn(
            "p-2 rounded-lg transition-colors",
            tool === 'pen' ? (darkMode ? "bg-white text-black" : "bg-black text-white") : (darkMode ? "hover:bg-white/10" : "hover:bg-black/5")
          )}
          title="Pen"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={cn(
            "p-2 rounded-lg transition-colors",
            tool === 'eraser' ? (darkMode ? "bg-white text-black" : "bg-black text-white") : (darkMode ? "hover:bg-white/10" : "hover:bg-black/5")
          )}
          title="Eraser"
        >
          <Eraser size={18} />
        </button>
        <button
          onClick={() => setTool('laser')}
          className={cn(
            "p-2 rounded-lg transition-colors",
            tool === 'laser' ? (darkMode ? "bg-white text-black" : "bg-black text-white") : (darkMode ? "hover:bg-white/10" : "hover:bg-black/5")
          )}
          title="Laser Pointer"
        >
          <MousePointer2 size={18} />
        </button>
        
        <div className={cn("w-px h-6 mx-1", darkMode ? "bg-white/10" : "bg-black/10")} />
        
        <button
          onClick={() => setTool('line')}
          className={cn(
            "p-2 rounded-lg transition-colors",
            tool === 'line' ? (darkMode ? "bg-white text-black" : "bg-black text-white") : (darkMode ? "hover:bg-white/10" : "hover:bg-black/5")
          )}
          title="Line"
        >
          <Minus size={18} />
        </button>
        <button
          onClick={() => setTool('rect')}
          className={cn(
            "p-2 rounded-lg transition-colors",
            tool === 'rect' ? (darkMode ? "bg-white text-black" : "bg-black text-white") : (darkMode ? "hover:bg-white/10" : "hover:bg-black/5")
          )}
          title="Rectangle"
        >
          <Square size={18} />
        </button>
        <button
          onClick={() => setTool('circle')}
          className={cn(
            "p-2 rounded-lg transition-colors",
            tool === 'circle' ? (darkMode ? "bg-white text-black" : "bg-black text-white") : (darkMode ? "hover:bg-white/10" : "hover:bg-black/5")
          )}
          title="Circle"
        >
          <CircleIcon size={18} />
        </button>
        <button
          onClick={() => setTool('text')}
          className={cn(
            "p-2 rounded-lg transition-colors",
            tool === 'text' ? (darkMode ? "bg-white text-black" : "bg-black text-white") : (darkMode ? "hover:bg-white/10" : "hover:bg-black/5")
          )}
          title="Text"
        >
          <Type size={18} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMath(!showMath)}
            className={cn(
              "p-2 rounded-lg transition-colors flex items-center gap-1",
              ['equation', 'fraction', 'pie', 'grid', 'ruler', 'protractor'].includes(tool) ? (darkMode ? "bg-white text-black" : "bg-black text-white") : (darkMode ? "hover:bg-white/10" : "hover:bg-black/5")
            )}
            title="Math Tools"
          >
            <Sigma size={18} />
            <ChevronDown size={12} />
          </button>
          
          <AnimatePresence>
            {showMath && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={cn(
                  "absolute top-full left-0 mt-2 z-50 rounded-xl shadow-xl border p-2 grid grid-cols-2 gap-1 min-w-[140px]",
                  darkMode ? "bg-stone-800 border-white/10" : "bg-white border-black/5"
                )}
              >
                {[
                  { id: 'equation', icon: Sigma, label: 'Equation' },
                  { id: 'fraction', icon: Type, label: 'Fraction' },
                  { id: 'pie', icon: PieChart, label: 'Pie Chart' },
                  { id: 'grid', icon: Grid3X3, label: 'Grid' },
                  { id: 'ruler', icon: Ruler, label: 'Ruler' },
                  { id: 'protractor', icon: Triangle, label: 'Protractor' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setTool(item.id as any); setShowMath(false); }}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg text-xs font-bold transition-colors",
                      tool === item.id ? (darkMode ? "bg-white text-black" : "bg-black text-white") : (darkMode ? "hover:bg-white/5" : "hover:bg-black/5")
                    )}
                  >
                    <item.icon size={14} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={cn("w-px h-6 mx-1", darkMode ? "bg-white/10" : "bg-black/10")} />
        
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
          title="Color Picker"
        />
        <select
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className={cn(
            "text-xs font-medium border rounded px-1 py-1 transition-colors",
            darkMode ? "bg-stone-800 border-white/10 text-white" : "bg-white border-black/10 text-black"
          )}
        >
          <option value={2}>Thin</option>
          <option value={5}>Medium</option>
          <option value={10}>Thick</option>
          <option value={20}>Extra Thick</option>
        </select>
      </div>
      
      <div className="flex items-center gap-1 flex-wrap">
        {isTeacher && (
          <>
            {waitingCount !== undefined && waitingCount > 0 && (
              <button
                onClick={onShowWaiting}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-full text-[10px] font-bold animate-pulse mr-1"
              >
                <Bell size={12} />
                <span>{waitingCount} Waiting</span>
              </button>
            )}
            <button
              onClick={onPushBoard}
              className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
              title="Push Board to Students"
            >
              <Send size={18} />
            </button>
            <button
              onClick={onClearAll}
              className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
              title="Clear All Student Boards"
            >
              <Trash2 size={18} className="scale-110" />
            </button>
            <button
              onClick={onToggleLock}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isLocked ? "text-red-500 bg-red-500/10" : "hover:bg-black/5"
              )}
              title={isLocked ? "Unlock Room" : "Lock Room"}
            >
              {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
            </button>
            <button
              onClick={onTogglePrivacy}
              className={cn(
                "p-2 rounded-lg transition-colors",
                hideNames ? "text-amber-500 bg-amber-500/10" : "hover:bg-black/5"
              )}
              title={hideNames ? "Show Names" : "Hide Names"}
            >
              {hideNames ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button
              onClick={onShowQR}
              className="p-2 rounded-lg hover:bg-black/5 transition-colors"
              title="Show QR Code"
            >
              <QrCode size={18} />
            </button>
            <div className={cn("w-px h-6 mx-1", darkMode ? "bg-white/10" : "bg-black/10")} />
          </>
        )}

        <button
          onClick={onShowTemplates}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          title="Templates Gallery"
        >
          <BookOpen size={18} />
        </button>
        <button
          onClick={onShowNotes}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          title="Shared Notes"
        >
          <FileText size={18} />
        </button>
        <button
          onClick={onShowPoll}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          title="Class Polls"
        >
          <BarChart2 size={18} />
        </button>
        <button
          onClick={onShowVideo}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          title="Share External Video"
        >
          <Youtube size={18} />
        </button>
        <button
          onClick={onShowStatus}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          title="Set Status / Emoji"
        >
          <Smile size={18} />
        </button>
        <button
          onClick={onShowImageUpload}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          title="Upload Image"
        >
          <ImageIcon size={18} />
        </button>

        <button
          onClick={() => setIsRecording?.(!isRecording)}
          className={cn(
            "p-2 rounded-lg transition-colors flex items-center gap-2",
            isRecording ? "bg-red-500 text-white animate-pulse" : "hover:bg-black/5"
          )}
          title={isRecording ? "Stop Recording" : "Start Recording"}
        >
          <div className={cn("w-2 h-2 rounded-full", isRecording ? "bg-white" : "bg-red-500")} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{isRecording ? 'Recording' : 'Record'}</span>
        </button>

        <div className={cn("w-px h-6 mx-1", darkMode ? "bg-white/10" : "bg-black/10")} />
        
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={onUndo}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={onRedo}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          title="Redo"
        >
          <Redo size={18} />
        </button>
        <button
          onClick={onClear}
          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
          title="Clear My Board"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={onDownload}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
          title="Download PNG"
        >
          <Download size={18} />
        </button>
        {isTeacher && onSaveToUSB && (
          <button
            onClick={onSaveToUSB}
            className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
            title="Save to PC/USB"
          >
            <HardDrive size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
