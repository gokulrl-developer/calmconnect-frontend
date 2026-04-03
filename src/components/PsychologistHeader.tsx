import React, { useContext, useState } from 'react';
import { Bell, LogOut, Menu } from 'lucide-react';
import { NotificationContext } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/authentication/authSlice';
import { handleApiError } from '../services/axiosInstance';
import { logOut } from '../services/authService';
import { useAppDispatch } from '../hooks/customReduxHooks';
type Props = {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const psychologistHeader: React.FC<Props> = ({ setIsSidebarOpen }) => {
  const { unreadNotificationCount } = useContext(NotificationContext);
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = function () {
    setIsSidebarOpen((prev: boolean) => !prev);
  }
  const handleLogout = async () => {
    try {
      const result = await logOut();
      if (result) {
        dispatch(logout());
        navigate("/")
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass-card border-b border-white/20 z-40">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-1 h-16 px-6">
          <span className="text-xl font-bold text-black md:hidden"><button>
            <Menu onClick={toggleSidebar} />
          </button>
          </span>
        </div>
        <div className="flex items-center gap-1 h-16 px-6">
          <span className="text-xl font-bold text-blue-600">CalmConnect</span>
        </div>


        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/psychologist/notifications")}>
                <Bell size={20} className="text-gray-600" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-[1px] rounded-full min-w-[16px] text-center font-medium shadow-sm">
                    {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                  </span>
                )}
              </button>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <span className="text-white font-medium text-sm">Psy</span>
                {isOpen && (
                  <div className="absolute right-0 top-full w-40 bg-white shadow-lg py-1 z-40 flex flex-col">
                    <span className="text-md text-blue-600">Psychologist</span>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default psychologistHeader;