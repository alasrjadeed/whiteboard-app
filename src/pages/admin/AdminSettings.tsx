import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Globe, Mail, Palette, Database, Settings, CheckCircle, CreditCard, AlertCircle, HardDrive, Cloud } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'email' | 'payments' | 'storage'>('general');
  const [saved, setSaved] = useState(false);

  // PayPal sandbox credentials
  const [paypalClientId, setPaypalClientId] = useState('');
  const [paypalClientSecret, setPaypalClientSecret] = useState('');
  const [paypalSandboxMode, setPaypalSandboxMode] = useState(true);

  // Social media toggles
  const [facebookSharing, setFacebookSharing] = useState(true);
  const [instagramSharing, setInstagramSharing] = useState(true);
  const [googleSharing, setGoogleSharing] = useState(true);
  const [marketingAnalytics, setMarketingAnalytics] = useState(true);

  const handleSave = () => {
    setSaved(true);
    // Save to localStorage
    localStorage.setItem('paypalClientId', paypalClientId);
    localStorage.setItem('paypalClientSecret', paypalClientSecret);
    localStorage.setItem('paypalSandboxMode', paypalSandboxMode.toString());
    localStorage.setItem('facebookSharing', facebookSharing.toString());
    localStorage.setItem('instagramSharing', instagramSharing.toString());
    localStorage.setItem('googleSharing', googleSharing.toString());
    localStorage.setItem('marketingAnalytics', marketingAnalytics.toString());
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'branding', name: 'Branding', icon: Palette },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'storage', name: 'Storage & Privacy', icon: Database },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">Configure your platform settings</p>
          </div>
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-emerald-600"
            >
              <CheckCircle size={20} />
              <span className="font-medium">Settings saved!</span>
            </motion.div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2",
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Name
                </label>
                <input
                  type="text"
                  defaultValue="AsarBoard"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform URL
                </label>
                <input
                  type="url"
                  defaultValue="https://asarboard.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Language
                </label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all">
                  <option>English</option>
                  <option>Arabic</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all">
                  <option>UTC (GMT+0)</option>
                  <option>GST (GMT+4)</option>
                  <option>EST (GMT-5)</option>
                  <option>PST (GMT-8)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Branding Settings */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Branding Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  defaultValue="https://asarboard.com/logo.png"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon URL
                </label>
                <input
                  type="url"
                  defaultValue="https://asarboard.com/favicon.ico"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-4">
                  <input
                    type="color"
                    defaultValue="#059669"
                    className="w-20 h-12 rounded-xl border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    defaultValue="#059669"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-4">
                  <input
                    type="color"
                    defaultValue="#0891b2"
                    className="w-20 h-12 rounded-xl border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    defaultValue="#0891b2"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Email Settings (SMTP)</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  defaultValue="smtp.gmail.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Port
                </label>
                <input
                  type="number"
                  defaultValue="587"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Username
                </label>
                <input
                  type="email"
                  defaultValue="noreply@asarboard.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Password
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* PayPal Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                PayPal Payment Gateway
              </h2>
              
              {/* Sandbox Mode Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-900">Sandbox Mode</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    You are currently in sandbox/test mode. No real transactions will be processed.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">PayPal Settings</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sandbox Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={paypalSandboxMode} onChange={(e) => setPaypalSandboxMode(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PayPal Client ID
                  </label>
                  <input
                    type="text"
                    value={paypalClientId}
                    onChange={(e) => setPaypalClientId(e.target.value)}
                    placeholder="Enter your PayPal Client ID"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get this from your PayPal Developer Dashboard
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PayPal Client Secret
                  </label>
                  <input
                    type="password"
                    value={paypalClientSecret}
                    onChange={(e) => setPaypalClientSecret(e.target.value)}
                    placeholder="Enter your PayPal Client Secret"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Keep this secret and never share it
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media & Marketing */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-600" />
                Social Media & Marketing
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">f</div>
                    <div>
                      <span className="font-medium text-gray-700">Facebook Post Sharing</span>
                      <p className="text-xs text-gray-500">Allow sharing to Facebook</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={facebookSharing} onChange={(e) => setFacebookSharing(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">📷</div>
                    <div>
                      <span className="font-medium text-gray-700">Instagram Post Sharing</span>
                      <p className="text-xs text-gray-500">Allow sharing to Instagram</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={instagramSharing} onChange={(e) => setInstagramSharing(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center font-bold text-sm">
                      <span className="text-red-500">G</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Google Post Sharing</span>
                      <p className="text-xs text-gray-500">Allow sharing to Google</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={googleSharing} onChange={(e) => setGoogleSharing(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Marketing Analytics</span>
                      <p className="text-xs text-gray-500">Track marketing performance</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={marketingAnalytics} onChange={(e) => setMarketingAnalytics(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Storage & Privacy Settings */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            {/* Privacy Notice */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-emerald-900 text-lg">Privacy-First Design</h3>
                  <p className="text-sm text-emerald-700 mt-2">
                    AsarBoard is designed with privacy as the top priority. No student or teacher data is stored on our servers. All work is saved locally on your device.
                  </p>
                </div>
              </div>
            </div>

            {/* Local Storage Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <HardDrive className="w-6 h-6 text-emerald-600" />
                Local Storage Settings
              </h2>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm opacity-80">Storage Location</p>
                      <p className="text-2xl font-bold">Local Device Only</p>
                    </div>
                    <HardDrive size={48} className="opacity-50" />
                  </div>
                  <p className="text-sm opacity-80">All work is saved on your PC/USB drive. No cloud storage required.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max File Upload Size (MB)
                  </label>
                  <input
                    type="number"
                    defaultValue="50"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Files are stored locally on your device
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Auto-Save Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-700">Auto-save to local device</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-700">Save to USB drive on class end</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-700">Clear session data after save</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Cloud Integration */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Cloud className="w-6 h-6 text-blue-600" />
                Optional Cloud Integration
              </h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-700">
                  <strong>Note:</strong> Cloud storage is completely optional and only enabled if your school requires it. By default, all data is stored locally.
                </p>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">G</div>
                    <div>
                      <span className="font-medium text-gray-700">Google Drive Integration</span>
                      <p className="text-xs text-gray-500">Optional - Only if school requires cloud backup</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">O</div>
                    <div>
                      <span className="font-medium text-gray-700">OneDrive Integration</span>
                      <p className="text-xs text-gray-500">Optional - Only if school requires cloud backup</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">D</div>
                    <div>
                      <span className="font-medium text-gray-700">Dropbox Integration</span>
                      <p className="text-xs text-gray-500">Optional - Only if school requires cloud backup</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              setActiveTab('general');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            <Save size={18} />
            Save All Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

// Helper function
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
