import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { FiCheckCircle, FiFileText } from 'react-icons/fi';

const PurchaseHistory = () => {
  const { user } = useAuth();
  const { orders } = useAppState();

  const readerOrders = orders.filter(o => 
    o.reader && user && o.reader.toString() === user.id.toString() && o.status === 'Completed'
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-brand-darkgreen/5">
        <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Purchase History</h1>
        <p className="text-sm font-light text-brand-charcoal/60 mt-1">
          Review invoices and transaction receipts of purchased digital books.
        </p>
      </div>

      {/* Orders Table */}
      {readerOrders.length > 0 ? (
        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-brand-cream/45 text-brand-darkgreen border-b border-brand-darkgreen/5">
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Order ID</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Book Title</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Author</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Format</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Amount Paid</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream/50 text-brand-charcoal/80">
                {readerOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-cream/15 transition-colors">
                    <td className="p-4 font-mono text-xs font-semibold">{order.id}</td>
                    <td className="p-4 font-serif font-bold text-brand-darkgreen">{order.bookTitle}</td>
                    <td className="p-4">{order.authorName}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-brand-darkgreen">
                          {order.isPhysical ? "Physical Hardcopy" : "Digital Ebook"}
                        </span>
                        {order.isPhysical && order.shippingAddress && (
                          <span className="text-[10px] text-brand-charcoal/50 font-light mt-0.5 max-w-[200px] truncate" title={order.shippingAddress}>
                            Addr: {order.shippingAddress}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-light">{order.date}</td>
                    <td className="p-4 font-bold">₹{order.price}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center space-x-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 font-medium">
                        <FiCheckCircle className="text-xs" />
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
          <FiFileText className="text-4xl text-brand-gold/60 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">No Receipts Found</h3>
          <p className="text-sm font-light text-brand-charcoal/60 mb-6">
            You don't have any purchase records yet. When you buy books, receipts will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
