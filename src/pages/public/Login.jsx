import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiShield, FiUser, FiEdit3, FiBookOpen } from 'react-icons/fi';

const Login = () => {
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('reader'); // Default role tab for quick testing
  const [showMfa, setShowMfa] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const redirectPath = location.state?.from || `/${role}/dashboard`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const res = await login(email, password, role);
      if (res && res.mfa_required) {
        setShowMfa(true);
        setError('');
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid login details.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the verification code.');
      return;
    }

    try {
      await verifyOtp(email, role, otp);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid verification code.');
    }
  };

  // Helper to prefill login credentials for convenience during evaluation
  const prefillCredentials = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('admin@verseshelf.com');
      setPassword('admin123');
    } else if (selectedRole === 'author') {
      setEmail('aria@verseshelf.com');
      setPassword('author123');
    } else if (selectedRole === 'publisher') {
      setEmail('publisher@verseshelf.com');
      setPassword('publisher123');
    } else {
      setEmail('jane@verseshelf.com');
      setPassword('reader123');
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
          <h2 className="mt-4 text-2xl font-serif font-bold text-brand-darkgreen">Welcome back</h2>
          <p className="mt-1.5 text-xs text-brand-charcoal/50">
            Sign in to access your digital bookshelf or earnings console.
          </p>
        </div>

        {/* Role Selector Tabs (Evaluation Helper) */}
        <div className="bg-brand-cream/45 p-1 rounded-xl grid grid-cols-4 gap-1 border border-brand-darkgreen/5">
          <button
            type="button"
            onClick={() => prefillCredentials('reader')}
            className={`py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all flex flex-col items-center justify-center ${
              role === 'reader' 
                ? 'bg-brand-darkgreen text-brand-warmwhite shadow' 
                : 'text-brand-charcoal/70 hover:text-brand-darkgreen'
            }`}
          >
            <FiUser className="mb-0.5" />
            <span>Reader</span>
          </button>
          <button
            type="button"
            onClick={() => prefillCredentials('author')}
            className={`py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all flex flex-col items-center justify-center ${
              role === 'author' 
                ? 'bg-brand-darkgreen text-brand-warmwhite shadow' 
                : 'text-brand-charcoal/70 hover:text-brand-darkgreen'
            }`}
          >
            <FiEdit3 className="mb-0.5" />
            <span>Author</span>
          </button>
          <button
            type="button"
            onClick={() => prefillCredentials('publisher')}
            className={`py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all flex flex-col items-center justify-center ${
              role === 'publisher' 
                ? 'bg-brand-darkgreen text-brand-warmwhite shadow' 
                : 'text-brand-charcoal/70 hover:text-brand-darkgreen'
            }`}
          >
            <FiBookOpen className="mb-0.5" />
            <span>Publisher</span>
          </button>
          <button
            type="button"
            onClick={() => prefillCredentials('admin')}
            className={`py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all flex flex-col items-center justify-center ${
              role === 'admin' 
                ? 'bg-brand-darkgreen text-brand-warmwhite shadow' 
                : 'text-brand-charcoal/70 hover:text-brand-darkgreen'
            }`}
          >
            <FiShield className="mb-0.5" />
            <span>Admin</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        {showMfa ? (
          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <div className="space-y-4 text-center">
              <p className="text-sm font-light text-brand-charcoal/70 leading-relaxed">
                We've sent a 2-step verification code to your registered device. Please enter the 6-digit OTP code below.
              </p>
              
              <div>
                <label htmlFor="otp" className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/65 block mb-1.5">Verification Code</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength="6"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-3 text-center text-lg font-mono font-bold tracking-[0.5em] focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-3.5 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Verify & Login</span>
                <FiArrowRight />
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setShowMfa(false); setError(''); }}
                className="text-xs text-brand-gold hover:text-brand-darkgreen font-semibold transition-colors underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Email Address</label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
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

              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-brand-gold hover:text-brand-darkgreen transition-colors">Forgot?</Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
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

            <div>
              <button
                type="submit"
                className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-3.5 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Sign In</span>
                <FiArrowRight />
              </button>
            </div>

            <div className="text-center border-t border-brand-cream pt-4 text-xs font-medium text-brand-charcoal/60">
              Don't have an account?{' '}
              <Link to={`/register?role=${role}`} className="text-brand-gold hover:text-brand-darkgreen underline">
                Create one now
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
