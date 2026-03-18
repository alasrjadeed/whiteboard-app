import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Image as KonvaImage, Group, Transformer } from 'react-konva';
import { Toolbar } from './Toolbar';
import { VerticalToolbar } from './VerticalToolbar';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, ThumbsUp, ThumbsDown, Send, MessageSquare, Trash2, Eye, EyeOff, Check, Ruler, Triangle, Grid3X3, Circle as CircleIcon, Square, Sigma, Star, Users, Bell, Maximize, Image as ImageIcon, MousePointer2, FileDown, Download, Mic, MicOff, BookOpen, Lightbulb, FileText, ClipboardList, GraduationCap, Pencil, CheckCircle2, LogOut, Activity } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../lib/utils';
import { VideoChat } from './VideoChat';
import { SessionTimer } from './timer/SessionTimer';
import { TeacherDashboard } from './whiteboard/TeacherDashboard';
import { StudentWhiteboard } from './whiteboard/StudentWhiteboard';
import { GoogleIntegration } from './GoogleIntegration';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const WhiteboardElement = ({ line, isSelected }: { line: any; isSelected?: boolean }) => {
  if (line.type === 'image') {
    const ImageComponent = () => {
      const [image, setImage] = useState<HTMLImageElement | null>(null);

      useEffect(() => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => setImage(img);
        img.src = line.src;
      }, [line.src]);

      if (!image) return null;

      return (
        <Group x={line.x} y={line.y} rotation={line.rotation}>
          <KonvaImage
            image={image}
            width={line.width}
            height={line.height}
          />
          {isSelected && (
            <Rect
              x={0}
              y={0}
              width={line.width}
              height={line.height}
              stroke="#10B981"
              strokeWidth={3}
              dash={[10, 5]}
              strokeScaleEnabled={false}
            />
          )}
          {line.label && (
            <Text
              text={line.label}
              y={line.height + 10}
              fontSize={16}
              fill="#000000"
              fontStyle="bold"
            />
          )}
        </Group>
      );
    };
    return <ImageComponent />;
  }

  if (line.type === 'text') {
    return (
      <Text
        x={line.points[0]}
        y={line.points[1]}
        text={line.text}
        fontSize={line.isFraction ? 18 : 24}
        fill={line.color}
        fontStyle={line.fontStyle}
        shadowColor={isSelected ? '#10B981' : undefined}
        shadowBlur={isSelected ? 10 : 0}
        shadowOffsetX={isSelected ? 2 : 0}
        shadowOffsetY={isSelected ? 2 : 0}
      />
    );
  }
  if (line.type === 'rect') {
    return <Rect x={line.points[0]} y={line.points[1]} width={line.points[2] - line.points[0]} height={line.points[3] - line.points[1]} stroke={line.color} strokeWidth={line.strokeWidth} shadowColor={isSelected ? '#10B981' : undefined} shadowBlur={isSelected ? 10 : 0} />;
  }
  if (line.type === 'circle') {
    return <Circle x={line.points[0]} y={line.points[1]} radius={Math.sqrt(Math.pow(line.points[2]-line.points[0], 2) + Math.pow(line.points[3]-line.points[1], 2))} stroke={line.color} strokeWidth={line.strokeWidth} shadowColor={isSelected ? '#10B981' : undefined} shadowBlur={isSelected ? 10 : 0} />;
  }
  if (line.type === 'pie') {
    // Simple pie chart representation
    return (
      <Circle
        x={line.points[0]}
        y={line.points[1]}
        radius={50}
        stroke={line.color}
        strokeWidth={line.strokeWidth}
        dash={[10, 5]}
        shadowColor={isSelected ? '#10B981' : undefined}
        shadowBlur={isSelected ? 10 : 0}
      />
    );
  }
  if (line.type === 'grid') {
    return (
      <Rect
        x={line.points[0]}
        y={line.points[1]}
        width={line.size}
        height={line.size}
        stroke={line.color}
        strokeWidth={1}
        dash={[2, 2]}
        shadowColor={isSelected ? '#10B981' : undefined}
        shadowBlur={isSelected ? 10 : 0}
      />
    );
  }
  return <Line points={line.points} stroke={line.color} strokeWidth={line.strokeWidth} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'} shadowColor={isSelected ? '#10B981' : undefined} shadowBlur={isSelected ? 10 : 0} />;
};

interface WhiteboardProps {
  roomId: string;
  name: string;
  role: 'teacher' | 'student';
  socket: any;
  students: Record<string, { name: string; lines: any[] }>;
  waiting: Record<string, { name: string }>;
  teacherInfo: { id: string; name: string } | null;
  isLocked: boolean;
  hideNames: boolean;
  isTeacher: boolean;
  // Attendance props
  attendanceList?: Record<string, any>;
  showAttendance?: boolean;
  setShowAttendance?: (show: boolean) => void;
  viewingStudentId?: string | null;
  viewingStudentBoard?: any[];
  onOpenAttendance?: () => void;
  onExportAttendance?: () => void;
  onViewStudentBoard?: (studentId: string) => void;
  onCloseStudentView?: () => void;
  onEndClass?: () => void;
}

