import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { FiCheckCircle } from 'react-icons/fi';

const OrdersList = () => {
  const { orders } = useAppState();

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-brand-darkgreen/5">
        <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Global Transactions</h1>
        <p className="text-sm font-light text-brand-charcoal/60 mt-1">
          Review all platform sales, commissions collected, and payouts.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-brand-cream/45 text-brand-darkgreen border-b border-brand-darkgreen/5">
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Order ID</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Book Name</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Reader</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Author</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Format</th>
                  <th className="p-4 font-semibold text-xs text-right uppercase tracking-wider">Price</th>
                  <th className="p-4 font-semibold text-xs text-right text-red-600 uppercase tracking-wider">Commission</th>
                  <th className="p-4 font-semibold text-xs text-right text-emerald-600 uppercase tracking-wider">Author Royalty</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream/50 text-brand-charcoal/80">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-cream/15 transition-colors">
                    <td className="p-4 font-mono text-xs font-semibold">{order.id}</td>
                    <td className="p-4 font-serif font-bold text-brand-darkgreen">{order.bookTitle}</td>
                    <td className="p-4">{order.readerName}</td>
                    <td className="p-4">{order.authorName}</td>
                    <td className="p-4">
                      <div className="flex flex-col space-y-1">
                        <span className="font-semibold text-xs text-brand-darkgreen bg-brand-cream/40 px-2 py-0.5 rounded border border-brand-darkgreen/5 inline-block w-fit">
                          {order.isPhysical ? "📦 Physical Copy" : "📱 Digital Ebook"}
                        </span>
                        {order.isPhysical && order.shippingAddress && (
                          <div className="text-[10px] text-zinc-700 bg-amber-50/70 border border-amber-200/50 p-2 rounded-lg mt-1 whitespace-pre-wrap max-w-[220px] font-normal leading-relaxed shadow-sm">
                            <strong className="text-amber-800 font-bold block mb-0.5">SHIPPING ADDRESS:</strong>
                            {order.shippingAddress}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">₹{order.price}</td>
                    <td className="p-4 text-right text-red-500 font-medium">-₹{order.commission}</td>
                    <td className="p-4 text-right text-emerald-600 font-bold">₹{order.earnings}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-semibold uppercase">
                        <FiCheckCircle />
                        <span>{order.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-lg mx-auto">
          <p className="text-5xl mb-4">🛒</p>
          <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">No Transactions</h3>
          <p className="text-sm font-light text-brand-charcoal/60">
            No sales have been processed on the platform yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
