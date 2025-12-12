import React, { useContext } from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  WalletIcon,
  BellIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { FlagIcon } from '@heroicons/react/24/solid'; 
import { logout } from '../features/authentication/authSlice';
import {useAppDispatch} from '../hooks/customReduxHooks';
import { useNavigate } from 'react-router-dom';
import { handleApiError } from '../services/axiosInstance';
import { logOut } from '../services/authService';
import { NotificationContext } from '../contexts/NotificationContext';


const Sidebar: React.FC = () => {
 const dispatch=useAppDispatch();
 const navigate=useNavigate();
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

  return (
    <aside className="fixed left-0 top-16 h-full max-h-[calc(100vh-4rem)] md:w-1/5 bg-white dark:bg-gray-900 shadow-lg z-40 flex flex-col">
      <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
        <button
          className={`w-full flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition`}
         onClick={()=>{navigate("/admin/dashboard")}}>
          <HomeIcon className="w-5 h-5 mr-3" />
          Dashboard
        </button>
        <button
          className={`w-full flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition`}
        onClick={()=>{navigate("/admin/applications")}}>
          <ClipboardDocumentListIcon className="w-5 h-5 mr-3" 
          />
          Applications
        </button>
        <button
          className={`w-full flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition`}
          onClick={()=>{navigate("/admin/sessions")}}>
          <VideoCameraIcon className="w-5 h-5 mr-3" /> 
          Sessions
        </button>
        <button
          className={`w-full flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition`}
          onClick={()=>{navigate("/admin/complaints")}}>
          <FlagIcon className="w-5 h-5 mr-3" /> 
          Complaints
        </button>
        <button
          className={`w-full flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition`}
          onClick={()=>{navigate("/admin/users")}}>
          <UserGroupIcon className="w-5 h-5 mr-3" />
          Users
        </button>
        <button
          className={`w-full flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition`}
          onClick={()=>{navigate("/admin/psychologists")}}>
          <AcademicCapIcon className="w-5 h-5 mr-3" />
          Psychologists
        </button>
        <button
          className={`w-full flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition`}
                   onClick={()=>{navigate("/admin/transactions")}}
         >
          <WalletIcon className="w-5 h-5 mr-3" />
          Transactions
        </button>
        <button
          className={`w-full flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition`}
                   onClick={()=>{navigate("/admin/notifications")}}
         >
          <BellIcon className="w-5 h-5 mr-3" />
          Notifications
           {unreadNotificationCount>0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
        </button>
      </nav>
      <div className="p-6 border-t border-gray-200 dark:border-gray-800">
        <button
          className="w-full flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition"
          onClick={()=>handleLogout()}
         >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;