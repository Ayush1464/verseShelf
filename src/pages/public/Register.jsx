import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEdit3, FiBookOpen } from 'react-icons/fi';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(searchParams.get('role') === 'author' ? 'author' : 'reader');
  const [error, setError] = useState('');

  useEffect(() => {
    const urlRole = searchParams.get('role');
    if (urlRole === 'author' || urlRole === 'reader') {
      setRole(urlRole);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await register(name, email, password, role);
      navigate(`/${role}/dashboard`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-warmwhite">
      <div className="max-w-md w-full space-y-8 bg-white border border-brand-darkgreen/5 p-8 rounded-3xl shadow-lg">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="text-3xl font-serif font-black text-brand-darkgreen tracking-wide">
            Verse<span className="text-brand-gold">Shelf</span>
          </Link>
          <h2 className="mt-4 text-2xl font-serif font-bold text-brand-darkgreen">Create your shelf</h2>
          <p className="mt-1.5 text-xs text-brand-charcoal/50">
            Publish your poetry or support independent writers today.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="bg-brand-cream/45 p-1 rounded-xl grid grid-cols-2 gap-1 border border-brand-darkgreen/5">
          <button
            type="button"
            onClick={() => setRole('reader')}
            className={`py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              role === 'reader' 
                ? 'bg-brand-darkgreen text-brand-warmwhite shadow' 
                : 'text-brand-charcoal/70 hover:text-brand-darkgreen'
            }`}
          >
            <FiBookOpen />
            <span>Join as Reader</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('author')}
            className={`py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              role === 'author' 
                ? 'bg-brand-darkgreen text-brand-warmwhite shadow' 
                : 'text-brand-charcoal/70 hover:text-brand-darkgreen'
            }`}
          >
            <FiEdit3 />
            <span>Join as Author</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                  placeholder="John Keats"
                />
                <FiUser className="absolute left-3.5 top-3.5 text-brand-charcoal/40 text-base" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                  placeholder="john@example.com"
                />
                <FiMail className="absolute left-3.5 top-3.5 text-brand-charcoal/40 text-base" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                  placeholder="••••••••"
                />
                <FiLock className="absolute left-3.5 top-3.5 text-brand-charcoal/40 text-base" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-3.5 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Create Account</span>
              <FiArrowRight />
            </button>
          </div>

          <div className="text-center border-t border-brand-cream pt-4 text-xs font-medium text-brand-charcoal/60">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-gold hover:text-brand-darkgreen underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
