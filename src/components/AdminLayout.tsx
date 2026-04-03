import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useState } from 'react';

const AdminLayout = () => {
  const [isSidebarOpen,setIsSidebarOpen]=useState(false);

  document.documentElement.classList.remove("dark");
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
         {/* Header */}
      <header className="fixed top-0 left-0 h-16 right-0 z-40">
        <AdminHeader setIsSidebarOpen={setIsSidebarOpen}/>
      </header>
      {/* Sidebar */}
        <aside className={`fixed w-fit md:w-64 z-40 top-16 left-0 md:block
           ${isSidebarOpen===true?"block":"hidden"}`}>
          <AdminSidebar/>
        </aside>
        {/* Main content */}
        <main className="p-6 flex-1 min-w-0 mt-16 md:ml-64">
            <Outlet />
        </main>
      </div>
    </>
  )
}

export default AdminLayout
