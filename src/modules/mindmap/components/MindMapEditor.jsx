import React, { useCallback, useEffect, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  MiniMap,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useMindMap } from '@/modules/core/context/MindMapContext';
import { useUI } from '@/modules/core/context/UIContext';
import CustomNode from '@/modules/mindmap/components/CustomNode';
import ContextMenu from '@/modules/ui/components/ContextMenu';
import Toolbar from '@/modules/mindmap/components/Toolbar';

// Define node types
const nodeTypes = {
  custom: CustomNode
};

const MindMapEditor = () => {
  const reactFlowWrapper = useRef(null);
  const { fitView } = useReactFlow();
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addEdge,
    addNode,
    selectedNode
  } = useMindMap();
  
  const { viewMode } = useUI();
  
  // Context menu state
  const [contextMenu, setContextMenu] = React.useState(null);
  
  // Fit view when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.2 });
      }, 50);
    }
  }, [nodes.length, fitView]);
  
  // Handle node drag
  const onNodeDragStop = useCallback(() => {
    // We don't need to update node positions manually as
    // ReactFlow handles this with onNodesChange
  }, []);
  
  // Handle edge creation
  const onConnect = useCallback((params) => {
    addEdge(params);
  }, [addEdge]);
  
  // Handle right-click on empty space (for adding new nodes)
  const onPaneContextMenu = useCallback((event) => {
    // Prevent default context menu
    event.preventDefault();
    
    // Only allow adding nodes in edit mode
    if (viewMode !== 'edit') return;
    
    // Get the position relative to the flow container
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    };
    
    // Show context menu
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      position,
      type: 'pane'
    });
  }, [viewMode]);
  
  // Handle right-click on node
  const onNodeContextMenu = useCallback((event, node) => {
    // Prevent default context menu
    event.preventDefault();
    
    // Only allow in edit mode
    if (viewMode !== 'edit') return;
    
    // Show context menu
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
      type: 'node'
    });
  }, [viewMode]);
  
  // Hide context menu on click
  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);
  
  // Add a new node from context menu
  const handleAddNode = useCallback((nodeType) => {
    if (contextMenu && contextMenu.type === 'pane') {
      addNode(nodeType, null, contextMenu.position);
    } else if (contextMenu && contextMenu.type === 'node') {
      // For add child, calculate position offset from parent
      const parentNode = nodes.find(n => n.id === contextMenu.nodeId);
      if (parentNode) {
        const newPosition = {
          x: parentNode.position.x + 150,
          y: parentNode.position.y + 50
        };
        addNode(nodeType, contextMenu.nodeId, newPosition);
      }
    }
    setContextMenu(null);
  }, [contextMenu, addNode, nodes]);
  
  // Render context menu options
  const renderContextMenuItems = () => {
    if (!contextMenu) return [];
    
    if (contextMenu.type === 'pane') {
      return [
        { label: 'Add Node', onClick: () => handleAddNode('default') },
        { label: 'Add Primary Node', onClick: () => handleAddNode('primary') },
        { label: 'Add Secondary Node', onClick: () => handleAddNode('secondary') }
      ];
    }
    
    if (contextMenu.type === 'node') {
      return [
        { label: 'Add Child Node', onClick: () => handleAddNode('default') },
        { label: 'Add Primary Child', onClick: () => handleAddNode('primary') },
        { label: 'Add Secondary Child', onClick: () => handleAddNode('secondary') }
      ];
    }
    
    return [];
  };
  
  // Determine if flow is interactive based on view mode
  const isInteractive = viewMode === 'edit';
  
  return (
    <div className="h-full w-full bg-gray-50 flex flex-col" ref={reactFlowWrapper} data-testid="mind-map-editor">
      <Toolbar />
      
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onPaneClick={onPaneClick}
          onPaneContextMenu={onPaneContextMenu}
          onNodeContextMenu={onNodeContextMenu}
          nodeTypes={nodeTypes}
          deleteKeyCode={['Backspace', 'Delete']}
          id="mindflow-editor"
          nodesDraggable={isInteractive}
          nodesConnectable={isInteractive}
          elementsSelectable={isInteractive}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnScroll={true}
          panOnDrag={isInteractive}
          fitView
        >
          <Background color="#aaa" gap={16} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={renderContextMenuItems()}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

// Wrap with ReactFlowProvider in the parent component
export default MindMapEditor;