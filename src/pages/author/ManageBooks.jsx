import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import BookCover from '../../components/book/BookCover';
import { FiCheckCircle, FiClock, FiTrash2, FiPlus, FiArrowUpRight } from 'react-icons/fi';

const ManageBooks = () => {
  const { user } = useAuth();
  const { books, deleteBook } = useAppState();

  const authorBooks = books.filter(b => b.authorId === user?.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-darkgreen/5">
        <div>
          <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Manage My Books</h1>
          <p className="text-sm font-light text-brand-charcoal/60 mt-1">
            View approval status, delete titles, or publish new manuscripts.
          </p>
        </div>
        <Link 
          to="/author/upload"
          className="bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen text-xs font-semibold px-5 py-2.5 rounded-full flex items-center space-x-1.5 transition-colors"
        >
          <FiPlus />
          <span>Publish New</span>
        </Link>
      </div>

      {authorBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authorBooks.map((book) => (
            <div key={book.id} className="bg-white border border-brand-darkgreen/5 rounded-2xl p-5 shadow-sm flex items-center space-x-5 hover:shadow-md transition-shadow">
              {/* Cover */}
              <BookCover title={book.title} author={book.authorName} category={book.category} coverColor={book.coverColor} coverImage={book.coverImage} className="w-20 h-28 text-[9px] p-2 flex-shrink-0" />
              
              {/* Metadata & Actions */}
              <div className="flex-1 flex flex-col justify-between h-28 min-w-0">
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-brand-darkgreen leading-tight truncate">{book.title}</h3>
                  <span className="text-xs text-brand-charcoal/65 block">{book.category}</span>
                  
                  {/* Status Badges */}
                  <div className="pt-2 flex items-center gap-2">
                    {book.approved ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-semibold uppercase tracking-wider">
                        <FiCheckCircle />
                        <span>Live / Approved</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-semibold uppercase tracking-wider">
                        <FiClock />
                        <span>Pending Review</span>
                      </span>
                    )}
                    <span className="text-xs font-bold text-brand-darkgreen bg-brand-cream/50 px-2 py-0.5 rounded font-sans">₹{book.price}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-brand-cream pt-2">
                  <Link 
                    to={`/book/${book.id}`}
                    className="text-xs font-semibold text-brand-gold hover:text-brand-darkgreen flex items-center"
                  >
                    <span>View Shelf Details</span>
                    <FiArrowUpRight className="ml-1" />
                  </Link>

                  <button 
                    onClick={() => { if(window.confirm(`Are you sure you want to delete "${book.title}"?`)) deleteBook(book.id); }}
                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Book"
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
          <p className="text-5xl mb-4">✍️</p>
          <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">No Published Work</h3>
          <p className="text-sm font-light text-brand-charcoal/60 mb-6">
            You haven't uploaded any manuscripts yet. Get started and share your poetry with the world.
          </p>
          <Link 
            to="/author/upload"
            className="bg-brand-darkgreen text-brand-warmwhite text-xs font-semibold px-6 py-2.5 rounded-full inline-block"
          >
            Upload Your First PDF
          </Link>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
