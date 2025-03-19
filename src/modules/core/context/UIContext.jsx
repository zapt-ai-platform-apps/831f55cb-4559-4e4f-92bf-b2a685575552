import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext(null);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  // Sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Current PDF file
  const [currentPdfFile, setCurrentPdfFile] = useState(null);
  
  // PDF loading state
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  
  // Current view mode (edit, view, presentation)
  const [viewMode, setViewMode] = useState('edit');
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);
  
  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Show modal
  const showModal = useCallback((modalType, modalProps = {}) => {
    setActiveModal({ type: modalType, props: modalProps });
  }, []);

  // Hide modal
  const hideModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Show toast notification
  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
    
    return id;
  }, []);

  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Set PDF file
  const setPdfFile = useCallback((file) => {
    setCurrentPdfFile(file);
  }, []);

  const value = {
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    viewMode,
    setViewMode,
    activeModal,
    showModal,
    hideModal,
    toasts,
    showToast,
    removeToast,
    currentPdfFile,
    setPdfFile,
    isPdfLoading,
    setIsPdfLoading
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};