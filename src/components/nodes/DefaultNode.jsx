import React, { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../../store';

const DefaultNode = ({ id, data, selected }) => {
  const { updateNodeData, addToHistory } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);
  
  const fontSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };
  
  // Start editing on double click
  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);
  
  // Update node on blur
  const handleBlur = useCallback(() => {
    if (editLabel !== data.label) {
      addToHistory();
      updateNodeData(id, { label: editLabel });
    }
    setIsEditing(false);
  }, [id, editLabel, data.label, updateNodeData, addToHistory]);
  
  // Handle key presses in editing mode
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditLabel(data.label);
      setIsEditing(false);
    }
  }, [data.label, handleBlur]);
  
  return (
    <div
      style={{
        backgroundColor: data.color,
        color: data.textColor,
        width: data.width,
        height: data.height,
        borderColor: selected ? '#3b82f6' : 'transparent',
        borderWidth: selected ? 2 : 0,
        borderStyle: 'solid',
        borderRadius: '8px',
      }}
      className="rounded-lg shadow-md p-3 flex items-center justify-center overflow-hidden"
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      
      {isEditing ? (
        <textarea
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${fontSizeClasses[data.fontSize]} w-full h-full p-0 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-center`}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className={`${fontSizeClasses[data.fontSize]} w-full h-full flex items-center justify-center text-center break-words overflow-auto whitespace-pre-wrap`}>
          {data.label}
        </div>
      )}
    </div>
  );
};

export default DefaultNode;