import React, { useState } from 'react';
import { useMindMap } from '@/modules/core/context/MindMapContext';
import { useUI } from '@/modules/core/context/UIContext';
import Modal from '@/modules/ui/components/Modal';
import Button from '@/modules/ui/components/Button';
import { exportToJson, exportToImage } from '@/modules/core/utils/exportImport';

const ExportModal = ({ isOpen, onClose }) => {
  const [exportType, setExportType] = useState('json');
  const [isExporting, setIsExporting] = useState(false);
  
  const { nodes, edges, currentMindMapName } = useMindMap();
  const { showToast } = useUI();
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      if (exportType === 'json') {
        await exportToJson({
          nodes,
          edges,
          name: currentMindMapName
        });
        showToast('Mind map exported successfully', 'success');
      } else if (exportType === 'image') {
        await exportToImage('mindflow-editor', currentMindMapName);
        showToast('Mind map exported as image', 'success');
      }
      
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      showToast(`Export failed: ${error.message}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Modal
      title="Export Mind Map"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Export Format</label>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="exportJson"
                name="exportType"
                value="json"
                checked={exportType === 'json'}
                onChange={() => setExportType('json')}
                className="mr-2"
              />
              <label htmlFor="exportJson">JSON</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="exportImage"
                name="exportType"
                value="image"
                checked={exportType === 'image'}
                onChange={() => setExportType('image')}
                className="mr-2"
              />
              <label htmlFor="exportImage">Image (PNG)</label>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            {exportType === 'json' 
              ? 'Export as JSON allows you to import the mind map later or share it with others.'
              : 'Export as image creates a PNG file of your current mind map view.'}
          </p>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            loading={isExporting}
            disabled={isExporting}
          >
            Export
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;