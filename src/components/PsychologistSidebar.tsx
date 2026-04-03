import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  Clock, 
  LogOut,
  Wallet,
  Bell,
} from 'lucide-react';
import { useAppDispatch } from '../hooks/customReduxHooks';
import { logout} from '../features/authentication/authSlice';
import { handleApiError } from '../services/axiosInstance';
import { logOut } from '../services/authService';
import { NotificationContext } from '../contexts/NotificationContext';

const Sidebar: React.FC = () => {
  const dispatch=useAppDispatch()
  const navigate = useNavigate();
  const { unreadNotificationCount} = useContext(NotificationContext);

  
 
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
    { icon: Wallet, label: 'Transactions', path: '/psychologist/transactions' },
    { icon: User, label: 'Profile', path: '/psychologist/profile' },
    { icon: Bell, label: 'Notifications', path: '/psychologist/notifications' },
  ];

  return (
    <>
      <div className={`fixed left-0 top-16 h-full max-h-[calc(100vh-4rem)] z-40 transition-all duration-300 w-fit md:w-64`}>
        <div className="h-full bg-white shadow-lg flex flex-col">
          
          {/* Navigation */}
          <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                }}
                className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition"
              >
                <item.icon className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                 {item.path === '/psychologist/notifications' && unreadNotificationCount>0  && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-6 border-t border-gray-200 hidden md:block">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;