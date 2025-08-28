import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import UserHeader from './UserHeader';

const UserLayout = ({}) => {
  document.documentElement.classList.remove("dark");
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <UserSidebar />
        <UserHeader />
        <main className="ml-64 pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  )
}

export default UserLayout
