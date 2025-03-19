import React, { useState, useRef } from 'react';
import { useMindMap } from '@/modules/core/context/MindMapContext';
import { useUI } from '@/modules/core/context/UIContext';
import Modal from '@/modules/ui/components/Modal';
import Button from '@/modules/ui/components/Button';
import { importFromJson, validateMindMapData } from '@/modules/core/utils/exportImport';
import { FiUpload } from 'react-icons/fi';

const ImportModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  
  const { setMindMap } = useMindMap();
  const { showToast } = useUI();
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };
  
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleImport = async () => {
    if (!selectedFile) {
      setError('Please select a file to import');
      return;
    }
    
    try {
      setIsImporting(true);
      setError('');
      
      const mindMapData = await importFromJson(selectedFile);
      
      // Validate the imported data
      if (!validateMindMapData(mindMapData)) {
        throw new Error('Invalid mind map format');
      }
      
      // Confirm before replacing existing mind map
      if (confirm('This will replace your current mind map. Continue?')) {
        setMindMap(mindMapData);
        showToast('Mind map imported successfully', 'success');
        onClose();
      }
    } catch (error) {
      console.error('Import error:', error);
      setError(`Import failed: ${error.message}`);
      showToast(`Import failed: ${error.message}`, 'error');
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <Modal
      title="Import Mind Map"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          
          {selectedFile ? (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-primary-100 text-primary-800 px-3 py-2 rounded-md">
                {selectedFile.name}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClickUpload}
              >
                Choose a different file
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <FiUpload className="w-12 h-12 text-gray-400" />
              <p className="text-gray-500 mb-2">
                Drag and drop your JSON file here, or click to browse
              </p>
              <Button
                variant="outline"
                onClick={handleClickUpload}
              >
                Select File
              </Button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="bg-yellow-50 p-3 rounded-md">
          <p className="text-sm text-yellow-800">
            Importing will replace your current mind map. Make sure to export your current work if you want to keep it.
          </p>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            loading={isImporting}
            disabled={isImporting || !selectedFile}
          >
            Import
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;