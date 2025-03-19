import React, { useState, useCallback } from 'react';
import { useUI } from '@/modules/core/context/UIContext';
import { useMindMap } from '@/modules/core/context/MindMapContext';
import Button from '@/modules/ui/components/Button';
import PDFViewer from '@/modules/pdf/components/PDFViewer';
import { convertPDFToMindMap } from '@/modules/pdf/utils/pdfToMindMap';
import { FiUpload, FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';

const PDFSidebar = () => {
  const { 
    isSidebarOpen, 
    toggleSidebar, 
    currentPdfFile, 
    setPdfFile,
    isPdfLoading,
    setIsPdfLoading,
    showToast
  } = useUI();
  
  const { generateMindMapFromData } = useMindMap();
  
  const [isConverting, setIsConverting] = useState(false);
  
  // File input reference
  const fileInputRef = React.useRef(null);
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      showToast(`Loaded PDF: ${file.name}`, 'success');
    } else if (file) {
      showToast('Please upload a valid PDF file', 'error');
    }
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Convert PDF to mind map
  const handleConvertToMindMap = useCallback(async () => {
    if (!currentPdfFile) {
      showToast('Please upload a PDF first', 'warning');
      return;
    }
    
    try {
      setIsConverting(true);
      showToast('Converting PDF to mind map...', 'info');
      
      // Convert PDF to structured data
      const structuredData = await convertPDFToMindMap(currentPdfFile);
      
      if (!structuredData || !structuredData.title) {
        throw new Error('Could not extract meaningful structure from the PDF');
      }
      
      // Generate mind map from structured data
      generateMindMapFromData(structuredData);
      
      showToast('PDF successfully converted to mind map!', 'success');
    } catch (error) {
      console.error('Error converting PDF to mind map:', error);
      showToast(`Conversion failed: ${error.message}`, 'error');
    } finally {
      setIsConverting(false);
    }
  }, [currentPdfFile, generateMindMapFromData, showToast]);
  
  if (!isSidebarOpen) {
    return (
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
        <button
          onClick={toggleSidebar}
          className="bg-white p-2 rounded-r-md shadow-md hover:bg-gray-100 focus:outline-none"
          aria-label="Open sidebar"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    );
  }
  
  return (
    <aside className="fixed top-16 left-0 bottom-0 w-72 bg-white shadow-lg z-20 flex flex-col transition-all duration-200 transform">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">PDF Document</h2>
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-gray-100 rounded-md cursor-pointer"
          aria-label="Close sidebar"
        >
          <FiChevronLeft size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {currentPdfFile ? (
          <>
            <div className="p-4 border-b">
              <h3 className="font-medium mb-1 truncate" title={currentPdfFile.name}>
                {currentPdfFile.name}
              </h3>
              <p className="text-sm text-gray-500">
                {(currentPdfFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              
              <div className="mt-4 space-y-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleConvertToMindMap}
                  loading={isConverting}
                  disabled={isConverting || isPdfLoading}
                >
                  <FiRefreshCw size={16} className="mr-2" />
                  Convert to Mind Map
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleUploadClick}
                  disabled={isConverting || isPdfLoading}
                >
                  <FiUpload size={16} className="mr-2" />
                  Upload Different PDF
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              <PDFViewer file={currentPdfFile} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="text-center">
              <FiUpload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload a PDF</h3>
              <p className="text-gray-500 mb-6">
                Upload a PDF document to view it and convert it to a mind map
              </p>
              
              <Button
                variant="primary"
                onClick={handleUploadClick}
              >
                Select PDF File
              </Button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default PDFSidebar;