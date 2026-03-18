import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Zap,
  Shield,
  Smartphone,
  Layout,
  MousePointer2,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  MessageSquare,
  FileText,
  Video,
  Mic,
  Presentation,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { cn } from '../lib/utils';

const Plus = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Inspire &</span>
                <span className="block text-emerald-600">Engage your students</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Teaching isn't easy. We know the struggle. AsarBoard gives you the tools to engage every student, identify misunderstandings in real-time, and include everyone in the conversation.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/new-session"
                    className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10 shadow-lg shadow-emerald-200 transition-all"
                  >
                    New session
                  </Link>
                  <Link
                    to="/join-session"
                    className="flex items-center justify-center px-8 py-3 border border-emerald-100 text-base font-medium rounded-full text-emerald-700 bg-emerald-50 hover:bg-emerald-100 md:py-4 md:text-lg md:px-10 transition-all"
                  >
                    Join session
                  </Link>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
            >
              <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-900 bg-gray-900">
                <img
                  className="w-full"
                  src="/01.png"
                  alt="App screenshot"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Updated */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Simple workflow for a seamless classroom experience.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {[
                {
                  title: '1. Create or Join Session',
                  desc: 'Teachers create a session with one click. Students join instantly via link, room code, or QR code—no login required.',
                  icon: Plus,
                  color: 'bg-emerald-500'
                },
                {
                  title: '2. Interactive Whiteboards',
                  desc: 'Every student gets their own digital whiteboard with drawing tools, text, shapes, images, and math tools.',
                  icon: Layout,
                  color: 'bg-blue-500'
                },
                {
                  title: '3. Real-Time Monitoring',
                  desc: 'Teachers see all student boards live, provide instant feedback, push their board to students, and export progress reports.',
                  icon: Users,
                  color: 'bg-purple-500'
                }
              ].map((step, i) => (
                <motion.div 
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative p-8 bg-white rounded-3xl shadow-sm border border-gray-100"
                >
                  <div className="absolute -top-6 left-8 bg-emerald-500 rounded-2xl p-4 shadow-lg shadow-emerald-200">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-4 text-gray-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Updated */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Packed with features</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need for effective classroom engagement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Instant Access', desc: 'No login required for students. Access on any device without downloads.', icon: Zap },
              { title: 'Device Independent', desc: 'Works on any device - no installation or downloads needed.', icon: Smartphone },
              { title: 'Privacy First', desc: 'No personal information shared. Everything deleted after room closes.', icon: Shield },
              { title: 'Access Control', desc: 'Waiting lobby and room locking for full control over who enters.', icon: MousePointer2 },
              { title: 'Versatile Tools', desc: 'Insert images, backgrounds, arrows, shapes and texts.', icon: ImageIcon },
              { title: 'Math & Graphs', desc: 'Math Editor for equations and tools for graphs, angles, and charts.', icon: CheckCircle2 },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex gap-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{feature.title}</h4>
                  <p className="mt-1 text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features & Capabilities - NEW */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Features & Capabilities</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to lead your classroom.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Live Video & Voice', desc: 'Talk while drawing with integrated video and voice chat.', icon: Video, color: 'text-blue-500' },
              { title: 'Screen Sharing', desc: 'Share your screen with students for presentations.', icon: Presentation, color: 'text-purple-500' },
              { title: 'Public Chat', desc: 'Group messaging for class discussions.', icon: MessageSquare, color: 'text-green-500' },
              { title: 'File Uploads', desc: 'Share PDFs, PowerPoint, Word, and Excel files.', icon: FileText, color: 'text-red-500' },
              { title: 'Assignment System', desc: 'Create, collect, and grade assignments.', icon: BookOpen, color: 'text-indigo-500' },
              { title: 'Attendance Tracking', desc: 'Automatic attendance with CSV export.', icon: CheckCircle2, color: 'text-emerald-500' },
              { title: 'PDF Export', desc: 'Export student work as professional PDF reports.', icon: FileText, color: 'text-pink-500' },
              { title: '10+ Templates', desc: 'Pre-made worksheets for various subjects.', icon: Layout, color: 'text-orange-500' },
              { title: 'Multi-Language', desc: 'Coming soon: Support for multiple languages.', icon: Globe, color: 'text-cyan-500' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <feature.icon className={cn("w-12 h-12 mb-4", feature.color)} />
                <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to engage your whole class?
          </h2>
          <p className="mt-4 text-xl text-emerald-100">
            Start using AsarBoard for free today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/new-session"
              className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-full hover:bg-emerald-50 transition-colors shadow-xl"
            >
              Create a new class
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
