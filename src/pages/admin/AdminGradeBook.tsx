import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Download, Edit2, Save, X, TrendingUp, Award, Calendar, User } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { cn } from '../../lib/utils';

interface GradeEntry {
  id: number;
  studentId: string;
  studentName: string;
  assignmentId: number;
  assignmentName: string;
  grade: number | null;
  maxPoints: number;
  feedback: string;
  submittedAt: string;
  gradedAt?: string;
}

export const AdminGradeBook = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [editingGrade, setEditingGrade] = useState<number | null>(null);
  const [gradeValue, setGradeValue] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  // Sample data (replace with API calls)
  const [grades, setGrades] = useState<GradeEntry[]>([
    {
      id: 1,
      studentId: 's1',
      studentName: 'Ali Ahmed',
      assignmentId: 1,
      assignmentName: 'Math Problems Ch.5',
      grade: 85,
      maxPoints: 100,
      feedback: 'Good work! Show more steps.',
      submittedAt: '2026-03-10',
      gradedAt: '2026-03-11'
    },
    {
      id: 2,
      studentId: 's2',
      studentName: 'Fatima Hassan',
      assignmentId: 1,
      assignmentName: 'Math Problems Ch.5',
      grade: 92,
      maxPoints: 100,
      feedback: 'Excellent work!',
      submittedAt: '2026-03-10',
      gradedAt: '2026-03-11'
    },
    {
      id: 3,
      studentId: 's3',
      studentName: 'Ahmed Mohamed',
      assignmentId: 1,
      assignmentName: 'Math Problems Ch.5',
      grade: null,
      maxPoints: 100,
      feedback: '',
      submittedAt: '2026-03-10',
      gradedAt: undefined
    }
  ]);

  const handleSaveGrade = (gradeId: number) => {
    setGrades(prev => prev.map(g => 
      g.id === gradeId 
        ? { 
            ...g, 
            grade: parseInt(gradeValue) || 0,
            feedback: feedbackText,
            gradedAt: new Date().toISOString()
          }
        : g
    ));
    setEditingGrade(null);
    setGradeValue('');
    setFeedbackText('');
  };

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getClassColor = (percentage: number) => {
    if (percentage >= 90) return 'text-emerald-600 bg-emerald-50';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50';
    if (percentage >= 70) return 'text-amber-600 bg-amber-50';
    if (percentage >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.assignmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStudent = !selectedStudent || grade.studentId === selectedStudent;
    return matchesSearch && matchesStudent;
  });

  const classAverage = grades.filter(g => g.grade !== null).reduce((sum, g) => sum + (g.grade || 0), 0) / 
                       grades.filter(g => g.grade !== null).length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grade Book</h1>
            <p className="text-gray-500 mt-1">Track and manage student grades</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
            <Download size={18} />
            Export Grades
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Class Average</p>
                <p className="text-2xl font-bold text-gray-900">{classAverage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <TrendingUp size={16} />
              <span className="font-medium">+2.5% from last week</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(grades.map(g => g.studentId)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Graded</p>
                <p className="text-2xl font-bold text-gray-900">
                  {grades.filter(g => g.grade !== null).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {grades.filter(g => g.grade === null).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student or assignment..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedStudent || ''}
                onChange={(e) => setSelectedStudent(e.target.value || null)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none"
              >
                <option value="">All Students</option>
                {Array.from(new Set(grades.map(g => g.studentId))).map(id => (
                  <option key={id} value={id}>
                    {grades.find(g => g.studentId === id)?.studentName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Assignment</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Grade</th>
                  <th className="px-6 py-4">Feedback</th>
                  <th className="px-6 py-4">Graded</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGrades.map((grade) => {
                  const percentage = grade.grade ? (grade.grade / grade.maxPoints) * 100 : 0;
                  const letterGrade = grade.grade ? getLetterGrade(percentage) : '-';
                  
                  return (
                    <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                            {grade.studentName[0]}
                          </div>
                          <span className="font-semibold text-gray-900">{grade.studentName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{grade.assignmentName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar size={14} />
                          {new Date(grade.submittedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingGrade === grade.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={gradeValue}
                              onChange={(e) => setGradeValue(e.target.value)}
                              className="w-20 px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                              autoFocus
                            />
                            <span className="text-gray-500">/ {grade.maxPoints}</span>
                          </div>
                        ) : grade.grade !== null ? (
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-3 py-1 rounded-full font-bold text-sm",
                              getClassColor(percentage)
                            )}>
                              {grade.grade} ({letterGrade})
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Not graded</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingGrade === grade.id ? (
                          <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Add feedback..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                          />
                        ) : grade.feedback ? (
                          <p className="text-sm text-gray-600 max-w-xs truncate">{grade.feedback}</p>
                        ) : (
                          <span className="text-gray-400 text-sm">No feedback</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {grade.gradedAt ? (
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar size={14} />
                            {new Date(grade.gradedAt).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {editingGrade === grade.id ? (
                            <>
                              <button
                                onClick={() => handleSaveGrade(grade.id)}
                                className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
                                title="Save"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingGrade(null);
                                  setGradeValue('');
                                  setFeedbackText('');
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingGrade(grade.id);
                                setGradeValue(grade.grade?.toString() || '');
                                setFeedbackText(grade.feedback || '');
                              }}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                              title="Edit Grade"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Helper components
function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}
