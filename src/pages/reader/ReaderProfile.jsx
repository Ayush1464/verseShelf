import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiCheck } from 'react-icons/fi';

const ReaderProfile = () => {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (avatarFile) {
      formData.append('avatarImage', avatarFile);
    }
    updateProfile(formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-brand-darkgreen/5">
        <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Profile Settings</h1>
        <p className="text-sm font-light text-brand-charcoal/60 mt-1">
          Manage your reader profile and billing information.
        </p>
      </div>

      <div className="max-w-2xl bg-white border border-brand-darkgreen/5 rounded-2xl p-6 shadow-sm">
        
        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3.5 text-xs text-center font-semibold flex items-center justify-center space-x-2">
            <FiCheck />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-brand-cream">
            <img 
              src={avatarPreview || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"} 
              alt={name} 
              className="w-20 h-20 rounded-full object-cover border-2 border-brand-gold shadow"
            />
            <div className="w-full">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block mb-1.5">Upload Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full text-xs text-brand-charcoal/65 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-cream/60 file:text-brand-darkgreen hover:file:bg-brand-cream"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
                <FiUser className="absolute left-3.5 top-3.5 text-brand-charcoal/40" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
                <FiMail className="absolute left-3.5 top-3.5 text-brand-charcoal/40" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen text-xs font-semibold px-6 py-3 rounded-xl shadow-sm transition-all duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReaderProfile;
