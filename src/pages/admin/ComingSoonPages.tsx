import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Rocket, Clock, Bell, X, Palette, Grid3X3, Download, Moon, Sun, Monitor, Type, Wand2, Library, Target } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { cn } from '../../lib/utils';

interface ComingSoonPageProps {
  feature: string;
  description: string;
  icon: string;
  features?: {
    name: string;
    description: string;
    icon: React.ElementType;
  }[];
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ 
  feature, 
  description,
  icon,
  features = []
}) => {
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    if (email) {
      setNotified(true);
      // Save to localStorage
      const notifications = JSON.parse(localStorage.getItem('featureNotifications') || '[]');
      notifications.push({ feature, email, date: new Date().toISOString() });
      localStorage.setItem('featureNotifications', JSON.stringify(notifications));
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl"
        >
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header with Large Emoji */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-12 text-center border-b border-amber-100">
              <div className="text-8xl mb-6 animate-bounce">{icon}</div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold mb-6">
                <Rocket size={16} />
                Coming Soon
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{feature}</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
            </div>

            {/* Features Grid */}
            {features.length > 0 && (
              <div className="p-12 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What's Coming</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feat, index) => {
                    const Icon = feat.icon;
                    return (
                      <motion.div
                        key={feat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-emerald-200 transition-colors"
                      >
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{feat.name}</h3>
                        <p className="text-sm text-gray-600">{feat.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notification Form */}
            <div className="p-12 bg-white">
              <div className="max-w-xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold mb-4">
                    <Bell size={16} />
                    Get Notified
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Be the First to Know</h2>
                  <p className="text-gray-600">We'll notify you when this feature is ready!</p>
                </div>

                {notified ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center"
                  >
                    <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-emerald-900 mb-2">You're on the list!</h3>
                    <p className="text-emerald-700">We'll notify you at {email} when this feature launches.</p>
                  </motion.div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                      onClick={handleNotify}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <Bell size={18} />
                      Notify Me
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

// Specific pages with features
export const LiveSessions = () => <ComingSoonPage 
  feature="Live Sessions" 
  description="Real-time session monitoring and controls with advanced presentation tools"
  icon="🔴"
  features={[
    { name: 'Laser Pointer', description: 'Highlight areas during presentations', icon: Target },
    { name: 'Library', description: 'Save and reuse custom shapes/components', icon: Library },
    { name: 'Text-to-Diagram', description: 'Generate diagrams from text descriptions using AI', icon: Wand2 },
  ]}
/>;

export const Analytics = () => <ComingSoonPage 
  feature="Analytics" 
  description="Comprehensive usage statistics and engagement metrics"
  icon="📊"
  features={[
    { name: 'Usage Stats', description: 'Track platform usage and activity', icon: BarChart3 },
    { name: 'Engagement', description: 'Monitor student engagement levels', icon: TrendingUp },
    { name: 'Reports', description: 'Generate detailed reports', icon: FileText },
  ]}
/>;

export const Students = () => <ComingSoonPage 
  feature="Students Management" 
  description="Dedicated student management page with profiles and progress tracking"
  icon="👨‍🎓"
  features={[
    { name: 'Student Profiles', description: 'View and manage student information', icon: User },
    { name: 'Progress Tracking', description: 'Track individual student progress', icon: TrendingUp },
    { name: 'Performance', description: 'View performance analytics', icon: Award },
  ]}
/>;

export const Teachers = () => <ComingSoonPage 
  feature="Teachers Management" 
  description="Teacher profiles and performance metrics"
  icon="👨‍🏫"
  features={[
    { name: 'Teacher Profiles', description: 'Manage teacher information', icon: User },
    { name: 'Performance', description: 'Track teaching performance', icon: TrendingUp },
    { name: 'Scheduling', description: 'Manage class schedules', icon: Calendar },
  ]}
/>;

export const Schools = () => <ComingSoonPage 
  feature="Schools" 
  description="School accounts and bulk licensing management"
  icon="🏫"
  features={[
    { name: 'School Accounts', description: 'Manage school accounts', icon: Building },
    { name: 'Bulk Licensing', description: 'Manage bulk licenses', icon: Users },
    { name: 'Admin Panel', description: 'School admin dashboard', icon: Settings },
  ]}
/>;

export const Storage = () => <ComingSoonPage 
  feature="Storage" 
  description="File management and storage usage with canvas customization"
  icon="💾"
  features={[
    { name: 'File Management', description: 'Organize and manage files', icon: Folder },
    { name: 'Usage Stats', description: 'Track storage usage', icon: PieChart },
    { name: 'Cloud Sync', description: 'Optional cloud backup', icon: Cloud },
  ]}
/>;

export const Invoices = () => <ComingSoonPage 
  feature="Invoices" 
  description="Invoice generation and history tracking"
  icon="📄"
  features={[
    { name: 'Generate Invoices', description: 'Create custom invoices', icon: FileText },
    { name: 'History', description: 'View invoice history', icon: History },
    { name: 'Export', description: 'Export to PDF/CSV', icon: Download },
  ]}
/>;

export const Notifications = () => <ComingSoonPage 
  feature="Notifications" 
  description="System and email notifications management"
  icon="🔔"
  features={[
    { name: 'System Alerts', description: 'Manage system notifications', icon: Bell },
    { name: 'Email Alerts', description: 'Email notification settings', icon: Mail },
    { name: 'Preferences', description: 'Customize notification prefs', icon: Settings },
  ]}
/>;

export const Support = () => <ComingSoonPage 
  feature="Support" 
  description="Support tickets and help center"
  icon="💬"
  features={[
    { name: 'Ticket System', description: 'Submit support tickets', icon: Ticket },
    { name: 'Help Center', description: 'Browse help articles', icon: BookOpen },
    { name: 'Live Chat', description: 'Chat with support', icon: MessageSquare },
  ]}
/>;

export const Security = () => <ComingSoonPage 
  feature="Security" 
  description="Security settings and login logs"
  icon="🔒"
  features={[
    { name: 'Login Logs', description: 'View login history', icon: History },
    { name: '2FA Setup', description: 'Enable two-factor auth', icon: Shield },
    { name: 'IP Blocking', description: 'Block suspicious IPs', icon: Ban },
  ]}
/>;

export const Branding = () => <ComingSoonPage 
  feature="Branding" 
  description="Custom branding and color schemes with canvas customization"
  icon="🎨"
  features={[
    { name: 'Custom Colors', description: 'Choose preset colors or custom hex codes', icon: Palette },
    { name: 'Theme Toggle', description: 'Light, Dark, or System (auto-detect)', icon: Monitor },
    { name: 'Grid Toggle', description: 'Show/hide grid overlay (Ctrl/Cmd + \')', icon: Grid3X3 },
    { name: 'Export Options', description: 'PNG, SVG, with/without scene data, dark mode export', icon: Download },
  ]}
/>;

// Helper components
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

function BarChart3({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18"></path>
      <path d="M18 17V9"></path>
      <path d="M13 17V5"></path>
      <path d="M8 17v-3"></path>
    </svg>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function Award({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7"></circle>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
  );
}

function Calendar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function Building({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="9" y1="22" x2="9" y2="22.01"></line>
      <line x1="15" y1="22" x2="15" y2="22.01"></line>
      <line x1="12" y1="22" x2="12" y2="22.01"></line>
      <line x1="12" y1="2" x2="12" y2="22"></line>
      <line x1="4" y1="10" x2="20" y2="10"></line>
      <line x1="4" y1="16" x2="20" y2="16"></line>
    </svg>
  );
}

function Folder({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

function PieChart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
      <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
    </svg>
  );
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
}

function History({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

function Mail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );
}

function Ticket({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7v2a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"></path>
    </svg>
  );
}

function BookOpen({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
}

function Ban({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
    </svg>
  );
}

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}

function Settings({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );
}
