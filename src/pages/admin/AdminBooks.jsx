import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import BookCover from '../../components/book/BookCover';
import { FiCheck, FiTrash2, FiClock, FiCheckCircle } from 'react-icons/fi';

const AdminBooks = () => {
  const { books, approveBook, deleteBook } = useAppState();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'all'

  const pendingBooks = books.filter(b => !b.approved);
  const liveBooks = books.filter(b => b.approved);
  const displayBooks = activeTab === 'pending' ? pendingBooks : books;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-brand-darkgreen/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Manuscript Approvals</h1>
          <p className="text-sm font-light text-brand-charcoal/60 mt-1">
            Review uploaded poetry book details and excerpts, and approve them for public indexing.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="bg-brand-cream/50 p-1 rounded-xl flex border border-brand-darkgreen/5">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'pending' 
                ? 'bg-brand-darkgreen text-brand-warmwhite shadow' 
                : 'text-brand-charcoal/70 hover:text-brand-darkgreen'
            }`}
          >
            Pending Review ({pendingBooks.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'all' 
                ? 'bg-brand-darkgreen text-brand-warmwhite shadow' 
                : 'text-brand-charcoal/70 hover:text-brand-darkgreen'
            }`}
          >
            All Books ({books.length})
          </button>
        </div>
      </div>

      {displayBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayBooks.map((book) => (
            <div key={book.id} className="bg-white border border-brand-darkgreen/5 rounded-2xl p-5 shadow-sm flex items-center space-x-5">
              {/* Cover */}
              <BookCover title={book.title} author={book.authorName} category={book.category} coverColor={book.coverColor} coverImage={book.coverImage} className="w-20 h-28 text-[9px] p-2 flex-shrink-0" />
              
              {/* Content */}
              <div className="flex-1 flex flex-col justify-between h-28 min-w-0">
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-brand-darkgreen leading-tight truncate">{book.title}</h3>
                  <p className="text-xs text-brand-charcoal/65 truncate flex items-center gap-1.5 flex-wrap">
                    <span>by {book.authorName} • ₹{book.price}</span>
                    {book.authorWhatsapp && (
                      <a
                        href={`https://wa.me/${book.authorWhatsapp.replace('+', '')}?text=Hello%20${encodeURIComponent(book.authorName)},%20this%20is%20the%20VerseShelf%20Moderation%20Team%20regarding%20your%20book%20"${encodeURIComponent(book.title)}".`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[9px] font-bold text-emerald-600 hover:text-emerald-750 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase"
                      >
                        WhatsApp
                      </a>
                    )}
                  </p>
                  
                  <div className="pt-2 flex items-center gap-1.5">
                    {book.approved ? (
                      <span className="inline-flex items-center space-x-1 text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-semibold uppercase tracking-wider">
                        <FiCheckCircle />
                        <span>Live / Catalogued</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[9px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-semibold uppercase tracking-wider animate-pulse">
                        <FiClock />
                        <span>Pending Mod review</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Approvals Actions */}
                <div className="flex items-center justify-end space-x-2 border-t border-brand-cream pt-2">
                  {!book.approved && (
                    <button
                      onClick={() => approveBook(book.id)}
                      className="bg-brand-darkgreen hover:bg-brand-gold hover:text-brand-darkgreen text-brand-warmwhite text-[10px] font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
                    >
                      <FiCheck />
                      <span>Approve</span>
                    </button>
                  )}
                  <button
                    onClick={() => { if(window.confirm(`Reject and delete "${book.title}"?`)) deleteBook(book.id); }}
                    className="border border-red-200 text-red-500 hover:bg-red-50 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                    title="Reject and Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-lg mx-auto">
          <p className="text-5xl mb-4">👍</p>
          <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">Shelf is Clean</h3>
          <p className="text-sm font-light text-brand-charcoal/60">
            No manuscripts are currently pending moderation in this view.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
