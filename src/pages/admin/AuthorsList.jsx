import React, { useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';
import API from '../../api';

const AuthorsList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await API.get('/authors/');
        setAuthors(response.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-brand-darkgreen/5">
        <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Registered Authors</h1>
        <p className="text-sm font-light text-brand-charcoal/60 mt-1">
          Monitor registered poetry authors, total books published, and aggregated revenue statistics.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-brand-charcoal/50 text-sm">Loading registered authors...</div>
      ) : authors.length > 0 ? (
        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-brand-cream/45 text-brand-darkgreen border-b border-brand-darkgreen/5">
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Author ID</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Author Name</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Bio Summary</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Total Gross Earnings</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Withdrawable Wallet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream/50 text-brand-charcoal/80">
                {authors.map((author) => (
                  <tr key={author.id} className="hover:bg-brand-cream/15 transition-colors">
                    <td className="p-4 font-mono text-xs">{author.id}</td>
                    <td className="p-4 flex items-center space-x-3">
                      <img 
                        src={author.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"} 
                        alt={author.name || author.username} 
                        className="w-8 h-8 rounded-full object-cover border border-brand-gold" 
                      />
                      <h4 className="font-semibold text-brand-darkgreen leading-none">{author.name || author.username}</h4>
                    </td>
                    <td className="p-4 text-xs font-light truncate max-w-[200px]" title={author.bio}>{author.bio || 'No biography written.'}</td>
                    <td className="p-4 font-bold">₹{author.total_earnings}</td>
                    <td className="p-4 font-bold text-emerald-700">₹{author.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-lg mx-auto">
          <FiUser className="text-4xl text-brand-gold/60 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">No Registered Authors</h3>
          <p className="text-sm font-light text-brand-charcoal/60">
            No author accounts found in database.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthorsList;
