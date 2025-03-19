import React, { useState } from 'react';
import { useMindMap } from '@/modules/core/context/MindMapContext';
import { useUI } from '@/modules/core/context/UIContext';
import Modal from '@/modules/ui/components/Modal';
import Button from '@/modules/ui/components/Button';
import { saveMindMap } from '@/modules/core/utils/storage';

const SaveModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const { nodes, edges, currentMindMapName } = useMindMap();
  const { showToast } = useUI();
  
  // Set initial name when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setName(currentMindMapName);
    }
  }, [isOpen, currentMindMapName]);
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const mindMapData = {
        nodes,
        edges,
        name: name.trim() || 'Untitled Mind Map',
        id: Date.now().toString(),
        dateCreated: new Date().toISOString()
      };
      
      const success = saveMindMap(mindMapData, name.trim());
      
      if (success) {
        showToast('Mind map saved successfully', 'success');
        onClose();
      } else {
        throw new Error('Failed to save mind map');
      }
    } catch (error) {
      console.error('Save error:', error);
      showToast(`Save failed: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Modal
      title="Save Mind Map"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="mindmap-name" className="block mb-1 font-medium">
            Mind Map Name
          </label>
          <input
            id="mindmap-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name for your mind map"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 box-border"
          />
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            Your mind map will be saved to your browser's local storage. You can access it later from the "Open" menu.
          </p>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving || !name.trim()}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SaveModal;