import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Plus, Edit2, Trash2, Ban, CheckCircle, XCircle, MoreVertical, Mail, School, Calendar, X, UserPlus, FileText } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

const initialUsers = [
  { id: 1, name: 'Ali Ahmed', email: 'ali@school.com', role: 'Student', school: 'ABC School', sessions: 12, status: 'Active', joined: '2026-01-15' },
  { id: 2, name: 'Fatima Hassan', email: 'fatima@school.com', role: 'Teacher', school: 'XYZ Academy', sessions: 145, status: 'Active', joined: '2025-09-20' },
  { id: 3, name: 'Ahmed Mohamed', email: 'ahmed@school.com', role: 'Student', school: 'ABC School', sessions: 8, status: 'Active', joined: '2026-02-01' },
  { id: 4, name: 'Sara Ali', email: 'sara@school.com', role: 'Teacher', school: 'DEF Institute', sessions: 98, status: 'Suspended', joined: '2025-11-10' },
  { id: 5, name: 'Hassan Ibrahim', email: 'hassan@school.com', role: 'Student', school: 'XYZ Academy', sessions: 25, status: 'Active', joined: '2026-01-05' },
];

export const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  // Form state for adding user
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Student',
    school: '',
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      alert('Please fill in required fields');
      return;
    }
    const newUserEntry = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      school: newUser.school || 'Not assigned',
      sessions: 0,
      status: 'Active' as const,
      joined: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUserEntry]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'Student', school: '' });
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowAddModal(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
    setShowActionMenu(null);
  };

  const handleToggleStatus = (user: any) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
        : u
    ));
    setShowActionMenu(null);
  };

  const handleViewResults = () => {
    setShowResultsModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-1">Manage students, teachers, and schools</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleViewResults}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              <FileText size={18} />
              View Results
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
            >
              <Plus size={18} />
              Add User
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none"
              >
                <option value="All">All Roles</option>
                <option value="Student">Students</option>
                <option value="Teacher">Teachers</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Banned">Banned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">School</th>
                  <th className="px-6 py-4">Sessions</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail size={14} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        user.role === 'Teacher'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <School size={16} />
                        {user.school}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{user.sessions}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={14} />
                        {user.joined}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        user.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : user.status === 'Suspended'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className="p-2 hover:bg-amber-50 rounded-lg transition-colors text-amber-600"
                          title={user.status === 'Active' ? 'Suspend' : 'Activate'}
                        >
                          {user.status === 'Active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                            className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
                          >
                            <MoreVertical size={16} />
                          </button>
                          <AnimatePresence>
                            {showActionMenu === user.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10"
                              >
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  View Profile
                                </button>
                                <button
                                  onClick={() => {
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  Send Email
                                </button>
                                <button
                                  onClick={() => {
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  View Activity Log
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">1</span> to <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of <span className="font-semibold text-gray-900">{filteredUsers.length}</span> results
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                1
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedUser(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={selectedUser?.name || newUser.name}
                    onChange={(e) => selectedUser 
                      ? setSelectedUser({ ...selectedUser, name: e.target.value })
                      : setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={selectedUser?.email || newUser.email}
                    onChange={(e) => selectedUser
                      ? setSelectedUser({ ...selectedUser, email: e.target.value })
                      : setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={selectedUser?.role || newUser.role}
                    onChange={(e) => selectedUser
                      ? setSelectedUser({ ...selectedUser, role: e.target.value })
                      : setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School
                  </label>
                  <input
                    type="text"
                    value={selectedUser?.school || newUser.school}
                    onChange={(e) => selectedUser
                      ? setSelectedUser({ ...selectedUser, school: e.target.value })
                      : setNewUser({ ...newUser, school: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter school name"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex-1 px-4 py-2.5 text-white bg-emerald-600 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  {selectedUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Modal */}
      <AnimatePresence>
        {showResultsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResultsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  User Results Report
                </h2>
                <button
                  onClick={() => setShowResultsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <p className="text-sm text-emerald-600 font-medium">Total Users</p>
                    <p className="text-2xl font-bold text-emerald-700">{users.length}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-blue-600 font-medium">Active</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {users.filter(u => u.status === 'Active').length}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-purple-600 font-medium">Teachers</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {users.filter(u => u.role === 'Teacher').length}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">User Summary</h3>
                  <div className="space-y-2">
                    {users.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.role} • {user.school}</p>
                          </div>
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-bold",
                          user.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        )}>
                          {user.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowResultsModal(false)}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert('Export functionality coming soon!');
                  }}
                  className="flex-1 px-4 py-2.5 text-white bg-emerald-600 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  Export Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

// Helper function
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
