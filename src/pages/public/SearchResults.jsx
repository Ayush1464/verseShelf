import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import BookCard from '../../components/book/BookCard';
import { FiChevronLeft, FiSearch } from 'react-icons/fi';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { books } = useAppState();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      const match = books.filter(book => {
        if (!book.approved) return false;
        return (
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.authorName.toLowerCase().includes(query.toLowerCase()) ||
          book.category.toLowerCase().includes(query.toLowerCase()) ||
          book.description.toLowerCase().includes(query.toLowerCase())
        );
      });
      setResults(match);
    } else {
      setResults([]);
    }
  }, [query, books]);

  return (
    <div className="py-12 bg-brand-warmwhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/browse" className="inline-flex items-center text-sm font-semibold text-brand-gold hover:text-brand-darkgreen mb-8 transition-colors">
          <FiChevronLeft className="mr-1.5" /> Back to Browse
        </Link>

        {/* Search header */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-baseline gap-2">
          <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Search Results</h1>
          <p className="text-brand-charcoal/60 font-light text-sm">
            for "{query}" — found {results.length} collections
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {results.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-lg mx-auto">
            <FiSearch className="text-4xl text-brand-gold/60 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">No Matching Verse</h3>
            <p className="text-sm font-light text-brand-charcoal/60 mb-6">
              We couldn't find any books matching your search. Try adjusting spelling or using generic poetry search terms.
            </p>
            <Link
              to="/browse"
              className="bg-brand-darkgreen text-brand-warmwhite text-xs font-semibold px-6 py-2.5 rounded-full inline-block"
            >
              Browse All Books
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
