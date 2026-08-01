import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import API from '../../api';
import BookCover from '../../components/book/BookCover';
import { FiDollarSign, FiBookOpen, FiActivity, FiArrowRight, FiUploadCloud } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const AuthorDashboard = () => {
  const { user, refreshUserData } = useAuth();
  const { books, orders, withdrawals } = useAppState();
  const [payingMem, setPayingMem] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    refreshUserData();
  }, []);

  // One-time Author Membership Paywall Check
  if (user && user.role === 'author' && !user.isMember) {
    const handlePayMembership = async () => {
      setPayingMem(true);
      try {
        // 1. Create membership order
        const res = await API.post('/auth/membership/create/', { userId: user.id });
        const { key, amount, orderId } = res.data;

        // 2. Configure Razorpay checkout
        const options = {
          key: key,
          amount: amount,
          currency: "INR",
          name: "VerseShelf CreatorDesk",
          description: "One-time Author Membership Activation Fee",
          order_id: orderId,
          handler: async function (response) {
            try {
              setPayingMem(true);
              // 3. Verify signature
              const verifyRes = await API.post('/auth/membership/verify/', {
                userId: user.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data.status === "Success") {
                await refreshUserData();
                alert("Welcome to the shelf! Your creator desk is now unlocked.");
              } else {
                alert("Payment verification failed. Please try again.");
              }
            } catch (err) {
              console.error(err);
              alert("Verification error.");
            } finally {
              setPayingMem(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email
          },
          theme: {
            color: "#0F2922"
          },
          modal: {
            ondismiss: function () {
              setPayingMem(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error(err);
        alert("Failed to initiate membership payment.");
        setPayingMem(false);
      }
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-brand-warmwhite">
        <div className="max-w-xl w-full bg-white border border-brand-darkgreen/5 p-8 rounded-3xl shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
            👑
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-black text-brand-darkgreen">{t('membership.title')}</h2>
            <p className="text-sm font-light text-brand-charcoal/60 max-w-md mx-auto">
              {t('membership.desc')}
            </p>
          </div>

          <div className="bg-brand-cream/35 border border-brand-darkgreen/5 rounded-2xl p-5 space-y-3.5 text-left max-w-md mx-auto">
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-darkgreen">{t('membership.privileges')}</h4>
            <ul className="text-xs font-light text-brand-charcoal/85 space-y-2">
              <li className="flex items-center space-x-2">
                <span className="text-brand-gold font-bold">✓</span>
                <span>{t('membership.p1')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-brand-gold font-bold">✓</span>
                <span>{t('membership.p2')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-brand-gold font-bold">✓</span>
                <span>{t('membership.p3')}</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 max-w-sm mx-auto">
            <button
              onClick={handlePayMembership}
              disabled={payingMem}
              className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-3.5 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 text-sm"
            >
              {payingMem ? t('membership.processing') : t('membership.unlock')}
            </button>
            <p className="text-[10px] text-brand-charcoal/40 mt-3 font-light">
              {t('membership.secure')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter books uploaded by this author
  const authorBooks = books.filter(b => b.authorId && user && b.authorId.toString() === user.id.toString());
  
  // Filter completed sales/orders of this author's books
  const authorSales = orders.filter(o => 
    o.authorId && user && o.authorId.toString() === user.id.toString() && o.status === 'Completed'
  );

  // Math totals
  const totalSalesCount = authorSales.length;
  
  // Dynamic earnings calculation (cast Decimal string to Number)
  const totalEarnings = authorSales.reduce((acc, curr) => acc + Number(curr.earnings || 0), 0);

  // Withdrawals
  const authorWithdrawals = withdrawals.filter(w => w.author && user && w.author.toString() === user.id.toString());
  const pendingWithdrawalAmount = authorWithdrawals
    .filter(w => w.status === 'Pending')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const recentSales = authorSales.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-brand-darkgreen text-brand-cream p-8 rounded-3xl border border-brand-gold/15 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="space-y-2 z-10">
          <span className="text-[10px] bg-brand-gold/20 text-brand-gold border border-brand-gold/25 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Author Console</span>
          <h1 className="text-3xl font-serif font-black text-brand-warmwhite">Creator Desk: {user?.name}</h1>
          <p className="text-sm font-light text-brand-cream/80 max-w-md">Upload and manage poetry manuscripts, view sales commissions, and withdraw royalty earnings.</p>
        </div>
        <Link 
          to="/author/upload"
          className="bg-brand-gold text-brand-darkgreen hover:bg-brand-warmwhite hover:text-brand-darkgreen font-semibold text-xs px-6 py-3 rounded-full shadow transition-all duration-300 z-10 flex items-center space-x-2"
        >
          <FiUploadCloud />
          <span>Upload Manuscript</span>
        </Link>
      </div>

      {/* Author Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
            <FiDollarSign />
          </div>
          <div>
            <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-wider font-semibold block">Total Net Earnings</span>
            <span className="text-2xl font-serif font-bold text-brand-darkgreen">₹{totalEarnings.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
            <FiActivity />
          </div>
          <div>
            <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-wider font-semibold block">Total Sales Count</span>
            <span className="text-2xl font-serif font-bold text-brand-darkgreen">{totalSalesCount} units</span>
          </div>
        </div>

        <div className="bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
            <FiBookOpen />
          </div>
          <div>
            <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-wider font-semibold block">Books Published</span>
            <span className="text-2xl font-serif font-bold text-brand-darkgreen">{authorBooks.length} titles</span>
          </div>
        </div>

        <div className="bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
            <FiDollarSign className="text-amber-700" />
          </div>
          <div>
            <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-wider font-semibold block">Withdrawing / Pending</span>
            <span className="text-2xl font-serif font-bold text-brand-darkgreen">₹{pendingWithdrawalAmount.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Main Console Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Sales History */}
        <div className="lg:col-span-8 bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-baseline mb-6 pb-2 border-b border-brand-cream">
            <h3 className="text-lg font-serif font-bold text-brand-darkgreen">Recent Sales & Commission</h3>
            <Link to="/author/books" className="text-xs font-semibold text-brand-gold hover:underline">View Sales History</Link>
          </div>

          {recentSales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-cream/45 text-brand-darkgreen border-b border-brand-darkgreen/5 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-3">Date</th>
                    <th className="p-3">Book Title</th>
                    <th className="p-3">List Price</th>
                    <th className="p-3 text-red-600">Commission</th>
                    <th className="p-3 text-emerald-700">Your Royalty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream/50 text-brand-charcoal/80 text-xs">
                  {recentSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-brand-cream/10 transition-colors">
                      <td className="p-3 font-light">{sale.date}</td>
                      <td className="p-3 font-serif font-bold text-brand-darkgreen">{sale.bookTitle}</td>
                      <td className="p-3 font-medium">₹{sale.price}</td>
                      <td className="p-3 text-red-500 font-medium">-₹{sale.commission}</td>
                      <td className="p-3 text-emerald-600 font-bold">₹{sale.earnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-brand-charcoal/40 text-xs font-light">
              No royalties processed yet. Share your book links to start earning!
            </div>
          )}
        </div>

        {/* Right: Wallet Balance & Quick Withdraw */}
        <div className="lg:col-span-4 bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-brand-darkgreen mb-4 pb-2 border-b border-brand-cream">My Wallet</h3>
            <div className="bg-brand-cream/25 border border-brand-darkgreen/5 rounded-xl p-5 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-charcoal/40 block">Withdrawable Balance</span>
              <span className="text-3xl font-black text-brand-darkgreen mt-1 block">₹{Number(user?.balance || 0).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-3 mt-6">
            <Link 
              to="/author/withdraw" 
              className="w-full text-center block bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen text-xs font-semibold py-3.5 rounded-xl transition-all duration-300"
            >
              Request Royalty Payout
            </Link>
            <p className="text-[10px] text-center text-brand-charcoal/40 font-light">
              Payout requests are usually processed to your designated bank account within 24 hours.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthorDashboard;
