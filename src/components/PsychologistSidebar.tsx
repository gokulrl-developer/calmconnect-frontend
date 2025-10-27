import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  AlertCircle, 
  User, 
  Clock, 
  LogOut,
  Menu,
  X,
  Wallet,
  Info,
  Bell,
} from 'lucide-react';
import { useAppDispatch } from '../hooks/customReduxHooks';
import { logout} from '../features/authentication/authSlice';
import { handleApiError } from '../services/axiosInstance';
import { logOut } from '../services/authService';
import { NotificationContext } from '../contexts/NotificationContext';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch=useAppDispatch()
  const navigate = useNavigate();
  const { unreadNotificationCount} = useContext(NotificationContext);

  
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

 const handleLogout=async ()=>{
 try{
  const result=await logOut();
  if(result){
   dispatch(logout());
   navigate("/")}
  }catch(error){
  handleApiError(error)
  }
 }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/psychologist/dashboard' },
    { icon: Calendar, label: 'Sessions', path: '/psychologist/sessions' },
    { icon: Clock, label: 'Availability', path: '/psychologist/availability' },
    { icon: AlertCircle, label: 'Raise Complaint', path: '/psychologist/dashboard' },
    { icon: Wallet, label: 'Wallet', path: '/psychologist/dashboard' },
    { icon: User, label: 'Profile', path: '/psychologist/profile' },
    { icon: Info, label: 'Wrong Actions', path: '/psychologist/dashboard' },
    { icon: Bell, label: 'Notifications', path: '/psychologist/notifications' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      <div className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${
        isCollapsed ? (isMobile ? '-translate-x-full' : 'w-20') : 'w-64'
      }`}>
        <div className="h-full bg-white shadow-lg flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between h-16 border-b border-gray-200 px-6">
            {!isCollapsed && (
              <span className="text-xl font-bold text-blue-600">CalmConnect</span>
            )}
            {isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isCollapsed ? <Menu size={20} /> : <X size={20} />}
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setIsCollapsed(true);
                }}
                className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {!isCollapsed && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
                 {item.path === '/psychologist/notifications' && unreadNotificationCount>0  && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {!isCollapsed && (
                <span>Logout</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      {isMobile && isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-white shadow-lg border border-gray-200 hover:scale-105 transition-all duration-200"
        >
          <Menu size={20} />
        </button>
      )}
    </>
  );
};

export default Sidebar;