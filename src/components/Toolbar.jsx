import React, { useCallback } from 'react';
import { useStore } from '../store';
import { RiNodeTree, RiAddCircleLine, RiDeleteBin2Line, RiArrowGoBackLine, RiArrowGoForwardLine, RiSave3Line, RiFileUploadLine, RiLayoutGridLine } from 'react-icons/ri';

export default function Toolbar() {
  const { 
    nodes, 
    edges, 
    selectedNode, 
    setNodes, 
    setEdges,
    undo,
    redo,
    canUndo,
    canRedo,
    addToHistory,
    setShowImportExport,
    addNode,
    deleteSelectedNode
  } = useStore();

  const handleAddNode = useCallback(() => {
    addNode();
  }, [addNode]);

  const handleDeleteNode = useCallback(() => {
    if (selectedNode) {
      deleteSelectedNode();
    }
  }, [selectedNode, deleteSelectedNode]);

  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  const handleSave = useCallback(() => {
    setShowImportExport(true);
  }, [setShowImportExport]);

  const autoLayout = useCallback(() => {
    // Basic auto-layout - arrange nodes in a circular pattern
    if (nodes.length > 0) {
      addToHistory();
      
      const centerX = 0;
      const centerY = 0;
      const radius = 300;
      const angleStep = (2 * Math.PI) / nodes.length;
      
      const updatedNodes = nodes.map((node, index) => {
        const angle = index * angleStep;
        return {
          ...node,
          position: {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
          },
        };
      });
      
      setNodes(updatedNodes);
    }
  }, [nodes, setNodes, addToHistory]);

  return (
    <div className="bg-white border-b border-gray-200 p-2 flex justify-between items-center shadow-sm">
      <div className="flex items-center">
        <RiNodeTree className="text-blue-500 text-xl mr-2" />
        <h1 className="text-xl font-bold text-gray-800">Mind Mapper</h1>
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={handleAddNode}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center cursor-pointer tooltip-container"
        >
          <RiAddCircleLine className="mr-1" />
          <span>Add Node</span>
          <span className="tooltip">Create a new node</span>
        </button>
        
        <button 
          onClick={handleDeleteNode}
          disabled={!selectedNode}
          className={`px-3 py-1 rounded-md flex items-center cursor-pointer tooltip-container ${selectedNode ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          <RiDeleteBin2Line className="mr-1" />
          <span>Delete</span>
          <span className="tooltip">Delete selected node</span>
        </button>
        
        <button 
          onClick={handleUndo}
          disabled={!canUndo}
          className={`px-2 py-1 rounded-md cursor-pointer tooltip-container ${canUndo ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          <RiArrowGoBackLine />
          <span className="tooltip">Undo</span>
        </button>
        
        <button 
          onClick={handleRedo}
          disabled={!canRedo}
          className={`px-2 py-1 rounded-md cursor-pointer tooltip-container ${canRedo ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          <RiArrowGoForwardLine />
          <span className="tooltip">Redo</span>
        </button>
        
        <button 
          onClick={autoLayout}
          className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer tooltip-container"
        >
          <RiLayoutGridLine />
          <span className="tooltip">Auto Layout</span>
        </button>
        
        <button 
          onClick={handleSave}
          className="px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white flex items-center cursor-pointer tooltip-container"
        >
          <RiSave3Line className="mr-1" />
          <span>Save/Export</span>
          <span className="tooltip">Save or export mind map</span>
        </button>
      </div>
    </div>
  );
}