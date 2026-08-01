import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../../context/AppStateContext';
import { DUMMY_AUTHORS, CATEGORIES } from '../../data/dummyData';
import BookCard from '../../components/book/BookCard';
import { FiArrowRight, FiBookOpen, FiDollarSign, FiFeather, FiShield } from 'react-icons/fi';

const LandingPage = () => {
  const { books } = useAppState();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Show only approved books on landing page
  const featuredBooks = books.filter(b => b.approved).slice(0, 4);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-brand-cream/60 via-brand-warmwhite to-brand-warmwhite pt-16 pb-24 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <span className="inline-flex items-center space-x-2 bg-brand-gold/10 text-brand-darkgreen border border-brand-gold/25 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              <FiFeather className="text-brand-gold" />
              <span>{t('landing.tagline')}</span>
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-brand-darkgreen tracking-tight leading-[1.1]">
              {t('landing.hero_title_1')} <span className="italic text-brand-gold underline decoration-brand-gold/30">{t('landing.hero_title_patrons')}</span>.
            </h1>
            <p className="text-lg text-brand-charcoal/70 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              {t('landing.hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link 
                to="/browse" 
                className="w-full sm:w-auto text-center bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen text-base font-medium px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {t('landing.explore_button')}
              </Link>
              <Link 
                to="/register?role=author" 
                className="w-full sm:w-auto text-center bg-transparent text-brand-darkgreen border border-brand-darkgreen/20 hover:border-brand-darkgreen hover:bg-brand-cream/35 text-base font-medium px-8 py-3.5 rounded-full transition-all duration-300"
              >
                {t('landing.publish_button')}
              </Link>
            </div>
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-brand-darkgreen/5 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-serif font-bold text-brand-darkgreen">80%</p>
                <p className="text-xs text-brand-charcoal/50 uppercase tracking-wider font-semibold">{t('landing.split_label')}</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-brand-darkgreen">1,200+</p>
                <p className="text-xs text-brand-charcoal/50 uppercase tracking-wider font-semibold">{t('landing.readers_label')}</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-brand-darkgreen">300+</p>
                <p className="text-xs text-brand-charcoal/50 uppercase tracking-wider font-semibold">{t('landing.sold_label')}</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Right Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl bg-brand-cream border border-brand-darkgreen/10 shadow-2xl p-8 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl -mr-16 -mt-16" />
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-darkgreen flex items-center justify-center text-brand-gold shadow">
                  <FiBookOpen className="text-xl" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-darkgreen">{t('landing.featured_classic')}</h3>
                <p className="text-sm font-light text-brand-charcoal/70 leading-relaxed">
                  "Silence is not the absence of sound, but the presence of deep, ringing self."
                </p>
              </div>

              <div className="border-t border-brand-darkgreen/10 pt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-brand-charcoal/40 uppercase tracking-wider">{t('landing.latest_anthology')}</p>
                  <p className="font-serif font-bold text-brand-darkgreen">The Silent Echoes</p>
                </div>
                <Link to="/browse" className="w-10 h-10 rounded-full bg-brand-gold text-brand-darkgreen flex items-center justify-center hover:scale-105 transition-transform shadow">
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-brand-cream/30 border-y border-brand-darkgreen/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-3xl font-serif font-bold text-brand-darkgreen mb-4">Browse by Genre</h2>
            <p className="text-brand-charcoal/65 font-light text-sm">Select a category to discover curated digital books and manuscripts.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {CATEGORIES.map((category, idx) => (
              <button 
                key={idx}
                onClick={() => navigate(`/browse?category=${encodeURIComponent(category)}`)}
                className="bg-white hover:bg-brand-darkgreen hover:text-brand-warmwhite text-brand-darkgreen border border-brand-darkgreen/5 hover:border-brand-darkgreen rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center flex flex-col items-center justify-center space-y-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                  <FiFeather />
                </div>
                <span className="text-sm font-semibold tracking-wide block">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-warmwhite">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-12 border-b border-brand-darkgreen/5 pb-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-darkgreen">Featured Collections</h2>
              <p className="text-sm font-light text-brand-charcoal/60 mt-1">Handpicked poetry from our bestselling independent writers.</p>
            </div>
            <Link to="/browse" className="text-sm font-semibold text-brand-gold hover:text-brand-darkgreen flex items-center mt-3 sm:mt-0 transition-colors group">
              <span>View Full Catalog</span>
              <FiArrowRight className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
