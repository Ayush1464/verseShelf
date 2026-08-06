import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FiLock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import API from '../../api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!uid || !token) {
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await API.post('/auth/reset-password/', {
        uid,
        token,
        password
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-warmwhite">
      <div className="max-w-md w-full bg-white border border-brand-darkgreen/5 p-8 rounded-3xl shadow-lg">
        
        {!submitted ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-serif font-bold text-brand-darkgreen">Choose New Password</h2>
              <p className="mt-2 text-xs text-brand-charcoal/50">
                Please enter and confirm your new account password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs text-center font-medium">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">New Password</label>
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

              <div>
                <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                    placeholder="••••••••"
                  />
                  <FiLock className="absolute left-3.5 top-3.5 text-brand-charcoal/40 text-base" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Resetting...' : 'Reset Password'}</span>
                {!loading && <FiArrowRight />}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4">
            <FiCheckCircle className="text-5xl text-brand-gold mx-auto" />
            <h2 className="text-2xl font-serif font-bold text-brand-darkgreen">Password Reset Complete</h2>
            <p className="text-sm font-light text-brand-charcoal/60 leading-relaxed">
              Your password has been successfully reset. You can now log in using your new credentials.
            </p>
            <div className="pt-4">
              <Link to="/login" className="bg-brand-darkgreen text-brand-warmwhite text-xs font-semibold px-6 py-2.5 rounded-full inline-block">
                Go to Login
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;
