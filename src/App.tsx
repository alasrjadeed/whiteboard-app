import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { UserGuide } from './components/UserGuide';
import { nanoid } from 'nanoid';
import { Whiteboard } from './components/Whiteboard';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Pricing } from './pages/Pricing';
import { FAQ } from './pages/FAQ';
import { Blog } from './pages/Blog';
import { SignIn } from './pages/SignIn';
import { Register } from './pages/Register';
import { NewSession } from './pages/NewSession';
import { JoinSession } from './pages/JoinSession';
import { PrivacyTerms } from './pages/PrivacyTerms';
// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSubscriptions } from './pages/admin/AdminSubscriptions';
import { AdminRooms } from './pages/admin/AdminRooms';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminGradeBook } from './pages/admin/AdminGradeBook';
import { 
  LiveSessions, 
  Analytics, 
  Students, 
  Teachers, 
  Schools, 
  Storage, 
  Invoices, 
  Notifications, 
  Support, 
  Security, 
  Branding 
} from './pages/admin/ComingSoonPages';
import { AdminRoute } from './components/admin/AdminRoute';
import './App.css';

type Role = 'teacher' | 'student';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const socketRef = useRef<Socket | null>(null);

  // Get URL params (more reliable than state)
  const params = new URLSearchParams(location.search);
  const paramRoomId = params.get('roomId');
  const paramIsTeacher = params.get('isTeacher') === 'true';
  const paramRole = params.get('role') as Role | null;
  const paramName = params.get('name');

  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState(paramRoomId || '');
  const [name, setName] = useState(paramName || '');
  const [role, setRole] = useState<Role | null>(paramRole || (paramIsTeacher ? 'teacher' : null));
  const [joined, setJoined] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const [students, setStudents] = useState<Record<string, any>>({});
  const [waiting, setWaiting] = useState<Record<string, any>>({});
  const [teacherInfo, setTeacherInfo] = useState<{ id: string, name: string } | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [hideNames, setHideNames] = useState(false);

  // Attendance tracking state
  const [attendanceList, setAttendanceList] = useState<Record<string, any>>({});
  const [showAttendance, setShowAttendance] = useState(false);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);
  const [viewingStudentBoard, setViewingStudentBoard] = useState<any[]>([]);

  // Initialize socket connection ONCE
  useEffect(() => {
    const newSocket = io();
    socketRef.current = newSocket;
    setSocket(newSocket);

    console.log('✅ Socket connected:', newSocket.id);

    newSocket.on('room-state', ({ students, waiting, isLocked, hideNames, teacherName, teacherId, assignments, presentations }) => {
      console.log('📊 Received room state:', { students, waiting, teacherId });
      setStudents(students);
      setWaiting(waiting || {});
      setIsLocked(isLocked);
      setHideNames(hideNames);
      if (teacherId && teacherName) {
        setTeacherInfo({ id: teacherId, name: teacherName });
      }
      // Load assignments and presentations if provided
      if (assignments && assignments.length > 0) {
        localStorage.setItem(`assignments-${roomId}`, JSON.stringify(assignments));
        window.dispatchEvent(new CustomEvent('assignment-updated'));
      }
      if (presentations && presentations.length > 0) {
        window.dispatchEvent(new CustomEvent('presentations-loaded', { detail: presentations }));
      }
    });

    newSocket.on('student-waiting', (student: any) => {
      console.log('👤 Student waiting:', student);
      setWaiting(prev => ({ ...prev, [student.id]: student }));
    });

    newSocket.on('waiting-updated', (newWaiting: any) => {
      console.log('📋 Waiting updated:', newWaiting);
      setWaiting(newWaiting);
    });

    newSocket.on('waiting-room', () => {
      console.log('⏳ Waiting room activated');
      setIsWaiting(true);
    });

    newSocket.on('approved', () => {
      console.log('✅ Approved! Joining room...');
      setIsWaiting(false);
      newSocket.emit('join-room', { roomId: roomId.toUpperCase(), name, role: 'student' });
    });

    newSocket.on('student-joined', (student: any) => {
      console.log('🎓 Student joined:', student);
      setStudents(prev => {
        const updated = { ...prev, [student.id]: student };
        console.log('📊 Updated students:', updated);
        return updated;
      });
    });

    newSocket.on('student-update', ({ id, lines }: { id: string, lines: any[] }) => {
      console.log('📝 Student update from:', id);
      setStudents(prev => ({ ...prev, [id]: { ...prev[id], lines } }));
    });

    newSocket.on('student-left', (id: string) => {
      console.log('👋 Student left:', id);
      setStudents(prev => {
        const next = { ...prev };
        delete next[id];
        console.log('📊 Updated students after leave:', next);
        return next;
      });
    });

    newSocket.on('room-locked', (locked: boolean) => {
      console.log('🔒 Room locked:', locked);
      setIsLocked(locked);
    });

    newSocket.on('privacy-updated', (hidden: boolean) => {
      console.log('👁️ Privacy updated:', hidden);
      setHideNames(hidden);
    });

    // Attendance socket listeners
    newSocket.on('attendance-report', ({ attendance, startTime, studentCount }) => {
      console.log('📊 Attendance report:', attendance);
      setAttendanceList(attendance);
    });

    newSocket.on('student-board-live', ({ studentId, studentName, lines, lastActive }) => {
      console.log('👁️ Viewing student board:', studentName);
      setViewingStudentId(studentId);
      setViewingStudentBoard(lines);
    });

    // Assignment socket listeners
    newSocket.on('assignment-created', (assignment) => {
      console.log('📚 Assignment created:', assignment.title);
      const existingAssignments = JSON.parse(localStorage.getItem(`assignments-${roomId}`) || '[]');
      existingAssignments.push(assignment);
      localStorage.setItem(`assignments-${roomId}`, JSON.stringify(existingAssignments));
      window.dispatchEvent(new CustomEvent('assignment-updated'));
    });

    // Public chat socket listeners
    newSocket.on('public-message', ({ message }) => {
      console.log('💬 Public message:', message);
      window.dispatchEvent(new CustomEvent('public-message', { detail: message }));
    });

    // Presentation socket listeners
    newSocket.on('presentation-uploaded', ({ presentation }) => {
      console.log('📊 Presentation uploaded:', presentation.name);
      window.dispatchEvent(new CustomEvent('presentation-updated', { detail: presentation }));
    });

    newSocket.on('error', (msg: string) => {
      console.error('❌ Socket error:', msg);
      alert(msg);
      setJoined(false);
      navigate('/join-session');
    });

    return () => {
      console.log('🔌 Disconnecting socket...');
      newSocket.off('attendance-report');
      newSocket.off('student-board-live');
      newSocket.off('assignment-created');
      newSocket.off('public-message');
      newSocket.off('presentation-uploaded');
      newSocket.disconnect();
    };
  }, [navigate]);

  // Join room when socket is ready and we have room info
  useEffect(() => {
    if (!socket || !roomId || !role) return;

    console.log('🚪 Attempting to join room:', roomId, 'as', role, 'name:', name);

    socket.emit('join-room', { roomId: roomId.toUpperCase(), name, role });
    setJoined(true);
  }, [socket, roomId, role, name]);

  const handleCreateRoom = (settings?: { maxStudents: number; duration: number }) => {
    if (!name) {
      alert('Please enter your name');
      return;
    }
    const id = nanoid(6).toUpperCase();
    console.log('🆕 Creating room:', id, 'Settings:', settings);
    setRoomId(id);
    setRole('teacher');
    // Store room settings in localStorage for server
    localStorage.setItem(`room-settings-${id}`, JSON.stringify(settings || { maxStudents: 30, duration: 60 }));
    // Navigation will trigger join via useEffect
    navigate(`/session/${id}?roomId=${id}&isTeacher=true&role=teacher&name=${encodeURIComponent(name)}`, { replace: true });
  };

  const handleJoinRoom = () => {
    if (!name) {
      alert('Please enter your name');
      return;
    }
    if (!roomId) {
      alert('Please enter room code');
      return;
    }
    const id = roomId.toUpperCase();
    console.log('🔑 Joining room:', id);
    setRoomId(id);
    setRole('student');
    // Navigation will trigger join via useEffect
    navigate(`/session/${id}?roomId=${id}&isTeacher=false&role=student&name=${encodeURIComponent(name)}`, { replace: true });
  };

  // Attendance handlers
  const handleOpenAttendance = () => {
    socket?.emit('get-attendance', { roomId });
    setShowAttendance(true);
  };

  const handleExportAttendance = () => {
    socket?.emit('export-attendance', { roomId });
  };

  const handleViewStudentBoard = (studentId: string) => {
    socket?.emit('view-student-board', { roomId, studentId });
  };

  const handleCloseStudentView = () => {
    setViewingStudentId(null);
    setViewingStudentBoard([]);
  };

  const handleEndClass = () => {
    if (window.confirm('End this class session? All students will be removed.')) {
      try {
        // Export attendance before ending
        if (socket && roomId) {
          socket.emit('export-attendance', { roomId });
          // Give socket time to send the event
          setTimeout(() => {
            socket.disconnect();
            navigate('/');
          }, 500);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error ending class:', error);
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/guide" element={<UserGuide />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy-terms" element={<PrivacyTerms />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/rooms" element={<AdminRoute><AdminRooms /></AdminRoute>} />
        <Route path="/admin/subscriptions" element={<AdminRoute><AdminSubscriptions /></AdminRoute>} />
        <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
        <Route path="/admin/gradebook" element={<AdminRoute><AdminGradeBook /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        
        {/* Coming Soon Routes */}
        <Route path="/admin/sessions" element={<AdminRoute><LiveSessions /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
        <Route path="/admin/students" element={<AdminRoute><Students /></AdminRoute>} />
        <Route path="/admin/teachers" element={<AdminRoute><Teachers /></AdminRoute>} />
        <Route path="/admin/schools" element={<AdminRoute><Schools /></AdminRoute>} />
        <Route path="/admin/storage" element={<AdminRoute><Storage /></AdminRoute>} />
        <Route path="/admin/invoices" element={<AdminRoute><Invoices /></AdminRoute>} />
        <Route path="/admin/notifications" element={<AdminRoute><Notifications /></AdminRoute>} />
        <Route path="/admin/support" element={<AdminRoute><Support /></AdminRoute>} />
        <Route path="/admin/security" element={<AdminRoute><Security /></AdminRoute>} />
        <Route path="/admin/branding" element={<AdminRoute><Branding /></AdminRoute>} />

        <Route path="/new-session" element={
          <NewSession
            name={name}
            setName={setName}
            onCreateRoom={handleCreateRoom}
          />
        } />

        <Route path="/join-session" element={
          <JoinSession
            name={name}
            setName={setName}
            roomId={roomId}
            setRoomId={setRoomId}
            onJoinRoom={handleJoinRoom}
            isWaiting={isWaiting}
          />
        } />

        <Route path="/session/:id" element={
          roomId && (role || paramRole) ? (
            <Whiteboard
              roomId={roomId}
              name={name}
              role={role || paramRole!}
              socket={socket}
              students={students}
              waiting={waiting}
              teacherInfo={teacherInfo}
              isLocked={isLocked}
              hideNames={hideNames}
              isTeacher={role === 'teacher' || paramIsTeacher}
              attendanceList={attendanceList}
              showAttendance={showAttendance}
              setShowAttendance={setShowAttendance}
              viewingStudentId={viewingStudentId}
              viewingStudentBoard={viewingStudentBoard}
              onOpenAttendance={handleOpenAttendance}
              onExportAttendance={handleExportAttendance}
              onViewStudentBoard={handleViewStudentBoard}
              onCloseStudentView={handleCloseStudentView}
              onEndClass={handleEndClass}
            />
          ) : (
            <Navigate to="/join-session" />
          )
        } />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
