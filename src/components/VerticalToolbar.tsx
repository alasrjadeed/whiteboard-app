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
  ChevronRight,
  ChevronLeft,
  Bell,
  RotateCcw,
  BookOpen,
  FileText,
  BarChart2,
  Youtube,
  Smile,
  Users,
  Video,
  Mic,
  MicOff,
  Camera,
  MessageSquare,
  Hand,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  Palette,
  Layers,
  Image,
  StickyNote,
  Lightbulb,
  Target,
  Zap,
  Share2,
  MonitorPlay,
  ClipboardList,
  Award,
  TrendingUp,
  FolderOpen,
  Save,
  Copy,
  Scissors,
  Maximize,
  Minimize2,
  RefreshCw,
  ArrowRight,
  Heart,
  Star,
  Flag,
  Bookmark
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';

interface VerticalToolbarProps {
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
  isRecording?: boolean;
  setIsRecording?: (recording: boolean) => void;
  students?: Record<string, any>;
  onShowBreakout?: () => void;
}

interface ToolCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  tools: ToolItem[];
}

interface ToolItem {
  id: string;
  name: string;
  icon: React.ElementType;
  shortcut?: string;
}

export const VerticalToolbar: React.FC<VerticalToolbarProps> = ({
  tool, setTool, color, setColor, strokeWidth, setStrokeWidth,
  onUndo, onRedo, onClear, onDownload,
  isTeacher, isLocked, onToggleLock, onPushBoard, onClearAll, hideNames, onTogglePrivacy,
  darkMode, onToggleDarkMode, onShowQR, waitingCount, onShowWaiting,
  onShowTemplates, onShowNotes, onShowPoll, onShowVideo, onShowStatus,
  isRecording, setIsRecording, students, onShowBreakout
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('drawing');
  const [showColors, setShowColors] = useState(false);

  const toolCategories: ToolCategory[] = [
    {
      id: 'drawing',
      name: 'Drawing',
      icon: Pencil,
      tools: [
        { id: 'pen', name: 'Pen', icon: Pencil, shortcut: 'P' },
        { id: 'eraser', name: 'Eraser', icon: Eraser, shortcut: 'E' },
        { id: 'laser', name: 'Laser', icon: MousePointer2, shortcut: 'L' },
        { id: 'highlighter', name: 'Highlighter', icon: HighlighterIcon, shortcut: 'H' },
      ]
    },
    {
      id: 'shapes',
      name: 'Shapes',
      icon: Square,
      tools: [
        { id: 'line', name: 'Line', icon: Minus, shortcut: '1' },
        { id: 'rect', name: 'Rectangle', icon: Square, shortcut: '2' },
        { id: 'circle', name: 'Circle', icon: CircleIcon, shortcut: '3' },
        { id: 'arrow', name: 'Arrow', icon: ArrowRight, shortcut: '4' },
        { id: 'triangle', name: 'Triangle', icon: Triangle, shortcut: '5' },
      ]
    },
    {
      id: 'text',
      name: 'Text',
      icon: Type,
      tools: [
        { id: 'text', name: 'Text', icon: Type, shortcut: 'T' },
        { id: 'equation', name: 'Equation', icon: Sigma, shortcut: 'M' },
        { id: 'fraction', name: 'Fraction', icon: FractionIcon, shortcut: 'F' },
        { id: 'sticky', name: 'Sticky Note', icon: StickyNote, shortcut: 'S' },
      ]
    },
    {
      id: 'math',
      name: 'Math Tools',
      icon: Sigma,
      tools: [
        { id: 'ruler', name: 'Ruler', icon: Ruler, shortcut: 'R' },
        { id: 'protractor', name: 'Protractor', icon: Triangle, shortcut: 'O' },
        { id: 'grid', name: 'Grid', icon: Grid3X3, shortcut: 'G' },
        { id: 'pie', name: 'Pie Chart', icon: PieChart, shortcut: 'C' },
        { id: 'graph', name: 'Graph', icon: TrendingUp, shortcut: 'X' },
      ]
    },
  ];

  const classroomTools = [
    { id: 'push', name: 'Push Board', icon: Send, color: 'emerald', onClick: onPushBoard },
    { id: 'clearAll', name: 'Clear All', icon: Trash2, color: 'red', onClick: onClearAll },
    { id: 'lock', name: isLocked ? 'Unlock' : 'Lock', icon: isLocked ? Unlock : Lock, color: isLocked ? 'orange' : 'gray', onClick: onToggleLock },
    { id: 'privacy', name: hideNames ? 'Show Names' : 'Hide Names', icon: hideNames ? EyeOff : Eye, color: hideNames ? 'amber' : 'gray', onClick: onTogglePrivacy },
    { id: 'breakout', name: 'Breakout Rooms', icon: Users, color: 'blue', onClick: onShowBreakout },
  ];

  const engagementTools = [
    { id: 'qr', name: 'QR Code', icon: QrCode, onClick: onShowQR },
    { id: 'templates', name: 'Templates', icon: BookOpen, onClick: onShowTemplates },
    { id: 'notes', name: 'Shared Notes', icon: FileText, onClick: onShowNotes },
    { id: 'poll', name: 'Create Poll', icon: BarChart2, onClick: onShowPoll },
    { id: 'video', name: 'Share Video', icon: Youtube, onClick: onShowVideo },
    { id: 'status', name: 'Set Status', icon: Smile, onClick: onShowStatus },
  ];

  const actionTools = [
    { id: 'undo', name: 'Undo', icon: Undo, shortcut: 'Ctrl+Z', onClick: onUndo },
    { id: 'redo', name: 'Redo', icon: Redo, shortcut: 'Ctrl+Y', onClick: onRedo },
    { id: 'clear', name: 'Clear My Board', icon: RotateCcw, shortcut: 'Ctrl+D', onClick: onClear },
    { id: 'download', name: 'Download', icon: Download, shortcut: 'Ctrl+S', onClick: onDownload },
  ];

  const colors = [
    '#000000', '#FFFFFF', '#EF4444', '#F97316', '#F59E0B', '#84CC16',
    '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
  ];

  return (
    <div className={cn(
      "flex flex-col h-full border-r overflow-y-auto scrollbar-hide",
      darkMode ? "bg-stone-900 border-white/10" : "bg-white border-black/5"
    )}>
      {/* Logo / App Name */}
      <div className={cn(
        "p-3 border-b text-center",
        darkMode ? "border-white/10" : "border-black/5"
      )}>
        <h1 className="text-xs font-bold uppercase tracking-widest opacity-50">Whiteboard</h1>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="p-2">
          <div className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 rounded-xl">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-red-500">REC</span>
          </div>
        </div>
      )}

      {/* Waiting Students Alert */}
      {isTeacher && waitingCount !== undefined && waitingCount > 0 && (
        <motion.button
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          onClick={onShowWaiting}
          className="mx-2 mb-2 px-3 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-pulse"
        >
          <Bell size={14} />
          <span>{waitingCount} Waiting</span>
        </motion.button>
      )}

      {/* Tool Categories */}
      <div className="flex-1 py-2">
        {toolCategories.map((category) => (
          <div key={category.id} className="mb-2">
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className={cn(
                "w-full px-3 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider transition-colors",
                darkMode ? "hover:bg-white/5" : "hover:bg-black/5"
              )}
            >
              <div className="flex items-center gap-2">
                <category.icon size={14} />
                <span>{category.name}</span>
              </div>
              {expandedCategory === category.id ? (
                <ChevronLeft size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
            </button>

            <AnimatePresence>
              {expandedCategory === category.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-2 py-1 space-y-1">
                    {category.tools.map((toolItem) => (
                      <button
                        key={toolItem.id}
                        onClick={() => setTool(toolItem.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors",
                          tool === toolItem.id
                            ? (darkMode ? "bg-white text-black" : "bg-black text-white")
                            : (darkMode ? "hover:bg-white/5" : "hover:bg-black/5")
                        )}
                        title={`${toolItem.name} ${toolItem.shortcut ? `(${toolItem.shortcut})` : ''}`}
                      >
                        <toolItem.icon size={14} />
                        <span>{toolItem.name}</span>
                        {toolItem.shortcut && (
                          <span className="ml-auto text-[10px] opacity-50">{toolItem.shortcut}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Color Picker */}
      <div className={cn("px-2 py-2 border-t", darkMode ? "border-white/10" : "border-black/5")}>
        <button
          onClick={() => setShowColors(!showColors)}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors",
            darkMode ? "hover:bg-white/5" : "hover:bg-black/5"
          )}
        >
          <Palette size={14} />
          <span>Colors</span>
          <ChevronRight size={12} className="ml-auto" />
        </button>

        <AnimatePresence>
          {showColors && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-2 py-2 grid grid-cols-4 gap-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setColor(c); setShowColors(false); }}
                    className={cn(
                      "w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110",
                      color === c ? "border-black dark:border-white" : "border-transparent"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="px-2 py-2">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-50">Stroke Width</label>
                <select
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className={cn(
                    "w-full mt-1 text-xs font-medium border rounded-lg px-2 py-1.5 transition-colors",
                    darkMode ? "bg-stone-800 border-white/10 text-white" : "bg-white border-black/10 text-black"
                  )}
                >
                  <option value={2}>Thin (2px)</option>
                  <option value={5}>Medium (5px)</option>
                  <option value={10}>Thick (10px)</option>
                  <option value={20}>Extra Thick (20px)</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Teacher Classroom Tools */}
      {isTeacher && (
        <div className={cn("px-2 py-2 border-t space-y-1", darkMode ? "border-white/10" : "border-black/5")}>
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider opacity-50">Classroom</div>
          {classroomTools.map((toolItem) => (
            <button
              key={toolItem.id}
              onClick={toolItem.onClick}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors",
                toolItem.color === 'emerald' ? "text-emerald-500 hover:bg-emerald-500/10" :
                toolItem.color === 'red' ? "text-red-500 hover:bg-red-500/10" :
                toolItem.color === 'orange' ? "text-orange-500 hover:bg-orange-500/10" :
                toolItem.color === 'blue' ? "text-blue-500 hover:bg-blue-500/10" :
                toolItem.color === 'amber' ? "text-amber-500 hover:bg-amber-500/10" :
                "hover:bg-black/5"
              )}
            >
              <toolItem.icon size={14} />
              <span>{toolItem.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Engagement Tools */}
      <div className={cn("px-2 py-2 border-t space-y-1", darkMode ? "border-white/10" : "border-black/5")}>
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider opacity-50">Engagement</div>
        {engagementTools.map((toolItem) => (
          <button
            key={toolItem.id}
            onClick={toolItem.onClick}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors",
              darkMode ? "hover:bg-white/5" : "hover:bg-black/5"
            )}
          >
            <toolItem.icon size={14} />
            <span>{toolItem.name}</span>
          </button>
        ))}
      </div>

      {/* Action Tools */}
      <div className={cn("px-2 py-2 border-t", darkMode ? "border-white/10" : "border-black/5")}>
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider opacity-50">Actions</div>
        <div className="grid grid-cols-2 gap-1">
          {actionTools.map((toolItem) => (
            <button
              key={toolItem.id}
              onClick={toolItem.onClick}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg text-[10px] transition-colors",
                darkMode ? "hover:bg-white/5" : "hover:bg-black/5"
              )}
              title={`${toolItem.name} ${toolItem.shortcut ? `(${toolItem.shortcut})` : ''}`}
            >
              <toolItem.icon size={16} />
              <span className="text-[9px]">{toolItem.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className={cn("p-2 border-t", darkMode ? "border-white/10" : "border-black/5")}>
        <button
          onClick={onToggleDarkMode}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors",
            darkMode ? "hover:bg-white/5" : "hover:bg-black/5"
          )}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      {/* Student Count */}
      {isTeacher && students && (
        <div className={cn("px-3 py-2 border-t text-center", darkMode ? "border-white/10" : "border-black/5")}>
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-50">
            Students: {Object.keys(students).length}
          </div>
        </div>
      )}
    </div>
  );
};

// Additional Icons
function HighlighterIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l-6 6v3h9l3-3" />
      <path d="M22 12l-4.6-4.6a2 2 0 0 0-2.8 0l-5.2 5.2a2 2 0 0 0 0 2.8L14 20" />
    </svg>
  );
}

function FractionIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="6" r="3" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="12" cy="18" r="3" />
    </svg>
  );
}
