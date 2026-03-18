import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 4173;

  const rooms: Record<string, any> = {};

  io.on("connection", (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on("join-room", ({ roomId, name, role }) => {
      console.log('🚪 Join room:', roomId, 'by', name, 'as', role);
      
      if (!rooms[roomId]) {
        console.log('🆕 Creating new room:', roomId);
        rooms[roomId] = { 
          teacherId: null, 
          students: {}, 
          waiting: {}, 
          isLocked: false, 
          hideNames: false,
          attendance: {},
          startTime: null
        };
      }

      // Track attendance - record join time
      if (!rooms[roomId].attendance[socket.id]) {
        rooms[roomId].attendance[socket.id] = {
          name,
          role,
          joinedAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          status: 'present'
        };
      }

      // Teacher rejoin logic (when teacher refreshes page)
      if (role === "teacher" && rooms[roomId].teacherId) {
        console.log('👨‍🏫 Teacher rejoining room:', roomId);
        // Update teacher socket ID
        rooms[roomId].teacherId = socket.id;
        rooms[roomId].teacherName = name;
        socket.join(roomId);
        socket.emit("room-state", {
          students: rooms[roomId].students,
          waiting: rooms[roomId].waiting,
          isLocked: rooms[roomId].isLocked,
          hideNames: rooms[roomId].hideNames,
          teacherName: name,
          teacherId: socket.id
        });
        // Notify students that teacher reconnected
        io.to(roomId).emit("teacher-reconnected", { teacherId: socket.id });
        return;
      }

      if (role === "student" && rooms[roomId].isLocked) {
        console.log('⏳ Student waiting (room locked):', name);
        rooms[roomId].waiting[socket.id] = { name };
        socket.emit("waiting-room");
        if (rooms[roomId].teacherId) {
          io.to(rooms[roomId].teacherId).emit("student-waiting", { id: socket.id, name });
        }
        return;
      }

      socket.join(roomId);
      if (role === "teacher") {
        console.log('👨‍🏫 Teacher joined room:', roomId);
        rooms[roomId].teacherId = socket.id;
        rooms[roomId].teacherName = name;
        rooms[roomId].startTime = new Date().toISOString();
        socket.emit("room-state", {
          students: rooms[roomId].students,
          waiting: rooms[roomId].waiting,
          isLocked: rooms[roomId].isLocked,
          hideNames: rooms[roomId].hideNames,
          teacherName: name,
          teacherId: socket.id,
          attendance: rooms[roomId].attendance,
          assignments: rooms[roomId].assignments || [],
          presentations: rooms[roomId].presentations || []
        });
      } else {
        console.log('🎓 Student joined room:', roomId, 'name:', name);
        rooms[roomId].students[socket.id] = { id: socket.id, name, lines: [], lastActive: new Date().toISOString() };
        socket.emit("room-state", {
          students: rooms[roomId].students,
          waiting: rooms[roomId].waiting,
          isLocked: rooms[roomId].isLocked,
          hideNames: rooms[roomId].hideNames,
          teacherName: rooms[roomId].teacherName,
          teacherId: rooms[roomId].teacherId,
          attendance: rooms[roomId].attendance,
          assignments: rooms[roomId].assignments || [],
          presentations: rooms[roomId].presentations || []
        });
        if (rooms[roomId].teacherId) {
          console.log('📢 Notifying teacher about student:', name);
          io.to(rooms[roomId].teacherId).emit("student-joined", {
            id: socket.id,
            name,
            lines: [],
            joinedAt: rooms[roomId].attendance[socket.id]?.joinedAt
          });
        } else {
          console.log('⚠️ No teacher in room yet');
        }
      }
    });

    socket.on("approve-student", ({ roomId, studentId }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id && rooms[roomId].waiting[studentId]) {
        const student = rooms[roomId].waiting[studentId];
        delete rooms[roomId].waiting[studentId];
        
        io.to(studentId).emit("approved");
        io.to(socket.id).emit("waiting-updated", rooms[roomId].waiting);
      }
    });

    socket.on("reject-student", ({ roomId, studentId }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id && rooms[roomId].waiting[studentId]) {
        delete rooms[roomId].waiting[studentId];
        io.to(studentId).emit("error", "Your request to join was declined.");
        io.to(socket.id).emit("waiting-updated", rooms[roomId].waiting);
      }
    });

    socket.on("remove-student", ({ roomId, studentId }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        delete rooms[roomId].students[studentId];
        io.to(studentId).emit("error", "You have been removed from the session.");
        io.to(socket.id).emit("student-left", studentId);
      }
    });

    socket.on("lock-room", ({ roomId, locked }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        rooms[roomId].isLocked = locked;
        io.to(roomId).emit("room-locked", locked);
      }
    });

    socket.on("push-board", ({ roomId, lines }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        console.log('📤 Teacher pushing board to', Object.keys(rooms[roomId].students).length, 'students');
        // Update all students' lines with the teacher's board
        for (const studentId in rooms[roomId].students) {
          rooms[roomId].students[studentId].lines = lines;
        }
        // Send to all students in the room
        io.to(roomId).emit("pushed-board", lines);
        console.log('✅ Board pushed successfully');
      } else {
        console.log('❌ Push board failed: Not teacher or room not found');
      }
    });

    socket.on("clear-all-students", ({ roomId }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        for (const studentId in rooms[roomId].students) {
          rooms[roomId].students[studentId].lines = [];
        }
        socket.to(roomId).emit("clear-board");
      }
    });

    socket.on("clear-all-boards", ({ roomId }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        Object.keys(rooms[roomId].students).forEach(id => {
          rooms[roomId].students[id].lines = [];
        });
        io.to(roomId).emit("all-boards-cleared");
      }
    });

    socket.on("spotlight", ({ roomId, studentId }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        io.to(roomId).emit("spotlight", studentId);
      }
    });

    socket.on("laser-pointer", ({ roomId, laserLine }) => {
      socket.to(roomId).emit("laser-pointer", laserLine);
    });

    socket.on("update-notes", ({ roomId, notes }) => {
      if (rooms[roomId]) {
        rooms[roomId].notes = notes;
        socket.to(roomId).emit("notes-updated", notes);
      }
    });

    socket.on("start-poll", ({ roomId, poll }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        rooms[roomId].currentPoll = { ...poll, results: {} };
        io.to(roomId).emit("poll-started", rooms[roomId].currentPoll);
      }
    });

    socket.on("vote-poll", ({ roomId, optionIndex }) => {
      if (rooms[roomId] && rooms[roomId].currentPoll) {
        const poll = rooms[roomId].currentPoll;
        poll.results[optionIndex] = (poll.results[optionIndex] || 0) + 1;
        io.to(roomId).emit("poll-updated", poll);
      }
    });

    socket.on("end-poll", ({ roomId }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        rooms[roomId].currentPoll = null;
        io.to(roomId).emit("poll-ended");
      }
    });

    socket.on("share-video", ({ roomId, url }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        rooms[roomId].externalVideoUrl = url;
        io.to(roomId).emit("video-shared", url);
      }
    });

    socket.on("set-status", ({ roomId, status }) => {
      if (rooms[roomId]) {
        if (!rooms[roomId].statuses) rooms[roomId].statuses = {};
        rooms[roomId].statuses[socket.id] = status;
        if (rooms[roomId].teacherId) {
          io.to(rooms[roomId].teacherId).emit("status-updated", { id: socket.id, status });
        }
      }
    });

    socket.on("private-message", ({ roomId, to, message }) => {
      if (rooms[roomId]) {
        const fromName = rooms[roomId].teacherId === socket.id ? "Teacher" : (rooms[roomId].students[socket.id]?.name || "Student");
        socket.to(to).emit("private-message", { from: socket.id, fromName, message });
      }
    });

    socket.on("signal", ({ roomId, to, signal }) => {
      socket.to(to).emit("signal", { from: socket.id, signal });
    });

    socket.on("ready-for-video", ({ roomId }) => {
      socket.to(roomId).emit("user-ready-for-video", { userId: socket.id });
    });

    socket.on("toggle-privacy", ({ roomId, hideNames }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        rooms[roomId].hideNames = hideNames;
        socket.emit("privacy-updated", hideNames);
      }
    });

    socket.on("draw", ({ roomId, lines }) => {
      // Update last active time for attendance
      if (rooms[roomId] && rooms[roomId].attendance[socket.id]) {
        rooms[roomId].attendance[socket.id].lastActive = new Date().toISOString();
      }
      
      if (rooms[roomId] && rooms[roomId].students[socket.id]) {
        rooms[roomId].students[socket.id].lines = lines;
        rooms[roomId].students[socket.id].lastActive = new Date().toISOString();
        if (rooms[roomId].teacherId) {
          // Send live update ONLY to teacher (not to other students)
          io.to(rooms[roomId].teacherId).emit("student-update", {
            id: socket.id,
            lines,
            lastActive: rooms[roomId].students[socket.id].lastActive
          });
        }
      }
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        socket.to(roomId).emit("teacher-draw", lines);
      }
    });

    // Get attendance report
    socket.on("get-attendance", ({ roomId }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        socket.emit("attendance-report", {
          attendance: rooms[roomId].attendance,
          startTime: rooms[roomId].startTime,
          studentCount: Object.keys(rooms[roomId].students).length
        });
      }
    });

    // Export attendance to CSV
    socket.on("export-attendance", ({ roomId }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        const attendance = rooms[roomId].attendance;
        const csvRows = [['Student Name', 'Role', 'Status', 'Joined At', 'Last Active']];
        
        Object.values(attendance).forEach((a: any) => {
          csvRows.push([
            a.name,
            a.role,
            a.status,
            new Date(a.joinedAt).toLocaleString(),
            new Date(a.lastActive).toLocaleString()
          ]);
        });
        
        const csv = csvRows.map(row => row.join(',')).join('\n');
        socket.emit("attendance-csv", { csv, filename: `attendance-${roomId}-${new Date().toISOString().split('T')[0]}.csv` });
      }
    });

    // Teacher requests to view specific student's board live
    socket.on("view-student-board", ({ roomId, studentId }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        const student = rooms[roomId].students[studentId];
        if (student) {
          socket.emit("student-board-live", {
            studentId,
            studentName: student.name,
            lines: student.lines,
            lastActive: student.lastActive
          });
        }
      }
    });

    // Google Meet created
    socket.on("google-meet-created", ({ roomId, meetLink }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        io.to(roomId).emit("google-meet-created", { meetLink });
        console.log(`📹 Google Meet created for room ${roomId}: ${meetLink}`);
      }
    });

    // Import Google Classroom students
    socket.on("import-google-students", ({ roomId, students }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        console.log(`👨‍🎓 Importing ${students.length} students from Google Classroom`);
        // Store imported students info in room
        if (!rooms[roomId].googleStudents) {
          rooms[roomId].googleStudents = [];
        }
        rooms[roomId].googleStudents.push(...students);
        // Notify teacher
        socket.emit("google-students-imported", { count: students.length });
      }
    });

    socket.on("clear-board", ({ roomId }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        socket.to(roomId).emit("clear-board");
      }
    });

    socket.on("feedback", ({ roomId, studentId, feedback }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        io.to(studentId).emit("feedback", feedback);
      }
    });

    // Assignment system handlers
    socket.on("create-assignment", ({ roomId, assignment }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        if (!rooms[roomId].assignments) {
          rooms[roomId].assignments = [];
        }
        rooms[roomId].assignments.push(assignment);
        io.to(roomId).emit("assignment-created", assignment);
        console.log(`📚 Assignment created: ${assignment.title}`);
      }
    });

    // Public chat handler
    socket.on("public-message", ({ roomId, message }) => {
      if (rooms[roomId]) {
        io.to(roomId).emit("public-message", { message });
        console.log(`💬 Public message in ${roomId}: ${message.from}`);
      }
    });

    // Presentation upload handler
    socket.on("upload-presentation", ({ roomId, presentation }) => {
      if (rooms[roomId]) {
        if (!rooms[roomId].presentations) {
          rooms[roomId].presentations = [];
        }
        rooms[roomId].presentations.push(presentation);
        io.to(roomId).emit("presentation-uploaded", { presentation });
        console.log(`📊 Presentation uploaded: ${presentation.name}`);
      }
    });

    socket.on("submit-assignment", ({ roomId, submission }) => {
      if (rooms[roomId]) {
        const assignment = rooms[roomId].assignments?.find(a => a.id === submission.assignmentId);
        if (assignment) {
          // Store submission
          if (!assignment.submissions) {
            assignment.submissions = {};
          }
          assignment.submissions[submission.studentId] = submission;
          
          // Notify teacher
          io.to(rooms[roomId].teacherId).emit("assignment-submitted", {
            assignmentId: submission.assignmentId,
            studentId: submission.studentId,
            studentName: submission.studentName,
            submittedAt: submission.submittedAt
          });
          console.log(`📝 Assignment submitted by ${submission.studentName}`);
        }
      }
    });

    socket.on("grade-submission", ({ roomId, submissionId, assignmentId, grade, feedback }) => {
      if (rooms[roomId] && rooms[roomId].teacherId === socket.id) {
        const assignment = rooms[roomId].assignments?.find(a => a.id === assignmentId);
        if (assignment && assignment.submissions?.[submissionId]) {
          // Update submission with grade
          assignment.submissions[submissionId].grade = grade;
          assignment.submissions[submissionId].feedback = feedback;
          
          // Notify student
          io.to(roomId).emit("assignment-graded", {
            assignmentId,
            submissionId,
            grade,
            feedback
          });
          console.log(`📊 Assignment graded: ${grade}`);
        }
      }
    });

    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        if (rooms[roomId].teacherId === socket.id) rooms[roomId].teacherId = null;
        if (rooms[roomId].students[socket.id]) {
          delete rooms[roomId].students[socket.id];
          if (rooms[roomId].teacherId) io.to(rooms[roomId].teacherId).emit("student-left", socket.id);
        }
        if (!rooms[roomId].teacherId && Object.keys(rooms[roomId].students).length === 0) delete rooms[roomId];
      }
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
