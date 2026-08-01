import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import BookCover from '../../components/book/BookCover';
import { FiBookOpen, FiDownload, FiX, FiChevronLeft, FiChevronRight, FiMoon, FiSun } from 'react-icons/fi';

const PurchasedBooks = () => {
  const { user } = useAuth();
  const { books } = useAppState();

  const purchasedBooks = books.filter(book => 
    user?.purchasedBookIds?.map(String).includes(book.id.toString())
  );
  
  // Reading mode states
  const [readingBook, setReadingBook] = useState(null);
  const [activePage, setActivePage] = useState(0);
  const [themeMode, setThemeMode] = useState('warm'); // 'warm' | 'dark'

  const openReader = (book) => {
    setReadingBook(book);
    setActivePage(0);
  };

  const closeReader = () => {
    setReadingBook(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-brand-darkgreen/5">
        <h1 className="text-3xl font-serif font-black text-brand-darkgreen">My Purchased Books</h1>
        <p className="text-sm font-light text-brand-charcoal/60 mt-1">
          Your collection of premium poetry. Select a book to start reading instantly in-browser.
        </p>
      </div>

      {/* Bookshelf Grid */}
      {purchasedBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {purchasedBooks.map((book) => (
            book.pdfUrl ? (
              <a 
                key={book.id}
                href={book.pdfUrl}
                download={`${book.title}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-brand-darkgreen/5 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between items-center text-center group cursor-pointer"
              >
                <div className="mb-4 transform transition-transform duration-300 group-hover:scale-105">
                  <BookCover 
                    title={book.title} 
                    author={book.authorName} 
                    category={book.category} 
                    coverColor={book.coverColor} 
                    coverImage={book.coverImage}
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-sm text-brand-darkgreen line-clamp-1 group-hover:text-brand-gold transition-colors">{book.title}</h4>
                  <p className="text-xs text-brand-charcoal/50">by {book.authorName}</p>
                </div>
                <div 
                  className="mt-4 flex items-center justify-center space-x-1.5 text-[10px] font-semibold tracking-wider uppercase bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen w-full py-2 rounded-lg transition-colors"
                >
                  <FiDownload className="mr-1" />
                  <span>Download PDF</span>
                </div>
              </a>
            ) : (
              <div 
                key={book.id}
                onClick={() => openReader(book)}
                className="bg-white border border-brand-darkgreen/5 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between items-center text-center group cursor-pointer"
              >
                <div className="mb-4 transform transition-transform duration-300 group-hover:scale-105">
                  <BookCover 
                    title={book.title} 
                    author={book.authorName} 
                    category={book.category} 
                    coverColor={book.coverColor} 
                    coverImage={book.coverImage}
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-sm text-brand-darkgreen line-clamp-1 group-hover:text-brand-gold transition-colors">{book.title}</h4>
                  <p className="text-xs text-brand-charcoal/50">by {book.authorName}</p>
                </div>
                <button 
                  className="mt-4 flex items-center justify-center space-x-1.5 text-[10px] font-semibold tracking-wider uppercase bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen w-full py-2 rounded-lg transition-colors"
                >
                  <FiBookOpen />
                  <span>Read Preview</span>
                </button>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-lg mx-auto">
          <p className="text-5xl mb-4">📖</p>
          <h3 className="text-xl font-serif font-bold text-brand-darkgreen mb-2">Shelf is Empty</h3>
          <p className="text-sm font-light text-brand-charcoal/60 mb-6">
            You haven't purchased any poetry books yet. Explore our catalog and support independent creators.
          </p>
          <button 
            onClick={() => window.location.href = '/browse'}
            className="bg-brand-darkgreen text-brand-warmwhite text-xs font-semibold px-6 py-2.5 rounded-full"
          >
            Explore Books
          </button>
        </div>
      )}

      {/* Reading Modal/Overlay Mode */}
      {readingBook && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md">
          {/* Reader Header */}
          <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between text-white bg-zinc-900">
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/10 font-bold tracking-wide">Reading Mode</span>
              <h2 className="font-serif font-bold text-sm truncate max-w-xs sm:max-w-md">{readingBook.title}</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <button 
                onClick={() => setThemeMode(t => t === 'warm' ? 'dark' : 'warm')}
                className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                title="Toggle Reading Theme"
              >
                {themeMode === 'warm' ? <FiMoon /> : <FiSun className="text-brand-gold" />}
              </button>
              
              {/* Download mock PDF file */}
              <a 
                href={`data:application/pdf;base64,JVBERi0xLjQKJ...`} // Fake PDF file download URL for showcase
                download={`${readingBook.title.replace(/\s+/g, '_')}_Manuscript.pdf`}
                className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-white hidden sm:flex items-center space-x-1.5 text-xs font-medium"
              >
                <FiDownload />
                <span>Download PDF</span>
              </a>

              <button 
                onClick={closeReader}
                className="p-2 border border-white/10 rounded-lg hover:bg-red-600/10 hover:text-red-400 transition-colors"
              >
                <FiX className="text-lg" />
              </button>
            </div>
          </header>

          {/* Reader Panel View */}
          <div className="flex-grow w-full h-[calc(100vh-4rem)] p-4 md:p-8 flex items-center justify-center">
            {readingBook.pdfUrl ? (
              <iframe 
                src={`${readingBook.pdfUrl}#toolbar=0&navpanes=0`} 
                className="w-full max-w-4xl h-full border border-white/10 rounded-2xl bg-white shadow-2xl" 
                title={readingBook.title}
              />
            ) : (
              <div className="flex items-center justify-center w-full">
                <button 
                  disabled={activePage === 0}
                  onClick={() => setActivePage(p => Math.max(0, p - 1))}
                  className={`p-3 rounded-full hover:bg-black/10 disabled:opacity-20 disabled:pointer-events-none transition-all ${
                    themeMode === 'warm' ? 'text-zinc-800' : 'text-white'
                  }`}
                >
                  <FiChevronLeft className="text-3xl" />
                </button>

                <div className={`w-full max-w-2xl aspect-[3/4] md:aspect-auto md:h-[650px] mx-4 rounded-xl shadow-2xl p-8 md:p-14 flex flex-col justify-between border transition-all ${
                  themeMode === 'warm' ? 'bg-[#FCFAF2] border-amber-900/10' : 'bg-zinc-900 border-zinc-800'
                }`}>
                  <div className="flex justify-between items-center border-b border-brand-darkgreen/5 pb-3">
                    <span className="text-[10px] tracking-wider uppercase font-semibold opacity-50">{readingBook.category}</span>
                    <span className="text-[10px] italic opacity-50">{readingBook.authorName}</span>
                  </div>

                  <div className="flex-grow flex flex-col justify-center my-6 overflow-y-auto max-h-[450px] pr-2">
                    <p className="font-serif italic text-base md:text-lg whitespace-pre-line leading-loose text-center">
                      {readingBook.previewPages[activePage] || "This is page content of " + readingBook.title}
                    </p>
                  </div>

                  <div className="border-t border-brand-darkgreen/5 pt-3 text-center text-xs opacity-50">
                    Page {activePage + 1} of {readingBook.previewPages.length}
                  </div>
                </div>

                <button 
                  disabled={activePage === readingBook.previewPages.length - 1}
                  onClick={() => setActivePage(p => Math.min(readingBook.previewPages.length - 1, p + 1))}
                  className={`p-3 rounded-full hover:bg-black/10 disabled:opacity-20 disabled:pointer-events-none transition-all ${
                    themeMode === 'warm' ? 'text-zinc-800' : 'text-white'
                  }`}
                >
                  <FiChevronRight className="text-3xl" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasedBooks;