export const Whiteboard: React.FC<WhiteboardProps> = ({
  roomId, name, role, socket, students, waiting, teacherInfo, isLocked, hideNames, isTeacher,
  attendanceList = {},
  showAttendance = false,
  setShowAttendance = () => {},
  viewingStudentId = null,
  viewingStudentBoard = [],
  onOpenAttendance = () => {},
  onExportAttendance = () => {},
  onViewStudentBoard = () => {},
  onCloseStudentView = () => {},
  onEndClass = () => {}
}) => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState<any[]>([]);
  const [history, setHistory] = useState<any[][]>([]);
  const [redoStack, setRedoStack] = useState<any[][]>([]);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showWaiting, setShowWaiting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [spotlightedStudent, setSpotlightedStudent] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [comment, setComment] = useState('');

  const [showTemplates, setShowTemplates] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [showPoll, setShowPoll] = useState(false);
  const [currentPoll, setCurrentPoll] = useState<any>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [externalVideoUrl, setExternalVideoUrl] = useState<string | null>(null);
  const [showStatus, setShowStatus] = useState(false);
  const [studentStatuses, setStudentStatuses] = useState<Record<string, string>>({});
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [privateMessages, setPrivateMessages] = useState<Record<string, any[]>>({});
  const [showPrivateChat, setShowPrivateChat] = useState<string | null>(null);
  
  // Public chat state
  const [showPublicChat, setShowPublicChat] = useState(false);
  const [publicMessages, setPublicMessages] = useState<any[]>([]);
  const [publicChatInput, setPublicChatInput] = useState('');
  
  // Presentation upload state
  const [showPresentation, setShowPresentation] = useState(false);
  const [presentations, setPresentations] = useState<any[]>([]);
  const [currentPresentation, setCurrentPresentation] = useState<any>(null);
  const [newMessageNotification, setNewMessageNotification] = useState<{show: boolean, from: string, fromName: string, message: string} | null>(null);
  const [privateInput, setPrivateInput] = useState('');

  // Image upload state
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  // Timer state
  const [showTimer, setShowTimer] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(60); // minutes

  // Voice chat state
  const [isVoiceChatOn, setIsVoiceChatOn] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);

  // Assignment system state
  const [showAssignments, setShowAssignments] = useState(false);
  const [assignments, setAssignments] = useState<any[]>(() => {
    // Load assignments from localStorage on mount
    try {
      const stored = localStorage.getItem(`assignments-${roomId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Listen for assignment updates from localStorage
  useEffect(() => {
    const handleAssignmentUpdate = () => {
      const stored = localStorage.getItem(`assignments-${roomId}`);
      if (stored) {
        setAssignments(JSON.parse(stored));
      }
    };

    const handlePresentationsLoaded = (e: any) => {
      setPresentations(e.detail || []);
    };

    window.addEventListener('assignment-updated', handleAssignmentUpdate);
    window.addEventListener('presentations-loaded', handlePresentationsLoaded);
    return () => {
      window.removeEventListener('assignment-updated', handleAssignmentUpdate);
      window.removeEventListener('presentations-loaded', handlePresentationsLoaded);
    };
  }, [roomId]);

  // Listen for public chat messages
  useEffect(() => {
    const handlePublicMessage = (e: any) => {
      const message = e.detail;
      console.log('💬 Received public message:', message);
      setPublicMessages(prev => [...prev, { ...message, isMe: message.fromId === socket?.id }]);
    };

    window.addEventListener('public-message', handlePublicMessage);
    return () => window.removeEventListener('public-message', handlePublicMessage);
  }, [socket?.id]);

  // Listen for presentation updates
  useEffect(() => {
    const handlePresentationUpdate = (e: any) => {
      const presentation = e.detail;
      console.log('📊 Received presentation update:', presentation);
      setPresentations(prev => {
        // Avoid duplicates
        if (prev.find(p => p.id === presentation.id)) return prev;
        return [...prev, presentation];
      });
    };

    window.addEventListener('presentation-updated', handlePresentationUpdate);
    return () => window.removeEventListener('presentation-updated', handlePresentationUpdate);
  }, [socket?.id]);
  const [currentAssignment, setCurrentAssignment] = useState<any>(null);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  const [assignmentPoints, setAssignmentPoints] = useState(100);
  const [studentSubmissions, setStudentSubmissions] = useState<Record<string, any>>({});
  const [showGrading, setShowGrading] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<any>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  // Selection and deletion state
  const [selectedTool, setSelectedTool] = useState<'select' | 'draw'>('draw');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  const stageRef = useRef<any>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Callback ref for better control
  const setStageRef = (node: any) => {
    if (node) {
      console.log('🔗 Stage ref callback called with node:', node);
      stageRef.current = node;
      setIsCanvasReady(true);
    } else {
      console.log('🔗 Stage ref callback called with null');
      stageRef.current = null;
      setIsCanvasReady(false);
    }
  };

  // Track when canvas is ready
  useEffect(() => {
    if (stageRef.current) {
      console.log('✅ Canvas is ready!');
    }
  }, [isCanvasReady]);

  // Keyboard shortcut for delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItems.length > 0) {
        e.preventDefault();
        handleDeleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItems]);

  useEffect(() => {
    const handleClearBoard = () => {
      console.log('🗑️ Clear board received');
      setLines([]);
    };

    const handlePushedBoard = (newLines: any[]) => {
      console.log('📤 Received pushed board:', newLines.length, 'lines');
      setLines(newLines);
    };

    const handleFeedback = (newFeedback: any) => {
      const id = Date.now();
      setFeedback(prev => [...prev, { ...newFeedback, id }]);
      // Auto-remove feedback after 10 seconds
      setTimeout(() => {
        setFeedback(prev => prev.filter(f => f.id !== id));
      }, 10000);
    };

    const handleAllBoardsCleared = () => {
      console.log('🗑️ All boards cleared');
      if (role === 'student') {
        setLines([]);
        setHistory([]);
        setRedoStack([]);
      }
    };

    socket.on('clear-board', handleClearBoard);
    socket.on('pushed-board', handlePushedBoard);
    socket.on('feedback', handleFeedback);
    socket.on('all-boards-cleared', handleAllBoardsCleared);

    socket.on('spotlight', (studentId: string | null) => {
      setSpotlightedStudent(studentId);
    });

    socket.on('laser-pointer', (laserLine: any) => {
      setLines(prev => [...prev, laserLine]);
      setTimeout(() => {
        setLines(prev => prev.filter(l => l.id !== laserLine.id));
      }, 2000);
    });

    socket.on('notes-updated', (newNotes: string) => {
      setNotes(newNotes);
    });

    socket.on('poll-started', (poll: any) => {
      setCurrentPoll(poll);
      setShowPoll(true);
    });

    socket.on('poll-updated', (poll: any) => {
      setCurrentPoll(poll);
    });

    socket.on('poll-ended', () => {
      setCurrentPoll(null);
      setShowPoll(false);
    });

    socket.on('video-shared', (url: string) => {
      setExternalVideoUrl(url);
    });

    socket.on('status-updated', ({ id, status }: { id: string, status: string }) => {
      setStudentStatuses(prev => ({ ...prev, [id]: status }));
    });

    socket.on('private-message', ({ from, fromName, message }: { from: string, fromName: string, message: string }) => {
      setPrivateMessages(prev => ({
        ...prev,
        [from]: [...(prev[from] || []), { fromName, message, timestamp: Date.now(), isMe: false }]
      }));
      
      // Show nice notification instead of alert
      setNewMessageNotification({
        show: true,
        from,
        fromName,
        message
      });
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setNewMessageNotification(null);
      }, 5000);
    });

    socket.on('spotlight', (studentId: string | null) => {
      setSpotlightedStudent(studentId);
    });

    socket.on('laser-pointer', (laserLine: any) => {
      setLines(prev => [...prev, laserLine]);
      setTimeout(() => {
        setLines(prev => prev.filter(l => l.id !== laserLine.id));
      }, 2000);
    });

    socket.on('notes-updated', (newNotes: string) => {
      setNotes(newNotes);
    });

    socket.on('poll-started', (poll: any) => {
      setCurrentPoll(poll);
      setShowPoll(true);
    });

    socket.on('poll-updated', (poll: any) => {
      setCurrentPoll(poll);
    });

    socket.on('poll-ended', () => {
      setCurrentPoll(null);
      setShowPoll(false);
    });

    socket.on('video-shared', (url: string) => {
      setExternalVideoUrl(url);
    });

    socket.on('status-updated', ({ id, status }: { id: string, status: string }) => {
      setStudentStatuses(prev => ({ ...prev, [id]: status }));
    });

    socket.on('private-message', ({ from, fromName, message }: { from: string, fromName: string, message: string }) => {
      setPrivateMessages(prev => ({
        ...prev,
        [from]: [...(prev[from] || []), { fromName, message, timestamp: Date.now(), isMe: false }]
      }));
      
      // Show nice notification instead of alert
      setNewMessageNotification({
        show: true,
        from,
        fromName,
        message
      });
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setNewMessageNotification(null);
      }, 5000);
    });

    return () => {
      console.log('🔌 Cleaning up socket listeners');
      socket.off('clear-board', handleClearBoard);
      socket.off('pushed-board', handlePushedBoard);
      socket.off('feedback', handleFeedback);
      socket.off('all-boards-cleared', handleAllBoardsCleared);
      socket.off('spotlight');
      socket.off('laser-pointer');
      socket.off('notes-updated');
      socket.off('poll-started');
      socket.off('poll-updated');
      socket.off('poll-ended');
      socket.off('video-shared');
      socket.off('status-updated');
      socket.off('private-message');
    };
  }, [socket, role]);

  const handleMouseDown = (e: any) => {
    // If in select mode, handle item selection instead of drawing
    if (selectedTool === 'select' && role === 'teacher') {
      const stage = e.target.getStage();
      if (!stage) return;

      const pos = stage.getPointerPosition();
      if (!pos) return;

      // Find clicked item with proper detection for each shape type
      const clickedIndex = lines.findIndex((line, index) => {
        if (line.type === 'image') {
          // Check if click is within image bounds
          return (
            pos.x >= line.x &&
            pos.x <= line.x + line.width &&
            pos.y >= line.y &&
            pos.y <= line.y + line.height
          );
        } else if (line.type === 'circle') {
          // Circle detection - check if click is within circle radius
          const [cx, cy, rx, ry] = line.points;
          const radius = Math.sqrt(Math.pow(rx - cx, 2) + Math.pow(ry - cy, 2));
          const distFromCenter = Math.sqrt(Math.pow(pos.x - cx, 2) + Math.pow(pos.y - cy, 2));
          return distFromCenter <= radius + 10; // Add 10px tolerance
        } else if (line.type === 'rect') {
          // Rectangle detection
          const [x1, y1, x2, y2] = line.points;
          const minX = Math.min(x1, x2);
          const maxX = Math.max(x1, x2);
          const minY = Math.min(y1, y2);
          const maxY = Math.max(y1, y2);
          return pos.x >= minX - 10 && pos.x <= maxX + 10 && 
                 pos.y >= minY - 10 && pos.y <= maxY + 10;
        } else if (line.points && line.points.length >= 2) {
          // Line or freehand detection - check if click is near line
          const [x1, y1] = line.points;
          const dist = Math.sqrt(Math.pow(pos.x - x1, 2) + Math.pow(pos.y - y1, 2));
          return dist < 30; // Increased tolerance to 30px
        }
        return false;
      });

      if (clickedIndex !== -1) {
        toggleSelectItem(clickedIndex);
      } else {
        setSelectedItems([]);
      }
      return;
    }
    
    if (role === 'teacher' && !selectedStudent) return; // Don't draw on dashboard grid

    // Save current state to history before drawing
    setHistory(prev => [...prev, [...lines]]);
    setRedoStack([]); // Clear redo stack on new action

    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();

    const newLine = {
      tool,
      color: tool === 'eraser' ? (darkMode ? '#1c1917' : '#ffffff') : color,
      strokeWidth,
      points: [pos.x, pos.y],
      opacity: 1,
    };

    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const updatedLines = [...lines, { ...newLine, text, type: 'text' }];
        setLines(updatedLines);
        socket.emit('draw', { roomId, lines: updatedLines });
      }
      setIsDrawing(false);
      return;
    }

    if (tool === 'laser') {
      const laserId = Date.now();
      const laserLine = { ...newLine, id: laserId, tool: 'laser' };
      setLines([...lines, laserLine]);
      socket.emit('laser-pointer', { roomId, laserLine });
      setTimeout(() => {
        setLines(prev => prev.filter(l => l.id !== laserId));
      }, 2000);
      setIsDrawing(true);
      return;
    }

    if (['rect', 'circle', 'line', 'arrow'].includes(tool)) {
      setLines([...lines, { ...newLine, points: [pos.x, pos.y, pos.x, pos.y], type: tool }]);
    } else if (tool === 'equation') {
      const eq = prompt('Enter equation (e.g. E=mc^2):');
      if (eq) setLines([...lines, { ...newLine, text: eq, type: 'text', fontStyle: 'italic serif' }]);
      setIsDrawing(false);
    } else if (tool === 'fraction') {
      const num = prompt('Numerator:');
      const den = prompt('Denominator:');
      if (num && den) setLines([...lines, { ...newLine, text: `${num}/${den}`, type: 'text', isFraction: true }]);
      setIsDrawing(false);
    } else if (tool === 'pie') {
      const data = prompt('Enter percentages (comma separated, e.g. 50,30,20):');
      if (data) setLines([...lines, { ...newLine, data: data.split(',').map(Number), type: 'pie' }]);
      setIsDrawing(false);
    } else if (tool === 'grid') {
      setLines([...lines, { ...newLine, type: 'grid', size: 200, spacing: 20 }]);
      setIsDrawing(false);
    } else {
      setLines([...lines, newLine]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = { ...lines[lines.length - 1] };

    if (['rect', 'circle', 'line'].includes(tool)) {
      lastLine.points = [lastLine.points[0], lastLine.points[1], point.x, point.y];
    } else {
      lastLine.points = lastLine.points.concat([point.x, point.y]);
    }

    const newLines = lines.slice(0, -1).concat([lastLine]);
    setLines(newLines);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    socket.emit('draw', { roomId, lines });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack(prev => [...prev, [...lines]]);
    setHistory(prev => prev.slice(0, -1));
    setLines(previous);
    socket.emit('draw', { roomId, lines: previous });
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory(prev => [...prev, [...lines]]);
    setRedoStack(prev => prev.slice(0, -1));
    setLines(next);
    socket.emit('draw', { roomId, lines: next });
  };

  const handleClear = () => {
    setHistory(prev => [...prev, [...lines]]);
    setRedoStack([]);
    setLines([]);
    setUploadedImages([]); // Also clear uploaded images
    socket.emit('draw', { roomId, lines: [] });
  };

  const handleDownload = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = `whiteboard-${roomId}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveToUSB = () => {
    console.log('💾 Saving whiteboard to PDF...');
    console.log('🔍 Debug:', {
      stageRef: stageRef.current,
      isCanvasReady,
      hasStage: !!stageRef.current
    });

    // Get the stage from ref
    const stage = stageRef?.current;

    if (!stage) {
      console.error('❌ Canvas not found. stageRef.current =', stageRef.current);
      console.error('❌ isCanvasReady =', isCanvasReady);
      alert('Canvas not ready. Please draw something on the whiteboard first, then try again.');
      return;
    }

    try {
      // Force a re-render to ensure canvas is ready
      stage.batchDraw();

      // Get the underlying HTML canvas element from Konva
      const container = stage.getContent();
      const canvasElement = container.querySelector('canvas');

      console.log('🎨 Container:', container);
      console.log('🎨 Canvas element:', canvasElement);

      if (!canvasElement) {
        console.error('❌ Cannot access canvas element');
        alert('Failed to access canvas. Please try again.');
        return;
      }

      // Convert canvas to data URL
      const dataUrl = canvasElement.toDataURL('image/png', 1);

      // Create PDF with jsPDF
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape A4
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit page with margins
      const margin = 10;
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2);
      
      // Get image dimensions
      const imgWidth = canvasElement.width;
      const imgHeight = canvasElement.height;
      
      // Calculate aspect ratio and scale to fit page
      const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      // Add image to PDF centered
      pdf.addImage(dataUrl, 'PNG', 
        (pageWidth - finalWidth) / 2, 
        (pageHeight - finalHeight) / 2, 
        finalWidth, 
        finalHeight
      );

      // Add title with student name and class info
      pdf.setFontSize(18);
      pdf.setTextColor(16, 185, 129); // Emerald green
      
      // Format filename and title with student name and class
      let studentName = name || 'Unknown';
      let className = roomId || 'Unknown';
      
      // If teacher viewing student board, use student info
      if (role === 'teacher' && viewingStudentId && students[viewingStudentId]) {
        studentName = students[viewingStudentId].name;
      }
      
      // Create formatted title
      const title = `Whiteboard - ${studentName}`;
      pdf.text(title, pageWidth / 2, margin + 5, { align: 'center' });

      // Add detailed info
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const dateStr = new Date().toLocaleString();
      pdf.text(`Class/Room: ${roomId} | Date: ${dateStr}`, pageWidth / 2, pageHeight - margin - 5, { align: 'center' });
      pdf.text(`Saved by: ${name} (${role})`, pageWidth / 2, pageHeight - margin + 2, { align: 'center' });

      // Create filename with student name and class
      // Sanitize filename (remove special characters)
      const safeStudentName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
      const safeClassName = roomId.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      
      const filename = `whiteboard-${safeClassName}-${safeStudentName}-${timestamp}.pdf`;
      
      // Save PDF
      pdf.save(filename);

      console.log('✅ Whiteboard saved as PDF successfully');
      alert(`✅ Whiteboard saved as PDF!\n\nStudent: ${studentName}\nClass: ${roomId}\n\nFile saved to your downloads folder.`);
    } catch (error) {
      console.error('❌ Error saving whiteboard:', error);
      alert('Error saving whiteboard. Please try again.');
    }
  };

  // Save ALL work - Teacher board + All student boards in one PDF
  const handleSaveAllWork = async () => {
    console.log('💾 Saving ALL work (Teacher + All Students)...');
    
    if (!stageRef?.current) {
      alert('Canvas not ready. Please try again.');
      return;
    }

    try {
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape A4
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      let pageNum = 0;

      // ========== COVER PAGE ==========
      pdf.setFillColor(16, 185, 129);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.text('Whiteboard Session Report', pageWidth / 2, 50, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text(`Room Code: ${roomId}`, pageWidth / 2, 80, { align: 'center' });
      pdf.text(`Teacher: ${name}`, pageWidth / 2, 95, { align: 'center' });
      pdf.setFontSize(14);
      pdf.text(`Date: ${new Date().toLocaleString()}`, pageWidth / 2, 115, { align: 'center' });
      pdf.text(`Total Students: ${Object.keys(students).length}`, pageWidth / 2, 130, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text('Generated by AsarBoard', pageWidth / 2, 150, { align: 'center' });
      pageNum++;

      // ========== TEACHER'S BOARD ==========
      pdf.addPage();
      pageNum++;
      
      pdf.setFillColor(16, 185, 129);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text(`Teacher's Board - ${name}`, pageWidth / 2, 20, { align: 'center' });

      // Capture teacher's board
      const stage = stageRef.current;
      stage.batchDraw();
      const container = stage.getContent();
      const canvasElement = container.querySelector('canvas');
      
      if (canvasElement) {
        const dataUrl = canvasElement.toDataURL('image/png', 1);
        const imgWidth = canvasElement.width;
        const imgHeight = canvasElement.height;
        const ratio = Math.min((pageWidth - 40) / imgWidth, (pageHeight - 60) / imgHeight);
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;

        pdf.addImage(dataUrl, 'PNG', 
          (pageWidth - finalWidth) / 2, 
          40, 
          finalWidth, 
          finalHeight
        );
      }

      // ========== ALL STUDENT BOARDS ==========
      const studentEntries = Object.entries(students);
      
      for (const [studentId, studentData] of studentEntries) {
        pdf.addPage();
        pageNum++;
        
        // Student header
        pdf.setFillColor(59, 130, 246); // Blue
        pdf.rect(0, 0, pageWidth, 30, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(18);
        pdf.text(`Student: ${studentData.name}`, pageWidth / 2, 20, { align: 'center' });
        
        // Student info box
        pdf.setFillColor(239, 246, 255);
        pdf.roundedRect(20, 40, 100, 20, 3, 3, 'F');
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Objects: ${studentData.lines?.length || 0}`, 25, 53);
        
        // If student has lines, render them
        if (studentData.lines && studentData.lines.length > 0) {
          // Create temporary canvas for student board
          const tempCanvas = document.createElement('canvas');
          const tempStage = new (window as any).Konva.Stage({
            node: tempCanvas,
            width: 800,
            height: 600
          });
          
          const tempLayer = new (window as any).Konva.Layer();
          tempStage.add(tempLayer);
          
          // Add all student lines to temp stage
          studentData.lines.forEach((line: any) => {
            // Recreate line based on type
            if (line.type === 'line' || !line.type) {
              const konvaLine = new (window as any).Konva.Line({
                points: line.points,
                stroke: line.color,
                strokeWidth: line.strokeWidth,
                tension: 0.5,
                lineCap: 'round',
                lineJoin: 'round'
              });
              tempLayer.add(konvaLine);
            } else if (line.type === 'rect') {
              const rect = new (window as any).Konva.Rect({
                x: line.points[0],
                y: line.points[1],
                width: line.points[2] - line.points[0],
                height: line.points[3] - line.points[1],
                stroke: line.color,
                strokeWidth: line.strokeWidth
              });
              tempLayer.add(rect);
            } else if (line.type === 'circle') {
              const circle = new (window as any).Konva.Circle({
                x: line.points[0],
                y: line.points[1],
                radius: Math.sqrt(Math.pow(line.points[2]-line.points[0], 2) + Math.pow(line.points[3]-line.points[1], 2)),
                stroke: line.color,
                strokeWidth: line.strokeWidth
              });
              tempLayer.add(circle);
            } else if (line.type === 'text') {
              const text = new (window as any).Konva.Text({
                x: line.points[0],
                y: line.points[1],
                text: line.text,
                fontSize: line.isFraction ? 18 : 24,
                fill: line.color,
                fontStyle: line.fontStyle
              });
              tempLayer.add(text);
            }
          });
          
          tempLayer.batchDraw();
          
          // Convert to image and add to PDF
          const studentDataUrl = tempCanvas.toDataURL('image/png');
          const studentRatio = Math.min((pageWidth - 40) / 800, (pageHeight - 80) / 600);
          const studentFinalWidth = 800 * studentRatio;
          const studentFinalHeight = 600 * studentRatio;
          
          pdf.addImage(studentDataUrl, 'PNG', 
            (pageWidth - studentFinalWidth) / 2, 
            70, 
            studentFinalWidth, 
            studentFinalHeight
          );
          
          // Cleanup
          tempStage.destroy();
        } else {
          pdf.setTextColor(150, 150, 150);
          pdf.setFontSize(14);
          pdf.text('No content on this board', pageWidth / 2, 100, { align: 'center' });
        }
        
        // Footer
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${pageNum}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
      }

      // ========== SUMMARY PAGE ==========
      pdf.addPage();
      pageNum++;
      
      pdf.setFillColor(16, 185, 129);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text('Session Summary', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text(`Total Pages: ${pageNum}`, 30, 60);
      pdf.text(`Total Students: ${Object.keys(students).length}`, 30, 80);
      
      // Student list with object counts
      pdf.setFontSize(12);
      pdf.text('Student Activity:', 30, 110);
      
      let yPos = 130;
      studentEntries.forEach(([studentId, studentData], index) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          pageNum++;
          yPos = 30;
        }
        pdf.text(
          `${index + 1}. ${studentData.name} - ${studentData.lines?.length || 0} objects`,
          40,
          yPos
        );
        yPos += 10;
      });
      
      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Generated by AsarBoard on ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

      // Save PDF
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const safeRoomId = roomId.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `complete-session-${safeRoomId}-${timestamp}.pdf`;
      
      pdf.save(filename);
      
      console.log('✅ Complete session saved successfully');
      alert(`✅ Complete session saved!\n\n📄 ${pageNum} pages\n👨‍🏫 Teacher board + ${Object.keys(students).length} student boards\n\nFile: ${filename}`);
      
    } catch (error) {
      console.error('❌ Error saving complete session:', error);
      alert('Error saving complete session. Please try again.');
    }
  };

  const handleAutoSave = () => {
    console.log('💾 Auto-saving whiteboard...');
    
    const stage = stageRef?.current;
    
    if (!stage) {
      console.error('❌ Cannot auto-save: Canvas not found');
      return;
    }
    
    try {
      // Force a re-render to ensure canvas is ready
      stage.batchDraw();
      
      // Get the underlying HTML canvas element from Konva
      // stage.getContent() returns the container div, we need the actual canvas
      const container = stage.getContent();
      const canvasElement = container.querySelector('canvas');
      
      if (!canvasElement) {
        console.error('❌ Cannot auto-save: Failed to access canvas');
        return;
      }
      
      canvasElement.toBlob((blob) => {
        if (!blob) {
          console.error('❌ Cannot auto-save: Failed to create image');
          return;
        }

        const fileName = `whiteboard-${roomId}-${new Date().toISOString()}.png`;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('✅ Auto-saved:', fileName);
      }, 'image/png', 1);
    } catch (error) {
      console.error('❌ Error in auto-save:', error);
    }
  };

  // PDF Export - Export all student work as PDF
  const handleExportPDF = async () => {
    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape A4 format
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const totalPages = 2 + Object.keys(students).length; // Title + teacher + students + summary
    let currentPage = 1;

    // Show progress
    console.log('📄 Generating PDF...');

    // ========== TITLE PAGE ==========
    pdf.setFillColor(16, 185, 129); // Emerald green header
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setFontSize(28);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Whiteboard Session Report', pageWidth / 2, 25, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Generated by AsarBoard', pageWidth / 2, 35, { align: 'center' });

    // Session details box
    pdf.setDrawColor(16, 185, 129);
    pdf.setFillColor(240, 253, 244); // Light emerald background
    pdf.roundedRect(20, 50, pageWidth - 40, 60, 5, 5, 'F');
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Session Details', pageWidth / 2, 65, { align: 'center' });
    
    pdf.setFontSize(13);
    pdf.text(`Room Code: ${roomId}`, 35, 85);
    pdf.text(`Teacher: ${name}`, 35, 95);
    pdf.text(`Date: ${new Date().toLocaleString()}`, 35, 105);
    pdf.text(`Total Students: ${Object.keys(students).length}`, 35, 115);

    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${currentPage} of ${totalPages}`, pageWidth - 25, pageHeight - 10);
    currentPage++;

    // ========== TEACHER'S BOARD ==========
    pdf.addPage();
    pdf.setFillColor(16, 185, 129);
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    pdf.setFontSize(18);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`Teacher's Board - ${name}`, pageWidth / 2, 20, { align: 'center' });
    
    // Capture and add teacher's board
    try {
      const stage = stageRef.current;
      if (stage) {
        const canvas = stage.toCanvas({ pixelRatio: 2 }); // High quality
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const scaledHeight = Math.min(imgHeight, pageHeight - 60);
        
        pdf.addImage(imgData, 'PNG', 20, 40, imgWidth, scaledHeight);
      } else {
        throw new Error('Canvas not available');
      }
    } catch (error) {
      console.error('Error capturing teacher board:', error);
      pdf.setFillColor(254, 242, 242);
      pdf.roundedRect(20, 40, pageWidth - 40, 40, 5, 5, 'F');
      pdf.setTextColor(220, 38, 38);
      pdf.text('Unable to capture board image', pageWidth / 2, 65, { align: 'center' });
    }
    
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${currentPage} of ${totalPages}`, pageWidth - 25, pageHeight - 10);
    currentPage++;

    // ========== STUDENT BOARDS ==========
    Object.entries(students).forEach(([studentId, studentData], index) => {
      pdf.addPage();
      pdf.setFillColor(59, 130, 246); // Blue header for students
      pdf.rect(0, 0, pageWidth, 30, 'F');
      
      pdf.setFontSize(18);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`Student ${index + 1} - ${studentData.name}`, pageWidth / 2, 20, { align: 'center' });
      
      // Student info box
      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(20, 40, 100, 20, 3, 3, 'F');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Objects: ${studentData.lines?.length || 0}`, 25, 53);
      
      // Capture student board from lines data
      try {
        // Create temporary canvas for student board
        const tempStage = new window.Konva.Stage({
          width: 800,
          height: 600,
          pixelRatio: 2
        });
        
        const tempLayer = new window.Konva.Layer();
        tempStage.add(tempLayer);
        
        // Add student's lines to temp canvas
        studentData.lines?.forEach((line: any) => {
          // Add line rendering logic here
          // For now, we'll use a placeholder
        });
        
        const canvas = tempStage.toCanvas();
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const scaledHeight = Math.min(imgHeight, pageHeight - 80);
        
        pdf.addImage(imgData, 'PNG', 20, 70, imgWidth, scaledHeight);
        
        tempStage.destroy();
      } catch (error) {
        console.error('Error capturing student board:', error);
        pdf.setFillColor(254, 242, 242);
        pdf.roundedRect(20, 70, pageWidth - 40, 40, 5, 5, 'F');
        pdf.setTextColor(220, 38, 38);
        pdf.text('Unable to capture student board', pageWidth / 2, 95, { align: 'center' });
      }
      
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${currentPage} of ${totalPages}`, pageWidth - 25, pageHeight - 10);
      currentPage++;
    });

    // ========== SUMMARY PAGE ==========
    pdf.addPage();
    pdf.setFillColor(16, 185, 129);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Session Summary', pageWidth / 2, 25, { align: 'center' });
    
    // Summary table
    pdf.setFillColor(240, 253, 244);
    pdf.roundedRect(20, 50, pageWidth - 40, 80, 5, 5, 'F');
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Summary Statistics', pageWidth / 2, 70, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.text(`Room Code: ${roomId}`, 35, 90);
    pdf.text(`Teacher: ${name}`, 35, 105);
    pdf.text(`Total Students: ${Object.keys(students).length}`, 35, 120);
    pdf.text(`Date: ${new Date().toLocaleString()}`, 35, 135);

    // Thank you message
    pdf.setFontSize(16);
    pdf.setTextColor(16, 185, 129);
    pdf.text('Thank you for using AsarBoard!', pageWidth / 2, 160, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Made with ❤️ by AsarBoard', pageWidth / 2, 175, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${currentPage} of ${totalPages}`, pageWidth - 25, pageHeight - 10);

    // Save PDF with auto-filename
    const filename = `whiteboard-session-${roomId}-${new Date().toISOString().split('T')[0]}.pdf`;
    console.log('💾 Saving PDF:', filename);
    pdf.save(filename);
    
    console.log('✅ PDF export complete!');
    alert(`PDF exported successfully!\n${Object.keys(students).length + 1} boards saved.`);
  };

  const handleToggleLock = () => {
    socket.emit('lock-room', { roomId, locked: !isLocked });
  };

  const handlePushBoard = () => {
    socket.emit('push-board', { roomId, lines });
  };

  const handleClearAll = () => {
    if (window.confirm('Clear ALL student boards? This cannot be undone.')) {
      // Clear local images as well
      setUploadedImages([]);
      socket.emit('clear-all-boards', { roomId });
    }
  };

  const handleTogglePrivacy = () => {
    socket.emit('toggle-privacy', { roomId, hideNames: !hideNames });
  };

  const handleLeaveRoom = () => {
    if (window.confirm('Are you sure you want to leave this session?')) {
      socket.disconnect();
      window.location.href = '/join-session';
    }
  };

  // Voice chat handlers
  const toggleVoiceChat = () => {
    setIsVoiceChatOn(!isVoiceChatOn);
    if (!isVoiceChatOn) {
      // Turn on voice chat (audio only)
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          console.log('🎤 Voice chat enabled');
        })
        .catch(err => {
          console.error('Failed to access microphone:', err);
          alert('Could not access microphone. Please check permissions.');
          setIsVoiceChatOn(false);
        });
    }
  };

  const toggleMicMute = () => {
    setIsMicMuted(!isMicMuted);
    // Note: Actual mute/unmute would require access to the media stream track
  };

  // Assignment system handlers
  const handleCreateAssignment = () => {
    if (!assignmentTitle.trim()) {
      alert('Please enter assignment title');
      return;
    }

    const newAssignment = {
      id: Date.now(),
      title: assignmentTitle,
      description: assignmentDescription,
      dueDate: assignmentDueDate,
      points: assignmentPoints,
      createdAt: new Date().toISOString(),
      createdBy: name,
      status: 'active',
      submissions: {}
    };

    setAssignments(prev => [...prev, newAssignment]);
    socket.emit('create-assignment', { roomId, assignment: newAssignment });
    
    // Reset form
    setAssignmentTitle('');
    setAssignmentDescription('');
    setAssignmentDueDate('');
    setAssignmentPoints(100);
    setShowCreateAssignment(false);
  };

  const handleSubmitAssignment = (assignmentId: number, boardSnapshot: any[]) => {
    const submission = {
      assignmentId,
      studentId: socket?.id,
      studentName: name,
      boardSnapshot,
      submittedAt: new Date().toISOString(),
      grade: null,
      feedback: ''
    };

    setStudentSubmissions(prev => ({
      ...prev,
      [assignmentId]: submission
    }));

    socket.emit('submit-assignment', { roomId, submission });
    alert('Assignment submitted successfully!');
  };

  const handleGradeSubmission = (submissionId: string, assignmentId: number) => {
    const updatedSubmissions = { ...studentSubmissions };
    if (updatedSubmissions[assignmentId]) {
      updatedSubmissions[assignmentId].grade = parseInt(gradeInput) || 0;
      updatedSubmissions[assignmentId].feedback = feedbackInput;
      setStudentSubmissions(updatedSubmissions);

      socket.emit('grade-submission', { 
        roomId, 
        submissionId, 
        assignmentId, 
        grade: parseInt(gradeInput), 
        feedback: feedbackInput 
      });

      setGradeInput('');
      setFeedbackInput('');
      setShowGrading(false);
    }
  };

  // Socket listeners for assignments
  useEffect(() => {
    socket.on('assignment-created', (assignment: any) => {
      setAssignments(prev => [...prev, assignment]);
      console.log('📚 New assignment created:', assignment.title);
    });

    socket.on('assignment-submitted', ({ assignmentId, studentId, studentName }: any) => {
      console.log(`📝 ${studentName} submitted assignment ${assignmentId}`);
    });

    socket.on('assignment-graded', ({ studentId, grade, feedback }: any) => {
      console.log(`📊 Assignment graded: ${grade} - ${feedback}`);
    });

    return () => {
      socket.off('assignment-created');
      socket.off('assignment-submitted');
      socket.off('assignment-graded');
    };
  }, [socket]);

  // Image upload handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgData = {
        id: Date.now(),
        src: event.target?.result as string,
        x: 100,
        y: 100,
        width: 300,
        height: 200,
        rotation: 0,
        label: ''
      };
      
      const newImage = {
        type: 'image',
        ...imgData
      };
      
      setUploadedImages(prev => [...prev, imgData]);
      setLines(prev => [...prev, newImage]);
      socket.emit('draw', { roomId, lines: [...lines, newImage] });
      setShowImageUpload(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateImage = (imageId: number, updates: any) => {
    setUploadedImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, ...updates } : img
    ));
    
    const updatedLines = lines.map(line => 
      line.type === 'image' && line.id === imageId ? { ...line, ...updates } : line
    );
    setLines(updatedLines);
    socket.emit('draw', { roomId, lines: updatedLines });
  };

  const handleDeleteImage = (imageId: number) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    const updatedLines = lines.filter(line => line.type !== 'image' || line.id !== imageId);
    setLines(updatedLines);
    socket.emit('draw', { roomId, lines: updatedLines });
  };

  // Delete selected items (lines or images)
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    const updatedLines = lines.filter((_, index) => !selectedItems.includes(index));
    setLines(updatedLines);
    setSelectedItems([]);
    socket.emit('draw', { roomId, lines: updatedLines });
  };

  // Delete individual item by index
  const handleDeleteItem = (index: number) => {
    const updatedLines = [...lines];
    updatedLines.splice(index, 1);
    setLines(updatedLines);
    socket.emit('draw', { roomId, lines: updatedLines });
  };

  // Toggle selection mode
  const toggleSelectMode = () => {
    setSelectedTool(selectedTool === 'select' ? 'draw' : 'select');
    setSelectedItems([]);
  };

  // Select/deselect item
  const toggleSelectItem = (index: number) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter(i => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handleApprove = (id: string) => {
    socket.emit('approve-student', { roomId, studentId: id });
  };

  const handleReject = (id: string) => {
    socket.emit('reject-student', { roomId, studentId: id });
  };

  const handleRemove = (id: string) => {
    if (confirm('Remove this student?')) {
      socket.emit('remove-student', { roomId, studentId: id });
    }
  };

  const handleToggleSpotlight = (id: string) => {
    const newSpotlight = spotlightedStudent === id ? null : id;
    socket.emit('spotlight', { roomId, studentId: newSpotlight });
  };

  const handleUpdateNotes = (newNotes: string) => {
    setNotes(newNotes);
    socket.emit('update-notes', { roomId, notes: newNotes });
  };

  const handleStartPoll = (question: string, options: string[]) => {
    socket.emit('start-poll', { roomId, poll: { question, options } });
  };

  const handleVote = (optionIndex: number) => {
    socket.emit('vote-poll', { roomId, optionIndex });
  };

  const handleEndPoll = () => {
    socket.emit('end-poll', { roomId });
  };

  const handleShareVideo = (url: string) => {
    // Convert youtube link to embed link
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be/')) {
      embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
    }
    socket.emit('share-video', { roomId, url: embedUrl });
    setExternalVideoUrl(embedUrl);
    setShowVideo(false);
  };

  const handleSetStatus = (status: string) => {
    socket.emit('set-status', { roomId, status });
    setShowStatus(false);
  };

  const handleSendPrivate = (to: string) => {
    if (!privateInput.trim()) return;
    socket.emit('private-message', { roomId, to, message: privateInput });
    setPrivateMessages(prev => ({
      ...prev,
      [to]: [...(prev[to] || []), { fromName: 'Me', message: privateInput, timestamp: Date.now(), isMe: true }]
    }));
    setPrivateInput('');
  };

  // Public chat handlers
  const handleSendPublicChat = () => {
    if (!publicChatInput.trim()) return;
    const message = {
      id: Date.now(),
      from: name,
      fromId: socket?.id,
      message: publicChatInput,
      timestamp: new Date().toISOString()
    };
    console.log('💬 Sending public message:', message);
    socket.emit('public-message', { roomId, message });
    setPublicMessages(prev => [...prev, { ...message, isMe: true }]);
    setPublicChatInput('');
  };

  // Presentation upload handlers
  const handleUploadPresentation = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const presentation = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        url: e.target?.result as string,
        uploadedBy: name,
        uploadedAt: new Date().toISOString()
      };
      console.log('📊 Uploading presentation:', presentation.name);
      socket.emit('upload-presentation', { roomId, presentation });
      setPresentations(prev => [...prev, presentation]);
      setShowPresentation(false);
      alert('Presentation uploaded successfully!');
    };
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error uploading file');
    };
    reader.readAsDataURL(file);
  };

  const handleCreateBreakout = () => {
    const count = prompt('How many breakout rooms?');
    if (count) {
      alert(`Creating ${count} breakout rooms... (Feature coming soon)`);
      socket.emit('create-breakout', { roomId, count: parseInt(count) });
    }
  };

  const loadTemplate = (type: string) => {
    let templateLines: any[] = [];
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (type === 'graph') {
      // Graph Paper
      for (let i = 0; i < width; i += 40) {
        templateLines.push({ tool: 'line', color: '#e5e7eb', strokeWidth: 1, points: [i, 0, i, height], type: 'line' });
      }
      for (let i = 0; i < height; i += 40) {
        templateLines.push({ tool: 'line', color: '#e5e7eb', strokeWidth: 1, points: [0, i, width, i], type: 'line' });
      }
    } else if (type === 'venn') {
      // Venn Diagram
      templateLines.push({ tool: 'circle', color: '#000000', strokeWidth: 2, points: [width/2 - 100, height/2, width/2 - 100 + 150, height/2], type: 'circle' });
      templateLines.push({ tool: 'circle', color: '#000000', strokeWidth: 2, points: [width/2 + 100, height/2, width/2 + 100 + 150, height/2], type: 'circle' });
    } else if (type === 'storyboard') {
      // Storyboard (6 panels)
      const boxW = 300;
      const boxH = 200;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
          const x = 100 + i * (boxW + 50);
          const y = 100 + j * (boxH + 50);
          templateLines.push({ tool: 'rect', color: '#000000', strokeWidth: 2, points: [x, y, x + boxW, y + boxH], type: 'rect' });
        }
      }
    } else if (type === 'timeline') {
      // Timeline Template
      templateLines.push({ tool: 'line', color: '#000000', strokeWidth: 3, points: [100, height/2, width - 100, height/2], type: 'line' });
      for (let i = 0; i < 5; i++) {
        const x = 150 + i * ((width - 200) / 4);
        templateLines.push({ tool: 'line', color: '#000000', strokeWidth: 2, points: [x, height/2 - 50, x, height/2 + 50], type: 'line' });
        templateLines.push({ tool: 'text', color: '#000000', strokeWidth: 1, points: [x - 30, height/2 + 80], text: `Event ${i + 1}`, type: 'text' });
      }
    } else if (type === 'fraction') {
      // Fraction Circles
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 150;
      // Whole circle
      templateLines.push({ tool: 'circle', color: '#000000', strokeWidth: 2, points: [centerX, centerY, centerX + radius, centerY], type: 'circle' });
      // Halves
      templateLines.push({ tool: 'line', color: '#000000', strokeWidth: 2, points: [centerX - radius, centerY, centerX + radius, centerY], type: 'line' });
      // Quarters
      templateLines.push({ tool: 'line', color: '#000000', strokeWidth: 2, points: [centerX, centerY - radius, centerX, centerY + radius], type: 'line' });
    } else if (type === 'coordinate') {
      // Coordinate Plane
      templateLines.push({ tool: 'line', color: '#000000', strokeWidth: 2, points: [100, height/2, width - 100, height/2], type: 'line' }); // X-axis
      templateLines.push({ tool: 'line', color: '#000000', strokeWidth: 2, points: [width/2, 100, width/2, height - 100], type: 'line' }); // Y-axis
      // Grid lines
      for (let i = 0; i < 10; i++) {
        const spacing = 50;
        templateLines.push({ tool: 'line', color: '#e5e7eb', strokeWidth: 1, points: [width/2 + i * spacing, 100, width/2 + i * spacing, height - 100], type: 'line' });
        templateLines.push({ tool: 'line', color: '#e5e7eb', strokeWidth: 1, points: [width/2 - i * spacing, 100, width/2 - i * spacing, height - 100], type: 'line' });
        templateLines.push({ tool: 'line', color: '#e5e7eb', strokeWidth: 1, points: [100, height/2 + i * spacing, width - 100, height/2 + i * spacing], type: 'line' });
        templateLines.push({ tool: 'line', color: '#e5e7eb', strokeWidth: 1, points: [100, height/2 - i * spacing, width - 100, height/2 - i * spacing], type: 'line' });
      }
    } else if (type === 'mindmap') {
      // Mind Map Template
      templateLines.push({ tool: 'circle', color: '#000000', strokeWidth: 2, points: [width/2, height/2, width/2 + 100, height/2], type: 'circle' }); // Center
      templateLines.push({ tool: 'text', color: '#000000', strokeWidth: 1, points: [width/2 - 50, height/2 - 10], text: 'Main Idea', type: 'text' });
      // Branches
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x1 = width/2 + Math.cos(angle) * 100;
        const y1 = height/2 + Math.sin(angle) * 100;
        const x2 = width/2 + Math.cos(angle) * 250;
        const y2 = height/2 + Math.sin(angle) * 250;
        templateLines.push({ tool: 'line', color: '#000000', strokeWidth: 2, points: [x1, y1, x2, y2], type: 'line' });
        templateLines.push({ tool: 'circle', color: '#000000', strokeWidth: 1, points: [x2, y2, x2 + 60, y2], type: 'circle' });
      }
    } else if (type === 'worksheet') {
      // Blank Worksheet Template
      // Title line
      templateLines.push({ tool: 'line', color: '#000000', strokeWidth: 2, points: [100, 100, width - 100, 100], type: 'line' });
      templateLines.push({ tool: 'text', color: '#000000', strokeWidth: 1, points: [100, 70], text: 'Name: ________________________', type: 'text' });
      templateLines.push({ tool: 'text', color: '#000000', strokeWidth: 1, points: [width - 300, 70], text: 'Date: __________', type: 'text' });
      // Writing lines
      for (let i = 0; i < 15; i++) {
        const y = 150 + i * 40;
        templateLines.push({ tool: 'line', color: '#e5e7eb', strokeWidth: 1, points: [100, y, width - 100, y], type: 'line' });
      }
    } else if (type === 'tchart') {
      // T-Chart
      templateLines.push({ tool: 'line', color: '#000000', strokeWidth: 2, points: [width/2, 100, width/2, height - 100], type: 'line' });
      templateLines.push({ tool: 'line', color: '#000000', strokeWidth: 2, points: [100, 100, width - 100, 100], type: 'line' });
      templateLines.push({ tool: 'text', color: '#000000', strokeWidth: 1, points: [200, 150], text: 'Column 1', type: 'text' });
      templateLines.push({ tool: 'text', color: '#000000', strokeWidth: 1, points: [width - 300, 150], text: 'Column 2', type: 'text' });
    } else if (type === 'pentagon') {
      // Pentagon (for geometry)
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 150;
      const points = [];
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        points.push(centerX + Math.cos(angle) * radius);
        points.push(centerY + Math.sin(angle) * radius);
      }
      templateLines.push({ tool: 'line', color: '#000000', strokeWidth: 2, points: points, type: 'line' });
    }

    setLines(templateLines);
    socket.emit('draw', { roomId, lines: templateLines });
    setShowTemplates(false);
  };

  const saveAsTemplate = () => {
    const name = prompt('Enter template name:');
    if (name) {
      setCustomTemplates(prev => [...prev, { name, lines: [...lines] }]);
      alert('Template saved!');
    }
  };

  const loadCustomTemplate = (templateLines: any[]) => {
    setLines(templateLines);
    socket.emit('draw', { roomId, lines: templateLines });
    setShowTemplates(false);
  };

  const sendFeedback = (type: 'thumb-up' | 'thumb-down' | 'comment', text?: string) => {
    if (!selectedStudent || selectedStudent === 'teacher') return;
    const feedbackData = {
      type,
      text,
      teacherName: name,
      timestamp: Date.now()
    };
    socket.emit('feedback', { roomId, studentId: selectedStudent, feedback: feedbackData });
    if (type === 'comment') setComment('');
  };

  // Send feedback to a specific student (from dashboard)
  const sendFeedbackToStudent = (studentId: string, type: 'thumb-up' | 'thumb-down') => {
    const feedbackData = {
      type,
      teacherName: name,
      timestamp: Date.now()
    };
    socket.emit('feedback', { roomId, studentId, feedback: feedbackData });
    console.log(`📤 Sent ${type} feedback to student ${studentId}`);
  };

  const waitingCount = Object.keys(waiting).length;
  const joinUrl = `${window.location.origin}?room=${roomId}`;

  return (
    <div className={cn(
      "flex flex-col h-screen overflow-hidden transition-colors",
      darkMode ? "bg-stone-950 text-white" : "bg-white text-black"
    )}>
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onDownload={handleDownload}
        onSaveToUSB={handleSaveToUSB}
        onAutoSave={handleAutoSave}
        isTeacher={role === 'teacher'}
        isLocked={isLocked}
        onToggleLock={handleToggleLock}
        onPushBoard={handlePushBoard}
        onClearAll={handleClearAll}
        hideNames={hideNames}
        onTogglePrivacy={handleTogglePrivacy}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onShowQR={() => setShowQR(true)}
        waitingCount={Object.keys(waiting).length}
        onShowWaiting={() => setShowWaiting(true)}
        onShowTemplates={() => setShowTemplates(true)}
        onShowNotes={() => setShowNotes(true)}
        onShowPoll={() => setShowPoll(true)}
        onShowVideo={() => setShowVideo(true)}
        onShowStatus={() => setShowStatus(true)}
        onShowImageUpload={() => setShowImageUpload(true)}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      />

      {/* Private Message Notification Popup */}
      <AnimatePresence>
        {newMessageNotification && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 100, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[100] w-full max-w-md"
          >
            <div className={cn(
              "mx-4 p-4 rounded-2xl shadow-2xl border-2",
              darkMode ? "bg-indigo-900/95 border-indigo-500 text-white" : "bg-white border-indigo-500 text-black"
            )}>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-500 rounded-xl">
                  <MessageSquare size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm">New Message from {newMessageNotification.fromName}</h4>
                    <button
                      onClick={() => setNewMessageNotification(null)}
                      className="p-1 hover:bg-black/10 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-sm opacity-80 mb-2">{newMessageNotification.message}</p>
                  <button
                    onClick={() => {
                      setShowPrivateChat(newMessageNotification.from);
                      setNewMessageNotification(null);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Chat Controls - Floating Button */}
      <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2">
        {isVoiceChatOn && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleMicMute}
            className={cn(
              "p-4 rounded-full shadow-2xl transition-all",
              isMicMuted 
                ? "bg-red-500 text-white hover:bg-red-600" 
                : "bg-emerald-500 text-white hover:bg-emerald-600 animate-pulse"
            )}
            title={isMicMuted ? "Unmute microphone" : "Mute microphone"}
          >
            {isMicMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </motion.button>
        )}
        
        <motion.button
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          onClick={toggleVoiceChat}
          className={cn(
            "p-4 rounded-full shadow-2xl transition-all flex items-center gap-2",
            isVoiceChatOn 
              ? "bg-emerald-500 text-white hover:bg-emerald-600" 
              : "bg-blue-500 text-white hover:bg-blue-600"
          )}
          title={isVoiceChatOn ? "Turn off voice chat" : "Turn on voice chat"}
        >
          {isVoiceChatOn ? (
            <>
              <Mic size={24} />
              <span className="text-sm font-bold">Voice On</span>
            </>
          ) : (
            <>
              <MicOff size={24} />
              <span className="text-sm font-bold">Voice Chat</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Select/Delete Controls - Floating Bar */}
      {role === 'teacher' && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border">
          <button
            onClick={toggleSelectMode}
            className={cn(
              "px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors",
              selectedTool === 'select'
                ? "bg-emerald-600 text-white"
                : "bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
            )}
            title="Toggle select mode to delete individual items"
          >
            <MousePointer2 size={16} />
            {selectedTool === 'select' ? 'Selecting' : 'Select Mode'}
          </button>
          
          {selectedItems.length > 0 && (
            <>
              <div className="w-px h-6 bg-stone-300 dark:bg-stone-700" />
              <span className="text-sm font-bold">{selectedItems.length} selected</span>
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center gap-2"
                title="Delete selected items (Press Delete key)"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex-1 relative overflow-auto p-4">
        {role === 'teacher' && !selectedStudent ? (
          <div className="space-y-6">
            {/* Dashboard Header with Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Users size={24} className="text-emerald-500" />
                    Classroom Overview
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    🔴 LIVE
                  </div>
                </div>
                <p className="text-sm opacity-50 mt-1">
                  📡 Real-time monitoring active - All student boards update live
                </p>
              </div>

              {/* Stats Cards */}
              <div className="flex gap-3 flex-wrap">
                <div className={cn(
                  "px-4 py-2 rounded-xl flex items-center gap-2",
                  darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                )}>
                  <Users size={16} />
                  <span className="text-sm font-bold">{Object.keys(students).length} Students</span>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-xl flex items-center gap-2",
                  darkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-700"
                )}>
                  <Activity size={16} />
                  <span className="text-sm font-bold">
                    {Object.values(students).filter((s: any) => s.lines?.length > 0).length} Drawing
                  </span>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-xl flex items-center gap-2",
                  darkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-700"
                )}>
                  <Eye size={16} />
                  <span className="text-sm font-bold">{Object.keys(waiting).length} Waiting</span>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-xl flex items-center gap-2",
                  spotlightedStudent ? (darkMode ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-700") : (darkMode ? "bg-white/5 text-white/40" : "bg-black/5 text-black/40")
                )}>
                  <Star size={16} />
                  <span className="text-sm font-bold">{spotlightedStudent ? 'Spotlight Active' : 'No Spotlight'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onEndClass}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                title="End class and export attendance"
              >
                <LogOut size={14} /> End Class
              </button>
              <button
                onClick={onOpenAttendance}
                className="px-4 py-2 bg-green-500/10 text-green-500 rounded-xl text-xs font-bold hover:bg-green-500/20 transition-colors flex items-center gap-2"
                title="View attendance and monitor students"
              >
                <ClipboardList size={14} /> Attendance
              </button>
              <button
                onClick={() => setShowPublicChat(true)}
                className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-colors flex items-center gap-2"
                title="Public Chat"
              >
                <MessageSquare size={14} /> Chat
              </button>
              <button
                onClick={() => setShowPresentation(true)}
                className="px-4 py-2 bg-purple-500/10 text-purple-500 rounded-xl text-xs font-bold hover:bg-purple-500/20 transition-colors flex items-center gap-2"
                title="Upload Presentation"
              >
                <FileText size={14} /> Presentations
              </button>
              <button
                onClick={() => setShowAssignments(true)}
                className="px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-xl text-xs font-bold hover:bg-indigo-500/20 transition-colors flex items-center gap-2"
                title="Manage Assignments"
              >
                <ClipboardList size={14} /> Assignments
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-purple-500/10 text-purple-500 rounded-xl text-xs font-bold hover:bg-purple-500/20 transition-colors flex items-center gap-2"
                title="Export all student work as PDF"
              >
                <FileDown size={14} /> Export PDF
              </button>
              {isTeacher && (
                <button
                  onClick={handleSaveAllWork}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-bold hover:from-emerald-600 hover:to-teal-600 transition-colors flex items-center gap-2 shadow-lg"
                  title="Save complete session with all student boards"
                >
                  <BookOpen size={14} /> Save All Work
                </button>
              )}
              {isTeacher && (
                <GoogleIntegration
                  roomId={roomId}
                  socket={socket}
                  isTeacher={isTeacher}
                />
              )}
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} /> Clear All Boards
              </button>
              <button
                onClick={handleTogglePrivacy}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2",
                  hideNames ? "bg-amber-500/10 text-amber-500" : (darkMode ? "bg-white/10 text-white" : "bg-black/5 text-black")
                )}
              >
                {hideNames ? <EyeOff size={14} /> : <Eye size={14} />} {hideNames ? 'Show Names' : 'Hide Names'}
              </button>
              <button
                onClick={handleCreateBreakout}
                className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-colors flex items-center gap-2"
              >
                <Sigma size={14} /> Breakout Rooms
              </button>
              <button
                onClick={handlePushBoard}
                className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
              >
                <Send size={14} /> Push My Board
              </button>
              {waitingCount !== undefined && waitingCount > 0 && (
                <button
                  onClick={() => setShowWaiting(true)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors flex items-center gap-2 animate-pulse"
                >
                  <Bell size={14} /> {waitingCount} Waiting
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Teacher's own board in the grid */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Your Board (Teacher)
                  </span>
                  <span className="text-[10px] opacity-50">{lines.length} objects</span>
                </div>
                <div
                  className={cn(
                    "aspect-video border-2 rounded-xl overflow-hidden cursor-pointer transition-all relative group",
                    darkMode ? "bg-stone-900 border-white/10 hover:border-emerald-500/50" : "bg-stone-50 border-black/5 hover:border-emerald-500/50",
                    "hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
                  )}
                  onClick={() => setSelectedStudent('teacher')}
                >
                  <Stage width={400} height={225} scaleX={400/window.innerWidth} scaleY={225/(window.innerHeight - 100)}>
                    <Layer>
                      {lines.map((line, i) => (
                        <WhiteboardElement key={i} line={line} isSelected={selectedItems.includes(i)} />
                      ))}
                    </Layer>
                  </Stage>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center">
                      <Maximize size={24} className="text-white mx-auto mb-1" />
                      <span className="text-white font-bold text-xs uppercase tracking-widest">Enlarge</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student boards */}
              {Object.entries(students).map(([id, student]) => (
                <div key={id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        spotlightedStudent === id ? "bg-purple-500 animate-pulse" : "bg-blue-500"
                      )}></div>
                      {hideNames ? 'Student' : student.name}
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      {studentStatuses[id] && (
                        <span className="text-base" title={`Status: ${studentStatuses[id]}`}>{studentStatuses[id]}</span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleSpotlight(id); }}
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors flex items-center gap-1",
                          spotlightedStudent === id 
                            ? "bg-purple-500 text-white" 
                            : (darkMode ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" : "bg-amber-50 text-amber-600 hover:bg-amber-100")
                        )}
                        title="Spotlight for everyone to see"
                      >
                        <Star size={10} />
                        {spotlightedStudent === id ? 'On' : 'Off'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemove(id); }}
                        className="text-[10px] font-bold text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded-full transition-colors"
                        title="Remove from class"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "student-board-preview aspect-video border-2 rounded-xl overflow-hidden cursor-pointer transition-all relative group",
                      darkMode ? "bg-stone-900 border-white/10 hover:border-blue-500/50" : "bg-stone-50 border-black/5 hover:border-blue-500/50",
                      "hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                    )}
                    onClick={() => setSelectedStudent(id)}
                  >
                    <Stage width={400} height={225} scaleX={400/window.innerWidth} scaleY={225/(window.innerHeight - 100)}>
                      <Layer>
                        {student.lines.map((line, i) => (
                          <WhiteboardElement key={i} line={line} />
                        ))}
                      </Layer>
                    </Stage>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-center">
                        <Maximize size={24} className="text-white mx-auto mb-1" />
                        <span className="text-white font-bold text-xs uppercase tracking-widest">Enlarge</span>
                      </div>
                    </div>
                    {/* Object count badge */}
                    <div className={cn(
                      "absolute bottom-2 right-2 px-2 py-1 rounded-lg text-[10px] font-bold",
                      darkMode ? "bg-white/90 text-black" : "bg-black/80 text-white"
                    )}>
                      {student.lines.length} objects
                    </div>
                  </div>
                  {/* Quick actions for this student */}
                  <div className="flex gap-1 px-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); sendFeedbackToStudent(id, 'thumb-up'); }}
                      className="flex-1 py-1.5 text-xs font-bold rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                      title="Thumbs Up"
                    >
                      👍
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); sendFeedbackToStudent(id, 'thumb-down'); }}
                      className="flex-1 py-1.5 text-xs font-bold rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                      title="Thumbs Down"
                    >
                      👎
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedStudent(id); }}
                      className={cn(
                        "flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors",
                        darkMode ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-black"
                      )}
                      title="View enlarged"
                    >
                      👁️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full rounded-xl shadow-2xl border border-black/5 overflow-hidden relative">
            <Stage
              width={window.innerWidth - 32}
              height={window.innerHeight - 140}
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              ref={setStageRef}
              className={cn("whiteboard-canvas", darkMode ? "bg-stone-900" : "bg-white")}
              key="main-stage"
            >
              <Layer>
                {(selectedStudent === 'teacher' || role === 'student' ? lines : students[selectedStudent!]?.lines || []).map((line, i) => (
                  <WhiteboardElement key={i} line={line} isSelected={role === 'teacher' && selectedItems.includes(i)} />
                ))}
              </Layer>
            </Stage>

            {/* Leave Room Button for Students */}
            {!isTeacher && roomId && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 3000
              }}>
                <button
                  onClick={handleLeaveRoom}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2"
                >
                  🚪 Leave Room
                </button>
              </div>
            )}

            {/* Student Action Buttons */}
            {!isTeacher && roomId && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 3000,
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => setShowPublicChat(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
                  title="Public Chat"
                >
                  <MessageSquare size={16} /> Chat
                </button>
                <button
                  onClick={() => setShowPresentation(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors shadow-lg flex items-center gap-2"
                  title="Presentations"
                >
                  <FileText size={16} /> Presentations
                </button>
                <button
                  onClick={() => setShowAssignments(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg flex items-center gap-2"
                  title="Assignments"
                >
                  <ClipboardList size={16} /> Assignments
                </button>
              </div>
            )}
            
            {role === 'teacher' && selectedStudent && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
                {selectedStudent !== 'teacher' && (
                  <div className={cn(
                    "flex items-center gap-2 p-2 rounded-2xl shadow-xl border backdrop-blur-md",
                    darkMode ? "bg-stone-900/80 border-white/10" : "bg-white/80 border-black/5"
                  )}>
                    <button 
                      onClick={() => handleToggleSpotlight(selectedStudent)}
                      className={cn(
                        "p-2 rounded-xl transition-colors",
                        spotlightedStudent === selectedStudent ? "bg-amber-500 text-white" : "hover:bg-amber-500/10 text-amber-500"
                      )}
                      title="Spotlight for everyone"
                    >
                      <Eye size={20} />
                    </button>
                    <div className="w-px h-6 bg-black/10 mx-1" />
                    <button 
                      onClick={() => sendFeedback('thumb-up')}
                      className="p-2 hover:bg-emerald-500/10 text-emerald-500 rounded-xl transition-colors"
                      title="Thumbs Up"
                    >
                      <ThumbsUp size={20} />
                    </button>
                    <button 
                      onClick={() => sendFeedback('thumb-down')}
                      className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
                      title="Thumbs Down"
                    >
                      <ThumbsDown size={20} />
                    </button>
                    <div className="w-px h-6 bg-black/10 mx-1" />
                    <input 
                      type="text"
                      placeholder="Quick comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendFeedback('comment', comment)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm outline-none transition-all w-40",
                        darkMode ? "bg-stone-800 border-white/10" : "bg-stone-100 border-black/5 focus:bg-white focus:ring-2 ring-emerald-500/20"
                      )}
                    />
                    <button 
                      onClick={() => sendFeedback('comment', comment)}
                      disabled={!comment}
                      className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 bg-black text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <X size={20} />
                </button>
                {selectedStudent !== 'teacher' && (
                  <button 
                    onClick={() => setShowPrivateChat(selectedStudent)}
                    className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="Private Chat"
                  >
                    <MessageSquare size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Student Feedback Display */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col gap-2 pointer-events-none z-50">
              <AnimatePresence>
                {feedback.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={cn(
                      "px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3",
                      darkMode ? "bg-stone-900 border-white/10" : "bg-white border-black/5"
                    )}
                  >
                    {f.type === 'thumb-up' && <ThumbsUp className="text-emerald-500" size={20} />}
                    {f.type === 'thumb-down' && <ThumbsDown className="text-red-500" size={20} />}
                    {f.type === 'comment' && <MessageSquare className="text-blue-500" size={20} />}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Feedback from Teacher</span>
                      <span className="text-sm font-medium">{f.text || (f.type === 'thumb-up' ? 'Great job!' : 'Keep trying!')}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* External Video Overlay */}
            {externalVideoUrl && (
              <div className="absolute top-4 right-4 w-80 aspect-video z-50 rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500 bg-black">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={externalVideoUrl} 
                  title="Shared Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
                <button 
                  onClick={() => setExternalVideoUrl(null)}
                  className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Spotlight Overlay for Students */}
            <AnimatePresence>
              {role === 'student' && spotlightedStudent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-4 z-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-500 bg-white"
                >
                  <div className="absolute top-4 left-4 z-50 bg-amber-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                    <Eye size={18} />
                    <span>Teacher is spotlighting: {spotlightedStudent === 'teacher' ? 'Teacher Board' : (students[spotlightedStudent]?.name || 'Student')}</span>
                  </div>
                  <Stage
                    width={window.innerWidth - 64}
                    height={window.innerHeight - 172}
                  >
                    <Layer>
                      {(spotlightedStudent === 'teacher' ? lines : students[spotlightedStudent]?.lines || []).map((line, i) => (
                        <WhiteboardElement key={i} line={line} />
                      ))}
                    </Layer>
                  </Stage>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-4xl p-8 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button onClick={() => setShowTemplates(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
              <h3 className="text-2xl font-bold mb-2">Templates Gallery</h3>
              <p className="text-sm opacity-60 mb-6">Choose a pre-made worksheet or template for your lesson</p>
              
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BookOpen size={20} />
                Basic Templates
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <button onClick={() => loadTemplate('graph')} className="flex flex-col items-center gap-3 p-6 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors">
                  <Grid3X3 size={40} className="text-blue-500" />
                  <span className="font-bold text-sm">Graph Paper</span>
                </button>
                <button onClick={() => loadTemplate('venn')} className="flex flex-col items-center gap-3 p-6 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors">
                  <CircleIcon size={40} className="text-emerald-500" />
                  <span className="font-bold text-sm">Venn Diagram</span>
                </button>
                <button onClick={() => loadTemplate('storyboard')} className="flex flex-col items-center gap-3 p-6 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors">
                  <Square size={40} className="text-amber-500" />
                  <span className="font-bold text-sm">Storyboard</span>
                </button>
                <button onClick={() => loadTemplate('timeline')} className="flex flex-col items-center gap-3 p-6 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors">
                  <Ruler size={40} className="text-purple-500" />
                  <span className="font-bold text-sm">Timeline</span>
                </button>
              </div>

              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sigma size={20} />
                Math Templates
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <button onClick={() => loadTemplate('coordinate')} className="flex flex-col items-center gap-3 p-6 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors">
                  <Grid3X3 size={40} className="text-blue-500" />
                  <span className="font-bold text-sm">Coordinate Plane</span>
                </button>
                <button onClick={() => loadTemplate('fraction')} className="flex flex-col items-center gap-3 p-6 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors">
                  <CircleIcon size={40} className="text-emerald-500" />
                  <span className="font-bold text-sm">Fraction Circles</span>
                </button>
                <button onClick={() => loadTemplate('pentagon')} className="flex flex-col items-center gap-3 p-6 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors">
                  <Triangle size={40} className="text-red-500" />
                  <span className="font-bold text-sm">Pentagon</span>
                </button>
                <button onClick={() => loadTemplate('tchart')} className="flex flex-col items-center gap-3 p-6 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors">
                  <Square size={40} className="text-orange-500" />
                  <span className="font-bold text-sm">T-Chart</span>
                </button>
              </div>

              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Lightbulb size={20} />
                Planning Templates
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <button onClick={() => loadTemplate('mindmap')} className="flex flex-col items-center gap-3 p-6 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors">
                  <CircleIcon size={40} className="text-pink-500" />
                  <span className="font-bold text-sm">Mind Map</span>
                </button>
                <button onClick={() => loadTemplate('worksheet')} className="flex flex-col items-center gap-3 p-6 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors">
                  <FileText size={40} className="text-indigo-500" />
                  <span className="font-bold text-sm">Worksheet</span>
                </button>
              </div>

              {customTemplates.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">Your Saved Templates</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {customTemplates.map((t, i) => (
                      <button key={i} onClick={() => loadCustomTemplate(t.lines)} className="p-4 bg-black/5 rounded-xl hover:bg-black/10 transition-colors font-bold text-sm">
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {role === 'teacher' && (
                <button
                  onClick={saveAsTemplate}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Save Current Board as Template
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shared Notes Modal */}
      <AnimatePresence>
        {showNotes && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-2xl p-8 rounded-3xl shadow-2xl relative h-[600px] flex flex-col",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button onClick={() => setShowNotes(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
              <h3 className="text-2xl font-bold mb-4">Shared Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => handleUpdateNotes(e.target.value)}
                placeholder="Type notes here for everyone to see..."
                className={cn(
                  "flex-1 p-6 rounded-2xl outline-none resize-none font-medium text-lg",
                  darkMode ? "bg-stone-800 text-white border-white/10" : "bg-stone-50 text-black border-black/5"
                )}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assignments Modal */}
      <AnimatePresence>
        {showAssignments && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-4xl p-8 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button onClick={() => setShowAssignments(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <GraduationCap size={32} className="text-indigo-500" />
                Assignments
              </h3>

              {role === 'teacher' ? (
                <div className="space-y-6">
                  {/* Create Assignment Section */}
                  <div className={cn(
                    "p-6 rounded-2xl border-2 border-dashed",
                    darkMode ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"
                  )}>
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <ClipboardList size={20} />
                      Create New Assignment
                    </h4>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Assignment Title"
                        value={assignmentTitle}
                        onChange={(e) => setAssignmentTitle(e.target.value)}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border outline-none transition-colors",
                          darkMode ? "bg-white/10 border-white/10 focus:border-indigo-500" : "bg-white border-black/10 focus:border-indigo-500"
                        )}
                      />
                      <textarea
                        placeholder="Assignment Description"
                        value={assignmentDescription}
                        onChange={(e) => setAssignmentDescription(e.target.value)}
                        rows={3}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border outline-none transition-colors resize-none",
                          darkMode ? "bg-white/10 border-white/10 focus:border-indigo-500" : "bg-white border-black/10 focus:border-indigo-500"
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="date"
                          value={assignmentDueDate}
                          onChange={(e) => setAssignmentDueDate(e.target.value)}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border outline-none transition-colors",
                            darkMode ? "bg-white/10 border-white/10 focus:border-indigo-500" : "bg-white border-black/10 focus:border-indigo-500"
                          )}
                        />
                        <input
                          type="number"
                          placeholder="Points (e.g., 100)"
                          value={assignmentPoints}
                          onChange={(e) => setAssignmentPoints(parseInt(e.target.value) || 100)}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border outline-none transition-colors",
                            darkMode ? "bg-white/10 border-white/10 focus:border-indigo-500" : "bg-white border-black/10 focus:border-indigo-500"
                          )}
                        />
                      </div>
                      <button
                        onClick={handleCreateAssignment}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Check size={20} />
                        Create Assignment
                      </button>
                    </div>
                  </div>

                  {/* Active Assignments List */}
                  {assignments.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold mb-4">Active Assignments</h4>
                      <div className="space-y-3">
                        {assignments.map((assignment) => (
                          <div key={assignment.id} className={cn(
                            "p-4 rounded-xl border",
                            darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                          )}>
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-bold text-lg">{assignment.title}</h5>
                                <p className="text-sm opacity-60">{assignment.description}</p>
                                <div className="flex gap-4 mt-2 text-xs">
                                  <span>Due: {assignment.dueDate || 'No due date'}</span>
                                  <span>Points: {assignment.points}</span>
                                  <span>Submissions: {Object.keys(assignment.submissions || {}).length}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setCurrentAssignment(assignment);
                                  setShowGrading(true);
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
                              >
                                Grade Submissions
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Student View */
                <div className="space-y-6">
                  {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                      <div key={assignment.id} className={cn(
                        "p-6 rounded-2xl border",
                        darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                      )}>
                        <h4 className="text-lg font-bold mb-2">{assignment.title}</h4>
                        <p className="text-sm opacity-60 mb-4">{assignment.description}</p>
                        <div className="flex gap-4 text-xs mb-4">
                          <span>Due: {assignment.dueDate || 'No due date'}</span>
                          <span>Points: {assignment.points}</span>
                        </div>
                        
                        {studentSubmissions[assignment.id] ? (
                          <div className={cn(
                            "p-4 rounded-xl",
                            darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                          )}>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={20} />
                              <span className="font-bold">Submitted!</span>
                            </div>
                            {studentSubmissions[assignment.id].grade !== null && (
                              <div className="mt-2">
                                Grade: {studentSubmissions[assignment.id].grade} / {assignment.points}
                                {studentSubmissions[assignment.id].feedback && (
                                  <p className="text-sm mt-2">Feedback: {studentSubmissions[assignment.id].feedback}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSubmitAssignment(assignment.id, lines)}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Send size={20} />
                            Submit Current Board
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 opacity-50">
                      <ClipboardList size={64} className="mx-auto mb-4" />
                      <p className="text-xl">No assignments yet</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grading Modal */}
      <AnimatePresence>
        {showGrading && currentAssignment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-2xl p-8 rounded-3xl shadow-2xl relative",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button onClick={() => setShowGrading(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
              <h3 className="text-2xl font-bold mb-6">Grade: {currentAssignment.title}</h3>
              
              <div className="space-y-4">
                {Object.entries(currentAssignment.submissions || {}).map(([studentId, submission]: [string, any]) => (
                  <div key={studentId} className={cn(
                    "p-4 rounded-xl border",
                    darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h5 className="font-bold">{submission.studentName}</h5>
                        <p className="text-sm opacity-60">Submitted: {new Date(submission.submittedAt).toLocaleString()}</p>
                      </div>
                      {submission.grade !== null ? (
                        <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl font-bold">
                          {submission.grade} / {currentAssignment.points}
                        </span>
                      ) : (
                        <span className="px-4 py-2 bg-amber-500/10 text-amber-500 rounded-xl font-bold">
                          Needs Grading
                        </span>
                      )}
                    </div>
                    
                    {!submission.grade && (
                      <div className="space-y-3">
                        <input
                          type="number"
                          placeholder={`Grade (max ${currentAssignment.points})`}
                          value={gradeInput}
                          onChange={(e) => setGradeInput(e.target.value)}
                          max={currentAssignment.points}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border outline-none transition-colors",
                            darkMode ? "bg-white/10 border-white/10 focus:border-indigo-500" : "bg-white border-black/10 focus:border-indigo-500"
                          )}
                        />
                        <textarea
                          placeholder="Feedback (optional)"
                          value={feedbackInput}
                          onChange={(e) => setFeedbackInput(e.target.value)}
                          rows={2}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border outline-none transition-colors resize-none",
                            darkMode ? "bg-white/10 border-white/10 focus:border-indigo-500" : "bg-white border-black/10 focus:border-indigo-500"
                          )}
                        />
                        <button
                          onClick={() => handleGradeSubmission(submission.id || studentId, currentAssignment.id)}
                          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Check size={20} />
                          Submit Grade
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Poll Modal */}
      <AnimatePresence>
        {showPoll && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-md p-8 rounded-3xl shadow-2xl relative",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button onClick={() => setShowPoll(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
              <h3 className="text-2xl font-bold mb-6">Class Poll</h3>
              
              {currentPoll ? (
                <div className="space-y-4">
                  <p className="text-lg font-bold">{currentPoll.question}</p>
                  <div className="space-y-2">
                    {currentPoll.options.map((opt: string, i: number) => {
                      const total = Object.values(currentPoll.results).reduce((a: any, b: any) => a + b, 0) as number;
                      const count = currentPoll.results[i] || 0;
                      const percent = total === 0 ? 0 : Math.round((count / total) * 100);
                      return (
                        <button 
                          key={i} 
                          onClick={() => handleVote(i)}
                          className="w-full p-4 bg-black/5 rounded-xl text-left relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-emerald-500/10 transition-all" style={{ width: `${percent}%` }} />
                          <div className="relative flex justify-between items-center">
                            <span className="font-medium">{opt}</span>
                            <span className="text-xs font-bold opacity-50">{percent}% ({count})</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {role === 'teacher' && (
                    <button onClick={handleEndPoll} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold mt-4">End Poll</button>
                  )}
                </div>
              ) : (
                role === 'teacher' ? (
                  <div className="space-y-4">
                    <input id="poll-q" placeholder="Question" className="w-full p-4 bg-black/5 rounded-xl outline-none" />
                    <input id="poll-o1" placeholder="Option 1" className="w-full p-4 bg-black/5 rounded-xl outline-none" />
                    <input id="poll-o2" placeholder="Option 2" className="w-full p-4 bg-black/5 rounded-xl outline-none" />
                    <button 
                      onClick={() => {
                        const q = (document.getElementById('poll-q') as HTMLInputElement).value;
                        const o1 = (document.getElementById('poll-o1') as HTMLInputElement).value;
                        const o2 = (document.getElementById('poll-o2') as HTMLInputElement).value;
                        if (q && o1 && o2) handleStartPoll(q, [o1, o2]);
                      }}
                      className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold"
                    >
                      Start Poll
                    </button>
                  </div>
                ) : (
                  <p className="text-center opacity-50 italic py-8">No active poll...</p>
                )
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-md p-8 rounded-3xl shadow-2xl relative",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button onClick={() => setShowVideo(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
              <h3 className="text-2xl font-bold mb-6">Share External Video</h3>
              <div className="space-y-4">
                <input id="video-url" placeholder="YouTube URL" className="w-full p-4 bg-black/5 rounded-xl outline-none" />
                <button 
                  onClick={() => {
                    const url = (document.getElementById('video-url') as HTMLInputElement).value;
                    if (url) handleShareVideo(url);
                  }}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold"
                >
                  Share Video
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Status Modal */}
      <AnimatePresence>
        {showStatus && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-md p-8 rounded-3xl shadow-2xl relative",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button onClick={() => setShowStatus(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
              <h3 className="text-2xl font-bold mb-6">Set Your Status</h3>
              <div className="grid grid-cols-4 gap-4">
                {['✋', '🤔', '✅', '❌', '🔥', '👏', '😴', '🆘'].map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => handleSetStatus(emoji)}
                    className="text-3xl p-4 bg-black/5 rounded-2xl hover:bg-black/10 transition-all hover:scale-110"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button onClick={() => handleSetStatus('')} className="w-full py-3 bg-black/5 rounded-xl font-bold mt-6">Clear Status</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Private Chat Modal */}
      <AnimatePresence>
        {showPrivateChat && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-md p-8 rounded-3xl shadow-2xl relative h-[500px] flex flex-col",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button onClick={() => setShowPrivateChat(null)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
              <h3 className="text-2xl font-bold mb-4">Private Chat: {showPrivateChat === 'teacher' ? 'Teacher' : (students[showPrivateChat]?.name || 'Student')}</h3>
              
              <div className="flex-1 overflow-auto space-y-2 mb-4 p-2">
                {(privateMessages[showPrivateChat] || []).map((m, i) => (
                  <div key={i} className={cn("flex flex-col", m.isMe ? "items-end" : "items-start")}>
                    <div className={cn("px-4 py-2 rounded-2xl max-w-[80%]", m.isMe ? "bg-blue-600 text-white" : "bg-black/5")}>
                      <p className="text-sm">{m.message}</p>
                    </div>
                    <span className="text-[10px] opacity-40 mt-1">{m.fromName}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  value={privateInput}
                  onChange={(e) => setPrivateInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPrivate(showPrivateChat)}
                  placeholder="Type a message..."
                  className={cn("flex-1 px-4 py-2 rounded-xl outline-none", darkMode ? "bg-stone-800" : "bg-stone-100")}
                />
                <button onClick={() => handleSendPrivate(showPrivateChat)} className="p-2 bg-blue-600 text-white rounded-xl"><Send size={18} /></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Public Chat Modal */}
      <AnimatePresence>
        {showPublicChat && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-2xl p-8 rounded-3xl shadow-2xl relative h-[600px] flex flex-col",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button onClick={() => setShowPublicChat(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare size={28} className="text-blue-500" />
                Public Chat - {roomId}
              </h3>

              <div className="flex-1 overflow-auto space-y-3 mb-4 p-4 rounded-xl bg-black/5">
                {publicMessages.length === 0 ? (
                  <p className="text-center py-8 opacity-40 italic">No messages yet. Start the conversation!</p>
                ) : (
                  publicMessages.map((m, i) => (
                    <div key={i} className={cn("flex flex-col", m.isMe ? "items-end" : "items-start")}>
                      <div className={cn("px-4 py-2 rounded-2xl max-w-[70%]", m.isMe ? "bg-blue-600 text-white" : "bg-black/10")}>
                        <p className="text-sm font-bold mb-1">{m.from}</p>
                        <p className="text-sm">{m.message}</p>
                      </div>
                      <span className="text-[10px] opacity-40 mt-1">{new Date(m.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  value={publicChatInput}
                  onChange={(e) => setPublicChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPublicChat()}
                  placeholder="Type a message to everyone..."
                  className={cn("flex-1 px-4 py-3 rounded-xl outline-none", darkMode ? "bg-stone-800" : "bg-stone-100")}
                />
                <button onClick={handleSendPublicChat} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Send size={18} />
                  Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Presentation Upload Modal */}
      <AnimatePresence>
        {showPresentation && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-2xl p-8 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button onClick={() => setShowPresentation(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText size={28} className="text-purple-500" />
                Presentations
              </h3>

              {/* Upload Section */}
              <div className={cn(
                "border-2 border-dashed rounded-2xl p-8 text-center mb-6",
                darkMode ? "border-white/20 bg-white/5" : "border-black/10 bg-black/5"
              )}>
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <h4 className="font-bold text-lg mb-2">Upload Presentation</h4>
                <p className="text-sm opacity-60 mb-4">Supported: PDF, PowerPoint, Word, Excel</p>
                <input
                  type="file"
                  id="presentation-upload"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUploadPresentation(e.target.files[0])}
                />
                <label
                  htmlFor="presentation-upload"
                  className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-bold cursor-pointer hover:bg-purple-700 transition-colors"
                >
                  📁 Browse Files
                </label>
              </div>

              {/* Uploaded Presentations List */}
              {presentations.length > 0 && (
                <div>
                  <h4 className="font-bold mb-4">Uploaded Presentations</h4>
                  <div className="space-y-2">
                    {presentations.map((pres) => (
                      <div key={pres.id} className={cn(
                        "p-4 rounded-xl flex items-center justify-between",
                        darkMode ? "bg-white/5" : "bg-black/5"
                      )}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                            <FileText size={24} className="text-purple-500" />
                          </div>
                          <div>
                            <p className="font-bold">{pres.name}</p>
                            <p className="text-sm opacity-60">Uploaded by {pres.uploadedBy}</p>
                          </div>
                        </div>
                        <a
                          href={pres.url}
                          download={pres.name}
                          className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors"
                        >
                          ⬇️ Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Waiting Room Modal */}
      <AnimatePresence>
        {showWaiting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-md p-8 rounded-3xl shadow-2xl relative",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button 
                onClick={() => setShowWaiting(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Lock className="text-amber-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Waiting Room</h3>
                </div>
                
                <div className="space-y-2 max-h-[400px] overflow-auto pr-2">
                  {Object.entries(waiting).length === 0 ? (
                    <p className="text-center py-8 opacity-40 italic">No students waiting...</p>
                  ) : (
                    Object.entries(waiting).map(([id, student]: [string, any]) => (
                      <div key={id} className="flex items-center justify-between p-4 bg-black/5 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                            {student.name[0]}
                          </div>
                          <span className="font-bold">{student.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApprove(id)}
                            className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleReject(id)}
                            className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Attendance Modal */}
      <AnimatePresence>
        {showAttendance && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-5xl p-8 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button onClick={() => setShowAttendance(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <ClipboardList size={32} className="text-green-500" />
                Class Attendance
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl">
                  <div>
                    <p className="font-bold text-lg">Class Session</p>
                    <p className="text-sm opacity-60">Room: {roomId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl">{Object.keys(attendanceList).length} Students</p>
                    <p className="text-sm opacity-60">Present today</p>
                  </div>
                </div>

                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className={cn("text-left", darkMode ? "bg-white/5" : "bg-black/5")}>
                      <tr>
                        <th className="p-3 font-bold">Student Name</th>
                        <th className="p-3 font-bold">Role</th>
                        <th className="p-3 font-bold">Joined</th>
                        <th className="p-3 font-bold">Last Active</th>
                        <th className="p-3 font-bold">Status</th>
                        <th className="p-3 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(attendanceList).map(([id, data]: [string, any]) => (
                        <tr key={id} className={cn("border-t", darkMode ? "border-white/5" : "border-black/5")}>
                          <td className="p-3 font-bold">{data.name}</td>
                          <td className="p-3">
                            <span className={cn("px-2 py-1 rounded-full text-xs font-bold", data.role === 'teacher' ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500")}>
                              {data.role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'}
                            </span>
                          </td>
                          <td className="p-3 text-sm">{new Date(data.joinedAt).toLocaleTimeString()}</td>
                          <td className="p-3 text-sm">{new Date(data.lastActive).toLocaleTimeString()}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500">
                              ✓ Present
                            </span>
                          </td>
                          <td className="p-3">
                            {data.role === 'student' && (
                              <button
                                onClick={() => {
                                  onViewStudentBoard(id);
                                  setShowAttendance(false);
                                }}
                                className="px-3 py-1 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                              >
                                <Eye size={14} /> View Board
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={onExportAttendance}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Export Attendance to CSV
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Live Student Board View Modal */}
      <AnimatePresence>
        {viewingStudentId && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-7xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Eye size={32} className="text-blue-500" />
                    Live View: {students[viewingStudentId]?.name || 'Student'}'s Board
                  </h2>
                  <p className="text-white/60 mt-1">Updates in real-time • Student cannot see you viewing</p>
                </div>
                <button
                  onClick={onCloseStudentView}
                  className="p-3 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="aspect-video bg-white rounded-2xl overflow-hidden shadow-2xl">
                <Stage width={window.innerWidth - 100} height={window.innerHeight - 250}>
                  <Layer>
                    {viewingStudentBoard.map((line: any, i: number) => (
                      <WhiteboardElement key={i} line={line} />
                    ))}
                  </Layer>
                </Stage>
              </div>

              <div className="mt-4 flex items-center justify-between text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Live updates active</span>
                </div>
                <button
                  onClick={onCloseStudentView}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-md p-8 rounded-3xl shadow-2xl relative",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center gap-6">
                <div className="p-4 bg-white rounded-2xl shadow-inner">
                  <QRCodeSVG value={joinUrl} size={200} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Join Classroom</h3>
                  <p className="text-sm opacity-60 mb-4">Scan this QR code or share the room code below</p>
                  <div className="bg-black/5 p-4 rounded-xl font-mono text-3xl font-bold tracking-widest">
                    {roomId}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(joinUrl);
                    alert('Link copied to clipboard!');
                  }}
                  className="w-full py-3 bg-black text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                  Copy Join Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Upload Modal */}
      <AnimatePresence>
        {showImageUpload && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-lg p-8 rounded-3xl shadow-2xl relative",
                darkMode ? "bg-stone-900 text-white" : "bg-white text-black"
              )}
            >
              <button
                onClick={() => setShowImageUpload(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold mb-6">Upload Image</h3>
              
              <div className="space-y-4">
                <div className={cn(
                  "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors",
                  darkMode ? "border-white/20 hover:border-white/40" : "border-black/10 hover:border-black/20"
                )}>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div onClick={() => imageInputRef.current?.click()}>
                    <ImageIcon size={48} className={cn("mx-auto mb-4 opacity-50", darkMode ? "text-white" : "text-black")} />
                    <p className="text-lg font-bold mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm opacity-60">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Choose Image
                  </button>
                  <button
                    onClick={() => setShowImageUpload(false)}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold transition-colors",
                      darkMode ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"
                    )}
                  >
                    Cancel
                  </button>
                </div>
                
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-2">Uploaded Images</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {uploadedImages.map((img) => (
                        <div key={img.id} className="aspect-square relative group">
                          <img src={img.src} alt="uploaded" className="w-full h-full object-cover rounded-lg" />
                          <button
                            onClick={() => handleDeleteImage(img.id)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className={cn(
        "px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex justify-between items-center border-t",
        darkMode ? "bg-stone-950 border-white/10 text-white/40" : "bg-stone-50 border-black/5 text-black/40"
      )}>
        <div className="flex gap-4">
          <span>Room: {roomId}</span>
          <span>Role: {role}</span>
          <span>User: {name}</span>
        </div>
        <div className="flex gap-4 items-center">
          {isLocked && <span className="text-red-500 flex items-center gap-1"><Lock size={10} /> Locked</span>}
          <span>EduBoard v1.0</span>
        </div>
      </div>

      <VideoChat
        roomId={roomId}
        socket={socket}
        userId={socket?.id}
        userName={name}
        peers={{
          ...(teacherInfo && role === 'student' ? { [teacherInfo.id]: { name: teacherInfo.name } } : {}),
          ...Object.fromEntries(
            Object.entries(students)
              .filter(([id]) => id !== socket?.id)
              .map(([id, s]) => [id, { name: s.name }])
          )
        }}
        darkMode={darkMode}
        isTeacher={role === 'teacher'}
      />
    </div>
  );
};
