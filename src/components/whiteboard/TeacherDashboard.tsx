import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StudentWhiteboard } from './StudentWhiteboard';
import { X, Maximize2, Save, Trash2, Copy, UserX, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface StudentBoard {
  id: string;
  name: string;
  lines: any[];
  lastActive: Date;
  status: 'active' | 'idle' | 'offline';
}

interface TeacherDashboardProps {
  roomId: string;
  socket: any;
  students: StudentBoard[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  roomId,
  socket,
  students
}) => {
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const handleSaveStudentBoard = (studentId: string) => {
    // Save student board
    console.log('Saving board for student:', studentId);
  };

  const handleClearStudentBoard = (studentId: string) => {
    // Clear student board
    console.log('Clearing board for student:', studentId);
  };

  const handleCopyStudentWork = (studentId: string) => {
    // Copy student work to clipboard
    console.log('Copying work from student:', studentId);
  };

  const handleRemoveStudent = (studentId: string) => {
    // Remove student from session
    console.log('Removing student:', studentId);
  };

  const handleGiveFeedback = (studentId: string, type: 'positive' | 'negative' | 'comment') => {
    // Give feedback to student
    console.log('Giving feedback to student:', studentId, type);
  };

  const expandedStudentData = students.find(s => s.id === expandedStudent);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Boards</h2>
          <p className="text-gray-500 mt-1">Monitor all students in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-emerald-700">
              {students.filter(s => s.status === 'active').length} Active
            </span>
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {students.map((student) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Student Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {student.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        student.status === 'active' ? "bg-emerald-500 animate-pulse" :
                        student.status === 'idle' ? "bg-amber-500" : "bg-gray-400"
                      )} />
                      <span className="text-xs text-gray-500 capitalize">{student.status}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedStudent(student.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Expand"
                >
                  <Maximize2 size={16} />
                </button>
              </div>

              {/* Board Preview */}
              <div className="aspect-video bg-gray-50 relative overflow-hidden">
                {student.lines.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                    No content yet
                  </div>
                ) : (
                  <div className="p-2">
                    <div className="text-xs text-gray-600">
                      {student.lines.length} elements
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1 px-4 py-2 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => handleGiveFeedback(student.id, 'positive')}
                  className="flex-1 p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
                  title="Thumbs Up"
                >
                  <ThumbsUp size={16} />
                </button>
                <button
                  onClick={() => handleGiveFeedback(student.id, 'negative')}
                  className="flex-1 p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  title="Needs Help"
                >
                  <ThumbsDown size={16} />
                </button>
                <button
                  onClick={() => handleGiveFeedback(student.id, 'comment')}
                  className="flex-1 p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                  title="Add Comment"
                >
                  <MessageSquare size={16} />
                </button>
                <button
                  onClick={() => handleSaveStudentBoard(student.id)}
                  className="flex-1 p-2 hover:bg-purple-50 rounded-lg transition-colors text-purple-600"
                  title="Save Board"
                >
                  <Save size={16} />
                </button>
              </div>

              {/* Advanced Actions */}
              <div className="flex items-center gap-1 px-4 py-2 border-t border-gray-100 bg-white">
                <button
                  onClick={() => handleCopyStudentWork(student.id)}
                  className="flex-1 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 text-xs"
                  title="Copy Work"
                >
                  Copy
                </button>
                <button
                  onClick={() => handleClearStudentBoard(student.id)}
                  className="flex-1 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 text-xs"
                  title="Clear Board"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleRemoveStudent(student.id)}
                  className="flex-1 p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 text-xs"
                  title="Remove Student"
                >
                  <UserX size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Elements</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {student.name[0]}
                      </div>
                      <span className="font-semibold text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        student.status === 'active' ? "bg-emerald-500 animate-pulse" :
                        student.status === 'idle' ? "bg-amber-500" : "bg-gray-400"
                      )} />
                      <span className="text-sm text-gray-600 capitalize">{student.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{student.lines.length} elements</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {student.lastActive.toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedStudent(student.id)}
                        className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
                        title="View Board"
                      >
                        <Maximize2 size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveStudent(student.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        title="Remove"
                      >
                        <UserX size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expanded Student Board */}
      <AnimatePresence>
        {expandedStudentData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setExpandedStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <StudentWhiteboard
                roomId={roomId}
                studentId={expandedStudentData.id}
                studentName={expandedStudentData.name}
                socket={socket}
                isTeacherView={true}
                isExpanded={true}
                onClose={() => setExpandedStudent(null)}
                initialLines={expandedStudentData.lines}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
