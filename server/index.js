const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const QRCode = require('qrrcode');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

const PORT = process.env.PORT || 3000;
const rooms = new Map();
const studentBoards = new Map();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/qr/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const url = req.protocol + ':' + req.get('host') + '/?room=' + roomId;
  try {
    const qrCode = await QRCode.toDataURL(url);
    res.json({ qrCode, url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.get('/api/rooms/:roomId/boards', (req, res) => {
  const { roomId } = req.params;
  res.json({ boards: studentBoards.get(roomId) || {} });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, userId, isTeacher }) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) rooms.set(roomId, { teacher: null, students: [], settings: {} });
    const room = rooms.get(roomId);
    if (isTeacher) {
      room.teacher = socket.id;
      console.log('Teacher', userId,'created room', roomId);
    } else {
      room.students.push({ id: socket.id, userId, name: userId });
      console.log('Student', userId,'joined room', roomId);
    }
    socket.emit('room-state', { roomId, isTeacher: socket.id === room.teacher, students: room.students });
    socket.to(roomId).emit('user-joined', { userId, isTeacher });
  });

  socket.on('draw', (data) => socket.to(data.roomId).emit('draw', data));
  socket.on('save-board', ({ roomId, studentId, boardData }) => {
    if (!studentBoards.has(roomId)) studentBoards.set(roomId, {});
    studentBoards.get(roomId)[studentId] = boardData;
    io.to(roomId).emit('board-updated', { studentId, boardData });
  });
  socket.on('clear-board', (data) => socket.to(data.roomId).emit('clear-board', data));
  socket.on('push-board', (data) => io.to(data.roomId).emit('push-board', data));
  socket.on('send-feedback', (data) => io.to(data.roomId).emit('receive-feedback', data));
  socket.on('upload-image', (data) => socket.to(data.roomId).emit('upload-image', data));
  socket.on('lock-room', (roomId) => { const r = rooms.get(roomId); if (r) { r.settings.locked = true; io.to(roomId).emit('room-locked'); } });
  socket.on('unlock-room', (roomId) => { const r = rooms.get(roomId); if (r) { r.settings.locked = false; io.to(roomId).emit('room-unlocked'); } });
  socket.on('clear-all-boards', (roomId) => { studentBoards.delete(roomId); io.to(roomId).emit('all-boards-cleared'); });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    rooms.forEach((room, roomId) => {
      if (room.teacher === socket.id) { io.to(roomId).emit('teacher-left'); rooms.delete(roomId); }
      else { room.students = room.students.filter(s => s.id !== socket.id); socket.to(roomId).emit('student-left', { userId: socket.id }); }
    });
  });
});

server.listen(PORT, () => {
  console.log('🎠 Whiteboard AL ASAR JADEED running on port', PORT);
  console.log('👚 Open http://localhost:' + PORT);
});