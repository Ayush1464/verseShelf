import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { CATEGORIES } from '../../data/dummyData';
import { FiBookOpen, FiUpload, FiFeather, FiCheck, FiX } from 'react-icons/fi';

const UploadBook = () => {
  const { user } = useAuth();
  const { addBook } = useAppState();
  const navigate = useNavigate();

  // Enforce membership paywall
  if (user && user.role === 'author' && !user.isMember) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-md mx-auto">
        <span className="text-4xl">👑</span>
        <h2 className="text-xl font-serif font-bold text-brand-darkgreen">Membership Required</h2>
        <p className="text-xs text-brand-charcoal/60 max-w-sm">Please activate your account by paying the one-time guild membership fee on your dashboard.</p>
        <Link to="/author/dashboard" className="bg-brand-darkgreen text-brand-warmwhite px-6 py-2.5 rounded-xl text-xs font-semibold inline-block">Go to Dashboard</Link>
      </div>
    );
  }

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState(150);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [previewPage1, setPreviewPage1] = useState('');
  const [previewPage2, setPreviewPage2] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !previewPage1 || !pdfFile || !coverImage) {
      alert("Please fill in all fields, select a Cover Image, and select a PDF file.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', Number(price));
      formData.append('authorId', user.id);
      formData.append('previewPages', JSON.stringify([previewPage1, previewPage2 || "Thank you for previewing!"]));
      formData.append('pdfFile', pdfFile);
      formData.append('coverImage', coverImage);

      await addBook(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/author/dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to upload manuscript. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header banner */}
      <div className="pb-4 border-b border-brand-darkgreen/5">
        <h1 className="text-3xl font-serif font-black text-brand-darkgreen">Publish Poetry Booklet</h1>
        <p className="text-sm font-light text-brand-charcoal/60 mt-1">
          Upload cover page artwork, write preview samples, and select your manuscript PDF.
        </p>
      </div>

      {success ? (
        <div className="bg-emerald-50 border border-emerald-250 p-8 rounded-3xl text-center max-w-lg mx-auto space-y-3">
          <FiCheck className="text-4xl text-emerald-600 mx-auto" />
          <h2 className="text-xl font-serif font-bold text-brand-darkgreen">Manuscript Submitted!</h2>
          <p className="text-xs text-brand-charcoal/60 leading-relaxed">
            Your collection is queued for administrator approval. You will see its status update on your creator dashboard shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-8 bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-sm font-serif font-bold text-brand-darkgreen pb-2 border-b border-brand-cream flex items-center">
              <FiFeather className="text-brand-gold mr-2" /> Booklet Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Title input */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Collection Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Whispers of the Horizon"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Description & Bio</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="Describe your anthology, theme, style, and outline..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Poetry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold appearance-none"
                >
                  {CATEGORIES.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price input */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">List Price (₹)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>
              
              {/* File Mock PDF Upload */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">PDF Upload (Manuscript)</label>
                <div className="relative border border-dashed border-brand-darkgreen/20 bg-brand-cream/15 rounded-xl p-5 text-center cursor-pointer hover:bg-brand-cream/30 transition-colors">
                  <FiUpload className="text-brand-gold mx-auto text-xl mb-1.5" />
                  <span className="text-xs font-medium text-brand-darkgreen block truncate max-w-[300px] mx-auto">
                    {pdfFile ? pdfFile.name : "Select Manuscript PDF Booklet"}
                  </span>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    required
                    onChange={(e) => setPdfFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            {/* Excerpts writing */}
            <div className="border-t border-brand-cream pt-6 space-y-4">
              <h3 className="text-sm font-serif font-bold text-brand-darkgreen flex items-center">
                <FiBookOpen className="text-brand-gold mr-2" /> Write Preview Excerpts (2 pages for readers to sample)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block mb-1.5">Preview Page 1</label>
                  <textarea
                    required
                    rows="6"
                    value={previewPage1}
                    onChange={(e) => setPreviewPage1(e.target.value)}
                    placeholder="Enter poem excerpt..."
                    className="w-full bg-[#FCFAF2] border border-amber-900/10 font-serif italic text-xs p-4 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block mb-1.5">Preview Page 2</label>
                  <textarea
                    rows="6"
                    value={previewPage2}
                    onChange={(e) => setPreviewPage2(e.target.value)}
                    placeholder="Enter poem excerpt..."
                    className="w-full bg-[#FCFAF2] border border-amber-900/10 font-serif italic text-xs p-4 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Cover Art Uploader */}
          <div className="lg:col-span-4 bg-white border border-brand-darkgreen/5 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-sm font-serif font-bold text-brand-darkgreen pb-2 border-b border-brand-cream flex items-center">
              <FiFeather className="text-brand-gold mr-2" /> Cover Art Page
            </h3>

            <div className="space-y-4">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block">Upload Cover Page (PNG/JPG)</label>
              
              {coverImagePreview ? (
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-brand-darkgreen/15 shadow-inner bg-brand-cream/10">
                  <img 
                    src={coverImagePreview} 
                    alt="Cover Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => { setCoverImage(null); setCoverImagePreview(null); }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow hover:bg-red-700 transition-colors"
                  >
                    <FiX className="text-sm" />
                  </button>
                </div>
              ) : (
                <div className="relative border border-dashed border-brand-darkgreen/20 bg-brand-cream/15 rounded-2xl p-8 text-center cursor-pointer hover:bg-brand-cream/30 transition-colors aspect-[3/4] flex flex-col justify-center items-center">
                  <FiUpload className="text-brand-gold text-3xl mb-2" />
                  <span className="text-xs font-semibold text-brand-darkgreen">Select Cover Image</span>
                  <span className="text-[10px] text-brand-charcoal/50 mt-1 block">Recommended: PNG / JPG format</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required
                    onChange={handleCoverImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-brand-cream">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-3.5 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-xs"
              >
                {loading ? (
                  <span>Publishing Collection...</span>
                ) : (
                  <>
                    <FiFeather />
                    <span>Publish Manuscript</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default UploadBook;
