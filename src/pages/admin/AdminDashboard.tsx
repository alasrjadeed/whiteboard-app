import React from 'react';
import { motion } from 'motion/react';
import { Users, DoorOpen, Video, DollarSign, TrendingUp, TrendingDown, Activity, Clock, Award, Calendar } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

const stats = [
  { name: 'Total Users', value: '2,543', icon: Users, change: '+12.5%', trend: 'up', color: 'bg-blue-500' },
  { name: 'Active Rooms', value: '47', icon: DoorOpen, change: '+8.2%', trend: 'up', color: 'bg-emerald-500' },
  { name: 'Live Sessions', value: '23', icon: Video, change: '+15.3%', trend: 'up', color: 'bg-purple-500' },
  { name: 'Monthly Revenue', value: '$12,458', icon: DollarSign, change: '+22.1%', trend: 'up', color: 'bg-amber-500' },
];

const recentSessions = [
  { id: 1, room: 'Math-101', teacher: 'Mr. Ali', students: 15, duration: '45 min', status: 'Active' },
  { id: 2, room: 'Science-202', teacher: 'Ms. Fatima', students: 22, duration: '60 min', status: 'Active' },
  { id: 3, room: 'English-301', teacher: 'Mr. Hassan', students: 18, duration: '55 min', status: 'Active' },
  { id: 4, room: 'Physics-401', teacher: 'Dr. Ahmed', students: 12, duration: '90 min', status: 'Active' },
  { id: 5, room: 'Chemistry-101', teacher: 'Ms. Sara', students: 20, duration: '75 min', status: 'Ended' },
];

const topTeachers = [
  { name: 'Mr. Ali', sessions: 145, students: 2340, rating: 4.9 },
  { name: 'Ms. Fatima', sessions: 132, students: 2100, rating: 4.8 },
  { name: 'Dr. Ahmed', sessions: 128, students: 1980, rating: 4.9 },
  { name: 'Mr. Hassan', sessions: 115, students: 1850, rating: 4.7 },
  { name: 'Ms. Sara', sessions: 108, students: 1720, rating: 4.8 },
];

export const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome to AsarBoard Admin Panel</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.color)}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Sessions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Sessions</h2>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="pb-4">Room</th>
                    <th className="pb-4">Teacher</th>
                    <th className="pb-4">Students</th>
                    <th className="pb-4">Duration</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <span className="font-semibold text-gray-900">{session.room}</span>
                      </td>
                      <td className="py-4 text-gray-600">{session.teacher}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-400" />
                          <span className="text-gray-600">{session.students}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-400" />
                          <span className="text-gray-600">{session.duration}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold",
                          session.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        )}>
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Teachers */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Teachers</h2>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {topTeachers.map((teacher, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    {teacher.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{teacher.name}</p>
                    <p className="text-sm text-gray-500">{teacher.sessions} sessions • {teacher.students.toLocaleString()} students</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award size={16} className="text-amber-500" />
                    <span className="font-bold text-gray-900">{teacher.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Graph Placeholder */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Activity Overview</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg">7D</button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">30D</button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">90D</button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-b from-emerald-50 to-transparent rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Activity size={48} className="mx-auto mb-2 opacity-50" />
              <p>Chart integration coming soon</p>
              <p className="text-sm">Use Recharts or Chart.js for graphs</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Helper function for class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
