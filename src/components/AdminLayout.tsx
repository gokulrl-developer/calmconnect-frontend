import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  document.documentElement.classList.remove("dark");
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
         {/* Header */}
      <header className="fixed top-0 left-0 h-16 right-0 z-40">
        <AdminHeader />
      </header>
      {/* Main wrapper: sidebar + content */}
      <div className="flex mt-16"> 
        {/* Sidebar */}
        <aside className="md:w-1/5 z-40">
          <AdminSidebar />
        </aside>

        {/* Main content pushed right */}
        <main className="p-6 flex-1 min-w-0">
            <Outlet />
        </main>
      </div>
      </div>
    </>
  )
}

export default AdminLayout
