import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-warmwhite">
      <div className="max-w-md w-full bg-white border border-brand-darkgreen/5 p-8 rounded-3xl shadow-lg">
        
        {!submitted ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-serif font-bold text-brand-darkgreen">Reset Password</h2>
              <p className="mt-2 text-xs text-brand-charcoal/50">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="name@example.com"
                  />
                  <FiMail className="absolute left-3.5 top-3.5 text-brand-charcoal/40 text-base" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-3.5 rounded-xl transition-all duration-300"
              >
                Send Password Reset Link
              </button>

              <div className="text-center">
                <Link to="/login" className="inline-flex items-center text-xs font-semibold text-brand-gold hover:text-brand-darkgreen transition-colors">
                  <FiArrowLeft className="mr-1.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4">
            <FiCheckCircle className="text-5xl text-brand-gold mx-auto" />
            <h2 className="text-2xl font-serif font-bold text-brand-darkgreen">Check your inbox</h2>
            <p className="text-sm font-light text-brand-charcoal/60 leading-relaxed">
              If an account exists for <span className="font-semibold text-brand-darkgreen">{email}</span>, we have sent instructions to reset your password.
            </p>
            <div className="pt-4">
              <Link to="/login" className="bg-brand-darkgreen text-brand-warmwhite text-xs font-semibold px-6 py-2.5 rounded-full">
                Back to Sign In
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
