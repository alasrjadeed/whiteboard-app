import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Plus, Edit2, Trash2, Eye, Lock, Unlock, Video, Users, Calendar, Clock, MoreVertical, X, Room } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

const initialRooms = [
  { id: 1, name: 'Math-101', teacher: 'Mr. Ali', students: 15, maxStudents: 30, status: 'Active', duration: '45 min', created: '2026-03-01', settings: { lobby: true, password: false, recording: true } },
  { id: 2, name: 'Science-202', teacher: 'Ms. Fatima', students: 22, maxStudents: 40, status: 'Active', duration: '60 min', created: '2026-03-05', settings: { lobby: true, password: true, recording: true } },
  { id: 3, name: 'English-301', teacher: 'Mr. Hassan', students: 0, maxStudents: 30, status: 'Idle', duration: '0 min', created: '2026-03-10', settings: { lobby: false, password: false, recording: false } },
  { id: 4, name: 'Physics-401', teacher: 'Dr. Ahmed', students: 12, maxStudents: 25, status: 'Active', duration: '90 min', created: '2026-02-28', settings: { lobby: true, password: false, recording: true } },
  { id: 5, name: 'Chemistry-101', teacher: 'Ms. Sara', students: 0, maxStudents: 35, status: 'Ended', duration: '75 min', created: '2026-03-08', settings: { lobby: true, password: true, recording: false } },
];

