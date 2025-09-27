import React from 'react';
import { Bell } from 'lucide-react';

const psychologistHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 glass-card border-b border-white/20 z-30">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-800">Psychologist</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={20} className="text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">DR</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Psychologist</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default psychologistHeader;