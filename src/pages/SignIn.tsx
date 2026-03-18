import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';

export const SignIn = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication (replace with real backend later)
    if (email && password) {
      // Store auth token
      localStorage.setItem('userToken', 'user-token-placeholder');
      localStorage.setItem('userEmail', email);
      
      // Redirect to new session
      navigate('/new-session');
    } else {
      alert('Please enter email and password');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 mt-2">Sign in to your teacher account</p>
        </div>

        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="teacher@school.edu"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              Remember me
            </label>
            <a href="#" className="text-emerald-600 font-medium hover:text-emerald-700">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
          >
            Sign in <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700">Register for free</Link>
          </p>
        </div>
      </motion.div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};
