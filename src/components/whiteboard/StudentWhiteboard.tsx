import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Image as KonvaImage, Group } from 'react-konva';
import { motion, AnimatePresence } from 'motion/react';
import {
  Pencil, Eraser, Type, Square, Circle as CircleIcon, Triangle,
  Image as ImageIcon, Undo, Redo, Trash2, Download, Save,
  Grid3X3, Ruler, Compass, Sigma, Calculator, StickyNote,
  Minimize2, Maximize2, X, Check, Plus, Minus
} from 'lucide-react';
import { cn } from '../lib/utils';

interface StudentWhiteboardProps {
  roomId: string;
  studentId: string;
  studentName: string;
  socket: any;
  isTeacherView?: boolean;
  isExpanded?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
  initialLines?: any[];
}

export const StudentWhiteboard: React.FC<StudentWhiteboardProps> = ({
  roomId,
  studentId,
  studentName,
  socket,
  isTeacherView = false,
  isExpanded = false,
  onExpand,
  onClose,
  initialLines = []
}) => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState<any[]>(initialLines);
  const [history, setHistory] = useState<any[][]>([]);
  const [redoStack, setRedoStack] = useState<any[][]>([]);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [textValue, setTextValue] = useState('');
  const [showTextModal, setShowTextModal] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [showMathTools, setShowMathTools] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);
  
  const stageRef = useRef<any>(null);
  const containerRef = useRef<any>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Sync lines from teacher/other students
  useEffect(() => {
    if (!socket) return;

    const handleBoardUpdate = ({ lines: newLines }: { lines: any[] }) => {
      setLines(newLines);
    };

    socket.on(`board-update-${roomId}`, handleBoardUpdate);
    return () => {
      socket.off(`board-update-${roomId}`, handleBoardUpdate);
    };
  }, [socket, roomId]);

  const handleMouseDown = (e: any) => {
    if (isTeacherView) return; // Teachers can't draw on student boards
    
    const pos = e.target.getStage().getPointerPosition();
    
    if (tool === 'text') {
      setTextPosition(pos);
      setShowTextModal(true);
      return;
    }

    if (tool === 'image') {
      imageInputRef.current?.click();
      return;
    }

    setIsDrawing(true);
    
    const newLine = {
      tool,
      color: tool === 'eraser' ? '#ffffff' : color,
      strokeWidth: tool === 'highlighter' ? 20 : strokeWidth,
      points: [pos.x, pos.y],
      type: 'freehand',
      opacity: tool === 'highlighter' ? 0.3 : 1,
    };

    if (['rect', 'circle', 'triangle'].includes(tool)) {
      setLines([...lines, { ...newLine, points: [pos.x, pos.y, pos.x, pos.y], type: 'shape' }]);
    } else {
      setLines([...lines, newLine]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = { ...lines[lines.length - 1] };

    if (lastLine.type === 'shape') {
      // Update shape dimensions
      lastLine.points = [lastLine.points[0], lastLine.points[1], point.x, point.y];
    } else {
      // Add point to freehand drawing
      lastLine.points = lastLine.points.concat([point.x, point.y]);
    }

    const newLines = lines.slice(0, -1).concat([lastLine]);
    setLines(newLines);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Save to history
    setHistory(prev => [...prev, [...lines]]);
    setRedoStack([]);
    
    // Sync to server
    if (socket) {
      socket.emit('student-board-update', {
        roomId,
        studentId,
        studentName,
        lines
      });
    }
  };

  const handleAddText = () => {
    if (!textValue.trim()) return;
    
    const newText = {
      tool: 'text',
      type: 'text',
      text: textValue,
      x: textPosition.x,
      y: textPosition.y,
      fontSize: 24,
      fill: color,
    };
    
    setLines(prev => [...prev, newText]);
    setShowTextModal(false);
    setTextValue('');
    
    // Sync to server
    if (socket) {
      socket.emit('student-board-update', {
        roomId,
        studentId,
        studentName,
        lines: [...lines, newText]
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const newImage = {
          tool: 'image',
          type: 'image',
          src: event.target?.result as string,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
        };
        
        setLines(prev => [...prev, newImage]);
        setUploadedImages(prev => [...prev, newImage]);
        
        // Sync to server
        if (socket) {
          socket.emit('student-board-update', {
            roomId,
            studentId,
            studentName,
            lines: [...lines, newImage]
          });
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack(prev => [...prev, [...lines]]);
    setHistory(prev => prev.slice(0, -1));
    setLines(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory(prev => [...prev, [...lines]]);
    setRedoStack(prev => prev.slice(0, -1));
    setLines(next);
  };

  const handleClear = () => {
    setHistory(prev => [...prev, [...lines]]);
    setRedoStack([]);
    setLines([]);
    
    if (socket) {
      socket.emit('student-board-update', {
        roomId,
        studentId,
        studentName,
        lines: []
      });
    }
  };

  const handleSave = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = `${studentName}-whiteboard-${new Date().toISOString()}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  const WhiteboardElement = ({ line }: { line: any }) => {
    if (line.type === 'text') {
      return (
        <Text
          x={line.x}
          y={line.y}
          text={line.text}
          fontSize={line.fontSize}
          fill={line.fill}
        />
      );
    }
    
    if (line.type === 'image') {
      const [image, setImage] = useState<HTMLImageElement | null>(null);
      
      useEffect(() => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => setImage(img);
        img.src = line.src;
      }, [line.src]);

      if (!image) return null;
      
      return (
        <KonvaImage
          image={image}
          x={line.x}
          y={line.y}
          width={line.width}
          height={line.height}
        />
      );
    }

    if (line.type === 'shape') {
      const [x1, y1, x2, y2] = line.points;
      
      if (line.tool === 'rect') {
        return (
          <Rect
            x={Math.min(x1, x2)}
            y={Math.min(y1, y2)}
            width={Math.abs(x2 - x1)}
            height={Math.abs(y2 - y1)}
            stroke={line.color}
            strokeWidth={line.strokeWidth}
          />
        );
      }
      
      if (line.tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return (
          <Circle
            x={x1}
            y={y1}
            radius={radius}
            stroke={line.color}
            strokeWidth={line.strokeWidth}
          />
        );
      }
      
      if (line.tool === 'triangle') {
        return (
          <Line
            points={[x1, y1, x2, y2, x1, y2]}
            closed
            stroke={line.color}
            strokeWidth={line.strokeWidth}
          />
        );
      }
    }

    // Freehand drawing
    return (
      <Line
        points={line.points}
        stroke={line.color}
        strokeWidth={line.strokeWidth}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        opacity={line.opacity}
        globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
      />
    );
  };

  return (
    <div className={cn(
      "flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden",
      isExpanded ? "fixed inset-4 z-[100]" : "h-full"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {studentName[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{studentName}</p>
            <p className="text-xs text-gray-500">Student Workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded ? (
            <button
              onClick={onExpand}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Expand"
            >
              <Maximize2 size={16} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <Minimize2 size={16} />
            </button>
          )}
          {!isTeacherView && (
            <>
              <button
                onClick={handleSave}
                className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
                title="Save"
              >
                <Save size={16} />
              </button>
              <button
                onClick={handleClear}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                title="Clear"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Toolbar */}
      {!isTeacherView && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-white overflow-x-auto">
          {/* Drawing Tools */}
          <div className="flex items-center gap-1 px-2 border-r border-gray-200">
            <button
              onClick={() => setTool('pen')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                tool === 'pen' ? "bg-emerald-100 text-emerald-700" : "hover:bg-gray-100"
              )}
              title="Pen"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => setTool('highlighter')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                tool === 'highlighter' ? "bg-amber-100 text-amber-700" : "hover:bg-gray-100"
              )}
              title="Highlighter"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                tool === 'eraser' ? "bg-gray-200 text-gray-700" : "hover:bg-gray-100"
              )}
              title="Eraser"
            >
              <Eraser size={18} />
            </button>
          </div>

          {/* Shapes */}
          <div className="flex items-center gap-1 px-2 border-r border-gray-200">
            <button
              onClick={() => setTool('rect')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                tool === 'rect' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              )}
              title="Rectangle"
            >
              <Square size={18} />
            </button>
            <button
              onClick={() => setTool('circle')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                tool === 'circle' ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
              )}
              title="Circle"
            >
              <CircleIcon size={18} />
            </button>
            <button
              onClick={() => setTool('triangle')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                tool === 'triangle' ? "bg-pink-100 text-pink-700" : "hover:bg-gray-100"
              )}
              title="Triangle"
            >
              <Triangle size={18} />
            </button>
          </div>

          {/* Text & Image */}
          <div className="flex items-center gap-1 px-2 border-r border-gray-200">
            <button
              onClick={() => setTool('text')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                tool === 'text' ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"
              )}
              title="Text"
            >
              <Type size={18} />
            </button>
            <button
              onClick={() => setTool('image')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                tool === 'image' ? "bg-orange-100 text-orange-700" : "hover:bg-gray-100"
              )}
              title="Upload Image"
            >
              <ImageIcon size={18} />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Math Tools */}
          <div className="relative">
            <button
              onClick={() => setShowMathTools(!showMathTools)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Math Tools"
            >
              <Sigma size={18} />
            </button>
            <AnimatePresence>
              {showMathTools && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 p-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 flex gap-1"
                >
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Equation">
                    <Sigma size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Fraction">
                    <Calculator size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Grid">
                    <Grid3X3 size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Ruler">
                    <Ruler size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Grid Toggle */}
          <button
            onClick={() => setGridVisible(!gridVisible)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              gridVisible ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
            )}
            title="Toggle Grid"
          >
            <Grid3X3 size={18} />
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Undo"
            >
              <Undo size={18} />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Redo"
            >
              <Redo size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 relative bg-white">
        {gridVisible && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        )}
        
        <Stage
          width={containerRef.current?.clientWidth || 800}
          height={containerRef.current?.clientHeight || 600}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          ref={stageRef}
        >
          <Layer>
            {lines.map((line, i) => (
              <WhiteboardElement key={i} line={line} />
            ))}
          </Layer>
        </Stage>

        {/* Text Input Modal */}
        <AnimatePresence>
          {showTextModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 flex items-center justify-center z-50"
              onClick={() => setShowTextModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white p-6 rounded-2xl shadow-xl"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold mb-4">Add Text</h3>
                <input
                  type="text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
                  placeholder="Enter your text..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none mb-4"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddText}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Add Text
                  </button>
                  <button
                    onClick={() => setShowTextModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Color Picker */}
      {!isTeacherView && (
        <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-100 bg-gray-50">
          <span className="text-xs font-medium text-gray-600">Color:</span>
          <div className="flex gap-1">
            {['#000000', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#A855F7', '#EC4899'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                  color === c ? "border-gray-900 scale-110" : "border-transparent"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-gray-600 w-6">{strokeWidth}px</span>
          </div>
        </div>
      )}
    </div>
  );
};
