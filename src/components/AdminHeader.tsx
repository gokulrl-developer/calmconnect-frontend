import React from 'react';

const Header: React.FC = () => {

  return (
    <header className="fixed top-0 left-64 right-0 h-16 glass-card border-b border-white/20 dark:border-gray-600/20 z-30">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">CalmConnect Admin</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">A</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;