import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useUI } from '@/modules/core/context/UIContext';
import Button from '@/modules/ui/components/Button';
import * as Sentry from '@sentry/browser';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { setIsPdfLoading, isPdfLoading } = useUI();
  
  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setIsPdfLoading(false);
  };
  
  // Handle document load error
  const onDocumentLoadError = (error) => {
    Sentry.captureException(error);
    console.error('Error loading PDF document:', error);
    setIsPdfLoading(false);
  };
  
  // Handle document loading
  const onDocumentLoadProgress = () => {
    setIsPdfLoading(true);
  };
  
  // Change page
  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };
  
  // Go to previous page
  const previousPage = () => {
    if (pageNumber > 1) {
      changePage(-1);
    }
  };
  
  // Go to next page
  const nextPage = () => {
    if (pageNumber < numPages) {
      changePage(1);
    }
  };
  
  if (!file) return null;
  
  return (
    <div className="pdf-container flex flex-col items-center w-full h-full">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        onLoadProgress={onDocumentLoadProgress}
        loading={<LoadingSpinner />}
        className="w-full"
      >
        <Page
          pageNumber={pageNumber}
          width={250}
          className="pdf-page"
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
      
      {numPages && (
        <div className="flex items-center justify-between bg-white shadow-md rounded-md p-2 mt-2 sticky bottom-2 w-11/12">
          <Button
            variant="ghost"
            size="sm"
            onClick={previousPage}
            disabled={pageNumber <= 1 || isPdfLoading}
            aria-label="Previous page"
          >
            <FiChevronLeft size={16} />
          </Button>
          
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={nextPage}
            disabled={pageNumber >= numPages || isPdfLoading}
            aria-label="Next page"
          >
            <FiChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Loading PDF...</p>
  </div>
);

export default PDFViewer;