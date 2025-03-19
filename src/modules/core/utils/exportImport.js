import { saveAs } from 'file-saver';
import * as Sentry from '@sentry/browser';
import { toPng } from 'html-to-image';

/**
 * Exports the current mind map as a JSON file
 * @param {object} mindMap - Mind map object with nodes, edges and name
 * @returns {Promise<boolean>} Success status
 */
export const exportToJson = async (mindMap) => {
  try {
    if (!mindMap || !mindMap.nodes) {
      throw new Error('Invalid mind map data');
    }
    
    const fileName = `${mindMap.name || 'mindmap'}.json`.replace(/\s+/g, '_');
    const blob = new Blob([JSON.stringify(mindMap, null, 2)], { type: 'application/json' });
    
    saveAs(blob, fileName);
    return true;
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error exporting mind map to JSON:', error);
    throw error;
  }
};

/**
 * Imports a mind map from a JSON file
 * @param {File} file - The JSON file to import
 * @returns {Promise<object>} The imported mind map
 */
export const importFromJson = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const mindMap = JSON.parse(event.target.result);
        
        if (!mindMap || !mindMap.nodes || !Array.isArray(mindMap.nodes)) {
          throw new Error('Invalid mind map format');
        }
        
        resolve(mindMap);
      } catch (error) {
        Sentry.captureException(error);
        console.error('Error parsing mind map JSON:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      Sentry.captureException(error);
      console.error('Error reading file:', error);
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

/**
 * Exports the mind map as an image
 * @param {string} elementId - ID of the element to capture
 * @param {string} fileName - Name for the exported file
 * @returns {Promise<boolean>} Success status
 */
export const exportToImage = async (elementId, fileName = 'mindmap') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }
    
    // Add a white background to make the image more visible
    const originalBackground = element.style.background;
    element.style.background = 'white';
    
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      quality: 1
    });
    
    // Restore the original background
    element.style.background = originalBackground;
    
    // Download the image
    const link = document.createElement('a');
    link.download = `${fileName.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
    
    return true;
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error exporting mind map to image:', error);
    throw error;
  }
};

/**
 * Validates mind map data structure
 * @param {object} data - Mind map data to validate
 * @returns {boolean} Whether the data is valid
 */
export const validateMindMapData = (data) => {
  // Basic structure validation
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) return false;
  
  // Node validation
  const validNodes = data.nodes.every(node => 
    node.id && 
    node.position && 
    typeof node.position.x === 'number' && 
    typeof node.position.y === 'number' &&
    node.data &&
    typeof node.data.label === 'string'
  );
  
  // Edge validation
  const validEdges = data.edges.every(edge => 
    edge.id && 
    typeof edge.source === 'string' && 
    typeof edge.target === 'string'
  );
  
  return validNodes && validEdges;
};