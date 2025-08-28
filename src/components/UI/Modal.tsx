import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Card from './Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative glass-card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
         <div className="m-3">
         <Card>
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-gray-600/20">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-500/10 dark:hover:bg-gray-700/20 transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        </Card>
        </div>
        <div className="m-3">
        <Card>
        <div>
          {children}
        </div>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Modal;