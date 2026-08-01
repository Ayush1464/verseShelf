import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { FiDollarSign, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

const Withdrawal = () => {
  const { user, updateProfile } = useAuth();
  const { withdrawals, requestWithdrawal } = useAppState();

  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState(user?.bankDetails || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Enforce membership paywall
  if (user && user.role === 'author' && !user.isMember) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-md mx-auto">
        <span className="text-4xl">👑</span>
        <h2 className="text-xl font-serif font-bold text-brand-darkgreen">Membership Required</h2>
        <p className="text-xs text-brand-charcoal/60 max-w-sm">Please activate your account by paying the one-time guild membership fee on your dashboard.</p>
        <Link to="/author/dashboard" className="bg-brand-darkgreen text-brand-warmwhite px-6 py-2.5 rounded-xl text-xs font-semibold inline-block">Go to Dashboard</Link>
      </div>
    );
  }

  const authorWithdrawals = withdrawals.filter(w => 
    w.author && user && w.author.toString() === user.id.toString()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const withdrawalAmount = Number(amount);

    if (!withdrawalAmount || withdrawalAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    if (withdrawalAmount > (user?.balance || 0)) {
      setError('Insufficient wallet balance.');
      return;
    }

    if (!bankDetails.trim()) {
      setError('Please provide bank details for the transfer.');
      return;
    }

    try {
      // Process withdrawal request
      await requestWithdrawal(user.id, user.name, withdrawalAmount, bankDetails);
      
      // Save bank details to user profile for future ease
      await updateProfile({ bankDetails });
      
      setAmount('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit withdrawal request.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-brand-darkgreen/5">
        <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Earnings & Payouts</h1>
        <p className="text-sm font-light text-brand-charcoal/60 mt-1">
          Withdraw your accumulated book sales royalties to your bank account.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Request Form */}
        <div className="lg:col-span-5 bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm space-y-6">
          <h3 className="text-lg font-serif font-bold text-brand-darkgreen pb-2 border-b border-brand-cream">Request Payout</h3>

          {/* Current balance */}
          <div className="bg-brand-cream/35 border border-brand-darkgreen/5 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-brand-charcoal/50 uppercase font-semibold block">Available Royalty</span>
              <span className="text-2xl font-black text-brand-darkgreen">₹{user?.balance || 0}</span>
            </div>
            <span className="text-xs font-semibold text-brand-gold bg-white border border-brand-gold/10 px-2.5 py-1 rounded-lg">Wallet</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs text-center font-semibold flex items-center justify-center space-x-1.5">
              <FiAlertCircle className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3.5 text-xs text-center font-semibold flex items-center justify-center space-x-2">
              <FiCheck />
              <span>Withdrawal request submitted for approval!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block mb-1.5">Withdrawal Amount (INR)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block mb-1.5">Bank Account Details (IFSC, A/C #)</label>
              <textarea
                required
                rows="3"
                placeholder="e.g. HDFC Bank, A/C: 1234567890, IFSC: HDFC0000123"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-3 rounded-xl transition-all duration-300 text-xs shadow-sm"
            >
              Request Transfer
            </button>
          </form>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-7 bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-serif font-bold text-brand-darkgreen pb-2 border-b border-brand-cream mb-4">Request History</h3>

          {authorWithdrawals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-brand-darkgreen/75 border-b border-brand-cream font-semibold">
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5">Account Info</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream/40 text-brand-charcoal/80">
                  {authorWithdrawals.map((w) => (
                    <tr key={w.id}>
                      <td className="py-3 font-light text-[10px]">{w.date}</td>
                      <td className="py-3 font-bold text-brand-darkgreen">₹{w.amount}</td>
                      <td className="py-3 truncate max-w-[150px]" title={w.accountDetails}>{w.accountDetails}</td>
                      <td className="py-3">
                        {w.status === 'Approved' ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-semibold">
                            <FiCheck />
                            <span>Paid</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-semibold">
                            <FiClock />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-brand-charcoal/50 text-center py-10">No withdrawal records reported.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
