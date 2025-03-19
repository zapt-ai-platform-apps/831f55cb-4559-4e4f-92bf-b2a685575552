import React, { useCallback, useState } from 'react';
import { toPng } from 'html-to-image';
import { useReactFlow } from 'reactflow';
import { useStore } from '../store';
import { saveMap, loadMap, getSavedMaps } from '../utils/localStorage';
import { FaTimes, FaDownload, FaUpload, FaSave, FaTrash } from 'react-icons/fa';

export default function ImportExport() {
  const { nodes, edges, setNodes, setEdges, setShowImportExport } = useStore();
  const [mapName, setMapName] = useState('');
  const [savedMaps, setSavedMaps] = useState(getSavedMaps());
  const [exportType, setExportType] = useState('png');
  const { getNodes } = useReactFlow();
  
  // Close modal
  const handleClose = useCallback(() => {
    setShowImportExport(false);
  }, [setShowImportExport]);
  
  // Save map to localStorage
  const handleSave = useCallback(() => {
    if (mapName.trim()) {
      saveMap(mapName, { nodes, edges });
      setMapName('');
      setSavedMaps(getSavedMaps());
    }
  }, [mapName, nodes, edges]);
  
  // Load map from localStorage
  const handleLoad = useCallback((name) => {
    const map = loadMap(name);
    if (map) {
      setNodes(map.nodes);
      setEdges(map.edges);
      handleClose();
    }
  }, [setNodes, setEdges, handleClose]);
  
  // Delete saved map
  const handleDelete = useCallback((name, e) => {
    e.stopPropagation();
    localStorage.removeItem(`mindmap-${name}`);
    setSavedMaps(getSavedMaps());
  }, []);
  
  // Export map as image
  const handleExportImage = useCallback(() => {
    const nodesBounds = document.querySelector('.react-flow__nodes');
    if (nodesBounds) {
      toPng(nodesBounds, { 
        backgroundColor: '#f9fafb',
        quality: 1,
        pixelRatio: 2
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `mindmap-${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Error exporting image:', error);
        });
    }
  }, []);
  
  // Export map as JSON
  const handleExportJson = useCallback(() => {
    const jsonString = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `mindmap-${Date.now()}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);
  
  // Import map from JSON file
  const handleImport = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (importedData.nodes && importedData.edges) {
            setNodes(importedData.nodes);
            setEdges(importedData.edges);
            handleClose();
          }
        } catch (error) {
          console.error('Error importing file:', error);
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  }, [setNodes, setEdges, handleClose]);
  
  // Handle export button click
  const handleExport = useCallback(() => {
    if (exportType === 'png') {
      handleExportImage();
    } else if (exportType === 'json') {
      handleExportJson();
    }
  }, [exportType, handleExportImage, handleExportJson]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Save & Export Mind Map</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Save to Browser Storage</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              placeholder="Enter map name"
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleSave}
              disabled={!mapName.trim()}
              className={`p-2 rounded flex items-center ${mapName.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <FaSave />
            </button>
          </div>
        </div>
        
        {savedMaps.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Saved Mind Maps</h3>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
              {savedMaps.map((name) => (
                <div 
                  key={name}
                  onClick={() => handleLoad(name)}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center border-b border-gray-200 last:border-b-0"
                >
                  <span>{name}</span>
                  <button
                    onClick={(e) => handleDelete(name, e)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Export</h3>
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded"
              >
                <option value="png">PNG Image</option>
                <option value="json">JSON File</option>
              </select>
              <button
                onClick={handleExport}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
              >
                <FaDownload />
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Import</h3>
          <label className="flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 cursor-pointer">
            <FaUpload className="mr-2" />
            <span>Import JSON File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}