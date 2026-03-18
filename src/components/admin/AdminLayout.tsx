import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  DoorOpen,
  CreditCard,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
      { name: 'Users', icon: Users, path: '/admin/users' },
      { name: 'Rooms', icon: DoorOpen, path: '/admin/rooms' },
    ]
  },
  {
    title: 'Billing',
    items: [
      { name: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions' },
      { name: 'Payments', icon: DollarSign, path: '/admin/payments' },
      { name: 'Grade Book', icon: GraduationCap, path: '/admin/gradebook' },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ]
  }
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Main': true,
    'Billing': true,
    'System': true,
  });
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-gray-900 text-white h-screen overflow-hidden fixed left-0 top-0 z-50"
          >
            <div className="p-6">
              {/* Logo */}
              <div className="flex items-center justify-between mb-8">
                <Link to="/admin" className="flex items-center gap-3">
                  <div className="bg-emerald-500 p-2 rounded-lg">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">AsarBoard</h1>
                    <p className="text-xs text-gray-400">Admin Panel</p>
                  </div>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {navSections.map((section) => (
                  <div key={section.title} className="mb-4">
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors"
                    >
                      {section.title}
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform",
                          expandedSections[section.title] ? "rotate-180" : ""
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {expandedSections[section.title] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 mt-2">
                            {section.items.map((item) => {
                              const Icon = item.icon;
                              const isActive = location.pathname === item.path;
                              return (
                                <Link
                                  key={item.name}
                                  to={item.path}
                                  className={cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all",
                                    isActive
                                      ? "bg-emerald-600 text-white"
                                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <Icon size={18} />
                                    <span>{item.name}</span>
                                  </div>
                                  {item.badge && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </div>

            {/* Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={cn("flex-1 transition-all duration-300", sidebarOpen ? "ml-[280px]" : "ml-0")}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Admin Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">admin@asarboard.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
