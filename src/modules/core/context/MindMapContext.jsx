import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/browser';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { saveToLocalStorage, loadFromLocalStorage } from '@/modules/core/utils/storage';

const MindMapContext = createContext(null);

export const useMindMap = () => {
  const context = useContext(MindMapContext);
  if (!context) {
    throw new Error('useMindMap must be used within a MindMapProvider');
  }
  return context;
};

export const MindMapProvider = ({ children }) => {
  // Main state for nodes and edges
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [currentMindMapName, setCurrentMindMapName] = useState('Untitled Mind Map');
  
  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Selected node state
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Initialize with empty mind map or load from storage
  useEffect(() => {
    try {
      const savedMindMap = loadFromLocalStorage('currentMindMap');
      if (savedMindMap) {
        setNodes(savedMindMap.nodes || []);
        setEdges(savedMindMap.edges || []);
        setCurrentMindMapName(savedMindMap.name || 'Untitled Mind Map');
        
        // Initialize history with current state
        setHistory([{ nodes: savedMindMap.nodes, edges: savedMindMap.edges }]);
        setHistoryIndex(0);
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to load mind map from storage:', error);
    }
  }, []);

  // Save current state to localStorage whenever it changes
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      saveToLocalStorage('currentMindMap', {
        nodes,
        edges,
        name: currentMindMapName
      });
    }
  }, [nodes, edges, currentMindMapName]);

  // Add a new node
  const addNode = useCallback((type = 'default', parentId = null, position = { x: 100, y: 100 }, data = { label: 'New Node' }) => {
    const newNode = {
      id: uuidv4(),
      type: 'custom',
      position,
      data: {
        ...data,
        type
      }
    };
    
    setNodes((nds) => [...nds, newNode]);
    
    // If parent is specified, create an edge
    if (parentId) {
      const newEdge = {
        id: `e${parentId}-${newNode.id}`,
        source: parentId,
        target: newNode.id,
        type: 'smoothstep'
      };
      
      setEdges((eds) => [...eds, newEdge]);
    }
    
    // Add to history
    addToHistory([...nodes, newNode], parentId ? [...edges, {
      id: `e${parentId}-${newNode.id}`,
      source: parentId,
      target: newNode.id,
      type: 'smoothstep'
    }] : edges);
    
    return newNode.id;
  }, [nodes, edges]);

  // Update a node
  const updateNode = useCallback((id, data) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
    
    // Add to history
    const updatedNodes = nodes.map(node => 
      node.id === id ? { ...node, data: { ...node.data, ...data } } : node
    );
    addToHistory(updatedNodes, edges);
  }, [nodes, edges]);

  // Delete a node and its connected edges
  const deleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== id && edge.target !== id
    ));
    
    // Add to history
    const filteredNodes = nodes.filter(node => node.id !== id);
    const filteredEdges = edges.filter(
      edge => edge.source !== id && edge.target !== id
    );
    addToHistory(filteredNodes, filteredEdges);
    
    // Clear selection if the deleted node was selected
    if (selectedNode === id) {
      setSelectedNode(null);
    }
  }, [nodes, edges, selectedNode]);

  // Handle node changes (position, selection)
  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    
    // Check for selection changes
    const selectionChange = changes.find(
      change => change.type === 'select'
    );
    
    if (selectionChange) {
      setSelectedNode(
        selectionChange.selected ? selectionChange.id : null
      );
    }
  }, []);

  // Handle edge changes
  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // Create an edge between nodes
  const addEdge = useCallback((params) => {
    const newEdge = {
      ...params,
      id: `e${params.source}-${params.target}`,
      type: 'smoothstep'
    };
    
    // Check if this edge already exists to prevent duplicates
    const edgeExists = edges.some(
      edge => edge.source === params.source && edge.target === params.target
    );
    
    if (!edgeExists) {
      setEdges((eds) => [...eds, newEdge]);
      addToHistory(nodes, [...edges, newEdge]);
    }
  }, [nodes, edges]);

  // Add current state to history
  const addToHistory = (newNodes, newEdges) => {
    // Truncate future history if we're not at the latest point
    const newHistory = history.slice(0, historyIndex + 1);
    
    // Add new state
    newHistory.push({ nodes: newNodes, edges: newEdges });
    
    // Limit history size to prevent memory issues
    if (newHistory.length > 30) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo last action
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  // Redo last undone action
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  // Create a new empty mind map
  const createNewMindMap = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setCurrentMindMapName('Untitled Mind Map');
    setHistory([{ nodes: [], edges: [] }]);
    setHistoryIndex(0);
    setSelectedNode(null);
  }, []);

  // Set a complete mind map (used for importing)
  const setMindMap = useCallback((mindMap) => {
    try {
      if (mindMap && mindMap.nodes && mindMap.edges) {
        setNodes(mindMap.nodes);
        setEdges(mindMap.edges);
        setCurrentMindMapName(mindMap.name || 'Imported Mind Map');
        
        // Reset history with new state
        setHistory([{ nodes: mindMap.nodes, edges: mindMap.edges }]);
        setHistoryIndex(0);
        setSelectedNode(null);
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to set mind map:', error);
    }
  }, []);

  // Generate a mind map from structured data (e.g., from PDF)
  const generateMindMapFromData = useCallback((data, centerX = 0, centerY = 0) => {
    try {
      if (!data || !data.title) {
        throw new Error('Invalid data structure for mind map generation');
      }
      
      // Clear existing mind map
      setNodes([]);
      setEdges([]);
      
      // Create root node
      const rootId = uuidv4();
      const rootNode = {
        id: rootId,
        type: 'custom',
        position: { x: centerX, y: centerY },
        data: { label: data.title, type: 'primary' }
      };
      
      const newNodes = [rootNode];
      const newEdges = [];
      
      // Process children recursively
      if (data.children && data.children.length > 0) {
        processChildren(data.children, rootId, newNodes, newEdges, 0, centerX, centerY);
      }
      
      // Update state
      setNodes(newNodes);
      setEdges(newEdges);
      setCurrentMindMapName(data.title);
      
      // Reset history with new state
      setHistory([{ nodes: newNodes, edges: newEdges }]);
      setHistoryIndex(0);
      setSelectedNode(null);
      
      return rootId;
    } catch (error) {
      Sentry.captureException(error);
      console.error('Failed to generate mind map from data:', error);
      return null;
    }
  }, []);

  // Helper function to process children nodes recursively
  const processChildren = (children, parentId, nodes, edges, level, parentX, parentY) => {
    const angleStep = (2 * Math.PI) / children.length;
    const radius = 150 + level * 100; // Increase radius for each level
    
    children.forEach((child, index) => {
      const angle = index * angleStep;
      const x = parentX + radius * Math.cos(angle);
      const y = parentY + radius * Math.sin(angle);
      
      const nodeId = uuidv4();
      const nodeType = getNodeTypeForLevel(level);
      
      nodes.push({
        id: nodeId,
        type: 'custom',
        position: { x, y },
        data: { label: child.title, type: nodeType }
      });
      
      edges.push({
        id: `e${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: 'smoothstep'
      });
      
      // Process next level children
      if (child.children && child.children.length > 0) {
        processChildren(child.children, nodeId, nodes, edges, level + 1, x, y);
      }
    });
  };

  // Helper to determine node type based on level
  const getNodeTypeForLevel = (level) => {
    const types = ['primary', 'secondary', 'success', 'warning', 'info', 'danger'];
    return types[level % types.length];
  };

  const value = {
    nodes,
    edges,
    currentMindMapName,
    setCurrentMindMapName,
    selectedNode,
    setSelectedNode,
    addNode,
    updateNode,
    deleteNode,
    onNodesChange,
    onEdgesChange,
    addEdge,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    createNewMindMap,
    setMindMap,
    generateMindMapFromData
  };

  return (
    <MindMapContext.Provider value={value}>
      {children}
    </MindMapContext.Provider>
  );
};