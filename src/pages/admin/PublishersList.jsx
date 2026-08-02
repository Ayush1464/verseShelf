import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiClock, FiCheckCircle } from 'react-icons/fi';
import API from '../../api';

const PublishersList = () => {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await API.get('/publishers/');
        setPublishers(response.data);
      } catch (error) {
        console.error("Error fetching publishers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublishers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-brand-darkgreen/5">
        <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Registered Publishers</h1>
        <p className="text-sm font-light text-brand-charcoal/60 mt-1">
          Monitor registered publishing houses, onboarding status, wallet balances, and global royalty statistics.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-brand-charcoal/50 text-sm">Loading registered publishers...</div>
      ) : publishers.length > 0 ? (
        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-brand-cream/45 text-brand-darkgreen border-b border-brand-darkgreen/5">
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Publisher ID</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Company Name</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Onboarding Fee (₹3,000)</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Total Gross Earnings</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Withdrawable Wallet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream/50 text-brand-charcoal/80">
                {publishers.map((pub) => (
                  <tr key={pub.id} className="hover:bg-brand-cream/15 transition-colors">
                    <td className="p-4 font-mono text-xs">{pub.id}</td>
                    <td className="p-4 flex items-center space-x-3">
                      <img 
                        src={pub.avatar || "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=150&h=150&q=80"} 
                        alt={pub.name || pub.username} 
                        className="w-8 h-8 rounded-full object-cover border border-brand-gold" 
                      />
                      <div>
                        <h4 className="font-semibold text-brand-darkgreen leading-none">{pub.name || pub.username}</h4>
                        <span className="text-[10px] text-brand-charcoal/40 mt-1 block">{pub.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {pub.isMember ? (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-semibold uppercase tracking-wider">
                          <FiCheckCircle />
                          <span>Paid & Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-semibold uppercase tracking-wider">
                          <FiClock />
                          <span>Unpaid (Pending)</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold">₹{pub.totalEarnings || '0.00'}</td>
                    <td className="p-4 font-bold text-emerald-700">₹{pub.balance || '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-lg mx-auto">
          <FiBookOpen className="text-4xl text-brand-gold/60 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">No Registered Publishers</h3>
          <p className="text-sm font-light text-brand-charcoal/60">
            No publisher accounts found in database.
          </p>
        </div>
      )}
    </div>
  );
};

export default PublishersList;
