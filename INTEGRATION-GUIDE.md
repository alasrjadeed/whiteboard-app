# 🔧 Feature Integration Guide

## How to Integrate New Features into AsarBoard

---

## 1. Session Timer Integration ⏱️

### Step 1: Import Component

In `src/components/Whiteboard.tsx`, add:

```typescript
import { SessionTimer } from './timer/SessionTimer';
```

### Step 2: Add State

Add these state variables (around line 200):

```typescript
// Timer state
const [showTimer, setShowTimer] = useState(false);
const [sessionDuration, setSessionDuration] = useState(60); // minutes
```

### Step 3: Add Timer Button

In the teacher dashboard action buttons section, add:

```typescript
<button
  onClick={() => setShowTimer(!showTimer)}
  className="px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-xl text-xs font-bold hover:bg-indigo-500/20 transition-colors flex items-center gap-2"
>
  <Clock size={14} /> {showTimer ? 'Hide Timer' : 'Session Timer'}
</button>
```

### Step 4: Render Timer Component

Add this where you want the timer to appear (e.g., above the dashboard):

```typescript
{showTimer && isTeacher && (
  <div className="mb-6">
    <SessionTimer
      roomId={roomId}
      socket={socket}
      initialDuration={sessionDuration}
      isTeacher={true}
      onSessionExpire={() => {
        // Auto-save all boards
        handleAutoSave();
        // Notify students
        alert('Session has ended! Please save your work.');
      }}
    />
  </div>
)}
```

### Step 5: Add Socket Handlers

In the server (`server/index.ts`), add:

```javascript
// Timer control
socket.on("timer-control", ({ roomId, action, timeRemaining, duration }) => {
  if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
    io.to(roomId).emit("timer-update", {
      action,
      time: timeRemaining,
      duration
    });
  }
});

// Timer sync
socket.on("timer-sync", ({ roomId }) => {
  const room = rooms[roomId];
  if (room) {
    socket.emit("timer-sync", {
      time: room.timeRemaining || 3600,
      isRunning: room.isTimerRunning || false,
      isPaused: room.isTimerPaused || false
    });
  }
});

// Session end
socket.on("session-end", ({ roomId }) => {
  io.to(roomId).emit("session-ended");
});
```

### Step 6: Add Room State

In the rooms object, track timer state:

```javascript
rooms[roomId] = {
  teacherId: socket.id,
  students: {},
  timeRemaining: 3600, // 60 minutes
  isTimerRunning: false,
  isTimerPaused: false,
  // ... other properties
};
```

---

## 2. Assignment System Integration 📝

### Already Implemented in Admin Panel

The assignment system is already built in the admin panel. To integrate with whiteboard:

### Step 1: Add Assignment State

```typescript
const [activeAssignment, setActiveAssignment] = useState<any>(null);
const [showAssignment, setShowAssignment] = useState(false);
```

### Step 2: Add Assignment Button

```typescript
<button
  onClick={() => setShowAssignment(true)}
  className="px-4 py-2 bg-purple-500/10 text-purple-500 rounded-xl"
>
  <GraduationCap size={14} /> Assignment
</button>
```

### Step 3: Submit Whiteboard as Assignment

```typescript
const handleSubmitAssignment = () => {
  socket.emit('assignment-submit', {
    roomId,
    assignmentId: activeAssignment.id,
    studentId: socket.id,
    studentName: name,
    boardSnapshot: lines,
    submissionTime: new Date()
  });
  setShowAssignment(false);
};
```

### Step 4: Server Handler

```javascript
socket.on("assignment-submit", ({ roomId, assignmentId, studentId, studentName, boardSnapshot, submissionTime }) => {
  if (rooms[roomId]) {
    // Store submission
    rooms[roomId].submissions = rooms[roomId].submissions || [];
    rooms[roomId].submissions.push({
      assignmentId,
      studentId,
      studentName,
      boardSnapshot,
      submissionTime,
      grade: null,
      feedback: ''
    });
    
    // Notify teacher
    io.to(rooms[roomId].teacherId).emit("assignment-submitted", {
      assignmentId,
      studentId,
      studentName,
      submissionTime
    });
  }
});
```

---

## 3. Grade Book Integration 📊

### Step 1: Create Grade Book Component

Create `src/components/gradebook/GradeBook.tsx`:

```typescript
import React, { useState } from 'react';
import { AdminLayout } from '../admin/AdminLayout';

export const GradeBook: React.FC = () => {
  const [grades, setGrades] = useState<any[]>([]);
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Grade Book</h1>
        
        {/* Grade entry table */}
        <table className="w-full">
          <thead>
            <tr>
              <th>Student</th>
              <th>Assignment</th>
              <th>Grade</th>
              <th>Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Grade rows */}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
```

### Step 2: Add Route

In `src/App.tsx`:

```typescript
import { GradeBook } from './pages/admin/GradeBook';

<Route path="/admin/gradebook" element={<GradeBook />} />
```

### Step 3: Add to Navigation

In `src/components/admin/AdminLayout.tsx`:

