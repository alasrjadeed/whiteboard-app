import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { motion, AnimatePresence } from 'motion/react';
import { Video, VideoOff, Mic, MicOff, Maximize2, Minimize2, User, Monitor, Share2, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface VideoChatProps {
  roomId: string;
  socket: any;
  userId: string;
  userName: string;
  peers: Record<string, { name: string }>;
  darkMode?: boolean;
  isTeacher?: boolean;
}

export const VideoChat: React.FC<VideoChatProps> = ({
  roomId, socket, userId, userName, peers: roomPeers, darkMode, isTeacher
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Record<string, { peer: Peer.Instance; stream?: MediaStream; screenStream?: MediaStream; name: string }>>({});
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAllScreens, setShowAllScreens] = useState(false);

  const myVideo = useRef<HTMLVideoElement>(null);
  const screenVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<Record<string, Peer.Instance>>({});

  useEffect(() => {
    if (isVideoOn || isAudioOn) {
      navigator.mediaDevices.getUserMedia({ video: isVideoOn, audio: isAudioOn })
        .then(currentStream => {
          setStream(currentStream);
          if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
          }

          // When we get our stream, we notify others we are ready to connect
          socket.emit('ready-for-video', { roomId });
        })
        .catch(err => console.error("Failed to get local stream", err));
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOn, isAudioOn]);

  useEffect(() => {
    socket.on('signal', ({ from, signal }: { from: string, signal: any }) => {
      if (peersRef.current[from]) {
        peersRef.current[from].signal(signal);
      } else {
        // Create a new peer in response to a signal (receiver)
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream || undefined,
        });

        peer.on('signal', signal => {
          socket.emit('signal', { roomId, to: from, signal });
        });

        peer.on('stream', remoteStream => {
          setPeers(prev => ({
            ...prev,
            [from]: { ...prev[from], peer, stream: remoteStream, name: roomPeers[from]?.name || 'Student' }
          }));
        });

        peer.signal(signal);
        peersRef.current[from] = peer;
      }
    });

    socket.on('user-ready-for-video', ({ userId: remoteUserId }: { userId: string }) => {
      if (remoteUserId === socket.id) return;
      
      // We are the initiator for users who just became ready
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream || undefined,
      });

      peer.on('signal', signal => {
        socket.emit('signal', { roomId, to: remoteUserId, signal });
      });

      peer.on('stream', remoteStream => {
        setPeers(prev => ({
          ...prev,
          [remoteUserId]: { ...prev[remoteUserId], peer, stream: remoteStream, name: roomPeers[remoteUserId]?.name || 'Student' }
        }));
      });

      peersRef.current[remoteUserId] = peer;
    });

    socket.on('user-disconnected', (id: string) => {
      if (peersRef.current[id]) {
        peersRef.current[id].destroy();
        delete peersRef.current[id];
        setPeers(prev => {
          const newPeers = { ...prev };
          delete newPeers[id];
          return newPeers;
        });
      }
    });

    return () => {
      socket.off('signal');
      socket.off('user-ready-for-video');
      socket.off('user-disconnected');
    };
  }, [stream, roomPeers]);

  const toggleVideo = () => setIsVideoOn(!isVideoOn);
  const toggleAudio = () => setIsAudioOn(!isAudioOn);
  
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screen = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: false 
        });
        setScreenStream(screen);
        setIsScreenSharing(true);
        
        // Send screen stream to peers
        Object.values(peersRef.current).forEach(peer => {
          const sender = peer._pc?.getSenders()?.find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screen.getVideoTracks()[0]);
          }
        });
        
        screen.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      } catch (err) {
        console.error('Failed to share screen:', err);
      }
    } else {
      stopScreenShare();
    }
  };
  
  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      
      // Switch back to camera
      if (stream) {
        Object.values(peersRef.current).forEach(peer => {
          const sender = peer._pc?.getSenders()?.find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(stream.getVideoTracks()[0]);
          }
        });
      }
    }
  };
  
  const viewAllScreens = () => {
    setShowAllScreens(!showAllScreens);
  };

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-[60] flex flex-col gap-2 transition-all",
      isMinimized ? "w-16 h-16" : "w-72"
    )}>
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              "rounded-3xl shadow-2xl border overflow-hidden flex flex-col",
              darkMode ? "bg-stone-900 border-white/10" : "bg-white border-black/5"
            )}
          >
            {/* Header */}
            <div className="p-3 border-b flex items-center justify-between bg-black/5">
              <span className="text-xs font-bold uppercase tracking-widest opacity-50">Video Chat</span>
              <button 
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-black/5 rounded-lg transition-colors"
              >
                <Minimize2 size={14} />
              </button>
            </div>

            {/* Video Grid */}
            <div className="p-2 grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {/* My Video */}
              <div className="aspect-video bg-black rounded-xl overflow-hidden relative group">
                {isVideoOn ? (
                  <video
                    ref={myVideo}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover mirror"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <User size={24} />
                  </div>
                )}
                <div className="absolute bottom-1 left-1 bg-black/60 px-2 py-0.5 rounded-md text-[10px] text-white font-bold">
                  You
                </div>
              </div>

              {/* Peer Videos */}
              {Object.entries(peers).map(([id, peerData]) => (
                <div key={id} className="aspect-video bg-black rounded-xl overflow-hidden relative">
                  {peerData.stream ? (
                    <VideoElement stream={peerData.stream} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <User size={24} />
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 bg-black/60 px-2 py-0.5 rounded-md text-[10px] text-white font-bold truncate max-w-[80%]">
                    {peerData.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="p-3 border-t flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={toggleVideo}
                className={cn(
                  "p-2.5 rounded-2xl transition-all",
                  isVideoOn ? "bg-emerald-500 text-white" : "bg-red-500/10 text-red-500"
                )}
                title={isVideoOn ? "Turn off camera" : "Turn on camera"}
              >
                {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
              </button>
              <button
                onClick={toggleAudio}
                className={cn(
                  "p-2.5 rounded-2xl transition-all",
                  isAudioOn ? "bg-emerald-500 text-white" : "bg-red-500/10 text-red-500"
                )}
                title={isAudioOn ? "Mute microphone" : "Unmute microphone"}
              >
                {isAudioOn ? <Mic size={18} /> : <MicOff size={18} />}
              </button>
              <button
                onClick={toggleScreenShare}
                className={cn(
                  "p-2.5 rounded-2xl transition-all",
                  isScreenSharing ? "bg-blue-500 text-white" : "bg-blue-500/10 text-blue-500"
                )}
                title={isScreenSharing ? "Stop screen share" : "Share your screen"}
              >
                <Share2 size={18} />
              </button>
              {isTeacher && (
                <button
                  onClick={viewAllScreens}
                  className={cn(
                    "p-2.5 rounded-2xl transition-all",
                    showAllScreens ? "bg-purple-500 text-white" : "bg-purple-500/10 text-purple-500"
                  )}
                  title="View all student screens"
                >
                  <Monitor size={18} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen View All Screens Modal */}
      <AnimatePresence>
        {showAllScreens && isTeacher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 p-4 overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Monitor size={28} className="text-purple-500" />
                  All Student Screens
                </h2>
                <button
                  onClick={() => setShowAllScreens(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                  <X size={28} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* My Screen */}
                {screenStream && (
                  <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
                    <video
                      ref={screenVideo}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded-md text-xs text-white font-bold">
                      Your Screen
                    </div>
                  </div>
                )}
                
                {/* Student Screens */}
                {Object.entries(peers).map(([id, peerData]) => (
                  <div key={id} className="aspect-video bg-black rounded-xl overflow-hidden relative">
                    {peerData.screenStream ? (
                      <VideoElement stream={peerData.screenStream} />
                    ) : peerData.stream ? (
                      <VideoElement stream={peerData.stream} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <User size={32} />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded-md text-xs text-white font-bold truncate max-w-[80%]">
                      {peerData.name}
                    </div>
                    {peerData.screenStream && (
                      <div className="absolute top-2 right-2 bg-blue-500 px-2 py-0.5 rounded-md text-[10px] text-white font-bold">
                        Sharing
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {Object.keys(peers).length === 0 && (
                <div className="text-center text-white/40 py-20">
                  <User size={64} className="mx-auto mb-4" />
                  <p className="text-xl">No students connected yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Button */}
      {isMinimized && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsMinimized(false)}
          className={cn(
            "w-16 h-16 rounded-full shadow-2xl border flex items-center justify-center transition-all hover:scale-110",
            darkMode ? "bg-stone-900 border-white/10 text-white" : "bg-white border-black/5 text-black"
          )}
        >
          <div className="relative">
            <Video size={24} />
            {(isVideoOn || isAudioOn || isScreenSharing) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            )}
          </div>
        </motion.button>
      )}
    </div>
  );
};

const VideoElement = ({ stream }: { stream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full h-full object-cover"
    />
  );
};
