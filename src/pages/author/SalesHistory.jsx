import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { FiDollarSign } from 'react-icons/fi';

const SalesHistory = () => {
  const { user } = useAuth();
  const { orders } = useAppState();

  const authorSales = orders.filter(o => o.authorId === user?.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-brand-darkgreen/5">
        <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Sales History</h1>
        <p className="text-sm font-light text-brand-charcoal/60 mt-1">
          Monitor your poetry sales transactions, commissions, and royalty splits.
        </p>
      </div>

      {/* Sales Table */}
      {authorSales.length > 0 ? (
        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-brand-cream/45 text-brand-darkgreen border-b border-brand-darkgreen/5">
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Transaction ID</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Book Title</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                  <th className="p-4 font-semibold text-xs text-right uppercase tracking-wider">Selling Price</th>
                  <th className="p-4 font-semibold text-xs text-right text-red-600 uppercase tracking-wider">Commission</th>
                  <th className="p-4 font-semibold text-xs text-right text-emerald-600 uppercase tracking-wider">Net Royalty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream/50 text-brand-charcoal/80">
                {authorSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-brand-cream/15 transition-colors">
                    <td className="p-4 font-mono text-xs font-semibold">{sale.id}</td>
                    <td className="p-4 font-serif font-bold text-brand-darkgreen">{sale.bookTitle}</td>
                    <td className="p-4 text-xs font-light">{sale.date}</td>
                    <td className="p-4 text-right font-semibold">₹{sale.price}</td>
                    <td className="p-4 text-right text-red-500 font-medium">-₹{sale.commission}</td>
                    <td className="p-4 text-right text-emerald-600 font-bold">₹{sale.earnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-lg mx-auto">
          <FiDollarSign className="text-4xl text-brand-gold/60 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">No Sales Reported</h3>
          <p className="text-sm font-light text-brand-charcoal/60 mb-6">
            You haven't received any orders yet. Promote your books to poetry lovers to generate sales.
          </p>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
