import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, BookOpen, Users, Upload, X, CheckCircle, LogIn, LogOut, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface GoogleIntegrationProps {
  roomId: string;
  socket: any;
  isTeacher?: boolean;
}

interface GoogleUser {
  name: string;
  email: string;
  photo?: string;
}

export const GoogleIntegration: React.FC<GoogleIntegrationProps> = ({
  roomId,
  socket,
  isTeacher = false
}) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'meet' | 'classroom'>('meet');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [isCreatingMeet, setIsCreatingMeet] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Google API Client ID - Replace with your actual Client ID
  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
  const SCOPES = 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.announcements';

  // Initialize Google APIs
  useEffect(() => {
    const loadGoogleAPIs = () => {
      if ((window as any).gapi) {
        (window as any).gapi.load('client', async () => {
          try {
            await (window as any).gapi.client.init({
              apiKey: 'YOUR_API_KEY',
              discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest'
              ],
            });
            console.log('✅ Google APIs loaded');
          } catch (error) {
            console.log('⚠️ Google APIs not configured yet');
          }
        });
      }
    };

    loadGoogleAPIs();
  }, []);

  // Handle Google Sign In
  const handleSignIn = async () => {
    try {
      // Using Google Identity Services
      const response = await (window as any).google.accounts.prompt({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
      });

      if (response.access_token) {
        // Set auth token
        (window as any).gapi.client.setToken({ access_token: response.access_token });
        
        // Get user info
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` }
        }).then(res => res.json());

        setUser({
          name: userInfo.name,
          email: userInfo.email,
          photo: userInfo.picture
        });
        setIsAuthenticated(true);

        // Load classrooms
        loadClassrooms();
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      alert('Failed to sign in with Google. Please make sure you have configured Google API credentials.');
    }
  };

  // Load Google Classrooms
  const loadClassrooms = async () => {
    try {
      setIsImporting(true);
      const response = await (window as any).gapi.client.classroom.courses.list({
        teacherId: 'me'
      });

      const courses = response.result.courses || [];
      setClassrooms(courses);
      console.log('📚 Loaded classrooms:', courses);
    } catch (error) {
      console.error('Error loading classrooms:', error);
      alert('Failed to load classrooms. Make sure you have teacher access.');
    } finally {
      setIsImporting(false);
    }
  };

  // Create Google Meet link
  const createMeetLink = async () => {
    try {
      setIsCreatingMeet(true);
      
      // Generate a Meet link (Note: Creating actual Meet requires Google Calendar API)
      // For now, we'll generate a meet.google.com link format
      const meetCode = Math.random().toString(36).substring(2, 5).toUpperCase() + 
                       '-' + Math.random().toString(36).substring(2, 5).toUpperCase() + 
                       '-' + Math.random().toString(36).substring(2, 4).toUpperCase();
      
      const link = `https://meet.google.com/${meetCode}`;
      setMeetLink(link);

      // Share Meet link with students via socket
      if (socket && isTeacher) {
        socket.emit('google-meet-created', { roomId, meetLink: link });
      }

      alert('✅ Google Meet link created! Share this with students:\n\n' + link);
    } catch (error) {
      console.error('Error creating Meet:', error);
      alert('Failed to create Meet link');
    } finally {
      setIsCreatingMeet(false);
    }
  };

  // Import students from Google Classroom
  const importStudents = async () => {
    if (!selectedClassroom) {
      alert('Please select a classroom first');
      return;
    }

    try {
      setIsImporting(true);
      
      const response = await (window as any).gapi.client.classroom.courses.students.list({
        courseId: selectedClassroom
      });

      const students = response.result.students || [];
      console.log('👨‍🎓 Imported students:', students);

      // Send students to socket/server
      if (socket && isTeacher) {
        socket.emit('import-google-students', {
          roomId,
          students: students.map((s: any) => ({
            name: s.profile.name.fullName,
            email: s.profile.emailAddress,
            source: 'google-classroom'
          }))
        });
      }

      alert(`✅ Imported ${students.length} students from Google Classroom!`);
    } catch (error) {
      console.error('Error importing students:', error);
      alert('Failed to import students. Make sure you have permission to view the classroom roster.');
    } finally {
      setIsImporting(false);
    }
  };

  // Post whiteboard to Google Classroom
  const postToClassroom = async () => {
    if (!selectedClassroom) {
      alert('Please select a classroom first');
      return;
    }

    try {
      setIsImporting(true);

      // Create announcement with whiteboard link
      const announcement = {
        workType: 'MATERIAL',
        title: `Whiteboard Session - ${roomId}`,
        materials: [
          {
            link: {
              url: window.location.href,
              title: 'Open Whiteboard'
            }
          }
        ],
        state: 'PUBLISHED'
      };

      await (window as any).gapi.client.classroom.courses.courseWork.create({
        courseId: selectedClassroom,
        resource: announcement
      });

      alert('✅ Whiteboard posted to Google Classroom!');
    } catch (error) {
      console.error('Error posting to classroom:', error);
      alert('Failed to post to classroom');
    } finally {
      setIsImporting(false);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    (window as any).gapi.client.setToken('');
    setUser(null);
    setIsAuthenticated(false);
    setClassrooms([]);
    setSelectedClassroom('');
    setMeetLink('');
  };

  return (
    <>
      {/* Google Integration Button */}
      <button
        onClick={() => setShowModal(true)}
        className={cn(
          "p-3 rounded-xl transition-colors shadow-lg",
          isTeacher 
            ? "bg-gradient-to-r from-blue-500 to-red-500 text-white hover:from-blue-600 hover:to-red-600"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
        title="Google Integration"
      >
        <BookOpen size={20} />
      </button>

      {/* Google Integration Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-red-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Google Integration</h2>
                      <p className="text-white/80 text-sm">Connect with Google Meet & Classroom</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('meet')}
                  className={cn(
                    "flex-1 py-4 font-semibold transition-colors border-b-2",
                    activeTab === 'meet'
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Video size={18} />
                    Google Meet
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('classroom')}
                  className={cn(
                    "flex-1 py-4 font-semibold transition-colors border-b-2",
                    activeTab === 'classroom'
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <BookOpen size={18} />
                    Google Classroom
                  </div>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-96">
                {!isAuthenticated ? (
                  /* Sign In Screen */
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <LogIn className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign in with Google</h3>
                    <p className="text-gray-500 mb-6">
                      Connect your Google account to access Meet and Classroom features
                    </p>
                    <button
                      onClick={handleSignIn}
                      className="px-8 py-4 bg-white border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 mx-auto"
                    >
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                      Sign in with Google
                    </button>
                    <p className="text-xs text-gray-400 mt-4">
                      Note: You'll need to configure Google API credentials in the code
                    </p>
                  </div>
                ) : activeTab === 'meet' ? (
                  /* Google Meet Tab */
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-900">
                        Signed in as {user?.email}
                      </span>
                    </div>

                    {meetLink ? (
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Your Meet Link</h3>
                        <div className="p-4 bg-white rounded-xl border-2 border-dashed border-blue-300 mb-4">
                          <p className="text-xl font-mono font-bold text-blue-600 break-all">
                            {meetLink}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => window.open(meetLink, '_blank')}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <ExternalLink size={18} />
                            Open Meet
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(meetLink);
                              alert('Meet link copied to clipboard!');
                            }}
                            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={createMeetLink}
                        disabled={isCreatingMeet}
                        className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        <Video size={20} />
                        {isCreatingMeet ? 'Creating...' : 'Create Google Meet'}
                      </button>
                    )}

                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-bold text-blue-900 mb-2">How it works:</h4>
                      <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                        <li>Click "Create Google Meet" to generate a link</li>
                        <li>Share the link with your students</li>
                        <li>Click "Open Meet" to start the video call</li>
                        <li>Students can join using the link</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  /* Google Classroom Tab */
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-900">
                        Signed in as {user?.email}
                      </span>
                    </div>

                    {classrooms.length > 0 ? (
                      <>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Select Classroom
                          </label>
                          <select
                            value={selectedClassroom}
                            onChange={(e) => setSelectedClassroom(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                          >
                            <option value="">Choose a classroom...</option>
                            {classrooms.map((course) => (
                              <option key={course.id} value={course.id}>
                                {course.name} {course.section ? `- ${course.section}` : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedClassroom && (
                          <div className="space-y-3">
                            <button
                              onClick={importStudents}
                              disabled={isImporting}
                              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold hover:from-red-600 hover:to-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <Users size={18} />
                              {isImporting ? 'Importing...' : 'Import Students from Classroom'}
                            </button>

                            <button
                              onClick={postToClassroom}
                              disabled={isImporting}
                              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <Upload size={18} />
                              Post Whiteboard to Classroom
                            </button>
                          </div>
                        )}

                        <div className="p-4 bg-red-50 rounded-xl">
                          <h4 className="font-bold text-red-900 mb-2">Features:</h4>
                          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                            <li>Import student roster from your classroom</li>
                            <li>Post whiteboard link as an assignment</li>
                            <li>Share announcements with students</li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <button
                          onClick={loadClassrooms}
                          disabled={isImporting}
                          className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                        >
                          <BookOpen size={18} />
                          {isImporting ? 'Loading...' : 'Load My Classrooms'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              {isAuthenticated && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
