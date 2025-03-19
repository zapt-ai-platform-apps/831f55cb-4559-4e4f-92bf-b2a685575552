// Save mind map to localStorage
export const saveMap = (name, data) => {
  try {
    localStorage.setItem(`mindmap-${name}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving map:', error);
    return false;
  }
};

// Load mind map from localStorage
export const loadMap = (name) => {
  try {
    const data = localStorage.getItem(`mindmap-${name}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading map:', error);
    return null;
  }
};

// Get list of saved mind maps
export const getSavedMaps = () => {
  const maps = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('mindmap-')) {
      maps.push(key.substring(8));
    }
  }
  return maps;
};