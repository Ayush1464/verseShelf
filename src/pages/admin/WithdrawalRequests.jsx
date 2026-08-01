import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { FiCheck, FiClock, FiCheckCircle } from 'react-icons/fi';

const WithdrawalRequests = () => {
  const { withdrawals, approveWithdrawal } = useAppState();

  const handleApprove = (id, amount, authorName) => {
    if (window.confirm(`Mark ₹${amount} payout to ${authorName} as transferred?`)) {
      approveWithdrawal(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-brand-darkgreen/5">
        <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Withdrawal Requests</h1>
        <p className="text-sm font-light text-brand-charcoal/60 mt-1">
          Approve pending royalty withdrawal transfers requested by poetry authors.
        </p>
      </div>

      {withdrawals.length > 0 ? (
        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-brand-cream/45 text-brand-darkgreen border-b border-brand-darkgreen/5">
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Author</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Requested Payout</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Bank Details</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="p-4 font-semibold text-xs text-right uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream/50 text-brand-charcoal/80">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-brand-cream/15 transition-colors">
                    <td className="p-4 font-light text-xs">{w.date}</td>
                    <td className="p-4 font-serif font-bold text-brand-darkgreen flex items-center gap-2 flex-wrap">
                      <span>{w.authorName}</span>
                      {w.authorWhatsapp && (
                        <a
                          href={`https://wa.me/${w.authorWhatsapp.replace('+', '')}?text=Hello%20${encodeURIComponent(w.authorName)},%20this%20is%20the%20VerseShelf%20Payout%20Team%20regarding%20your%20withdrawal%20request%20of%20INR%20${w.amount}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-[9px] font-bold text-emerald-600 hover:text-emerald-750 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase"
                        >
                          WhatsApp
                        </a>
                      )}
                    </td>
                    <td className="p-4 font-bold text-brand-darkgreen">₹{w.amount}</td>
                    <td className="p-4 text-xs font-mono break-all max-w-[200px]" title={w.accountDetails}>{w.accountDetails}</td>
                    <td className="p-4 text-xs">
                      {w.status === 'Approved' ? (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-semibold uppercase">
                          <FiCheckCircle />
                          <span>Paid</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-semibold uppercase animate-pulse">
                          <FiClock />
                          <span>Pending payout</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {w.status === 'Pending' ? (
                        <button
                          onClick={() => handleApprove(w.id, w.amount, w.authorName)}
                          className="bg-brand-darkgreen hover:bg-brand-gold hover:text-brand-darkgreen text-brand-warmwhite text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-colors inline-flex items-center space-x-1"
                        >
                          <FiCheck />
                          <span>Approve Payout</span>
                        </button>
                      ) : (
                        <span className="text-xs text-brand-charcoal/40 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-lg mx-auto">
          <p className="text-5xl mb-4">💸</p>
          <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">No Requests</h3>
          <p className="text-sm font-light text-brand-charcoal/60">
            No withdrawal requests have been logged.
          </p>
        </div>
      )}
    </div>
  );
};

export default WithdrawalRequests;
