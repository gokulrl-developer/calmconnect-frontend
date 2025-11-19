import React, { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { unreadNotificationCount} = useContext(NotificationContext);
     const navigate=useNavigate()
  return (
    <header className="fixed top-0 left-64 right-0 h-16 glass-card border-b border-white/20 dark:border-gray-600/20 z-30">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">CalmConnect Admin</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
             <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={()=>navigate("/admin/notifications")}>
              <Bell size={20} className="text-gray-600" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-[1px] rounded-full min-w-[16px] text-center font-medium shadow-sm">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
              )}
            </button>
            </div>
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