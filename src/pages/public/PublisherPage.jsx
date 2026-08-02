import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api';
import { useAppState } from '../../context/AppStateContext';
import BookCard from '../../components/book/BookCard';
import { FiBookOpen, FiUser, FiLoader, FiMail, FiMapPin } from 'react-icons/fi';

const PublisherPage = () => {
  const { id } = useParams();
  const { books } = useAppState();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/authors/${id}/`);
        setAuthor(res.data);
      } catch (err) {
        console.error("Error fetching author details:", err);
        setError("Publisher not found or unable to fetch profile details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [id]);

  // Filter approved books by this author
  const authorBooks = books.filter(
    (book) => book.approved && book.authorId.toString() === id.toString()
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-brand-warmwhite/20">
        <FiLoader className="animate-spin text-4xl text-brand-gold" />
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-darkgreen/60">Loading profile...</p>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-brand-warmwhite/20">
        <div className="text-5xl mb-4">🤷‍♂️</div>
        <h2 className="text-2xl font-serif font-bold text-brand-darkgreen mb-2">Publisher Profile Unavailable</h2>
        <p className="text-sm text-brand-charcoal/60 max-w-md mb-6">{error || "The author profile could not be loaded."}</p>
        <Link to="/browse" className="bg-brand-darkgreen text-brand-warmwhite text-xs font-semibold px-6 py-3 rounded-full hover:bg-brand-gold hover:text-brand-darkgreen transition-all shadow-md">
          Browse Other Books
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-warmwhite/30 to-brand-cream/10 pb-16">
      {/* Publisher Header Section */}
      <div className="bg-brand-darkgreen text-brand-warmwhite py-14 px-4 shadow-inner relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute right-0 bottom-0 opacity-10 font-serif text-[180px] pointer-events-none translate-y-12 translate-x-8">
          ✍️
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {/* Avatar / Profile picture */}
          {author.avatar ? (
            <img 
              src={author.avatar} 
              alt={author.name || author.username} 
              className="w-32 h-32 rounded-3xl object-cover border-4 border-brand-gold shadow-xl"
            />
          ) : (
            <div className="w-32 h-32 rounded-3xl bg-brand-gold/20 border-4 border-brand-gold flex items-center justify-center text-brand-gold text-5xl font-serif shadow-xl">
              {(author.name || author.username).charAt(0).toUpperCase()}
            </div>
          )}

          {/* Details */}
          <div className="flex-grow text-center md:text-left space-y-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Verified Publisher</span>
              <h1 className="text-3xl md:text-4xl font-serif font-black tracking-wide">{author.name || author.username}</h1>
            </div>

            {/* Email and Profile Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs opacity-80">
              <div className="flex items-center space-x-1">
                <FiMail />
                <span>{author.email}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
              <div className="flex items-center space-x-1">
                <FiBookOpen />
                <span>{authorBooks.length} Publications</span>
              </div>
            </div>

            {/* Biography */}
            <p className="max-w-2xl text-sm font-light leading-relaxed text-brand-warmwhite/90">
              {author.bio || "This verified publisher is currently showcasing their creative manuscripts on VerseShelf. Explore their digital collection and support their independent work below."}
            </p>
          </div>
        </div>
      </div>

      {/* Published Works Section */}
      <div className="max-w-6xl mx-auto px-4 mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-brand-darkgreen">Publications ({authorBooks.length})</h2>
          <p className="text-xs font-light text-brand-charcoal/50 mt-1">Explore all currently active and approved poetry manuscripts by this author.</p>
        </div>

        {authorBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {authorBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <p className="text-4xl mb-3">📚</p>
            <h3 className="text-base font-serif font-bold text-brand-darkgreen">No Publications Yet</h3>
            <p className="text-xs font-light text-brand-charcoal/60 mt-1">This publisher hasn't released any public manuscripts at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublisherPage;