```typescript
{ name: 'Grade Book', icon: GraduationCap, path: '/admin/gradebook' }
```

---

## 4. Progress Tracking Integration 📈

### Step 1: Create Progress Component

Create `src/components/progress/ProgressChart.tsx`:

```typescript
import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie } from 'recharts';

export const ProgressChart: React.FC<{ studentId: string }> = ({ studentId }) => {
  // Fetch progress data
  const data = [
    { date: '2026-03-01', score: 85 },
    { date: '2026-03-08', score: 88 },
    { date: '2026-03-15', score: 92 },
  ];
  
  return (
    <div>
      <LineChart width={600} height={300} data={data}>
        <Line dataKey="score" stroke="#10B981" />
      </LineChart>
    </div>
  );
};
```

### Step 2: Install Recharts

```bash
npm install recharts
```

### Step 3: Add to Student Profile

```typescript
<ProgressChart studentId={studentId} />
```

---

## 5. Multi-Language Integration 🌍

### Step 1: Create Language Context

Create `src/contexts/LanguageContext.tsx`:

```typescript
import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    'timer.start': 'Start',
    'timer.pause': 'Pause',
    'timer.reset': 'Reset',
    'session.end': 'End Session',
    'assignment.submit': 'Submit Assignment',
    'grade.book': 'Grade Book'
  },
  ar: {
    'timer.start': 'يبدأ',
    'timer.pause': 'يوقف',
    'timer.reset': 'إعادة تعيين',
    'session.end': 'إنهاء الجلسة'
  },
  es: {
    'timer.start': 'Comenzar',
    'timer.pause': 'Pausar',
    'timer.reset': 'Reiniciar',
    'session.end': 'Terminar Sesión'
  }
};

const LanguageContext = createContext<any>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  const t = (key: string) => {
    return translations[language]?.[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
```

### Step 2: Wrap App

In `src/main.tsx`:

```typescript
import { LanguageProvider } from './contexts/LanguageContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
```

### Step 3: Use Translations

```typescript
import { useLanguage } from '../contexts/LanguageContext';

const { t, language, setLanguage } = useLanguage();

<button>{t('timer.start')}</button>
```

### Step 4: Language Selector Component

Create `src/components/language/LanguageSelector.tsx`:

```typescript
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];
  
  return (
    <div className="relative">
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
        <Globe size={18} />
        <span>{languages.find(l => l.code === language)?.flag}</span>
      </button>
      
      {/* Dropdown with language options */}
    </div>
  );
};
```

---

## 6. Accessibility Integration ♿

### Step 1: Add ARIA Labels

```typescript
<button
  aria-label="Start timer"
  className="..."
>
  <Play size={18} />
</button>

<div
  role="timer"
  aria-live="polite"
  aria-label="Time remaining"
>
  {formatTime(timeRemaining)}
</div>
```

### Step 2: Keyboard Navigation

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ' && e.target === document.activeElement) {
      e.preventDefault();
      handleStart(); // Space bar starts timer
    }
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave(); // Ctrl+S saves
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Step 3: High Contrast Mode

```typescript
const [highContrast, setHighContrast] = useState(false);

<div className={cn(
  highContrast ? "bg-black text-white" : "bg-white text-gray-900"
)}>
```

### Step 4: Focus Indicators

```css
/* In index.css */
*:focus {
  outline: 3px solid #10B981;
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}

*:focus-visible {
  outline: 3px solid #10B981;
  outline-offset: 2px;
}
```

---

## 📦 Required Dependencies

Install these packages:

```bash
npm install recharts
npm install @types/react-router-dom
```

---

## 🧪 Testing Checklist

### Timer:
- [ ] Timer starts when clicked
- [ ] Timer pauses correctly
- [ ] Timer resets to initial duration
- [ ] 5-minute warning appears
- [ ] 1-minute warning appears
- [ ] Session auto-ends at 0:00
- [ ] Students see same time as teacher
- [ ] Timer syncs on student join

### Assignments:
- [ ] Teacher can create assignment
- [ ] Students see assignment
- [ ] Student can submit whiteboard
- [ ] Teacher receives submission notification
- [ ] Teacher can grade submission
- [ ] Student sees grade and feedback

### Grade Book:
- [ ] All assignments listed
- [ ] Grades can be entered
- [ ] Averages calculate correctly
- [ ] Reports export to CSV/PDF

### Progress Tracking:
- [ ] Charts display correctly
- [ ] Data updates in real-time
- [ ] Individual progress visible
- [ ] Class analytics accurate

### Multi-Language:
- [ ] All text translates
- [ ] RTL layout works for Arabic
- [ ] Language persists on reload
- [ ] Switching works without reload

### Accessibility:
- [ ] Screen reader reads all elements
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] High contrast mode works
- [ ] Large text mode works

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install recharts

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📞 Support

For integration issues, check:
1. Console for errors
2. Network tab for failed requests
3. Socket.IO debug logs
4. Component props are correct

---

**Last Updated:** March 2026  
**Version:** 2.1

Made with ❤️ by **AL ASAR JADEED**
