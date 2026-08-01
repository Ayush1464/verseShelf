import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { useTranslation } from 'react-i18next';
import BookCover from '../../components/book/BookCover';
import { FiBookOpen, FiClock, FiUser, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const ReaderDashboard = () => {
  const { user } = useAuth();
  const { books, orders } = useAppState();
  const { t } = useTranslation();

  const purchasedBooks = books.filter(book => 
    user?.purchasedBookIds?.map(String).includes(book.id.toString())
  );
  
  const recentBook = purchasedBooks[0];

  // Filter completed orders matching this reader
  const myOrders = orders.filter(o => 
    o.reader && user && o.reader.toString() === user.id.toString() && o.status === 'Completed'
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-brand-darkgreen text-brand-cream p-8 rounded-3xl border border-brand-gold/15 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="space-y-2 z-10">
          <h1 className="text-3xl font-serif font-black text-brand-warmwhite">
            {t('dashboard.welcome')}, {user?.name}
          </h1>
          <p className="text-sm font-light text-brand-cream/80 max-w-md">
            {t('dashboard.bookshelf_desc', { count: purchasedBooks.length })}
          </p>
        </div>
        <Link 
          to="/browse"
          className="bg-brand-gold text-brand-darkgreen hover:bg-brand-warmwhite hover:text-brand-darkgreen font-semibold text-xs px-6 py-3 rounded-full shadow transition-all duration-300 z-10 flex items-center space-x-1"
        >
          <span>{t('dashboard.find_poetry')}</span>
          <FiArrowRight />
        </Link>
      </div>

      {/* Reader Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
            <FiBookOpen />
          </div>
          <div>
            <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-wider font-semibold block">{t('dashboard.purchased_books')}</span>
            <span className="text-2xl font-serif font-bold text-brand-darkgreen">{purchasedBooks.length}</span>
          </div>
        </div>

        <div className="bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
            <FiClock />
          </div>
          <div>
            <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-wider font-semibold block">{t('dashboard.recent_purchases')}</span>
            <span className="text-2xl font-serif font-bold text-brand-darkgreen">{recentBook ? 1 : 0}</span>
          </div>
        </div>

        <div className="bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl">
            <FiUser />
          </div>
          <div>
            <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-wider font-semibold block">{t('dashboard.account_tier')}</span>
            <span className="text-sm font-semibold text-brand-darkgreen uppercase tracking-wide bg-brand-gold/10 border border-brand-gold/15 px-2 py-0.5 rounded">Patron / Reader</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Book & Shelf Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Last Read/Recent Book Card */}
        <div className="lg:col-span-5 bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-brand-darkgreen mb-4 pb-2 border-b border-brand-cream">{t('dashboard.recent_purchase')}</h3>
            {recentBook ? (
              <div className="flex space-x-4 items-center">
                <BookCover title={recentBook.title} author={recentBook.authorName} category={recentBook.category} coverColor={recentBook.coverColor} coverImage={recentBook.coverImage} className="w-20 h-28 text-[9px] p-2.5" />
                <div>
                  <h4 className="text-base font-serif font-bold text-brand-darkgreen leading-tight">{recentBook.title}</h4>
                  <p className="text-xs text-brand-charcoal/60 mt-0.5">by {recentBook.authorName}</p>
                  <p className="text-xs text-brand-charcoal/50 mt-3 italic line-clamp-2">"{recentBook.description}"</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-brand-charcoal/50 text-center py-8">{t('dashboard.no_books_bought')}</p>
            )}
          </div>
          
          {recentBook && (
            <Link 
              to="/reader/purchased" 
              className="w-full text-center block bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen text-xs font-semibold py-3 rounded-xl transition-all duration-300 mt-6"
            >
              {t('dashboard.open_reader')}
            </Link>
          )}
        </div>

        {/* Right: Browse recommendations */}
        <div className="lg:col-span-7 bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-baseline mb-6 pb-2 border-b border-brand-cream">
            <h3 className="text-lg font-serif font-bold text-brand-darkgreen">{t('dashboard.explore_poetry')}</h3>
            <Link to="/browse" className="text-xs font-semibold text-brand-gold hover:underline">{t('dashboard.view_catalog')}</Link>
          </div>

          <div className="space-y-4">
            {books.filter(b => b.approved && !user?.purchasedBookIds?.map(String).includes(b.id.toString())).slice(0, 3).map(book => (
              <div key={book.id} className="flex items-center justify-between p-3.5 hover:bg-brand-cream/30 rounded-xl transition-colors border border-transparent hover:border-brand-darkgreen/5">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <BookCover title={book.title} author={book.authorName} category={book.category} coverColor={book.coverColor} coverImage={book.coverImage} className="w-10 h-14 text-[6px] p-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-serif font-bold text-brand-darkgreen truncate">{book.title}</h4>
                    <p className="text-xs text-brand-charcoal/55 truncate">by {book.authorName}</p>
                  </div>
                </div>
                <Link to={`/book/${book.id}`} className="text-xs font-semibold bg-brand-cream border border-brand-darkgreen/15 text-brand-darkgreen hover:bg-brand-darkgreen hover:text-brand-warmwhite px-3.5 py-1.5 rounded-full transition-all">
                  {t('browse.details')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Purchase History Section */}
      <div className="bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-serif font-bold text-brand-darkgreen mb-4 pb-2 border-b border-brand-cream">{t('nav.history')}</h3>
        {myOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-brand-cream/45 text-brand-darkgreen border-b border-brand-darkgreen/5 text-xs font-semibold uppercase tracking-wider">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">{t('nav.home')}</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">{t('browse.price')}</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream/50 text-brand-charcoal/80 text-xs">
                {myOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-cream/10 transition-colors">
                    <td className="p-3 font-mono font-bold">{order.id}</td>
                    <td className="p-3 font-serif font-semibold text-brand-darkgreen">{order.bookTitle}</td>
                    <td className="p-3">{order.authorName}</td>
                    <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-3 text-right font-bold">₹{order.price}</td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center space-x-1 text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-semibold uppercase">
                        <FiCheckCircle />
                        <span>{order.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-brand-charcoal/40">
            No completed purchases registered on this account yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderDashboard;
