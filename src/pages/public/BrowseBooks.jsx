import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '../../data/dummyData';
import BookCard from '../../components/book/BookCard';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';

const BrowseBooks = () => {
  const { books } = useAppState();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || '';
  const initialAuthor = searchParams.get('author') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedAuthor, setSelectedAuthor] = useState(initialAuthor);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state if query params change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedAuthor(searchParams.get('author') || '');
  }, [searchParams]);

  // Filter approved books
  const filteredBooks = books.filter(book => {
    if (!book.approved) return false;
    
    const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
    const matchesAuthor = selectedAuthor ? book.authorName.toLowerCase().includes(selectedAuthor.toLowerCase()) : true;
    const matchesSearch = searchQuery 
      ? book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesAuthor && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedAuthor('');
    setSearchQuery('');
    setSearchParams({});
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    
    const params = {};
    if (value) params.category = value;
    if (selectedAuthor) params.author = selectedAuthor;
    setSearchParams(params);
  };

  return (
    <div className="py-12 bg-brand-warmwhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-brand-darkgreen mb-2">
            {t('browse.title')}
          </h1>
          <p className="text-brand-charcoal/60 font-light text-sm">
            {t('browse.subtitle')}
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Category Filter */}
            <div className="relative w-full sm:w-48">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full bg-brand-cream/40 rounded-xl border border-brand-darkgreen/15 text-sm py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold appearance-none"
              >
                <option value="">{t('browse.category')}</option>
                {CATEGORIES.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Author filter indicator */}
            {selectedAuthor && (
              <div className="flex items-center space-x-2 bg-brand-gold/15 text-brand-darkgreen text-xs font-semibold px-3 py-2 rounded-xl border border-brand-gold/20">
                <span>Author: {selectedAuthor}</span>
                <button onClick={() => { setSelectedAuthor(''); setSearchParams(selectedCategory ? { category: selectedCategory } : {}); }}>
                  <FiX className="text-sm cursor-pointer hover:text-red-600" />
                </button>
              </div>
            )}

            {/* Clear Button */}
            {(selectedCategory || selectedAuthor || searchQuery) && (
              <button 
                onClick={clearFilters}
                className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors flex items-center"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Search box within catalog */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder={t('browse.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
            />
            <FiSearch className="absolute left-3.5 top-3.5 text-brand-charcoal/40" />
          </div>
        </div>

        {/* Results grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-lg mx-auto">
            <p className="text-5xl mb-4">📚</p>
            <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">{t('browse.no_books')}</h3>
            <p className="text-sm font-light text-brand-charcoal/60 mb-6">
              We couldn't find any books matching your active filter criteria. Try clearing filters or search another query.
            </p>
            <button
              onClick={clearFilters}
              className="bg-brand-darkgreen text-brand-warmwhite text-xs font-semibold px-6 py-2.5 rounded-full"
            >
              {t('browse.reset')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseBooks;
