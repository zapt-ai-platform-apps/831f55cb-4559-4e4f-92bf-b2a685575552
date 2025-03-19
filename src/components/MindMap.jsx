import React, { useCallback, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel,
  useReactFlow, 
  MarkerType 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nanoid } from 'nanoid';
import { useStore } from '../store';
import { saveMap } from '../utils/localStorage';
import NodeTypes from './nodes';
import { RiZoomInLine, RiZoomOutLine, RiFullscreenLine } from 'react-icons/ri';

export default function MindMap() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    setSelectedNode,
    setNodes,
    setEdges,
    addToHistory
  } = useStore();
  
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef(null);

  // Auto-save changes
  const onNodeChange = useCallback((changes) => {
    onNodesChange(changes);
    saveMap('last-map', { nodes, edges });
  }, [nodes, edges, onNodesChange]);

  const onEdgeChange = useCallback((changes) => {
    onEdgesChange(changes);
    saveMap('last-map', { nodes, edges });
  }, [nodes, edges, onEdgesChange]);

  // Handle connections between nodes
  const handleConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      id: `e${nanoid()}`,
      type: 'smoothstep',
      animated: false,
      style: { strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
    };
    
    addToHistory();
    onConnect(newEdge);
    saveMap('last-map', { 
      nodes, 
      edges: [...edges, newEdge] 
    });
  }, [nodes, edges, onConnect, addToHistory]);

  // Handle node click for selection
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  // Handle pane click for deselection
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Handle double click to create a new node
  const onPaneDoubleClick = useCallback((event) => {
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode = {
      id: `node_${nanoid()}`,
      type: 'defaultNode',
      position,
      data: { 
        label: 'New Idea',
        color: '#ffffff',
        textColor: '#000000',
        fontSize: 'md',
        width: 180,
        height: 80
      },
    };

    addToHistory();
    setNodes([...nodes, newNode]);
    saveMap('last-map', { nodes: [...nodes, newNode], edges });
  }, [reactFlowInstance, nodes, edges, setNodes, addToHistory]);

  // Handle keyboard shortcuts
  const onKeyDown = useCallback((event) => {
    // Implement keyboard shortcuts here (Delete, Ctrl+Z, etc.)
  }, []);

  // Custom zoom controls
  const zoomIn = () => {
    reactFlowInstance.zoomIn();
  };

  const zoomOut = () => {
    reactFlowInstance.zoomOut();
  };

  const fitView = () => {
    reactFlowInstance.fitView();
  };

  return (
    <div 
      className="flex-1 h-full" 
      ref={reactFlowWrapper}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgeChange}
        onConnect={handleConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onPaneDoubleClick={onPaneDoubleClick}
        nodeTypes={NodeTypes}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background color="#aaa" gap={16} />
        <Controls showInteractive={false} />
        <Panel position="top-right" className="space-x-2 mt-2 mr-2">
          <button onClick={zoomIn} className="bg-white p-2 rounded shadow hover:bg-gray-100 tooltip-container">
            <RiZoomInLine />
            <span className="tooltip">Zoom In</span>
          </button>
          <button onClick={zoomOut} className="bg-white p-2 rounded shadow hover:bg-gray-100 tooltip-container">
            <RiZoomOutLine />
            <span className="tooltip">Zoom Out</span>
          </button>
          <button onClick={fitView} className="bg-white p-2 rounded shadow hover:bg-gray-100 tooltip-container">
            <RiFullscreenLine />
            <span className="tooltip">Fit View</span>
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}