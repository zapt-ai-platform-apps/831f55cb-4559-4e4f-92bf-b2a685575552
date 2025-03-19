import React, { useEffect, useState } from 'react';
import { FiX, FiCheck, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (!isVisible) return null;
  
  // Toast type styles
  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-800',
      icon: <FiCheck className="w-5 h-5 text-green-500" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: <FiAlertCircle className="w-5 h-5 text-red-500" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      icon: <FiAlertTriangle className="w-5 h-5 text-yellow-500" />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-800',
      icon: <FiInfo className="w-5 h-5 text-blue-500" />
    }
  };
  
  const style = typeStyles[type] || typeStyles.info;
  
  return (
    <div 
      className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border-l-4 ${style.border} ${style.bg} transition-opacity duration-300`}
      role="alert"
    >
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0 mr-3">
          {style.icon}
        </div>
        <div className={`flex-1 ${style.text}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          className="ml-4 text-gray-500 hover:text-gray-600 cursor-pointer"
          onClick={handleClose}
          aria-label="Close"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;