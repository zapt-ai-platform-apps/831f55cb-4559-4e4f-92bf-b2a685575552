import React from 'react';
import { useUI } from '@/modules/core/context/UIContext';
import Header from '@/modules/core/components/Header';
import MindMapEditor from '@/modules/mindmap/components/MindMapEditor';
import PDFSidebar from '@/modules/pdf/components/PDFSidebar';
import Toast from '@/modules/ui/components/Toast';
import Modal from '@/modules/ui/components/Modal';
import ExportModal from '@/modules/mindmap/components/modals/ExportModal';
import ImportModal from '@/modules/mindmap/components/modals/ImportModal';
import SaveModal from '@/modules/mindmap/components/modals/SaveModal';
import OpenModal from '@/modules/mindmap/components/modals/OpenModal';
import HelpModal from '@/modules/ui/components/modals/HelpModal';

const Layout = () => {
  const { isSidebarOpen, toasts, activeModal, hideModal } = useUI();

  // Render the active modal
  const renderModal = () => {
    if (!activeModal) return null;

    const modalProps = {
      isOpen: !!activeModal,
      onClose: hideModal,
      ...activeModal.props
    };

    switch (activeModal.type) {
      case 'export':
        return <ExportModal {...modalProps} />;
      case 'import':
        return <ImportModal {...modalProps} />;
      case 'save':
        return <SaveModal {...modalProps} />;
      case 'open':
        return <OpenModal {...modalProps} />;
      case 'help':
        return <HelpModal {...modalProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className={`flex-1 transition-all duration-200 h-full ${isSidebarOpen ? 'md:ml-72' : ''}`}>
          <MindMapEditor />
        </main>
        
        {/* Sidebar */}
        <PDFSidebar />
      </div>
      
      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => {}}
          />
        ))}
      </div>
      
      {/* Modal container */}
      {renderModal()}
    </div>
  );
};

export default Layout;