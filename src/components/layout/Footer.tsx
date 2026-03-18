import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-4">AsarBoard</h3>
            <p className="text-sm text-gray-400">
              Interactive virtual classroom for modern education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/guide" className="hover:text-white transition-colors">User Guide</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/privacy-terms" className="hover:text-white transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="font-bold mb-4">Admin</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p className="mb-2">
            Made with ❤️ Powered by{' '}
            <a
              href="https://alasarjadeed.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 transition-colors font-semibold"
            >
              AL ASAR JADEED
            </a>
          </p>
          <p>Copyright © {new Date().getFullYear()} AsarBoard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
