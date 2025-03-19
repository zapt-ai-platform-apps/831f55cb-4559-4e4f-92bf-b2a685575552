import React, { useState, useEffect } from 'react';
import { useMindMap } from '@/modules/core/context/MindMapContext';
import { useUI } from '@/modules/core/context/UIContext';
import Modal from '@/modules/ui/components/Modal';
import Button from '@/modules/ui/components/Button';
import { getSavedMindMaps, deleteSavedMindMap } from '@/modules/core/utils/storage';
import { FiTrash2, FiFileText } from 'react-icons/fi';

const OpenModal = ({ isOpen, onClose }) => {
  const [mindMaps, setMindMaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { setMindMap } = useMindMap();
  const { showToast } = useUI();
  
  // Load saved mind maps when modal opens
  useEffect(() => {
    if (isOpen) {
      loadMindMaps();
    }
  }, [isOpen]);
  
  const loadMindMaps = () => {
    try {
      setIsLoading(true);
      const savedMaps = getSavedMindMaps();
      
      // Sort by date modified/created (most recent first)
      const sortedMaps = savedMaps.sort((a, b) => {
        const dateA = a.dateModified || a.dateCreated || '';
        const dateB = b.dateModified || b.dateCreated || '';
        return dateB.localeCompare(dateA);
      });
      
      setMindMaps(sortedMaps);
    } catch (error) {
      console.error('Error loading mind maps:', error);
      showToast('Failed to load saved mind maps', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpen = (mindMap) => {
    try {
      if (confirm('This will replace your current mind map. Continue?')) {
        setMindMap(mindMap);
        showToast(`Opened "${mindMap.name}"`, 'success');
        onClose();
      }
    } catch (error) {
      console.error('Error opening mind map:', error);
      showToast(`Failed to open mind map: ${error.message}`, 'error');
    }
  };
  
  const handleDelete = (id, name, e) => {
    e.stopPropagation(); // Prevent opening the mind map
    
    try {
      if (confirm(`Delete "${name}"? This cannot be undone.`)) {
        const success = deleteSavedMindMap(id);
        
        if (success) {
          showToast(`Deleted "${name}"`, 'success');
          // Refresh the list
          loadMindMaps();
        } else {
          throw new Error('Failed to delete mind map');
        }
      }
    } catch (error) {
      console.error('Error deleting mind map:', error);
      showToast(`Failed to delete mind map: ${error.message}`, 'error');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <Modal
      title="Open Mind Map"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-6">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading saved mind maps...</p>
          </div>
        ) : mindMaps.length === 0 ? (
          <div className="text-center py-8">
            <FiFileText className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">No saved mind maps found</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {mindMaps.map((mindMap) => (
                <li
                  key={mindMap.id}
                  className="py-3 px-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => handleOpen(mindMap)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{mindMap.name || 'Untitled'}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(mindMap.dateModified || mindMap.dateCreated)}
                        <span className="mx-1">•</span>
                        {mindMap.nodes?.length || 0} nodes
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(mindMap.id, mindMap.name, e)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            Opening a mind map will replace your current work. Make sure to save your current work if needed.
          </p>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OpenModal;