import React from 'react';
import { FiBook } from 'react-icons/fi';

const BookCover = ({ title, author, category, coverColor = "from-teal-800 to-emerald-950", coverImage, className = "w-36 h-52 text-xs" }) => {
  const isCustomImage = !!coverImage;
  
  // Resolve absolute backend URL if needed
  const imageUrl = coverImage && !coverImage.startsWith('http') && !coverImage.startsWith('blob:')
    ? `http://localhost:8000${coverImage}`
    : coverImage;

  return (
    <div 
      className={`relative ${className} rounded-r-md book-shadow overflow-hidden flex flex-col justify-between p-4 select-none transition-transform duration-300 hover:scale-102 ${
        !isCustomImage ? `bg-gradient-to-br ${coverColor}` : ''
      }`}
      style={isCustomImage ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {/* Book Spine Overlay */}
      <div className="absolute top-0 left-0 h-full w-3 bg-black/25 book-spine z-10" />
      <div className="absolute top-0 left-3 h-full w-0.5 bg-white/10 z-10" />

      {!isCustomImage && (
        <>
          {/* Book Category/Header */}
          <div className="z-20 text-[10px] uppercase tracking-widest text-brand-gold/80 font-medium font-sans pl-2">
            {category || "Poetry Collection"}
          </div>

          {/* Book Title */}
          <div className="z-20 flex-grow flex flex-col justify-center pl-2 my-2">
            <h3 className="font-serif font-bold text-white text-base leading-tight tracking-wide line-clamp-3">
              {title}
            </h3>
            <div className="w-8 h-0.5 bg-brand-gold mt-2 rounded" />
          </div>

          {/* Author Name */}
          <div className="z-20 flex items-center justify-between pl-2 pt-2 border-t border-white/10">
            <span className="text-white/80 font-light truncate italic font-serif">
              {author || "Independent Author"}
            </span>
            <FiBook className="text-brand-gold/60 text-sm flex-shrink-0 ml-1" />
          </div>
        </>
      )}
    </div>
  );
};

export default BookCover;
