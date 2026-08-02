import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { CATEGORIES } from '../../data/dummyData';
import { FiBookOpen, FiUpload, FiFeather, FiCheck, FiX, FiInfo } from 'react-icons/fi';

const PublisherUploadBook = () => {
  const { user } = useAuth();
  const { addBook } = useAppState();
  const navigate = useNavigate();

  // Enforce membership paywall
  if (user && !user.isMember) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-white border border-brand-darkgreen/5 rounded-3xl p-8 max-w-md mx-auto">
        <span className="text-4xl">👑</span>
        <h2 className="text-xl font-serif font-bold text-brand-darkgreen">Membership Required</h2>
        <p className="text-xs text-brand-charcoal/60 max-w-sm">Please activate your account by paying the one-time publisher onboarding fee on your dashboard.</p>
        <Link to="/publisher/dashboard" className="bg-brand-darkgreen text-brand-warmwhite px-6 py-2.5 rounded-xl text-xs font-semibold inline-block">Go to Dashboard</Link>
      </div>
    );
  }

  const [title, setTitle] = useState('');
  const [writerName, setWriterName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState(150);
  const [physicalPrice, setPhysicalPrice] = useState('');
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
    if (!title || !writerName || !description || !previewPage1 || !pdfFile || !coverImage) {
      alert("Please fill in all fields, select a Cover Image, and select a PDF file.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('writerName', writerName); // Saved in the database writerName field
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', Number(price));
      if (physicalPrice) {
        formData.append('physicalPrice', Number(physicalPrice));
      }
      formData.append('authorId', user.id);
      formData.append('previewPages', JSON.stringify([previewPage1, previewPage2 || "Thank you for previewing!"]));
      formData.append('pdfFile', pdfFile);
      formData.append('coverImage', coverImage);

      await addBook(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/publisher/dashboard');
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
          Publish on behalf of your authors. Upload cover page artwork, write preview samples, and select your manuscript PDF.
        </p>
      </div>

      {success ? (
        <div className="bg-emerald-50 border border-emerald-250 p-8 rounded-3xl text-center max-w-lg mx-auto space-y-3">
          <FiCheck className="text-4xl text-emerald-600 mx-auto" />
          <h2 className="text-xl font-serif font-bold text-brand-darkgreen">Manuscript Submitted!</h2>
          <p className="text-xs text-brand-charcoal/60 leading-relaxed">
            Your booklet will appear in your catalog and public store once platform administrators approve it. Redirecting...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Upload Form */}
          <div className="lg:col-span-8 bg-white border border-brand-darkgreen/5 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Collection Title */}
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

              {/* Writer / Author Name */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5 flex items-center">
                  <span>Author / Writer Name</span>
                  <span className="text-[10px] text-brand-gold ml-1.5 font-normal normal-case flex items-center"><FiInfo className="mr-0.5" /> Specify the booklet's writer</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rabindranath Tagore"
                  value={writerName}
                  onChange={(e) => setWriterName(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Description & Bio</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="Describe this anthology, theme, style, and author bio..."
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
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Ebook Price (₹)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              {/* Physical Price input */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-1.5">Physical Copy Price (₹, Optional)</label>
                <input 
                  type="number" 
                  min="0"
                  placeholder="Defaults to Ebook + Surcharge"
                  value={physicalPrice}
                  onChange={(e) => setPhysicalPrice(e.target.value)}
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
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block mb-1">Preview Page 1</label>
                  <textarea 
                    required
                    rows="6"
                    placeholder="Write page 1 snippet/poem..."
                    value={previewPage1}
                    onChange={(e) => setPreviewPage1(e.target.value)}
                    className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold font-serif leading-relaxed"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block mb-1">Preview Page 2 (Optional)</label>
                  <textarea 
                    rows="6"
                    placeholder="Write page 2 snippet/poem..."
                    value={previewPage2}
                    onChange={(e) => setPreviewPage2(e.target.value)}
                    className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold font-serif leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Cover Upload & Design Preview */}
          <div className="lg:col-span-4 bg-white border border-brand-darkgreen/5 rounded-3xl p-6 shadow-sm space-y-6 h-fit">
            <h3 className="text-base font-serif font-bold text-brand-darkgreen pb-2 border-b border-brand-cream flex items-center">
              <FiFeather className="text-brand-gold mr-2" /> Booklet Cover
            </h3>

            {/* Cover Image Upload Input */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/60 block mb-2">Upload Cover Artwork</label>
              <div className="relative border border-dashed border-brand-darkgreen/20 bg-brand-cream/15 rounded-xl p-5 text-center cursor-pointer hover:bg-brand-cream/30 transition-colors">
                <FiUpload className="text-brand-gold mx-auto text-xl mb-1.5" />
                <span className="text-xs font-medium text-brand-darkgreen block truncate max-w-[200px] mx-auto">
                  {coverImage ? coverImage.name : "Select Cover Image (JPG/PNG)"}
                </span>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png"
                  required
                  onChange={handleCoverImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
            </div>

            {/* Live Design Preview */}
            <div className="pt-4 border-t border-brand-cream flex flex-col items-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 mb-3">Live Cover Preview</span>
              <div className="relative w-44 h-64 shadow-2xl rounded-xl overflow-hidden bg-brand-darkgreen flex items-center justify-center text-brand-warmwhite p-4 text-center">
                {coverImagePreview ? (
                  <img src={coverImagePreview} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-800 to-emerald-950 opacity-90" />
                )}
                
                {/* Book Title Overlays */}
                <div className="relative z-10 space-y-2">
                  <h3 className="font-serif font-bold text-base leading-tight drop-shadow-md line-clamp-2">
                    {title || "Booklet Title"}
                  </h3>
                  <div className="w-8 h-[1px] bg-brand-gold/60 mx-auto" />
                  <p className="text-[10px] italic drop-shadow-sm font-sans line-clamp-1">
                    by {writerName || "Writer Name"}
                  </p>
                </div>

                <div className="absolute bottom-3 text-[7px] tracking-widest uppercase opacity-60 z-10 font-semibold font-sans">
                  VerseShelf Editions
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center text-sm mt-4"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Submitting Anthology...</span>
                </span>
              ) : (
                <span>Submit Manuscript</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PublisherUploadBook;
