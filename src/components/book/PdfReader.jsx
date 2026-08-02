import React, { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi';

const PdfReader = ({ pdfUrl, themeMode = 'warm' }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    if (!pdfUrl) return;

    setLoading(true);
    const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise.then(
      (loadedPdf) => {
        setPdf(loadedPdf);
        setTotalPages(loadedPdf.numPages);
        setCurrentPage(1);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading PDF:', error);
        setLoading(false);
      }
    );
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdf || totalPages === 0) return;

    setRendering(true);
    pdf.getPage(currentPage).then((page) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      
      // Determine viewport scale based on outer container width
      const unscaledViewport = page.getViewport({ scale: 1 });
      const containerWidth = containerRef.current ? containerRef.current.clientWidth : 800;
      
      // Scale primarily to fit width so the text is large and readable
      const scale = Math.min((containerWidth - 120) / unscaledViewport.width, 1.8);

      const viewport = page.getPageViewport ? page.getPageViewport({ scale }) : page.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);
      renderTask.promise.then(() => {
        setRendering(false);
      });
    });
  }, [pdf, currentPage, totalPages]);

  const handleNextPage = () => {
    if (currentPage < totalPages && !rendering) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && !rendering) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-between w-full h-auto">
      {/* Loading Indicator */}
      {loading && (
        <div className="flex-grow flex flex-col items-center justify-center space-y-3">
          <FiLoader className="animate-spin text-3xl text-brand-gold" />
          <p className="text-xs tracking-wider uppercase font-semibold opacity-60">Opening Manuscript...</p>
        </div>
      )}

      {/* Main Canvas Container */}
      {!loading && pdf && (
        <div className="flex-grow flex items-center justify-center w-full relative min-h-[400px]">
          {/* Previous Page Button */}
          <button
            disabled={currentPage === 1 || rendering}
            onClick={handlePrevPage}
            className={`absolute left-0 z-10 p-2 sm:p-3 rounded-full hover:bg-black/10 disabled:opacity-20 disabled:pointer-events-none transition-all ${
              themeMode === 'warm' ? 'text-zinc-800' : 'text-white'
            }`}
          >
            <FiChevronLeft className="text-2xl sm:text-3xl" />
          </button>

          {/* Canvas Wrapper */}
          <div 
            className={`shadow-2xl border transition-all rounded-xl overflow-y-auto flex items-start justify-center p-1 sm:p-2 ${
              themeMode === 'warm' ? 'bg-[#FCFAF2] border-amber-900/10' : 'bg-zinc-900 border-zinc-800'
            }`}
            style={{
              filter: themeMode === 'dark' ? 'invert(0.9) hue-rotate(180deg)' : 'none',
              maxWidth: '98%',
              maxHeight: '76vh',
            }}
          >
            <canvas ref={canvasRef} className="rounded-lg shadow-sm max-w-full" />
          </div>

          {/* Next Page Button */}
          <button
            disabled={currentPage === totalPages || rendering}
            onClick={handleNextPage}
            className={`absolute right-0 z-10 p-2 sm:p-3 rounded-full hover:bg-black/10 disabled:opacity-20 disabled:pointer-events-none transition-all ${
              themeMode === 'warm' ? 'text-zinc-800' : 'text-white'
            }`}
          >
            <FiChevronRight className="text-2xl sm:text-3xl" />
          </button>
        </div>
      )}

      {/* Bottom Pagination Info */}
      {!loading && pdf && (
        <div className="mt-4 border-t border-white/10 pt-3 text-center text-xs opacity-80 font-semibold tracking-wider text-white">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
};

export default PdfReader;
