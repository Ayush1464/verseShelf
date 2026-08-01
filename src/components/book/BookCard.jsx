import React from 'react';
import { Link } from 'react-router-dom';
import BookCover from './BookCover';
import { FiStar, FiArrowRight } from 'react-icons/fi';

const BookCard = ({ book }) => {
  const { id, title, authorName, category, price, rating, reviewsCount, coverColor, coverImage } = book;

  return (
    <div className="group bg-white rounded-2xl border border-brand-darkgreen/5 hover:border-brand-gold/20 shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col h-full">
      {/* Cover container */}
      <div className="flex justify-center items-center py-6 bg-brand-cream/40 rounded-xl mb-4 overflow-hidden relative">
        <div className="transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
          <BookCover 
            title={title} 
            author={authorName} 
            category={category} 
            coverColor={coverColor} 
            coverImage={coverImage}
          />
        </div>
      </div>

      {/* Book details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider bg-brand-gold/5 px-2 py-0.5 rounded">
              {category}
            </span>
            <div className="flex items-center text-brand-gold text-xs">
              <FiStar className="fill-brand-gold mr-1" />
              <span className="font-semibold">{Number(rating || 5.0).toFixed(1)}</span>
              <span className="text-brand-charcoal/40 ml-0.5">({reviewsCount || 0})</span>
            </div>
          </div>
          
          <h3 className="font-serif text-lg font-bold text-brand-darkgreen leading-snug mb-1 line-clamp-1 group-hover:text-brand-gold transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-brand-charcoal/65 mb-4">
            by {authorName}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-brand-cream mt-auto">
          <div>
            <span className="text-xs text-brand-charcoal/45 block leading-none">Price</span>
            <span className="text-lg font-bold text-brand-darkgreen font-sans">₹{price}</span>
          </div>
          <Link 
            to={`/book/${id}`}
            className="flex items-center justify-center space-x-1 text-xs font-semibold bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen px-3.5 py-2 rounded-full transition-all duration-300"
          >
            <span>Details</span>
            <FiArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
