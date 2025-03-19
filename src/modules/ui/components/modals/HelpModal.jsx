import React from 'react';
import Modal from '@/modules/ui/components/Modal';
import Button from '@/modules/ui/components/Button';

const HelpModal = ({ isOpen, onClose }) => {
  const shortcuts = [
    { keys: ['Delete', 'Backspace'], description: 'Delete selected node' },
    { keys: ['Double Click'], description: 'Edit node text' },
    { keys: ['Ctrl', '+'], description: 'Zoom in' },
    { keys: ['Ctrl', '-'], description: 'Zoom out' },
    { keys: ['Ctrl', '0'], description: 'Reset zoom' },
    { keys: ['Ctrl', 'Z'], description: 'Undo last action' },
    { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo last action' },
    { keys: ['Right Click'], description: 'Open context menu' },
  ];
  
  const features = [
    { title: 'PDF Import', description: 'Upload PDF documents and view them in the sidebar' },
    { title: 'PDF to Mind Map', description: 'Convert PDF content to a structured mind map' },
    { title: 'Node Customization', description: 'Create different types of nodes with various styles' },
    { title: 'Export/Import', description: 'Save your mind maps as JSON or image files' },
    { title: 'Local Storage', description: 'Your mind maps are saved to your device for later use' },
  ];
  
  return (
    <Modal
      title="MindFlow Help Guide"
      isOpen={isOpen}
      onClose={onClose}
      size="large"
    >
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-2">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="border rounded-md p-3 bg-gray-50">
                <h4 className="font-medium mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold mb-2">Keyboard Shortcuts</h3>
          <div className="overflow-hidden border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shortcut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shortcuts.map((shortcut, index) => (
                  <tr key={index}>
                    <td className="px-6 py-2">
                      <div className="flex items-center space-x-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && <span>+</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-2 text-sm text-gray-700">
                      {shortcut.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold mb-2">Quick Start</h3>
          <ol className="list-decimal ml-5 space-y-2">
            <li className="text-sm text-gray-700">
              <span className="font-medium">Create a node:</span> Right-click on the canvas and select "Add Node"
            </li>
            <li className="text-sm text-gray-700">
              <span className="font-medium">Connect nodes:</span> Drag from one node's output handle to another node's input handle
            </li>
            <li className="text-sm text-gray-700">
              <span className="font-medium">Edit node text:</span> Double-click on a node to edit its content
            </li>
            <li className="text-sm text-gray-700">
              <span className="font-medium">Import a PDF:</span> Open the sidebar and click "Upload PDF"
            </li>
            <li className="text-sm text-gray-700">
              <span className="font-medium">Convert PDF to mind map:</span> After uploading a PDF, click "Convert to Mind Map"
            </li>
            <li className="text-sm text-gray-700">
              <span className="font-medium">Save your work:</span> Click the Save icon in the toolbar to save your mind map
            </li>
          </ol>
        </section>
        
        <div className="flex justify-end pt-2">
          <Button variant="primary" onClick={onClose}>
            Got it!
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HelpModal;