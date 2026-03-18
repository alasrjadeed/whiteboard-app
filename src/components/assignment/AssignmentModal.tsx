import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Clock, AlertCircle, Save, Send, FileText, Calendar, Award } from 'lucide-react';
import { cn } from '../lib/utils';

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  status: 'active' | 'completed' | 'expired';
}

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  socket: any;
  isTeacher?: boolean;
  currentBoard?: any[];
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  roomId,
  socket,
  isTeacher = false,
  currentBoard = []
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('list');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create assignment form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState(100);

  // Load assignments on open
  useEffect(() => {
    if (!isOpen || !socket) return;

    const handleAssignmentsList = ({ assignments: loadedAssignments }: { assignments: Assignment[] }) => {
      setAssignments(loadedAssignments);
    };

    socket.emit('assignments-list', { roomId });
    socket.on('assignments-list', handleAssignmentsList);

    return () => {
      socket.off('assignments-list', handleAssignmentsList);
    };
  }, [isOpen, socket, roomId]);

  const handleCreateAssignment = () => {
    if (!title.trim() || !dueDate) return;

    const newAssignment: Assignment = {
      id: Date.now(),
      title,
      description,
      dueDate,
      points,
      status: 'active'
    };

    socket.emit('assignment-create', {
      roomId,
      assignment: newAssignment
    });

    setAssignments(prev => [...prev, newAssignment]);
    setTitle('');
    setDescription('');
    setDueDate('');
    setPoints(100);
    setActiveTab('list');
  };

  const handleSubmitAssignment = () => {
    if (!selectedAssignment) return;

    setIsSubmitting(true);
    
    socket.emit('assignment-submit', {
      roomId,
      assignmentId: selectedAssignment.id,
      boardSnapshot: currentBoard,
      submissionTime: new Date().toISOString()
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedAssignment(null);
      onClose();
      alert('Assignment submitted successfully!');
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={cn(
          "w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col",
          isTeacher ? "h-[600px]" : "h-[500px]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Assignments</h2>
              <p className="text-sm text-gray-500">
                {isTeacher ? 'Create and manage assignments' : 'View and submit assignments'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Teacher Tabs */}
        {isTeacher && (
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('list')}
              className={cn(
                "flex-1 px-6 py-3 text-sm font-bold transition-colors",
                activeTab === 'list'
                  ? "bg-purple-50 text-purple-700 border-b-2 border-purple-500"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              All Assignments
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={cn(
                "flex-1 px-6 py-3 text-sm font-bold transition-colors",
                activeTab === 'create'
                  ? "bg-purple-50 text-purple-700 border-b-2 border-purple-500"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              Create New
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Teacher - Create Assignment */}
          {isTeacher && activeTab === 'create' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Math Problems Chapter 5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what students need to do..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Award size={16} className="inline mr-2" />
                    Points
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleCreateAssignment}
                  disabled={!title.trim() || !dueDate}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  Create Assignment
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Assignment List */}
          {(activeTab === 'list' || !isTeacher) && (
            <div className="space-y-3">
              {assignments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No assignments yet</p>
                  {isTeacher && (
                    <button
                      onClick={() => setActiveTab('create')}
                      className="mt-4 text-purple-600 font-bold hover:underline"
                    >
                      Create your first assignment
                    </button>
                  )}
                </div>
              ) : (
                assignments.map((assignment) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all cursor-pointer",
                      selectedAssignment?.id === assignment.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-100 hover:border-purple-200"
                    )}
                    onClick={() => !isTeacher && setSelectedAssignment(assignment)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{assignment.title}</h3>
                        {assignment.description && (
                          <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award size={14} />
                            {assignment.points} points
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full font-bold",
                            assignment.status === 'active' ? "bg-emerald-100 text-emerald-700" :
                            assignment.status === 'completed' ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-600"
                          )}>
                            {assignment.status}
                          </span>
                        </div>
                      </div>

                      {!isTeacher && selectedAssignment?.id === assignment.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubmitAssignment();
                          }}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <Send size={16} />
                          {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
