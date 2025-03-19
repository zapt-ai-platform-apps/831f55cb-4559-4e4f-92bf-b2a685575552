import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveMap, loadMap, getSavedMaps } from '../src/utils/localStorage';

describe('Local Storage Utils', () => {
  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should save a map to localStorage', () => {
    const testData = { nodes: [{ id: 'test' }], edges: [] };
    saveMap('test-map', testData);
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'mindmap-test-map', 
      JSON.stringify(testData)
    );
  });

  it('should load a map from localStorage', () => {
    const testData = { nodes: [{ id: 'test' }], edges: [] };
    localStorage.getItem.mockReturnValue(JSON.stringify(testData));
    
    const result = loadMap('test-map');
    
    expect(localStorage.getItem).toHaveBeenCalledWith('mindmap-test-map');
    expect(result).toEqual(testData);
  });

  it('should return null when loading non-existent map', () => {
    localStorage.getItem.mockReturnValue(null);
    
    const result = loadMap('non-existent');
    
    expect(result).toBeNull();
  });

  it('should get list of saved maps', () => {
    localStorage.length = 3;
    localStorage.key.mockImplementation((index) => {
      const keys = ['mindmap-map1', 'other-key', 'mindmap-map2'];
      return keys[index];
    });
    
    const result = getSavedMaps();
    
    expect(result).toEqual(['map1', 'map2']);
  });
});