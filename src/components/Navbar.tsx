import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Pencil, Plus, LogIn, UserPlus, Globe, DollarSign, MapPin, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// GCC Countries data
const gccCountries = [
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', currency: 'KWD' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', currency: 'QAR' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', currency: 'BHD' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', currency: 'OMR' },
];

// Currencies data
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
  { code: 'QAR', symbol: '﷼', name: 'Qatari Riyal' },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar' },
  { code: 'OMR', symbol: '﷼', name: 'Omani Rial' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

// Languages data
const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'de', name: 'German', native: 'Deutsch' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(gccCountries[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const location = useLocation();

  const navLinks = [
    { name: 'Pricing', path: '/pricing' },
    { name: 'FAQ', path: '/faq' },
    { name: 'User Guide', path: '/guide' },
    { name: 'Blog', path: '/blog' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Bar - GCC Country, Currency, Language */}
      <div className="bg-gray-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left side - GCC selectors */}
          <div className="flex items-center gap-4 text-xs">
            {/* Country Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCountryDropdown(!showCountryDropdown);
                  setShowCurrencyDropdown(false);
                  setShowLanguageDropdown(false);
                }}
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              >
                <MapPin size={14} />
                <span className="hidden sm:inline">{selectedCountry.flag} {selectedCountry.name}</span>
                <span className="sm:hidden">{selectedCountry.flag}</span>
                <ChevronDown size={12} />
              </button>
              
              <AnimatePresence>
                {showCountryDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-900 rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="max-h-64 overflow-y-auto">
                      {gccCountries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowCountryDropdown(false);
                            // Auto-select currency for country
                            const countryCurrency = currencies.find(c => c.code === country.currency);
                            if (countryCurrency) setSelectedCurrency(countryCurrency);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span className="text-sm">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCurrencyDropdown(!showCurrencyDropdown);
                  setShowCountryDropdown(false);
                  setShowLanguageDropdown(false);
                }}
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              >
                <DollarSign size={14} />
                <span className="hidden sm:inline">{selectedCurrency.code} {selectedCurrency.symbol}</span>
                <span className="sm:hidden">{selectedCurrency.symbol}</span>
                <ChevronDown size={12} />
              </button>
              
              <AnimatePresence>
                {showCurrencyDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-1 w-40 bg-white text-gray-900 rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="max-h-64 overflow-y-auto">
                      {currencies.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => {
                            setSelectedCurrency(currency);
                            setShowCurrencyDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-emerald-50 flex items-center justify-between transition-colors"
                        >
                          <span className="text-sm font-medium">{currency.code}</span>
                          <span className="text-xs text-gray-500">{currency.symbol}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLanguageDropdown(!showLanguageDropdown);
                  setShowCountryDropdown(false);
                  setShowCurrencyDropdown(false);
                }}
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              >
                <Globe size={14} />
                <span className="hidden sm:inline">{selectedLanguage.native}</span>
                <span className="sm:hidden">{selectedLanguage.code.toUpperCase()}</span>
                <ChevronDown size={12} />
              </button>
              
              <AnimatePresence>
                {showLanguageDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-1 w-40 bg-white text-gray-900 rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="max-h-64 overflow-y-auto">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLanguage(lang);
                            setShowLanguageDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-emerald-50 flex items-center justify-between transition-colors"
                        >
                          <span className="text-sm">{lang.native}</span>
                          <span className="text-xs text-gray-500">{lang.code.toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side - Additional info */}
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline text-gray-400">🌍 Serving GCC Region</span>
            <span className="text-emerald-400 font-medium">✨ AsarBoard</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-8 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-emerald-500 p-1.5 rounded-lg">
                <Pencil className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">AsarBoard</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                    isActive(link.path)
                      ? 'border-emerald-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/new-session"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New session
            </Link>
            <Link
              to="/join-session"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full hover:bg-emerald-100 transition-all"
            >
              Join session
            </Link>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <Link
              to="/signin"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            {/* Mobile GCC Selectors */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Country</span>
                <select
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const country = gccCountries.find(c => c.code === e.target.value);
                    if (country) {
                      setSelectedCountry(country);
                      const countryCurrency = currencies.find(c => c.code === country.currency);
                      if (countryCurrency) setSelectedCurrency(countryCurrency);
                    }
                  }}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {gccCountries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Currency</span>
                <select
                  value={selectedCurrency.code}
                  onChange={(e) => {
                    const currency = currencies.find(c => c.code === e.target.value);
                    if (currency) setSelectedCurrency(currency);
                  }}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Language</span>
                <select
                  value={selectedLanguage.code}
                  onChange={(e) => {
                    const language = languages.find(l => l.code === e.target.value);
                    if (language) setSelectedLanguage(language);
                  }}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.native} ({lang.code.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-100 space-y-2">
                <Link
                  to="/new-session"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-4 py-3 text-base font-semibold text-white bg-emerald-600 rounded-xl"
                >
                  New session
                </Link>
                <Link
                  to="/join-session"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-4 py-3 text-base font-semibold text-emerald-700 bg-emerald-50 rounded-xl"
                >
                  Join session
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center px-4 py-3 text-base font-medium text-gray-600 bg-gray-50 rounded-xl"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center px-4 py-3 text-base font-medium text-gray-600 bg-gray-50 rounded-xl"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </>
  );
};
