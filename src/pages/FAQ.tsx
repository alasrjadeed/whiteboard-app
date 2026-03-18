import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Mail, MessageSquare, ExternalLink, ArrowRight, Clock, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';

export const FAQ = () => {
  const faqs = [
    {
      q: "Is AsarBoard really free?",
      a: "Yes! You can use the basic features of AsarBoard for free forever. We offer paid plans for teachers who need longer sessions, more students, and advanced tools like PDF uploads and co-teaching."
    },
    {
      q: "Do students need to create an account?",
      a: "No. Students can join your session instantly using a link, room code, or QR code without any registration or login required."
    },
    {
      q: "What devices are supported?",
      a: "AsarBoard is device-independent and works on any device with a modern web browser, including computers, tablets, and smartphones. No installation is needed."
    },
    {
      q: "How do I share files with students?",
      a: "Click the 'Presentations' button to upload PDF, PowerPoint, Word, or Excel files. Students can then download them from their own Presentations panel."
    },
    {
      q: "Can I create and grade assignments?",
      a: "Yes! Use the Assignments feature to create tasks, collect student work, and provide grades with feedback directly in the platform."
    },
    {
      q: "How does the public chat work?",
      a: "Click the 'Chat' button to open the public chat. All participants in the session can send and receive messages in real-time for class discussions."
    },
    {
      q: "Can I see what students are drawing live?",
      a: "Yes! Teachers can monitor all student whiteboards in real-time from the dashboard. Click on any student to view their board up close."
    },
    {
      q: "How do I export student work?",
      a: "Click 'Export PDF' in the teacher dashboard to generate a professional PDF report with all student whiteboards, perfect for portfolios or parent communication."
    },
    {
      q: "Is my data safe?",
      a: "Absolutely. We prioritize privacy. No personal information is shared with third parties, and all whiteboard data is deleted after the room is closed."
    },
    {
      q: "Can I track attendance?",
      a: "Yes! AsarBoard automatically tracks when students join and their last active time. You can export attendance reports as CSV files."
    },
    {
      q: "How many students can join a session?",
      a: "The Free plan supports up to 20 students per session. Paid plans increase this limit up to 100 students."
    },
    {
      q: "Can I use video and voice chat?",
      a: "Yes! AsarBoard includes integrated video and voice chat so you can talk while drawing on the whiteboard."
    }
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600 uppercase tracking-widest">FAQ and Help</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everything you need to know
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            AsarBoard is really easy to use. We have collected answers to frequently asked questions and help topics in our Support portal.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-gray-50 rounded-3xl border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-2 rounded-xl flex-shrink-0">
                  <HelpCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{faq.q}</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold mb-4">
              <Rocket size={16} />
              Coming Soon
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features in Development</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're working hard to bring you these amazing features. Stay tuned for updates!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Live Sessions', icon: '🔴', desc: 'Real-time session monitoring and controls' },
              { name: 'Analytics', icon: '📊', desc: 'Usage statistics and engagement metrics' },
              { name: 'Students Management', icon: '👨‍🎓', desc: 'Dedicated student management page' },
              { name: 'Teachers Management', icon: '👨‍🏫', desc: 'Teacher profiles and performance metrics' },
              { name: 'Schools', icon: '🏫', desc: 'School accounts and bulk licensing' },
              { name: 'Storage', icon: '💾', desc: 'File management and storage usage' },
              { name: 'Invoices', icon: '📄', desc: 'Invoice generation and history' },
              { name: 'Notifications', icon: '🔔', desc: 'System and email notifications' },
              { name: 'Support', icon: '💬', desc: 'Support tickets and help center' },
              { name: 'AI Moderation', icon: '🤖', desc: 'Content moderation and auto-flagging' },
              { name: 'Security', icon: '🔒', desc: 'Security settings and login logs' },
              { name: 'Branding', icon: '🎨', desc: 'Custom branding and color schemes' },
            ].map((feature) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-600">
                  <Clock size={14} />
                  <span>In Development</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="p-8 bg-emerald-600 rounded-3xl text-white">
            <MessageSquare className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Support Page</h3>
            <p className="text-emerald-100 text-sm mb-6">
              Check out our support page for help articles and detailed tutorials.
            </p>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all"
            >
              Go to support page <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="p-8 bg-gray-900 rounded-3xl text-white">
            <Mail className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Contact Us</h3>
            <p className="text-gray-400 text-sm mb-6">
              Do you have suggestions or feedback? We'd love to hear from you.
            </p>
            <a 
              href="mailto:support@whiteboard.fi" 
              className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all text-emerald-400"
            >
              Contact us <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
            <ExternalLink className="w-8 h-8 mb-4 text-emerald-600" />
            <h3 className="text-xl font-bold mb-2 text-gray-900">Blog</h3>
            <p className="text-gray-500 text-sm mb-6">
              Check out our blog for tips and tricks on using AsarBoard effectively.
            </p>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all text-emerald-600"
            >
              Go to the blog <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
