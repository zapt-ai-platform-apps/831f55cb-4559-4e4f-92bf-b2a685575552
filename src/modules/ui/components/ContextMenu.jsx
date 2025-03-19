import React, { useEffect, useRef } from 'react';

const ContextMenu = ({ x, y, items = [], onClose }) => {
  const menuRef = useRef(null);
  
  // Adjust position if menu goes out of viewport
  useEffect(() => {
    if (!menuRef.current) return;
    
    const rect = menuRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let adjustedX = x;
    let adjustedY = y;
    
    if (x + rect.width > windowWidth) {
      adjustedX = windowWidth - rect.width - 10;
    }
    
    if (y + rect.height > windowHeight) {
      adjustedY = windowHeight - rect.height - 10;
    }
    
    menuRef.current.style.left = `${adjustedX}px`;
    menuRef.current.style.top = `${adjustedY}px`;
  }, [x, y]);
  
  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    // Listen for clicks and context menu events
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('contextmenu', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [onClose]);
  
  if (items.length === 0) return null;
  
  return (
    <div 
      ref={menuRef}
      className="fixed z-50 bg-white shadow-lg rounded-md py-1 min-w-[160px]"
      style={{ 
        left: x, 
        top: y
      }}
    >
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                item.onClick();
                onClose();
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;