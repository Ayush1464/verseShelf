import React, { useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';
import API from '../../api';

const UsersList = () => {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReaders = async () => {
      try {
        const response = await API.get('/users/');
        setReaders(response.data);
      } catch (error) {
        console.error("Error fetching readers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReaders();
  }, []);

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-brand-darkgreen/5">
        <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Registered Readers</h1>
        <p className="text-sm font-light text-brand-charcoal/60 mt-1">
          Monitor user accounts registered as readers.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-brand-charcoal/50 text-sm">Loading registered readers...</div>
      ) : readers.length > 0 ? (
        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-brand-cream/45 text-brand-darkgreen border-b border-brand-darkgreen/5">
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">User ID</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Name</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Email</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Join Date</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Books Purchased</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream/50 text-brand-charcoal/80">
                {readers.map((reader) => (
                  <tr key={reader.id} className="hover:bg-brand-cream/15 transition-colors">
                    <td className="p-4 font-mono text-xs">{reader.id}</td>
                    <td className="p-4 font-semibold text-brand-darkgreen flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xs">
                        <FiUser />
                      </div>
                      <span>{reader.name || reader.username}</span>
                    </td>
                    <td className="p-4">{reader.email}</td>
                    <td className="p-4 text-xs font-light">
                      {reader.date_joined ? new Date(reader.date_joined).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 font-bold">{reader.purchasedBookIds?.length || 0} books</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-lg mx-auto">
          <FiUser className="text-4xl text-brand-gold/60 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">No Registered Readers</h3>
          <p className="text-sm font-light text-brand-charcoal/60">
            No reader accounts found in database.
          </p>
        </div>
      )}
    </div>
  );
};

export default UsersList;
