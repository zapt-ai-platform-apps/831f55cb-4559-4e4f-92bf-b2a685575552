import * as Sentry from '@sentry/browser';

/**
 * Saves data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 * @returns {boolean} Success status
 */
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    Sentry.captureException(error);
    console.error(`Error saving data to localStorage: ${error.message}`);
    return false;
  }
};

/**
 * Loads data from localStorage with error handling
 * @param {string} key - Storage key
 * @returns {any|null} Retrieved data or null if not found/error
 */
export const loadFromLocalStorage = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    Sentry.captureException(error);
    console.error(`Error loading data from localStorage: ${error.message}`);
    return null;
  }
};

/**
 * Removes data from localStorage
 * @param {string} key - Storage key to remove
 * @returns {boolean} Success status
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    Sentry.captureException(error);
    console.error(`Error removing data from localStorage: ${error.message}`);
    return false;
  }
};

/**
 * Saves a mind map to user's saved mind maps collection
 * @param {object} mindMap - Mind map data to save
 * @param {string} name - Name for the mind map
 * @returns {boolean} Success status
 */
export const saveMindMap = (mindMap, name) => {
  try {
    // Get existing saved mind maps
    const savedMindMaps = loadFromLocalStorage('savedMindMaps') || [];
    
    // Create mind map object with metadata
    const mindMapWithMeta = {
      ...mindMap,
      name: name || 'Untitled Mind Map',
      id: mindMap.id || Date.now().toString(),
      dateCreated: mindMap.dateCreated || new Date().toISOString(),
      dateModified: new Date().toISOString()
    };
    
    // Check if updating existing or adding new
    const existingIndex = savedMindMaps.findIndex(m => m.id === mindMapWithMeta.id);
    
    if (existingIndex >= 0) {
      // Update existing
      savedMindMaps[existingIndex] = mindMapWithMeta;
    } else {
      // Add new
      savedMindMaps.push(mindMapWithMeta);
    }
    
    // Save back to storage
    return saveToLocalStorage('savedMindMaps', savedMindMaps);
  } catch (error) {
    Sentry.captureException(error);
    console.error(`Error saving mind map: ${error.message}`);
    return false;
  }
};

/**
 * Gets all saved mind maps
 * @returns {Array} Array of saved mind maps
 */
export const getSavedMindMaps = () => {
  return loadFromLocalStorage('savedMindMaps') || [];
};

/**
 * Gets a specific saved mind map by id
 * @param {string} id - Mind map id
 * @returns {object|null} Mind map object or null if not found
 */
export const getSavedMindMapById = (id) => {
  const savedMindMaps = getSavedMindMaps();
  return savedMindMaps.find(mindMap => mindMap.id === id) || null;
};

/**
 * Deletes a saved mind map
 * @param {string} id - Mind map id to delete
 * @returns {boolean} Success status
 */
export const deleteSavedMindMap = (id) => {
  try {
    const savedMindMaps = getSavedMindMaps();
    const filteredMindMaps = savedMindMaps.filter(mindMap => mindMap.id !== id);
    
    return saveToLocalStorage('savedMindMaps', filteredMindMaps);
  } catch (error) {
    Sentry.captureException(error);
    console.error(`Error deleting mind map: ${error.message}`);
    return false;
  }
};