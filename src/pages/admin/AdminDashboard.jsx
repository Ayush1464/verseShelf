import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import API from '../../api';
import { FiDollarSign, FiUsers, FiBookOpen, FiClock, FiSettings, FiActivity } from 'react-icons/fi';

const AdminDashboard = () => {
  const { books, orders, withdrawals, commissionRate } = useAppState();
  const [totalAuthorsCount, setTotalAuthorsCount] = useState(0);

  useEffect(() => {
    const fetchAuthorsCount = async () => {
      try {
        const response = await API.get('/authors/');
        setTotalAuthorsCount(response.data.length);
      } catch (error) {
        console.error("Failed to load author count from database:", error);
      }
    };
    fetchAuthorsCount();
  }, []);

  // Filter completed orders
  const completedOrders = orders.filter(o => o.status === 'Completed');

  // Math totals
  const totalRevenue = completedOrders.reduce((acc, curr) => acc + Number(curr.commission || 0), 0);
  const totalBooksCount = books.length;
  const totalOrdersCount = completedOrders.length;

  // Pending tasks
  const pendingApprovals = books.filter(b => !b.approved);
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'Pending');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-brand-darkgreen text-brand-cream p-8 rounded-3xl border border-brand-gold/15 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="space-y-2 z-10">
          <span className="text-[10px] bg-brand-gold/20 text-brand-gold border border-brand-gold/25 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Admin Control</span>
          <h1 className="text-3xl font-serif font-black text-brand-warmwhite">VerseShelf Moderator Console</h1>
          <p className="text-sm font-light text-brand-cream/80 max-w-md">Moderate book submissions, review author payout requests, configure global commission rates, and track global transactions.</p>
        </div>
        <Link 
          to="/admin/commissions"
          className="bg-brand-gold text-brand-darkgreen hover:bg-brand-warmwhite hover:text-brand-darkgreen font-semibold text-xs px-6 py-3 rounded-full shadow transition-all duration-300 z-10 flex items-center space-x-1.5"
        >
          <FiSettings />
          <span>Commission Settings</span>
        </Link>
      </div>

      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
            <FiDollarSign className="text-emerald-700" />
          </div>
          <div>
            <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-wider font-semibold block">Commission Revenue</span>
            <span className="text-2xl font-serif font-bold text-brand-darkgreen">₹{totalRevenue}</span>
          </div>
        </div>

        <div className="bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
            <FiUsers />
          </div>
          <div>
            <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-wider font-semibold block">Total Authors</span>
            <span className="text-2xl font-serif font-bold text-brand-darkgreen">{totalAuthorsCount}</span>
          </div>
        </div>

        <div className="bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
            <FiBookOpen />
          </div>
          <div>
            <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-wider font-semibold block">Catalog Titles</span>
            <span className="text-2xl font-serif font-bold text-brand-darkgreen">{totalBooksCount}</span>
          </div>
        </div>

        <div className="bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
            <FiClock />
          </div>
          <div>
            <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-wider font-semibold block">Completed Sales</span>
            <span className="text-2xl font-serif font-bold text-brand-darkgreen">{totalOrdersCount}</span>
          </div>
        </div>

      </div>

      {/* Tasks Queue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Books Pending Review */}
        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-baseline pb-2 border-b border-brand-cream">
            <h3 className="text-lg font-serif font-bold text-brand-darkgreen flex items-center">
              <FiActivity className="text-brand-gold mr-2" /> Book Approval Queue
            </h3>
            <Link to="/admin/books" className="text-xs font-semibold text-brand-gold hover:underline">Manage Titles</Link>
          </div>

          {pendingApprovals.length > 0 ? (
            <div className="divide-y divide-brand-cream/50">
              {pendingApprovals.slice(0, 3).map(book => (
                <div key={book.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brand-darkgreen">{book.title}</h4>
                    <span className="text-[10px] text-brand-charcoal/50">by {book.authorName} • {book.category}</span>
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-brand-charcoal/40 text-center py-6">All book submissions have been processed.</p>
          )}
        </div>

        {/* Withdrawal Payout Queue */}
        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-baseline pb-2 border-b border-brand-cream">
            <h3 className="text-lg font-serif font-bold text-brand-darkgreen flex items-center">
              <FiActivity className="text-brand-gold mr-2" /> Payout Approvals Queue
            </h3>
            <Link to="/admin/withdrawals" className="text-xs font-semibold text-brand-gold hover:underline">Manage Payouts</Link>
          </div>

          {pendingWithdrawals.length > 0 ? (
            <div className="divide-y divide-brand-cream/50">
              {pendingWithdrawals.slice(0, 3).map(req => (
                <div key={req.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                  <div>
                    <h4 className="font-semibold text-sm text-brand-darkgreen">₹{req.amount}</h4>
                    <span className="text-[10px] text-brand-charcoal/50">Author ID: {req.author}</span>
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                    Awaiting Payout
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-brand-charcoal/40 text-center py-6">No pending author withdrawal requests.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
