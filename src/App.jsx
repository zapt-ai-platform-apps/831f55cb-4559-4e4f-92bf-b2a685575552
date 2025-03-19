import React from 'react';
import { MindMapProvider } from '@/modules/core/context/MindMapContext';
import { UIProvider } from '@/modules/core/context/UIContext';
import Layout from '@/modules/core/components/Layout';
import MindMapEditor from '@/modules/mindmap/components/MindMapEditor';
import PDFSidebar from '@/modules/pdf/components/PDFSidebar';
import ZaptBadge from '@/modules/ui/components/ZaptBadge';

export default function App() {
  return (
    <div className="h-full bg-gray-50">
      <UIProvider>
        <MindMapProvider>
          <Layout />
          <ZaptBadge />
        </MindMapProvider>
      </UIProvider>
    </div>
  );
}