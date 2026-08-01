import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiUser, FiLogOut, FiBookOpen, FiSettings, FiMenu, FiX, FiGlobe } from 'react-icons/fi';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    return `/${user.role}/dashboard`;
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem('verseshelf_lang', newLang);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-warmwhite text-brand-charcoal">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full glass border-b border-brand-darkgreen/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-serif font-bold text-brand-darkgreen tracking-wide">
                  Verse<span className="text-brand-gold">Shelf</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/20 font-sans font-medium uppercase tracking-widest hidden sm:inline-block">Beta</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 text-sm font-medium animate-fade-in">
              <Link 
                to="/" 
                className={`transition-colors duration-200 hover:text-brand-darkgreen ${location.pathname === '/' ? 'text-brand-darkgreen border-b-2 border-brand-gold pb-1' : 'text-brand-charcoal/75'}`}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/browse" 
                className={`transition-colors duration-200 hover:text-brand-darkgreen ${location.pathname === '/browse' ? 'text-brand-darkgreen border-b-2 border-brand-gold pb-1' : 'text-brand-charcoal/75'}`}
              >
                {t('nav.browse')}
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden sm:block flex-1 max-w-xs mx-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder={t('browse.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-cream/50 pl-10 pr-4 py-2 rounded-full border border-brand-darkgreen/15 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold placeholder-brand-charcoal/40 transition-all duration-300"
                />
                <FiSearch className="absolute left-3.5 top-3 text-brand-charcoal/40 text-base" />
              </form>
            </div>

            {/* Language Switcher dropdown */}
            <div className="flex items-center space-x-2 mr-3 bg-brand-cream/35 border border-brand-darkgreen/10 rounded-full px-2.5 py-1 text-brand-darkgreen">
              <FiGlobe className="text-xs text-brand-gold" />
              <select 
                value={i18n.language}
                onChange={handleLanguageChange}
                className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer text-brand-darkgreen"
              >
                <option value="en">EN</option>
                <option value="or">ଓଡ଼ିଆ</option>
              </select>
            </div>

            {/* User Session Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 focus:outline-none border border-brand-darkgreen/10 rounded-full py-1.5 px-3 hover:bg-brand-cream/50 transition-colors"
                  >
                    <img 
                      src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"} 
                      alt={user.name} 
                      className="w-7 h-7 rounded-full object-cover border border-brand-gold/30"
                    />
                    <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-brand-darkgreen/10 shadow-xl py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-brand-cream">
                        <p className="text-xs text-brand-charcoal/50 uppercase tracking-widest font-semibold">{user.role}</p>
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-brand-charcoal/60 truncate">{user.email}</p>
                      </div>
                      <Link 
                        to={getDashboardLink()}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-brand-charcoal hover:bg-brand-cream hover:text-brand-darkgreen transition-colors"
                      >
                        <FiBookOpen className="mr-3 text-brand-gold" /> {t('nav.dashboard')}
                      </Link>
                      <Link 
                        to={`/${user.role}/profile`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-brand-charcoal hover:bg-brand-cream hover:text-brand-darkgreen transition-colors"
                      >
                        <FiUser className="mr-3 text-brand-gold" /> {t('nav.profile')}
                      </Link>
                      <button
                        onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-brand-cream"
                      >
                        <FiLogOut className="mr-3" /> {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="text-sm font-medium hover:text-brand-darkgreen px-4 py-2 transition-colors"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-sm font-medium bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-darkgreen/90 px-5 py-2.5 rounded-full shadow-sm transition-all hover:shadow-md"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-2">
              {user && (
                <Link to={getDashboardLink()} className="p-2 border border-brand-darkgreen/15 rounded-full">
                  <img src={user.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-brand-darkgreen focus:outline-none border border-brand-darkgreen/15 rounded-full"
              >
                {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass border-t border-brand-darkgreen/10 py-4 px-6 space-y-4 shadow-inner animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder={t('browse.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-cream/50 pl-10 pr-4 py-2 rounded-full border border-brand-darkgreen/15 text-sm placeholder-brand-charcoal/40"
              />
              <FiSearch className="absolute left-3.5 top-3 text-brand-charcoal/40" />
            </form>
            <div className="flex flex-col space-y-3 font-medium">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 border-b border-brand-cream hover:text-brand-darkgreen"
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/browse" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 border-b border-brand-cream hover:text-brand-darkgreen"
              >
                {t('nav.browse')}
              </Link>
              {user ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-1 border-b border-brand-cream hover:text-brand-darkgreen"
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <Link 
                    to={`/${user.role}/profile`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-1 border-b border-brand-cream hover:text-brand-darkgreen"
                  >
                    {t('nav.profile')}
                  </Link>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                    className="text-left py-1 text-red-600 font-semibold"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-full border border-brand-darkgreen/20 hover:bg-brand-cream"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-full bg-brand-darkgreen text-brand-warmwhite font-medium"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="bg-brand-darkgreen text-brand-cream py-16 border-t border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <span className="text-2xl font-serif font-bold text-brand-warmwhite">
                Verse<span className="text-brand-gold">Shelf</span>
              </span>
              <p className="text-brand-cream/70 text-sm font-light leading-relaxed">
                Empowering independent poets and authors to publish and monetize their beautiful words directly.
              </p>
            </div>
            
            {/* Quick links */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold">Links</h4>
              <div className="flex flex-col space-y-1.5 text-sm text-brand-cream/70 font-light">
                <Link to="/">{t('nav.home')}</Link>
                <Link to="/browse">{t('nav.browse')}</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
