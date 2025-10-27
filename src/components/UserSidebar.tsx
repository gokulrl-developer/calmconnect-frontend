import { useLocation,useNavigate } from 'react-router-dom';
import { logout} from '../features/authentication/authSlice';
import type { IRootState } from '../store';
import {
  Calendar,
  Target,
  CreditCard,
  FileText,
  AlertTriangle,
  MessageCircle,
  HelpCircle,
  Bell,
  User,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/customReduxHooks';
import { logOut } from '../services/authService';
import { handleApiError } from '../services/axiosInstance';
import { NotificationContext } from '../contexts/NotificationContext';
import { useContext } from 'react';

export default function UserSidebar() {
 const {firstName,isAuthenticated, role} = useAppSelector((state: IRootState) => state.auth);
 const navigate=useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
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
    

  const navItems = isAuthenticated && role === 'user' ? [
    { path: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/user/profile', label: 'Profile', icon: LayoutDashboard },
    { path: '/user/psychologists', label: 'Book Session', icon: Calendar },
    { path: '/user/sessions', label: 'My Sessions', icon: Target },
    { path: '/user/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/user/warnings-actions', label: 'Warnings & Actions', icon: AlertTriangle },
    { path: '/user/complaints', label: 'Support', icon: HelpCircle },
    { path: '/user/notifications', label: 'Notifications', icon: Bell },
  ] : [];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">CalmConnect</span>
      </div>
      
      <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition ${
              isActive(item.path) ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.path === '/user/notifications' && unreadNotificationCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </button>
        ))}
      </nav>
      
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-3 text-gray-600" />
            <span className="text-sm text-gray-700">{firstName}</span>
          </div>
        </div>
        <button
          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}