import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

export const useStore = create((set, get) => ({
  // Flow state
  nodes: [],
  edges: [],
  selectedNode: null,
  showSidebar: false,
  showImportExport: false,
  
  // History for undo/redo
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
  
  // Node/edge actions
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  
  // Node selection
  setSelectedNode: (node) => {
    set({ 
      selectedNode: node,
      showSidebar: node !== null
    });
  },
  
  // Update node data
  updateNodeData: (id, newData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      }),
    });
  },
  
  // Add a new node
  addNode: () => {
    const { nodes, edges, addToHistory } = get();
    
    addToHistory();
    
    const centerX = Math.random() * 300 - 150;
    const centerY = Math.random() * 300 - 150;
    
    const newNode = {
      id: `node_${nanoid()}`,
      type: 'defaultNode',
      position: { x: centerX, y: centerY },
      data: { 
        label: 'New Idea',
        color: '#ffffff',
        textColor: '#000000',
        fontSize: 'md',
        width: 180,
        height: 80
      },
    };
    
    set({
      nodes: [...nodes, newNode],
      selectedNode: newNode,
      showSidebar: true,
    });
  },
  
  // Delete the selected node
  deleteSelectedNode: () => {
    const { selectedNode, nodes, edges, addToHistory } = get();
    if (!selectedNode) return;
    
    addToHistory();
    
    set({
      nodes: nodes.filter((node) => node.id !== selectedNode.id),
      edges: edges.filter(
        (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ),
      selectedNode: null,
      showSidebar: false,
    });
  },
  
  // Import/export modal
  setShowImportExport: (show) => set({ showImportExport: show }),
  
  // History management
  addToHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    
    const newHistory = [
      ...history.slice(0, historyIndex + 1),
      { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) },
    ];
    
    // Keep history size manageable
    if (newHistory.length > 30) {
      newHistory.shift();
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      canUndo: newHistory.length > 1,
      canRedo: false,
    });
  },
  
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    const historyState = history[newIndex];
    
    set({
      nodes: historyState.nodes,
      edges: historyState.edges,
      historyIndex: newIndex,
      canUndo: newIndex > 0,
      canRedo: true,
      selectedNode: null,
      showSidebar: false,
    });
  },
  
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    
    const newIndex = historyIndex + 1;
    const historyState = history[newIndex];
    
    set({
      nodes: historyState.nodes,
      edges: historyState.edges,
      historyIndex: newIndex,
      canUndo: true,
      canRedo: newIndex < history.length - 1,
      selectedNode: null,
      showSidebar: false,
    });
  },
}));