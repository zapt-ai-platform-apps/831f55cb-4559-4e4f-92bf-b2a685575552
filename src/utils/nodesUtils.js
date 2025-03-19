import { nanoid } from 'nanoid';

// Create a new node
export const createNode = (position, label = 'New Idea') => ({
  id: `node_${nanoid()}`,
  type: 'defaultNode',
  position,
  data: { 
    label,
    color: '#ffffff',
    textColor: '#000000',
    fontSize: 'md',
    width: 180,
    height: 80
  },
});

// Calculate a central position for new nodes
export const calculateCentralPosition = (nodes, viewportCenter) => {
  if (!nodes || nodes.length === 0) {
    return viewportCenter || { x: 0, y: 0 };
  }
  
  // Calculate average position of existing nodes
  const totalNodes = nodes.length;
  const sum = nodes.reduce(
    (acc, node) => ({
      x: acc.x + node.position.x,
      y: acc.y + node.position.y,
    }),
    { x: 0, y: 0 }
  );
  
  // Add slight random offset to avoid overlap
  return {
    x: sum.x / totalNodes + (Math.random() * 100 - 50),
    y: sum.y / totalNodes + (Math.random() * 100 - 50),
  };
};

// Get node styles based on its data
export const getNodeStyles = (nodeData) => {
  const { color, textColor, width, height } = nodeData;
  
  return {
    backgroundColor: color || '#ffffff',
    color: textColor || '#000000',
    width: `${width || 180}px`,
    height: `${height || 80}px`,
  };
};

// Get font size class based on node data
export const getFontSizeClass = (fontSize) => {
  const fontSizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };
  
  return fontSizeMap[fontSize] || 'text-base';
};