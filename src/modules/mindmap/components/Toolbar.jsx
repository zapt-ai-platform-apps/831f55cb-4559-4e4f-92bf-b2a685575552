import React from 'react';
import { useUI } from '@/modules/core/context/UIContext';
import { useMindMap } from '@/modules/core/context/MindMapContext';
import Button from '@/modules/ui/components/Button';
import { 
  FiZoomIn, 
  FiZoomOut, 
  FiMaximize2, 
  FiEdit, 
  FiEye, 
  FiTrash2,
  FiPlus
} from 'react-icons/fi';
import { useReactFlow } from 'reactflow';

const Toolbar = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { viewMode, setViewMode, showToast } = useUI();
  const { selectedNode, deleteNode, addNode } = useMindMap();
  
  // Toggle view mode between edit and view
  const toggleViewMode = () => {
    setViewMode(viewMode === 'edit' ? 'view' : 'edit');
    showToast(
      viewMode === 'edit' ? 'View mode enabled' : 'Edit mode enabled',
      'info'
    );
  };
  
  // Handle delete node
  const handleDeleteNode = () => {
    if (selectedNode) {
      deleteNode(selectedNode);
      showToast('Node deleted', 'success');
    } else {
      showToast('Select a node to delete', 'warning');
    }
  };
  
  // Handle add node
  const handleAddNode = () => {
    // Calculate center position
    const { x, y, zoom } = useReactFlow().getViewport();
    const centerX = -x / zoom + window.innerWidth / (2 * zoom);
    const centerY = -y / zoom + window.innerHeight / (2 * zoom);
    
    // Add node at center of viewport
    const newNodeId = addNode('default', null, { x: centerX, y: centerY });
    showToast('Node added', 'success');
  };
  
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md">
      <Button
        variant="ghost"
        size="icon"
        onClick={zoomIn}
        aria-label="Zoom in"
      >
        <FiZoomIn size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={zoomOut}
        aria-label="Zoom out"
      >
        <FiZoomOut size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fitView({ duration: 500, padding: 0.2 })}
        aria-label="Fit view"
      >
        <FiMaximize2 size={16} />
      </Button>
      
      <div className="h-px bg-gray-200 my-1" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleViewMode}
        aria-label="Toggle edit mode"
      >
        {viewMode === 'edit' ? <FiEye size={16} /> : <FiEdit size={16} />}
      </Button>
      
      {viewMode === 'edit' && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddNode}
            aria-label="Add node"
          >
            <FiPlus size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteNode}
            disabled={!selectedNode}
            aria-label="Delete selected node"
          >
            <FiTrash2 size={16} />
          </Button>
        </>
      )}
    </div>
  );
};

export default Toolbar;