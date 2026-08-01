import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiBookOpen, FiArrowRight } from 'react-icons/fi';

const Success = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || `ord-${Date.now()}`;

  return (
    <div className="min-h-[85vh] bg-brand-warmwhite flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-brand-darkgreen/5 p-8 rounded-3xl shadow-xl text-center space-y-6">
        
        {/* Success Icon */}
        <div className="w-16 h-16 bg-brand-gold/15 text-brand-gold rounded-full flex items-center justify-center mx-auto shadow-inner border border-brand-gold/25">
          <FiCheckCircle className="text-3xl" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-semibold text-brand-gold tracking-widest bg-brand-gold/10 px-2.5 py-1 rounded border border-brand-gold/10">Payment Successful</span>
          <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Thank you for your purchase</h1>
          <p className="text-sm font-light text-brand-charcoal/60 leading-relaxed">
            Your transaction has been processed successfully. The poetry manuscript has been added to your digital library shelf.
          </p>
        </div>

        {/* Order Details box */}
        <div className="bg-brand-cream/35 border border-brand-darkgreen/5 rounded-2xl p-4 text-xs space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-brand-charcoal/50">Order Reference</span>
            <span className="font-semibold text-brand-darkgreen font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-charcoal/50">Delivery Method</span>
            <span className="font-semibold text-brand-darkgreen">Instant Ebook (PDF)</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            to="/reader/purchased"
            className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
          >
            <FiBookOpen className="text-base" />
            <span>Go to Reader Shelf</span>
          </Link>
          <Link
            to="/browse"
            className="w-full bg-transparent hover:bg-brand-cream/40 text-brand-darkgreen border border-brand-darkgreen/15 text-xs font-semibold py-3 rounded-xl transition-colors"
          >
            Continue Browsing
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Success;
