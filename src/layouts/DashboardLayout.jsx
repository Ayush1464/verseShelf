import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiGrid, FiBookOpen, FiFileText, FiUser, FiLogOut, FiUploadCloud, 
  FiBook, FiDollarSign, FiCreditCard, FiUsers, FiActivity, FiSettings, 
  FiMenu, FiX, FiChevronRight, FiHome 
} from 'react-icons/fi';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define sidebar navigation items based on user role
  const getNavItems = () => {
    switch (user.role) {
      case 'reader':
        return [
          { name: 'Dashboard', path: '/reader/dashboard', icon: <FiGrid /> },
          { name: 'Purchased Books', path: '/reader/purchased', icon: <FiBookOpen /> },
          { name: 'Purchase History', path: '/reader/history', icon: <FiFileText /> },
          { name: 'Profile Settings', path: '/reader/profile', icon: <FiUser /> },
        ];
      case 'author':
        return [
          { name: 'Overview', path: '/author/dashboard', icon: <FiGrid /> },
          { name: 'Upload New Book', path: '/author/upload', icon: <FiUploadCloud /> },
          { name: 'Manage Books', path: '/author/books', icon: <FiBook /> },
          { name: 'Sales History', path: '/author/sales', icon: <FiDollarSign /> },
          { name: 'Earnings & Withdraw', path: '/author/withdrawal', icon: <FiCreditCard /> },
          { name: 'Profile Settings', path: '/author/profile', icon: <FiUser /> },
        ];
      case 'admin':
        return [
          { name: 'Console', path: '/admin/dashboard', icon: <FiGrid /> },
          { name: 'Books Approvals', path: '/admin/books', icon: <FiBook /> },
          { name: 'Withdraw Requests', path: '/admin/withdrawals', icon: <FiCreditCard /> },
          { name: 'Commission Settings', path: '/admin/commissions', icon: <FiSettings /> },
          { name: 'Manage Authors', path: '/admin/authors', icon: <FiActivity /> },
          { name: 'Manage Publishers', path: '/admin/publishers', icon: <FiBookOpen /> },
          { name: 'Manage Users', path: '/admin/users', icon: <FiUsers /> },
          { name: 'All Orders', path: '/admin/orders', icon: <FiFileText /> },
        ];
      case 'publisher':
        return [
          { name: 'Console Overview', path: '/publisher/dashboard', icon: <FiGrid /> },
          { name: 'Publish Booklet', path: '/publisher/upload', icon: <FiUploadCloud /> },
          { name: 'Booklet Catalog', path: '/publisher/books', icon: <FiBook /> },
          { name: 'Profile Settings', path: '/publisher/profile', icon: <FiUser /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-brand-warmwhite text-brand-charcoal flex">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-darkgreen text-brand-cream border-r border-brand-gold/10">
        <div className="h-20 flex items-center px-6 border-b border-brand-cream/10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-serif font-bold text-brand-warmwhite">
              Verse<span className="text-brand-gold">Shelf</span>
            </span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-6 border-b border-brand-cream/10 flex items-center space-x-3">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-10 h-10 rounded-full object-cover border border-brand-gold/40"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold truncate text-brand-warmwhite">{user.name}</h4>
            <span className="inline-block text-[10px] tracking-wider uppercase font-medium bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/15 mt-0.5">{user.role}</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-brand-gold text-brand-darkgreen shadow-md font-semibold' 
                    : 'text-brand-cream/80 hover:bg-brand-cream/5 hover:text-brand-warmwhite'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-brand-cream/10 space-y-1">
          <Link
            to="/"
            className="flex items-center px-4 py-2.5 rounded-lg text-xs font-medium text-brand-cream/65 hover:bg-brand-cream/5 hover:text-brand-warmwhite transition-colors"
          >
            <FiHome className="text-sm mr-3" /> Back to Main Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <FiLogOut className="text-sm mr-3" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center justify-between px-6 bg-brand-darkgreen text-brand-cream border-b border-brand-gold/10">
          <Link to="/" className="text-lg font-serif font-bold text-brand-warmwhite">
            Verse<span>Shelf</span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 border border-brand-cream/10 rounded-lg hover:bg-brand-cream/5 focus:outline-none"
          >
            {isSidebarOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
          </button>
        </header>

        {/* Mobile Sidebar overlay */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            
            {/* Sidebar content */}
            <div className="relative w-64 bg-brand-darkgreen text-brand-cream flex flex-col z-10 border-r border-brand-gold/10">
              <div className="h-16 flex items-center justify-between px-6 border-b border-brand-cream/10">
                <span className="text-lg font-serif font-bold text-brand-warmwhite">VerseShelf</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-brand-cream">
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* User info */}
              <div className="p-6 border-b border-brand-cream/10 flex items-center space-x-3">
                <img src={user.avatar} className="w-10 h-10 rounded-full object-cover border border-brand-gold/30" alt="" />
                <div>
                  <h4 className="text-sm font-semibold truncate text-brand-warmwhite">{user.name}</h4>
                  <span className="text-[10px] tracking-wider uppercase font-medium bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded mt-0.5">{user.role}</span>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-brand-gold text-brand-darkgreen shadow-md font-semibold' 
                          : 'text-brand-cream/80 hover:bg-brand-cream/5'
                      }`}
                    >
                      <span className="text-lg mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-brand-cream/10 space-y-1">
                <Link to="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center px-4 py-2.5 rounded-lg text-xs text-brand-cream/65">
                  <FiHome className="text-sm mr-3" /> Main Site
                </Link>
                <button onClick={() => { setIsSidebarOpen(false); handleLogout(); }} className="w-full flex items-center px-4 py-2.5 rounded-lg text-xs text-red-400">
                  <FiLogOut className="text-sm mr-3" /> Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Pages Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-brand-warmwhite/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
