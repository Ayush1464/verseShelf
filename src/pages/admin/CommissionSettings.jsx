import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { FiCheck, FiSettings, FiPercent } from 'react-icons/fi';

const CommissionSettings = () => {
  const { commissionRate, updateCommissionRate } = useAppState();
  const [rate, setRate] = useState(commissionRate);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCommissionRate(Number(rate));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-brand-darkgreen/5">
        <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Commission Configuration</h1>
        <p className="text-sm font-light text-brand-charcoal/60 mt-1">
          Configure the global percentage commission rate deducted from sales transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 bg-white border border-brand-darkgreen/5 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-serif font-bold text-brand-darkgreen pb-2 border-b border-brand-cream flex items-center">
            <FiSettings className="mr-2 text-brand-gold" /> Modify Commission
          </h3>

          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3.5 text-xs text-center font-semibold flex items-center justify-center space-x-2 animate-fade-in">
              <FiCheck />
              <span>Global commission rate updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block mb-1.5 font-sans">Global Commission Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
                <FiPercent className="absolute right-4 top-3.5 text-brand-charcoal/40 text-sm" />
              </div>
            </div>

            <button
              type="submit"
              className="bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen text-xs font-semibold px-6 py-3 rounded-xl transition-all duration-300 w-full"
            >
              Update Global Rate
            </button>
          </form>
        </div>

        {/* Right Column: Explainer */}
        <div className="lg:col-span-7 bg-brand-cream/30 border border-brand-darkgreen/5 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-serif font-bold text-brand-darkgreen pb-2 border-b border-brand-darkgreen/5">Commission Split Mechanics</h3>
          
          <div className="text-sm font-light text-brand-charcoal/75 leading-relaxed space-y-4">
            <p>
              VerseShelf uses a transparent global commission model. Modifying this rate alters the revenue splits on **all future book sales** processed by the system.
            </p>
            
            <div className="bg-white border border-brand-darkgreen/5 rounded-xl p-4 space-y-3.5 text-xs">
              <div className="font-semibold text-brand-darkgreen">Example transaction simulation (Global Rate: {rate}%):</div>
              <div className="flex justify-between items-center pb-2 border-b border-brand-cream">
                <span>Book Selling Price</span>
                <span className="font-bold text-brand-darkgreen">₹150.00</span>
              </div>
              <div className="flex justify-between items-center text-red-600 pb-2 border-b border-brand-cream">
                <span>Platform Commission ({rate}%)</span>
                <span>-₹{(150 * rate / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-600 font-bold">
                <span>Author Receives ({100 - rate}%)</span>
                <span>₹{(150 - (150 * rate / 100)).toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-brand-charcoal/40 italic">
              Note: Historical orders split metrics will remain locked to the rate at the time of purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionSettings;
