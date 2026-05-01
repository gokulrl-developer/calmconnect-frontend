import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import { useContext, useState } from "react";
import { CallContext } from "../contexts/CallContext";

const UserLayout = () => {
    const [isSidebarOpen,setIsSidebarOpen]=useState(false);
  const { inCall } = useContext(CallContext)!;
  document.documentElement.classList.remove("dark");
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        {!inCall && (
          <header className="fixed top-0 left-0 h-16 right-0 z-40">
            <UserHeader setIsSidebarOpen={setIsSidebarOpen}/>
          </header>
        )}
          {/* Sidebar */}
          {!inCall && (
            <aside className={`fixed w-fit md:w-64 z-40 top-16 left-0 md:block
           ${isSidebarOpen===true?"block":"hidden"}`}>
              <UserSidebar />
            </aside>
          )}
          {/* Main content*/}
          <main className={`flex-1 min-w-0 ${!inCall && "mt-16 md:ml-64 p-6"}`}>
            <Outlet />
          </main>
        </div>
    </>
  );
};

export default UserLayout;
