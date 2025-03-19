import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useMindMap } from '@/modules/core/context/MindMapContext';
import { useUI } from '@/modules/core/context/UIContext';
import { FiEdit2 } from 'react-icons/fi';

const CustomNode = ({ id, data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'New Node');
  const inputRef = useRef(null);
  
  const { updateNode, selectedNode } = useMindMap();
  const { viewMode } = useUI();
  
  // Get node type or default
  const nodeType = data.type || 'default';
  
  // Determine if the node is selected
  const isSelected = selectedNode === id;
  
  // Update local label when data changes from parent
  useEffect(() => {
    setLabel(data.label || 'New Node');
  }, [data.label]);
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  // Handle double click to edit
  const handleDoubleClick = () => {
    if (viewMode === 'edit') {
      setIsEditing(true);
    }
  };
  
  // Handle input change
  const handleChange = (e) => {
    setLabel(e.target.value);
  };
  
  // Handle blur event to save changes
  const handleBlur = () => {
    finishEditing();
  };
  
  // Handle key press (Enter to confirm, Escape to cancel)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setLabel(data.label || 'New Node'); // Reset to original value
    }
  };
  
  // Finish editing and save changes
  const finishEditing = () => {
    setIsEditing(false);
    if (label.trim() !== data.label) {
      updateNode(id, { label: label.trim() || 'New Node' });
    }
  };
  
  // Calculate border style based on selection state
  const borderStyle = isSelected ? 'ring-2 ring-primary-500 shadow-md' : '';
  
  return (
    <div className={`node node-${nodeType} ${borderStyle}`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable && viewMode === 'edit'}
        style={{ background: '#555' }}
      />
      
      {isEditing ? (
        <input
          ref={inputRef}
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent outline-none p-0 text-center box-border"
          autoFocus
        />
      ) : (
        <div 
          className="relative group"
          onDoubleClick={handleDoubleClick}
        >
          <div className="text-center break-words">{label}</div>
          
          {viewMode === 'edit' && (
            <button
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <FiEdit2 size={12} />
            </button>
          )}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable && viewMode === 'edit'}
        style={{ background: '#555' }}
      />
    </div>
  );
};

export default CustomNode;