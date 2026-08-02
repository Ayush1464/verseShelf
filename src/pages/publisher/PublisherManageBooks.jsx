import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useAuth } from '../../context/AuthContext';
import BookCover from '../../components/book/BookCover';
import { FiCheckCircle, FiClock, FiTrash2, FiPlus, FiArrowLeft } from 'react-icons/fi';

const PublisherManageBooks = () => {
  const { user } = useAuth();
  const { books, deleteBook, refreshData } = useAppState();

  useEffect(() => {
    refreshData();
  }, []);

  const publisherBooks = books.filter(b => b.authorId === user.id);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action is permanent.`)) {
      try {
        await deleteBook(id);
        alert("Booklet removed successfully.");
      } catch (err) {
        alert("Failed to delete booklet.");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-brand-darkgreen/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Link to="/publisher/dashboard" className="inline-flex items-center text-xs font-semibold text-brand-gold hover:text-brand-darkgreen transition-colors mb-2">
            <FiArrowLeft className="mr-1" /> Back to Console
          </Link>
          <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Publisher Catalog</h1>
          <p className="text-sm font-light text-brand-charcoal/60">
            Audit approvals, edit listings, and manage your published booklet catalog.
          </p>
        </div>
        <Link 
          to="/publisher/upload" 
          className="bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-300 flex items-center space-x-2 w-fit h-fit"
        >
          <FiPlus className="text-sm" />
          <span>Add New Booklet</span>
        </Link>
      </div>

      {publisherBooks.length > 0 ? (
        <div className="bg-white border border-brand-darkgreen/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-brand-cream/45 text-brand-darkgreen border-b border-brand-darkgreen/5">
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Booklet Cover</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Title</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Writer / Author</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Category</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Ebook Price</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Physical Price</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream/50 text-brand-charcoal/80">
                {publisherBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-brand-cream/15 transition-colors">
                    {/* Book Cover */}
                    <td className="p-4">
                      <BookCover 
                        title={book.title} 
                        author={book.authorName} 
                        category={book.category} 
                        coverColor={book.coverColor} 
                        coverImage={book.coverImage} 
                        className="w-12 h-16 text-[6px] p-1.5" 
                      />
                    </td>
                    {/* Title */}
                    <td className="p-4 font-serif font-bold text-brand-darkgreen text-base">{book.title}</td>
                    {/* Writer */}
                    <td className="p-4 font-medium">{book.authorName}</td>
                    {/* Category */}
                    <td className="p-4">
                      <span className="text-xs bg-brand-cream/50 border border-brand-darkgreen/5 px-2 py-0.5 rounded-full font-serif italic text-brand-darkgreen">
                        {book.category}
                      </span>
                    </td>
                    {/* Ebook Price */}
                    <td className="p-4 text-right font-semibold font-mono text-brand-darkgreen">₹{book.price}</td>
                    {/* Physical Price */}
                    <td className="p-4 text-right font-semibold font-mono text-amber-800">
                      {book.physicalPrice ? `₹${book.physicalPrice}` : 'Ebook + Surcharge'}
                    </td>
                    {/* Status */}
                    <td className="p-4">
                      {book.approved ? (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100 font-semibold uppercase tracking-wider">
                          <FiCheckCircle />
                          <span>Live</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-100 font-semibold uppercase tracking-wider">
                          <FiClock />
                          <span>Pending Review</span>
                        </span>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(book.id, book.title)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-all inline-flex items-center"
                        title="Delete Booklet"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-lg mx-auto">
          <p className="text-5xl mb-4">📚</p>
          <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">No Publications</h3>
          <p className="text-sm font-light text-brand-charcoal/60 mb-6">
            You haven't uploaded any books to your publisher catalog yet.
          </p>
          <Link 
            to="/publisher/upload" 
            className="bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen px-6 py-2.5 rounded-xl text-xs font-semibold inline-block transition-all shadow-sm"
          >
            Upload Your First Booklet
          </Link>
        </div>
      )}
    </div>
  );
};

export default PublisherManageBooks;
