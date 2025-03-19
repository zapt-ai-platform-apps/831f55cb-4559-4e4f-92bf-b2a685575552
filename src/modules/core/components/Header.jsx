import React from 'react';
import { useUI } from '@/modules/core/context/UIContext';
import { useMindMap } from '@/modules/core/context/MindMapContext';
import Button from '@/modules/ui/components/Button';
import { FiMenu, FiFile, FiSave, FiFolder, FiDownload, FiUpload, FiHelpCircle, FiPlus } from 'react-icons/fi';

const Header = () => {
  const { 
    toggleSidebar, 
    showModal 
  } = useUI();
  
  const { 
    currentMindMapName, 
    setCurrentMindMapName,
    createNewMindMap,
    canUndo,
    canRedo,
    undo,
    redo
  } = useMindMap();

  const handleNameChange = (e) => {
    setCurrentMindMapName(e.target.value);
  };

  const handleNew = () => {
    if (confirm('Create a new mind map? Unsaved changes will be lost.')) {
      createNewMindMap();
    }
  };

  return (
    <header className="bg-white shadow-sm flex items-center justify-between h-16 px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FiMenu size={20} />
        </Button>
        
        <div className="flex items-center gap-2">
          <img 
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=32&height=32" 
            alt="MindFlow Logo" 
            className="w-8 h-8"
          />
          <h1 className="text-xl font-semibold hidden md:block">MindFlow</h1>
        </div>
      </div>
      
      <div className="flex-1 max-w-xl px-4">
        <input
          type="text"
          value={currentMindMapName}
          onChange={handleNameChange}
          className="w-full p-2 text-center border border-transparent hover:border-gray-300 focus:border-primary-500 focus:outline-none rounded-md box-border"
          aria-label="Mind map name"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            className="px-2"
          >
            Undo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            className="px-2"
          >
            Redo
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNew}
            aria-label="New mind map"
          >
            <FiPlus size={18} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => showModal('open')}
            aria-label="Open mind map"
          >
            <FiFolder size={18} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => showModal('save')}
            aria-label="Save mind map"
          >
            <FiSave size={18} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => showModal('import')}
            aria-label="Import"
          >
            <FiUpload size={18} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => showModal('export')}
            aria-label="Export"
          >
            <FiDownload size={18} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => showModal('help')}
            aria-label="Help"
          >
            <FiHelpCircle size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;