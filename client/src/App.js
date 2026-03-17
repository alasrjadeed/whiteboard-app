import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const [isTeacher, setIsTeacher] = useState(true);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  const joinRoom = () => {
    if (!roomId || !name) return;
    const newSocket = io(window.location.origin);
    setSocket(newSocket);
    newSocket.emit('join-room', { roomId, userId: name, isTeacher });
    setConnected(true);
  };

  return (
    <div className="app">
      <nav class="navbar navbar-dark mb-4">
        <div class="container">
          <span class="navbar-brand">🎈 Whiteboard AL ASER JADEED</span>
        </div>
      </nav>
      <div class="container">
        {!connected ? (
          <div class="card">
            <div class="card-body">
              <h3>Join a Whiteboard Session</h3>
              <div class="mb-3">
                <label>Room ID</label>
                <input type="text" class="form-control" value={roomId} onChange={e => setRoomId(e.target.value.toUpperCase())} placeholder="ENTER123" />
              </div>
              <div class="mb-3">
                <label>Your Name</label>
                <input type="text" class="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
              </div>
              <div class="mb-3">
                <label>I am:</label>
                <div>
                  <button class="btn me-2 btn-primary" onClick={() => setIsTeacher(true)}>Teacher</button>
                  <button class="btn me-2 btn-secondary" onClick={() => setIsTeacher(false)}>Student</button>
                </div>
              </div>
              <button class="btn btn-success lg" onClick={joinRoom}>Join Whiteboard</button>
            </div>
          </div>
        ) : (
          <div class="alert alert-success">
            Connected to room: {roomId} as {isTeacher ? 'Teacher' : 'Student'}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;