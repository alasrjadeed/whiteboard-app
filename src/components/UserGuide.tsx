import React from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Smartphone, 
  Lock, 
  Shield, 
  Eye, 
  Pencil, 
  Sigma, 
  PieChart, 
  Smile, 
  Save, 
  Send, 
  Link, 
  RefreshCw, 
  BookOpen, 
  MessageSquare, 
  Timer, 
  ClipboardList 
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, category }: { icon: any, title: string, description: string, category: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-4"
  >
    <div className="flex items-center justify-between">
      <div className="p-3 bg-black/5 rounded-2xl">
        <Icon size={24} className="text-black" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">{category}</span>
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-black/60 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export const UserGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 py-20 px-4 font-sans">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            AsarBoard <span className="text-white/30">Training</span>
          </motion.h1>
          <p className="text-xl text-black/60">Master the tools designed to engage every student in your classroom.</p>
        </div>

        {/* How It Works */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-black/40">Simple workflow for a seamless classroom experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create', desc: 'Start a new session as a teacher and get your unique room code or QR code.' },
              { step: '02', title: 'Join', desc: 'Students scan the QR code or enter the room code to get their individual whiteboards.' },
              { step: '03', title: 'Teach', desc: 'Monitor all student boards in real-time, provide feedback, and push content instantly.' },
            ].map((item, i) => (
              <div key={i} className="relative p-8 bg-white rounded-3xl border border-black/5 space-y-4">
                <span className="text-6xl font-bold opacity-5 absolute -top-4 -left-2">{item.step}</span>
                <h3 className="text-2xl font-bold relative z-10">{item.title}</h3>
                <p className="text-black/60 relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Features & Capabilities</h2>
            <p className="text-black/40">Everything you need to lead your classroom.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Core Features */}
            <FeatureCard 
              icon={Target} 
              title="Instant Access" 
              description="No installation required. Works directly in any modern web browser."
              category="Core"
            />
            <FeatureCard 
              icon={Smartphone} 
              title="Device Independent" 
              description="Use it on tablets, laptops, or smartphones. Perfect for BYOD classrooms."
              category="Core"
            />
            <FeatureCard 
              icon={Lock} 
              title="Access Control" 
              description="Lock your room and use the waiting room to approve students before they join."
              category="Core"
            />
            <FeatureCard 
              icon={Eye} 
              title="Live Overview" 
              description="See all student whiteboards in real-time on your teacher dashboard."
              category="Core"
            />
            <FeatureCard 
              icon={Sigma} 
              title="Math Tools" 
              description="Advanced tools for equations, fractions, grids, and geometry."
              category="Tools"
            />
            <FeatureCard 
              icon={PieChart} 
              title="Data Viz" 
              description="Create pie charts and graphs to visualize data with your students."
              category="Tools"
            />
            <FeatureCard 
              icon={Send} 
              title="Push Board" 
              description="Send your teacher whiteboard to all students instantly with one click."
              category="Advanced"
            />
            <FeatureCard 
              icon={MessageSquare} 
              title="Live Feedback" 
              description="Send thumbs up, stars, or written comments to individual students."
              category="Advanced"
            />
            <FeatureCard 
              icon={Timer} 
              title="Session Timer" 
              description="Keep activities on track with a built-in countdown timer for the whole class."
              category="Advanced"
            />
          </div>
        </section>

        {/* Classroom Use Cases */}
        <section className="bg-black text-white p-12 md:p-20 rounded-[40px] space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Classroom Use Cases</h2>
            <p className="text-white/60 max-w-2xl">See how AsarBoard can transform different subjects in your school.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm">01</span>
                Science Lessons
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Upload a diagram of a cell as a background. Push it to all students and have them label the organelles. Monitor their progress in real-time and provide instant feedback.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm">02</span>
                Mathematics
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Use the grid tool to create coordinate planes. Have students plot functions or solve geometry problems using the ruler and protractor tools.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm">03</span>
                Geography
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Upload a world map. Ask students to mark specific countries or terrain features. Hide names to allow for anonymous peer review of their findings.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm">04</span>
                Language Arts
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Write a writing prompt on your board and push it to everyone. Students can respond with text or drawings, allowing for creative expression.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
