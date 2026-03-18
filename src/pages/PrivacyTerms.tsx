import React from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, CheckCircle, AlertCircle, Mail, Globe, Lock, CreditCard, User, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyTerms = () => {
  const sections = [
    { id: 'privacy', title: 'Privacy Policy', icon: Lock },
    { id: 'terms', title: 'Terms of Service', icon: FileText },
    { id: 'data', title: 'Data Collection', icon: Shield },
    { id: 'cookies', title: 'Cookies', icon: CreditCard },
    { id: 'rights', title: 'Your Rights', icon: User },
    { id: 'contact', title: 'Contact Us', icon: Mail },
  ];

  const [activeSection, setActiveSection] = React.useState('privacy');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Shield className="w-12 h-12" />
            </div>
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <FileText className="w-12 h-12" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Privacy Policy & Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/90 max-w-3xl mx-auto"
          >
            Your privacy and trust are important to us. This document outlines how we collect, use, and protect your information, along with the terms governing your use of AsarBoard.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-2 text-sm text-white/80"
          >
            <AlertCircle size={16} />
            <span>Last updated: March 12, 2026</span>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-emerald-600" />
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        activeSection === section.id
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Icon size={16} />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-12"
          >
            {/* Privacy Policy Section */}
            <section id="privacy" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <Lock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
                </div>

                <div className="prose prose-emerald max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    At AsarBoard, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational whiteboard platform.
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Personal Information</p>
                        <p className="text-gray-600 text-sm">Name, email address (for teacher accounts), and session data.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Whiteboard Content</p>
                        <p className="text-gray-600 text-sm">Drawings, text, images, and other content created during sessions.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Usage Data</p>
                        <p className="text-gray-600 text-sm">Session duration, features used, and device information.</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>To provide and maintain our educational whiteboard services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>To facilitate real-time collaboration between teachers and students</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>To improve our platform and develop new features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>To communicate with you about service updates and announcements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>To ensure platform security and prevent misuse</span>
                    </li>
                  </ul>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">3. Data Retention</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Whiteboard sessions are automatically deleted after the session expires (based on your plan: 3 hours for Free, 24 hours for Starter, 60 days for Pro, or 365 days for Premium). We do not permanently store whiteboard content unless you explicitly export and save it.
                  </p>
                </div>
              </div>
            </section>

            {/* Terms of Service Section */}
            <section id="terms" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
                </div>

                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Welcome to AsarBoard! By accessing or using our educational whiteboard platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h3>
                  <p className="text-gray-600 leading-relaxed">
                    By creating a session, joining a session, or otherwise using AsarBoard, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">2. Eligibility</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <p className="text-blue-900 font-semibold mb-3">To use AsarBoard, you must:</p>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li className="flex items-start gap-2">
                        <span>✓</span>
                        <span>Be at least 13 years old (or have parental consent)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>✓</span>
                        <span>Be a teacher, educator, or student using the platform for educational purposes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>✓</span>
                        <span>Not use the platform for any illegal or unauthorized purpose</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>✓</span>
                        <span>Comply with all applicable laws and regulations</span>
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">3. User Responsibilities</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Teachers must:</p>
                        <ul className="text-gray-600 text-sm mt-2 space-y-1">
                          <li>• Supervise student use of the platform</li>
                          <li>• Ensure appropriate content is shared</li>
                          <li>• Manage session access and permissions</li>
                          <li>• Report any misuse or inappropriate behavior</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">All users must not:</p>
                        <ul className="text-gray-600 text-sm mt-2 space-y-1">
                          <li>• Share inappropriate or offensive content</li>
                          <li>• Harass, bully, or intimidate other users</li>
                          <li>• Attempt to access other users' data without authorization</li>
                          <li>• Use the platform to distribute malware or viruses</li>
                          <li>• Reverse engineer or attempt to access our source code</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">4. Subscription Plans & Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Free Plan</h4>
                      <p className="text-sm text-gray-600">3-hour sessions, up to 30 students, 1 active session</p>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Starter ($0.99/mo)</h4>
                      <p className="text-sm text-gray-600">24-hour sessions, up to 40 students, 3 active sessions</p>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Pro ($2.99/mo)</h4>
                      <p className="text-sm text-gray-600">60-day sessions, up to 60 students, 20 active sessions</p>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Premium ($7.99/mo)</h4>
                      <p className="text-sm text-gray-600">365-day sessions, up to 150 students, 100 active sessions</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-4">
                    All prices are in USD. Yearly billing available with approximately 17% savings. Prices may vary by region and are subject to change with 30 days notice.
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">5. Cancellation & Refunds</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period. We do not provide refunds for partial billing periods, but you will retain access until the period ends.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Collection Section */}
            <section id="data" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Data Collection & Security</h2>
                </div>

                <div className="prose prose-purple max-w-none">
                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">How We Protect Your Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                      <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <Lock size={18} />
                        Encryption
                      </h4>
                      <p className="text-purple-800 text-sm">
                        All data transmitted between your device and our servers is encrypted using industry-standard SSL/TLS protocols.
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                      <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <Shield size={18} />
                        Secure Storage
                      </h4>
                      <p className="text-purple-800 text-sm">
                        Session data is stored securely and automatically deleted after session expiration based on your plan.
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                      <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <User size={18} />
                        Access Control
                      </h4>
                      <p className="text-purple-800 text-sm">
                        Room codes and waiting room features ensure only authorized participants can join sessions.
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                      <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <CheckCircle size={18} />
                        Compliance
                      </h4>
                      <p className="text-purple-800 text-sm">
                        We comply with applicable data protection regulations including GDPR for EU users.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Third-Party Services</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We use trusted third-party services to operate our platform. These services have access to limited information necessary to perform their functions and are obligated to maintain confidentiality:
                  </p>
                  <ul className="space-y-2 text-gray-600 mt-4">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Cloud hosting providers for data storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Payment processors for subscription billing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Analytics tools for platform improvement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookies Section */}
            <section id="cookies" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <CreditCard className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Cookies & Tracking</h2>
                </div>

                <div className="prose prose-amber max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    We use cookies and similar tracking technologies to enhance your experience on AsarBoard. Cookies are small data files stored on your device that help us remember your preferences and understand how you use our platform.
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Types of Cookies We Use</h3>
                  <div className="space-y-4">
                    <div className="border border-amber-100 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Essential Cookies</h4>
                      <p className="text-gray-600 text-sm">Required for basic platform functionality, such as maintaining your session and room connection.</p>
                    </div>
                    <div className="border border-amber-100 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Preference Cookies</h4>
                      <p className="text-gray-600 text-sm">Remember your settings, such as language preference and display options.</p>
                    </div>
                    <div className="border border-amber-100 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Analytics Cookies</h4>
                      <p className="text-gray-600 text-sm">Help us understand how users interact with our platform to improve our services.</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Managing Cookies</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Most web browsers allow you to control cookies through their settings. You can set your browser to refuse all cookies, accept only certain cookies, or notify you when a cookie is set. However, disabling essential cookies may limit your ability to use certain features of AsarBoard.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights Section */}
            <section id="rights" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <User className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Rights & Choices</h2>
                </div>

                <div className="prose prose-emerald max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Depending on your location, you may have certain rights regarding your personal information. We are committed to helping you exercise these rights.
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Your Rights Include</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Access</p>
                        <p className="text-gray-600 text-sm">Request a copy of your personal information</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Correction</p>
                        <p className="text-gray-600 text-sm">Request correction of inaccurate information</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Deletion</p>
                        <p className="text-gray-600 text-sm">Request deletion of your personal information</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Portability</p>
                        <p className="text-gray-600 text-sm">Request transfer of your data to another service</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Opt-Out</p>
                        <p className="text-gray-600 text-sm">Opt-out of marketing communications</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Restriction</p>
                        <p className="text-gray-600 text-sm">Request restriction of certain data processing</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">How to Exercise Your Rights</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To exercise any of these rights, please contact us at{' '}
                    <a href="mailto:privacy@asarboard.com" className="text-emerald-600 hover:underline font-medium">
                      privacy@asarboard.com
                    </a>
                    . We will respond to your request within 30 days and may need to verify your identity before processing your request.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="scroll-mt-24">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                </div>

                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    We value your feedback and questions about our Privacy Policy and Terms of Service. If you have any questions or concerns, please don't hesitate to contact us.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                      <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <Mail size={20} />
                        Email Support
                      </h3>
                      <div className="space-y-3 text-blue-800">
                        <div>
                          <p className="text-sm font-semibold">General Inquiries</p>
                          <a href="mailto:support@asarboard.com" className="text-blue-600 hover:underline text-sm">
                            support@asarboard.com
                          </a>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Privacy Questions</p>
                          <a href="mailto:privacy@asarboard.com" className="text-blue-600 hover:underline text-sm">
                            privacy@asarboard.com
                          </a>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Legal Matters</p>
                          <a href="mailto:legal@asarboard.com" className="text-blue-600 hover:underline text-sm">
                            legal@asarboard.com
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                      <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                        <Globe size={20} />
                        Additional Resources
                      </h3>
                      <div className="space-y-3 text-emerald-800">
                        <div>
                          <p className="text-sm font-semibold">Help Center</p>
                          <Link to="/guide" className="text-emerald-600 hover:underline text-sm">
                            User Guide & Tutorials
                          </Link>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">FAQ</p>
                          <Link to="/faq" className="text-emerald-600 hover:underline text-sm">
                            Frequently Asked Questions
                          </Link>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Blog</p>
                          <Link to="/blog" className="text-emerald-600 hover:underline text-sm">
                            Latest Updates & Tips
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-3">Response Time</h3>
                    <p className="text-gray-600 text-sm">
                      We strive to respond to all inquiries within 48 hours during business days (Sunday-Thursday, 9 AM - 5 PM GST). For urgent matters related to session security or inappropriate content, please mark your email as "Urgent" and we will prioritize your request.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Updates Section */}
            <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Policy Updates</h2>
              <p className="text-white/90 leading-relaxed mb-6">
                We may update this Privacy Policy and Terms of Service from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
              <p className="text-white/80 text-sm">
                Your continued use of AsarBoard after any changes indicates your acceptance of the updated terms. We encourage you to review this page periodically for the latest information on our privacy and terms practices.
              </p>
            </section>
          </motion.div>
        </div>
      </div>

      {/* Footer CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of educators using AsarBoard to create engaging learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/new-session"
              className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg"
            >
              Create New Session
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper function for class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
