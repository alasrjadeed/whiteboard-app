import React from 'react';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';

export const Register = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
          <p className="text-gray-500 mt-2">Join thousands of teachers worldwide</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="teacher@school.edu"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="text-xs text-gray-500 leading-relaxed">
            By registering, you agree to our <Link to="/privacy-terms" className="text-emerald-600 hover:underline">Privacy & Terms</Link>.
          </div>
          <button className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
            Create account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/signin" className="text-emerald-600 font-bold hover:text-emerald-700">Sign in</Link>
          </p>
        </div>
      </motion.div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};
