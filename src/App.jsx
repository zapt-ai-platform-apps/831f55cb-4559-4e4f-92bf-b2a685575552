import React, { useEffect } from 'react';
import MindMap from './components/MindMap';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import ImportExport from './components/ImportExport';
import { useStore } from './store';
import { loadMap } from './utils/localStorage';
import ZaptBadge from './components/ZaptBadge';

export default function App() {
  const { 
    setNodes, 
    setEdges, 
    selectedNode, 
    showSidebar, 
    showImportExport,
    setSelectedNode
  } = useStore();

  // Load last saved map on startup
  useEffect(() => {
    const savedMap = loadMap('last-map');
    if (savedMap) {
      setNodes(savedMap.nodes);
      setEdges(savedMap.edges);
    }
  }, [setNodes, setEdges]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectedNode && 
          !e.target.closest('.sidebar') && 
          !e.target.closest('.react-flow__node') &&
          !e.target.closest('button')) {
        setSelectedNode(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedNode, setSelectedNode]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden relative">
        <MindMap />
        {showSidebar && <Sidebar />}
        {showImportExport && <ImportExport />}
      </div>
      <ZaptBadge />
    </div>
  );
}