import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useAuth } from '../../context/AuthContext';
import BookCover from '../../components/book/BookCover';
import PdfReader from '../../components/book/PdfReader';
import { FiStar, FiChevronLeft, FiChevronRight, FiLock, FiBookOpen, FiX, FiMoon, FiSun } from 'react-icons/fi';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books } = useAppState();
  const { user } = useAuth();

  const book = books.find(b => b.id.toString() === id.toString());
  const [activePreviewPage, setActivePreviewPage] = useState(0);

  // Immersive reader states
  const [isReading, setIsReading] = useState(false);
  const [readingPage, setReadingPage] = useState(0);
  const [themeMode, setThemeMode] = useState('warm'); // 'warm' | 'dark'

  if (!book) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <p className="text-4xl mb-4">⚠️</p>
        <h2 className="text-2xl font-serif font-bold text-brand-darkgreen">Book Not Found</h2>
        <p className="text-sm font-light text-brand-charcoal/60 mb-6">The book you are looking for does not exist or has been removed.</p>
        <Link to="/browse" className="bg-brand-darkgreen text-brand-warmwhite px-6 py-2.5 rounded-full text-xs font-semibold">Back to Catalog</Link>
      </div>
    );
  }

  const { title, authorName, category, price, rating, reviewsCount, description, coverColor, previewPages, coverImage } = book;

  // Check reader purchase state
  const hasPurchased = user?.purchasedBookIds?.map(String).includes(id.toString());

  // Check if current user is the author of this book
  const isAuthor = user && book.authorId && user.id && book.authorId.toString() === user.id.toString();

  // Author or paid readers can read
  const canRead = hasPurchased || isAuthor;

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/checkout/${id}` } });
    } else {
      navigate(`/checkout/${id}`);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-brand-warmwhite min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Link */}
        <Link to="/browse" className="inline-flex items-center text-sm font-semibold text-brand-gold hover:text-brand-darkgreen mb-10 transition-colors">
          <FiChevronLeft className="mr-1.5" /> Back to browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Visual Cover & Purchase Card */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-8">
            <div className="bg-brand-cream/45 border border-brand-darkgreen/5 rounded-3xl p-10 shadow-sm flex items-center justify-center w-full aspect-square md:aspect-auto md:h-[400px]">
              <div className="scale-110 md:scale-125 transform transition-transform duration-500 hover:rotate-1">
                <BookCover title={title} author={authorName} category={category} coverColor={coverColor} coverImage={coverImage} className="w-48 h-64 text-sm" />
              </div>
            </div>

            {/* Purchase CTA Widget */}
            <div className="bg-white border border-brand-darkgreen/5 rounded-2xl p-6 shadow-md w-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs text-brand-charcoal/40 uppercase tracking-widest font-semibold block">Price</span>
                  <span className="text-3xl font-black text-brand-darkgreen font-sans">₹{price}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-charcoal/45 block">Format</span>
                  <span className="text-sm font-semibold text-brand-darkgreen bg-brand-gold/10 px-2.5 py-1 rounded-md border border-brand-gold/10">PDF Ebook</span>
                </div>
              </div>

              {canRead ? (
                <button
                  onClick={() => setIsReading(true)}
                  className="w-full text-center block bg-brand-gold text-brand-darkgreen hover:bg-brand-darkgreen hover:text-brand-warmwhite text-sm font-semibold py-3.5 rounded-xl shadow-md transition-all duration-300"
                >
                  {isAuthor ? "Read Manuscript" : "Read Ebook"}
                </button>
              ) : (
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen text-sm font-semibold py-3.5 rounded-xl shadow-lg transition-all duration-300"
                >
                  Buy Ebook Now
                </button>
              )}

              <p className="text-[11px] text-center text-brand-charcoal/50 mt-4 leading-relaxed font-light">
                {isAuthor ? "You own this title." : "Instant access. Read directly in-browser using our premium immersive reader."}
              </p>
            </div>
          </div>

          {/* Right Column: Title Info & Look Inside Mockup */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider bg-brand-gold/5 px-2.5 py-1 rounded">
                  {category}
                </span>
                <div className="flex items-center text-brand-gold text-xs">
                  <FiStar className="fill-brand-gold mr-1" />
                  <span className="font-semibold">{Number(rating || 5.0).toFixed(1)}</span>
                  <span className="text-brand-charcoal/40 ml-0.5">({reviewsCount} customer reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-black text-brand-darkgreen leading-tight">
                {title}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-lg text-brand-charcoal/70">
                  by <Link to={`/publisher/${book.authorId}`} className="text-brand-darkgreen hover:text-brand-gold underline decoration-brand-gold/30 font-semibold">{authorName}</Link>
                </p>
                {book.authorWhatsapp && (
                  <a
                    href={`https://wa.me/${book.authorWhatsapp.replace('+', '')}?text=Hi%20${encodeURIComponent(authorName)},%20I%20saw%20your%20book%20"${encodeURIComponent(title)}"%20on%20VerseShelf%20and%20would%20love%20to%20connect!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-brand-darkgreen/5 pt-6 space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-brand-charcoal/55 font-bold">Synopsis</h4>
              <p className="text-sm font-light text-brand-charcoal/75 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Interactive Preview Widget */}
            <div className="border-t border-brand-darkgreen/5 pt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-widest text-brand-charcoal/55 font-bold flex items-center">
                  <FiBookOpen className="text-brand-gold mr-2 text-base" /> Look Inside (Sample Pages)
                </h4>
                <div className="flex items-center space-x-1">
                  <button
                    disabled={activePreviewPage === 0}
                    onClick={() => setActivePreviewPage(p => Math.max(0, p - 1))}
                    className="p-1 rounded bg-brand-cream/50 border border-brand-darkgreen/10 text-brand-darkgreen hover:bg-brand-cream disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft />
                  </button>
                  <span className="text-xs text-brand-charcoal/60 px-2 font-medium">
                    {activePreviewPage + 1} / {previewPages?.length || 1}
                  </span>
                  <button
                    disabled={activePreviewPage === (previewPages?.length || 1) - 1}
                    onClick={() => setActivePreviewPage(p => Math.min((previewPages?.length || 1) - 1, p + 1))}
                    className="p-1 rounded bg-brand-cream/50 border border-brand-darkgreen/10 text-brand-darkgreen hover:bg-brand-cream disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>

              {/* Page Visual Mockup */}
              <div className="bg-brand-cream/25 border border-brand-darkgreen/10 rounded-2xl p-8 relative shadow-inner aspect-[4/3] md:aspect-auto md:h-72 flex flex-col justify-between">
                <div className="absolute top-0 left-1/2 -ml-0.5 h-full w-[1px] bg-brand-darkgreen/5 hidden md:block" />
                <div className="z-10 text-xs sm:text-sm font-serif font-light text-brand-charcoal/80 whitespace-pre-line leading-relaxed italic overflow-y-auto pr-2">
                  {previewPages ? previewPages[activePreviewPage] : "Sample content placeholder..."}
                </div>
                <div className="z-10 mt-6 border-t border-brand-darkgreen/5 pt-4 text-[10px] text-center text-brand-charcoal/40 uppercase tracking-widest flex items-center justify-center space-x-1.5">
                  <FiLock />
                  <span>Purchase to unlock complete manuscript ({book.pagesCount} pages)</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Immersive Reader Overlay Modal (For Authors and Paid Readers) */}
      {isReading && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm">
          <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between text-white bg-zinc-900">
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/10 font-bold tracking-wide">
                {isAuthor ? "Author View" : "Reading Mode"}
              </span>
              <h2 className="font-serif font-bold text-sm truncate max-w-xs sm:max-w-md">{title}</h2>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setThemeMode(t => t === 'warm' ? 'dark' : 'warm')}
                className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                {themeMode === 'warm' ? <FiMoon /> : <FiSun className="text-brand-gold" />}
              </button>
              <button
                onClick={() => setIsReading(false)}
                className="p-2 border border-white/10 rounded-lg hover:bg-red-600/10 hover:text-red-400 transition-colors"
              >
                <FiX className="text-lg" />
              </button>
            </div>
          </header>

          <div className="flex-grow w-full h-[calc(100vh-4rem)] p-4 md:p-8 flex items-center justify-center">
            {book.pdfUrl ? (
              <div className="w-full max-w-7xl h-full flex items-center justify-center">
                <PdfReader pdfUrl={book.pdfUrl} themeMode={themeMode} />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <button
                  disabled={readingPage === 0}
                  onClick={() => setReadingPage(p => Math.max(0, p - 1))}
                  className="p-3 rounded-full hover:bg-black/10 disabled:opacity-20 transition-all text-2xl"
                >
                  <FiChevronLeft />
                </button>

                <div className={`w-full max-w-2xl aspect-[3/4] md:aspect-auto md:h-[600px] mx-4 rounded-xl shadow-2xl p-8 md:p-14 flex flex-col justify-between border transition-all ${themeMode === 'warm' ? 'bg-[#FCFAF2] border-amber-900/10' : 'bg-zinc-900 border-zinc-800'
                  }`}>
                  <div className="flex justify-between items-center border-b border-brand-darkgreen/5 pb-3">
                    <span className="text-[10px] tracking-wider uppercase font-semibold opacity-50">{category}</span>
                    <span className="text-[10px] italic opacity-50">{authorName}</span>
                  </div>

                  <div className="flex-grow flex flex-col justify-center my-6 overflow-y-auto max-h-[400px]">
                    <p className="font-serif italic text-base md:text-lg whitespace-pre-line leading-loose text-center">
                      {previewPages && previewPages[readingPage] ? previewPages[readingPage] : "Page content empty."}
                    </p>
                  </div>

                  <div className="border-t border-brand-darkgreen/5 pt-3 text-center text-xs opacity-50">
                    Page {readingPage + 1} of {previewPages?.length || 1}
                  </div>
                </div>

                <button
                  disabled={previewPages && readingPage === previewPages.length - 1}
                  onClick={() => setReadingPage(p => Math.min((previewPages?.length || 1) - 1, p + 1))}
                  className="p-3 rounded-full hover:bg-black/10 disabled:opacity-20 transition-all text-2xl"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
