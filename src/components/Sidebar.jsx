import React, { useState, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useStore } from '../store';

export default function Sidebar() {
  const { selectedNode, updateNodeData, addToHistory } = useStore();
  const [editingLabel, setEditingLabel] = useState(selectedNode?.data?.label || '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);

  // Update the node text
  const handleLabelChange = useCallback((e) => {
    setEditingLabel(e.target.value);
  }, []);

  const handleLabelBlur = useCallback(() => {
    if (selectedNode && editingLabel !== selectedNode.data.label) {
      addToHistory();
      updateNodeData(selectedNode.id, { label: editingLabel });
    }
  }, [selectedNode, editingLabel, updateNodeData, addToHistory]);

  // Update node color
  const handleColorChange = useCallback((color) => {
    if (selectedNode) {
      updateNodeData(selectedNode.id, { color });
    }
  }, [selectedNode, updateNodeData]);

  const handleColorChangeComplete = useCallback(() => {
    addToHistory();
  }, [addToHistory]);

  // Update text color
  const handleTextColorChange = useCallback((textColor) => {
    if (selectedNode) {
      updateNodeData(selectedNode.id, { textColor });
    }
  }, [selectedNode, updateNodeData]);

  // Update font size
  const handleFontSizeChange = useCallback((e) => {
    if (selectedNode) {
      addToHistory();
      updateNodeData(selectedNode.id, { fontSize: e.target.value });
    }
  }, [selectedNode, updateNodeData, addToHistory]);

  // Handle node dimensions
  const handleDimensionChange = useCallback((dimension, value) => {
    if (selectedNode) {
      addToHistory();
      updateNodeData(selectedNode.id, { [dimension]: Number(value) });
    }
  }, [selectedNode, updateNodeData, addToHistory]);

  if (!selectedNode) return null;

  return (
    <div className="sidebar bg-white w-64 p-4 border-l border-gray-200 overflow-y-auto">
      <h2 className="font-bold text-lg mb-4">Node Properties</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text
        </label>
        <textarea
          value={editingLabel}
          onChange={handleLabelChange}
          onBlur={handleLabelBlur}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Background Color
        </label>
        <div 
          className="w-full h-8 border border-gray-300 rounded-md cursor-pointer mb-1"
          style={{ backgroundColor: selectedNode.data.color }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        {showColorPicker && (
          <div className="relative z-10">
            <HexColorPicker
              color={selectedNode.data.color}
              onChange={handleColorChange}
              onMouseUp={handleColorChangeComplete}
              className="mb-2"
            />
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Color
        </label>
        <div 
          className="w-full h-8 border border-gray-300 rounded-md cursor-pointer mb-1"
          style={{ backgroundColor: selectedNode.data.textColor }}
          onClick={() => setShowTextColorPicker(!showTextColorPicker)}
        />
        {showTextColorPicker && (
          <div className="relative z-10">
            <HexColorPicker
              color={selectedNode.data.textColor}
              onChange={handleTextColorChange}
              onMouseUp={handleColorChangeComplete}
              className="mb-2"
            />
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Size
        </label>
        <select
          value={selectedNode.data.fontSize}
          onChange={handleFontSizeChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Width
        </label>
        <input
          type="number"
          value={selectedNode.data.width}
          onChange={(e) => handleDimensionChange('width', e.target.value)}
          min={100}
          max={500}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Height
        </label>
        <input
          type="number"
          value={selectedNode.data.height}
          onChange={(e) => handleDimensionChange('height', e.target.value)}
          min={50}
          max={400}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
}