export const AdminRooms = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  const [newRoom, setNewRoom] = useState({
    name: '',
    teacher: '',
    maxStudents: 30,
    lobby: true,
    password: false,
    recording: true,
  });

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateRoom = () => {
    if (!newRoom.name || !newRoom.teacher) {
      alert('Please fill in required fields');
      return;
    }
    const newRoomEntry = {
      id: rooms.length + 1,
      name: newRoom.name,
      teacher: newRoom.teacher,
      students: 0,
      maxStudents: newRoom.maxStudents,
      status: 'Idle' as const,
      duration: '0 min',
      created: new Date().toISOString().split('T')[0],
      settings: {
        lobby: newRoom.lobby,
        password: newRoom.password,
        recording: newRoom.recording,
      },
    };
    setRooms([...rooms, newRoomEntry]);
    setShowCreateModal(false);
    setNewRoom({ name: '', teacher: '', maxStudents: 30, lobby: true, password: false, recording: true });
  };

  const handleEditRoom = (room: any) => {
    setSelectedRoom(room);
    setShowCreateModal(true);
  };

  const handleViewRoom = (room: any) => {
    setSelectedRoom(room);
    setShowViewModal(true);
  };

  const handleDeleteRoom = (roomId: number) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(r => r.id !== roomId));
    }
    setShowActionMenu(null);
  };

  const handleEndSession = (roomId: number) => {
    if (window.confirm('End this session?')) {
      setRooms(rooms.map(r => 
        r.id === roomId ? { ...r, status: 'Ended' as const } : r
      ));
    }
    setShowActionMenu(null);
  };

  const handleToggleLock = (roomId: number) => {
    setRooms(rooms.map(r => 
      r.id === roomId ? { ...r, settings: { ...r.settings, lobby: !r.settings.lobby } } : r
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
            <p className="text-gray-500 mt-1">Manage all classrooms and live sessions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            <Plus size={18} />
            Create Room
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{rooms.filter(r => r.status === 'Active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{rooms.reduce((sum, r) => sum + r.students, 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Duration</p>
                <p className="text-2xl font-bold text-gray-900">52 min</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Locked Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{rooms.filter(r => r.settings.lobby).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by room name or teacher..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
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
                <option value="Idle">Idle</option>
                <option value="Ended">Ended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rooms Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Teacher</th>
                  <th className="px-6 py-4">Students</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Settings</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                          {room.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{room.name}</p>
                          <p className="text-sm text-gray-500">Created: {room.created}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{room.teacher}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-gray-600">{room.students}/{room.maxStudents}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-600">{room.duration}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {room.settings.lobby && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full" title="Lobby Enabled">
                            <Lock size={12} />
                          </span>
                        )}
                        {room.settings.password && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full" title="Password Protected">
                            🔒
                          </span>
                        )}
                        {room.settings.recording && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full" title="Recording Enabled">
                            <Video size={12} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        room.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : room.status === 'Idle'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-red-100 text-red-700'
                      )}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewRoom(room)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          title="View Room"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditRoom(room)}
                          className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
                          title="Edit Room"
                        >
                          <Edit2 size={16} />
                        </button>
                        {room.status === 'Active' && (
                          <button
                            onClick={() => handleEndSession(room.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                            title="End Session"
                          >
                            <Lock size={16} />
                          </button>
                        )}
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === room.id ? null : room.id)}
                            className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
                          >
                            <MoreVertical size={16} />
                          </button>
                          <AnimatePresence>
                            {showActionMenu === room.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10"
                              >
                                <button
                                  onClick={() => {
                                    handleToggleLock(room.id);
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  {room.settings.lobby ? 'Disable Lobby' : 'Enable Lobby'}
                                </button>
                                <button
                                  onClick={() => {
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  View Analytics
                                </button>
                                <button
                                  onClick={() => {
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  Export Data
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
              Showing <span className="font-semibold text-gray-900">1</span> to <span className="font-semibold text-gray-900">{filteredRooms.length}</span> of <span className="font-semibold text-gray-900">{filteredRooms.length}</span> results
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

      {/* Create/Edit Room Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
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
                  {selectedRoom ? 'Edit Room' : 'Create New Room'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedRoom(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    value={selectedRoom?.name || newRoom.name}
                    onChange={(e) => selectedRoom 
                      ? setSelectedRoom({ ...selectedRoom, name: e.target.value })
                      : setNewRoom({ ...newRoom, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Math-101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teacher Name *
                  </label>
                  <input
                    type="text"
                    value={selectedRoom?.teacher || newRoom.teacher}
                    onChange={(e) => selectedRoom
                      ? setSelectedRoom({ ...selectedRoom, teacher: e.target.value })
                      : setNewRoom({ ...newRoom, teacher: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Mr. Ali"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Students
                  </label>
                  <input
                    type="number"
                    value={selectedRoom?.maxStudents || newRoom.maxStudents}
                    onChange={(e) => selectedRoom
                      ? setSelectedRoom({ ...selectedRoom, maxStudents: parseInt(e.target.value) })
                      : setNewRoom({ ...newRoom, maxStudents: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    min="5"
                    max="150"
                  />
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <p className="font-semibold text-gray-900">Room Settings</p>
                  
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <span className="text-sm text-gray-700">Lobby Protection</span>
                    <input
                      type="checkbox"
                      checked={selectedRoom?.settings.lobby ?? newRoom.lobby}
                      onChange={(e) => selectedRoom
                        ? setSelectedRoom({ ...selectedRoom, settings: { ...selectedRoom.settings, lobby: e.target.checked } })
                        : setNewRoom({ ...newRoom, lobby: e.target.checked })
                      }
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <span className="text-sm text-gray-700">Password Protected</span>
                    <input
                      type="checkbox"
                      checked={selectedRoom?.settings.password ?? newRoom.password}
                      onChange={(e) => selectedRoom
                        ? setSelectedRoom({ ...selectedRoom, settings: { ...selectedRoom.settings, password: e.target.checked } })
                        : setNewRoom({ ...newRoom, password: e.target.checked })
                      }
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <span className="text-sm text-gray-700">Recording Enabled</span>
                    <input
                      type="checkbox"
                      checked={selectedRoom?.settings.recording ?? newRoom.recording}
                      onChange={(e) => selectedRoom
                        ? setSelectedRoom({ ...selectedRoom, settings: { ...selectedRoom.settings, recording: e.target.checked } })
                        : setNewRoom({ ...newRoom, recording: e.target.checked })
                      }
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedRoom(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRoom}
                  className="flex-1 px-4 py-2.5 text-white bg-emerald-600 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  {selectedRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Room Modal */}
      <AnimatePresence>
        {showViewModal && selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Room Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {selectedRoom.name[0]}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{selectedRoom.name}</p>
                    <p className="text-gray-600">Teacher: {selectedRoom.teacher}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Students</p>
                    <p className="text-xl font-bold text-gray-900">{selectedRoom.students}/{selectedRoom.maxStudents}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-xl font-bold text-gray-900">{selectedRoom.duration}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold",
                      selectedRoom.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : selectedRoom.status === 'Idle'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-red-100 text-red-700'
                    )}>
                      {selectedRoom.status}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-xl font-bold text-gray-900">{selectedRoom.created}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-semibold text-gray-900 mb-3">Settings</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Lobby Protection</span>
                      <span className={cn("px-2 py-1 rounded text-xs font-bold", selectedRoom.settings.lobby ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600')}>
                        {selectedRoom.settings.lobby ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Password Protected</span>
                      <span className={cn("px-2 py-1 rounded text-xs font-bold", selectedRoom.settings.password ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600')}>
                        {selectedRoom.settings.password ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Recording</span>
                      <span className={cn("px-2 py-1 rounded text-xs font-bold", selectedRoom.settings.recording ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600')}>
                        {selectedRoom.settings.recording ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
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
