import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({}) => {
  document.documentElement.classList.remove("dark");
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <AdminSidebar/>
        <AdminHeader />
        <main className="ml-64 pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet/>
          </div>
        </main>
      </div>
    </>
  )
}

export default AdminLayout
