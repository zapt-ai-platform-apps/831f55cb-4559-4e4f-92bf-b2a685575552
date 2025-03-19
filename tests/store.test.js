import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../src/store';

describe('Mind Map Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { setNodes, setEdges } = useStore.getState();
    setNodes([]);
    setEdges([]);
  });

  it('should add a new node', () => {
    const { addNode, nodes } = useStore.getState();
    
    // Initial state should have no nodes
    expect(nodes.length).toBe(0);
    
    // Add a node
    addNode();
    
    // Check if node was added
    const { nodes: updatedNodes } = useStore.getState();
    expect(updatedNodes.length).toBe(1);
    expect(updatedNodes[0].data.label).toBe('New Idea');
  });

  it('should update node data', () => {
    const { addNode, updateNodeData } = useStore.getState();
    
    // Add a node
    addNode();
    const { nodes } = useStore.getState();
    const nodeId = nodes[0].id;
    
    // Update the node
    updateNodeData(nodeId, { label: 'Updated Idea', color: '#ff0000' });
    
    // Check if node was updated
    const { nodes: updatedNodes } = useStore.getState();
    expect(updatedNodes[0].data.label).toBe('Updated Idea');
    expect(updatedNodes[0].data.color).toBe('#ff0000');
  });

  it('should delete a node', () => {
    const { addNode, setSelectedNode, deleteSelectedNode } = useStore.getState();
    
    // Add a node
    addNode();
    const { nodes } = useStore.getState();
    const node = nodes[0];
    
    // Select and delete the node
    setSelectedNode(node);
    deleteSelectedNode();
    
    // Check if node was deleted
    const { nodes: updatedNodes } = useStore.getState();
    expect(updatedNodes.length).toBe(0);
  });

  it('should add and track history for undo/redo', () => {
    const { addNode, addToHistory, undo, redo } = useStore.getState();
    
    // Add a node and save to history
    addNode();
    addToHistory();
    const { nodes: firstNodes } = useStore.getState();
    
    // Add another node and save to history
    addNode();
    addToHistory();
    const { nodes: secondNodes } = useStore.getState();
    
    // There should be two nodes
    expect(secondNodes.length).toBe(2);
    
    // Undo to get back to first state
    undo();
    const { nodes: afterUndo } = useStore.getState();
    expect(afterUndo.length).toBe(1);
    expect(afterUndo[0].id).toBe(firstNodes[0].id);
    
    // Redo to get back to second state
    redo();
    const { nodes: afterRedo } = useStore.getState();
    expect(afterRedo.length).toBe(2);
  });
});