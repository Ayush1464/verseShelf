import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import API from '../../api';
import BookCover from '../../components/book/BookCover';
import { FiDollarSign, FiBookOpen, FiActivity, FiArrowRight, FiUploadCloud, FiAward, FiClock } from 'react-icons/fi';

const PublisherDashboard = () => {
  const { user, refreshUserData } = useAuth();
  const { books, orders, withdrawals, requestWithdrawal, refreshData } = useAppState();
  
  const [wAmount, setWAmount] = useState('');
  const [wAccount, setWAccount] = useState('');
  const [wSubmitting, setWSubmitting] = useState(false);
  const [wSuccess, setWSuccess] = useState(false);
  const [payingMem, setPayingMem] = useState(false);

  useEffect(() => {
    refreshUserData();
    refreshData();
  }, []);

  const handlePayMembership = async () => {
    setPayingMem(true);
    try {
      const res = await API.post('/auth/membership/create/', { userId: user.id });
      const { key, amount, orderId } = res.data;

      const options = {
        key: key,
        amount: amount,
        currency: "INR",
        name: "VerseShelf PublisherDesk",
        description: "One-time Publisher Onboarding Fee",
        order_id: orderId,
        handler: async function (response) {
          try {
            setPayingMem(true);
            const verifyRes = await API.post('/auth/membership/verify/', {
              userId: user.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.status === "Success") {
              await refreshUserData();
              alert("Welcome to the shelf! Your publisher console is now unlocked.");
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

  if (user && !user.isMember) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-brand-warmwhite">
        <div className="max-w-xl w-full bg-white border border-brand-darkgreen/5 p-8 rounded-3xl shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
            🏢
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-bold text-brand-darkgreen">Publisher Activation Required</h2>
            <p className="text-sm font-light text-brand-charcoal/60 max-w-md mx-auto">
              Unlock your publishing console by paying the one-time publisher onboarding fee. This enables you to publish booklets for multiple authors, view commission splits, and manage distributions.
            </p>
          </div>

          <div className="bg-brand-cream/35 border border-brand-darkgreen/5 rounded-2xl p-5 space-y-3.5 text-left max-w-md mx-auto">
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-darkgreen">Onboarding Package Includes:</h4>
            <ul className="text-xs font-light text-brand-charcoal/85 space-y-2">
              <li className="flex items-center space-x-2">
                <span className="text-brand-gold font-bold">✓</span>
                <span>Unlimited multi-author booklet uploads</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-brand-gold font-bold">✓</span>
                <span>Group sales metrics & publisher earnings logs</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-brand-gold font-bold">✓</span>
                <span>Direct platform wallet payouts & priority approvals</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 max-w-sm mx-auto">
            <button
              onClick={handlePayMembership}
              disabled={payingMem}
              className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-3.5 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 text-sm"
            >
              {payingMem ? 'Processing...' : 'Pay Onboarding Fee (₹3,000.00)'}
            </button>
            <p className="text-[10px] text-brand-charcoal/40 mt-3 font-light">
              Secure encryption via Razorpay. One-time payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const publisherBooks = books.filter(b => b.authorId === user.id);
  const publisherOrders = orders.filter(o => o.status === 'Completed' && publisherBooks.some(pb => pb.id === o.bookId));
  const publisherWithdrawals = withdrawals.filter(w => w.author === user.id);

  // Group books & earnings by Author name
  const authorMetrics = publisherBooks.reduce((acc, book) => {
    const authorName = book.authorName || 'Unknown Author';
    if (!acc[authorName]) {
      acc[authorName] = {
        name: authorName,
        booksCount: 0,
        salesCount: 0,
        revenue: 0,
        royalties: 0
      };
    }
    acc[authorName].booksCount += 1;
    
    // Find sales for this book
    const bookSales = publisherOrders.filter(o => o.bookId === book.id);
    acc[authorName].salesCount += bookSales.length;
    
    const bookRev = bookSales.reduce((sum, o) => sum + Number(o.price), 0);
    const bookRoyalty = bookSales.reduce((sum, o) => sum + Number(o.earnings), 0);
    
    acc[authorName].revenue += bookRev;
    acc[authorName].royalties += bookRoyalty;
    
    return acc;
  }, {});

  const authorMetricsList = Object.values(authorMetrics).sort((a, b) => b.royalties - a.royalties);

  const totalSalesCount = publisherOrders.length;
  const totalRoyalties = publisherOrders.reduce((sum, o) => sum + Number(o.earnings), 0);

  const handleWithdrawalRequest = async (e) => {
    e.preventDefault();
    if (!wAmount || Number(wAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (Number(wAmount) > Number(user.balance)) {
      alert("Insufficient wallet balance.");
      return;
    }
    if (!wAccount.trim()) {
      alert("Please fill in your banking info.");
      return;
    }

    setWSubmitting(true);
    try {
      await requestWithdrawal(user.id, user.name, Number(wAmount), wAccount);
      setWSuccess(true);
      setWAmount('');
      setWAccount('');
      await refreshUserData();
      await refreshData();
      setTimeout(() => setWSuccess(false), 3000);
    } catch (err) {
      alert("Withdrawal request failed.");
    } finally {
      setWSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="pb-4 border-b border-brand-darkgreen/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Publisher Console</h1>
          <p className="text-sm font-light text-brand-charcoal/60 mt-1">
            Manage your authors, configure booklet pricing, and audit royalty distributions.
          </p>
        </div>
        <Link 
          to="/publisher/upload" 
          className="bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-300 flex items-center space-x-2 w-fit"
        >
          <FiUploadCloud className="text-sm" />
          <span>Publish New Booklet</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start text-brand-charcoal/50">
            <span className="text-xs uppercase tracking-wider font-semibold">Anthologies Published</span>
            <FiBookOpen className="text-brand-gold text-lg" />
          </div>
          <p className="text-3xl font-serif font-black text-brand-darkgreen mt-2">{publisherBooks.length}</p>
          <p className="text-[10px] text-brand-charcoal/50 mt-1">Across all associated writers</p>
        </div>

        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start text-brand-charcoal/50">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Copies Sold</span>
            <FiActivity className="text-brand-gold text-lg" />
          </div>
          <p className="text-3xl font-serif font-black text-brand-darkgreen mt-2">{totalSalesCount}</p>
          <p className="text-[10px] text-brand-charcoal/50 mt-1">Physical & digital deliveries</p>
        </div>

        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start text-brand-charcoal/50">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Sales Revenue</span>
            <FiDollarSign className="text-brand-gold text-lg" />
          </div>
          <p className="text-3xl font-serif font-black text-brand-darkgreen mt-2">₹{totalRoyalties.toFixed(2)}</p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">After commission payouts</p>
        </div>

        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start text-brand-charcoal/50">
            <span className="text-xs uppercase tracking-wider font-semibold">Payout Wallet</span>
            <FiDollarSign className="text-brand-gold text-lg" />
          </div>
          <p className="text-3xl font-serif font-black text-brand-darkgreen mt-2">₹{Number(user.balance).toFixed(2)}</p>
          <p className="text-[10px] text-brand-charcoal/50 mt-1">Available for bank payout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Author Shares & Catalog List */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Author-wise Analytics */}
          <div className="bg-white border border-brand-darkgreen/5 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-brand-darkgreen mb-4 flex items-center">
              <FiAward className="text-brand-gold mr-2" /> Publisher Authors Breakdown
            </h3>
            {authorMetricsList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-brand-cream/30 text-brand-darkgreen border-b border-brand-darkgreen/5">
                      <th className="p-3 font-semibold uppercase tracking-wider">Writer / Author Name</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-center">Books</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-center">Copies Sold</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-right">Publisher Royalty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-cream/40 text-brand-charcoal/80">
                    {authorMetricsList.map((metric, idx) => (
                      <tr key={idx} className="hover:bg-brand-cream/10 transition-colors">
                        <td className="p-3 font-serif font-bold text-brand-darkgreen text-sm">{metric.name}</td>
                        <td className="p-3 text-center font-medium">{metric.booksCount}</td>
                        <td className="p-3 text-center font-medium">{metric.salesCount}</td>
                        <td className="p-3 text-right font-bold text-emerald-600">₹{metric.royalties.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-brand-charcoal/50 py-4 text-center">No associated authors or publications found.</p>
            )}
          </div>

          {/* Recent Publications */}
          <div className="bg-white border border-brand-darkgreen/5 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif font-bold text-brand-darkgreen">Recent Booklet Submissions</h3>
              <Link to="/publisher/books" className="text-xs font-semibold text-brand-gold hover:text-brand-darkgreen underline flex items-center">
                <span>Manage Publications</span>
                <FiArrowRight className="ml-1" />
              </Link>
            </div>
            {publisherBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {publisherBooks.slice(0, 4).map((book) => (
                  <div key={book.id} className="border border-brand-darkgreen/5 rounded-xl p-3 flex flex-col items-center text-center space-y-2 bg-brand-cream/10">
                    <BookCover 
                      title={book.title} 
                      author={book.authorName} 
                      category={book.category} 
                      coverColor={book.coverColor} 
                      coverImage={book.coverImage} 
                      className="w-16 h-24 text-[8px] p-2" 
                    />
                    <h4 className="text-xs font-serif font-bold text-brand-darkgreen line-clamp-1">{book.title}</h4>
                    <p className="text-[9px] text-brand-charcoal/50 italic line-clamp-1">by {book.authorName}</p>
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      book.approved 
                        ? 'text-emerald-650 bg-emerald-50' 
                        : 'text-amber-650 bg-amber-50'
                    }`}>
                      {book.approved ? 'Live' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-brand-charcoal/50 py-6 text-center">No publications created yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Withdrawal Requests */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-brand-darkgreen/5 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-brand-darkgreen mb-2">Request Payout</h3>
            <p className="text-xs font-light text-brand-charcoal/65 mb-4">Transfer accumulated royalties directly to your corporate bank account.</p>

            {wSuccess && (
              <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 text-xs p-3 rounded-xl mb-4 font-semibold text-center">
                ✓ Payout Request Filed!
              </div>
            )}

            <form onSubmit={handleWithdrawalRequest} className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/55 block mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5000"
                  required
                  value={wAmount}
                  onChange={(e) => setWAmount(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/55 block mb-1">Settlement Account Details</label>
                <textarea 
                  rows="3"
                  placeholder="Provide Bank Name, Account Number, and IFSC Code..."
                  required
                  value={wAccount}
                  onChange={(e) => setWAccount(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={wSubmitting || Number(user.balance) <= 0}
                className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-2.5 rounded-xl shadow-sm transition-all duration-300 disabled:opacity-50 text-xs"
              >
                {wSubmitting ? 'Filing Payout...' : 'Request Payout'}
              </button>
            </form>
          </div>

          {/* Withdrawal History */}
          <div className="bg-white border border-brand-darkgreen/5 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-serif font-bold text-brand-darkgreen mb-4">Payout Requests History</h3>
            {publisherWithdrawals.length > 0 ? (
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {publisherWithdrawals.map((req) => (
                  <div key={req.id} className="text-xs p-3 rounded-xl border border-brand-cream bg-brand-cream/10 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-brand-darkgreen">₹{req.amount}</p>
                      <p className="text-[9px] text-brand-charcoal/50 mt-0.5">{req.date}</p>
                    </div>
                    <span className={`inline-flex items-center space-x-1 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      req.status === 'Approved' 
                        ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                        : req.status === 'Rejected'
                        ? 'text-red-650 bg-red-50 border border-red-100'
                        : 'text-amber-650 bg-amber-50 border border-amber-100'
                    }`}>
                      {req.status === 'Pending' && <FiClock className="mr-0.5" />}
                      <span>{req.status}</span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-brand-charcoal/50 py-4 text-center">No payout requests found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherDashboard;
