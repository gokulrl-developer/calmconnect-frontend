import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import PsychologistSidebar from "./PsychologistSidebar";
import PsychologistHeader from "./PsychologistHeader";
import { CallContext } from "../contexts/CallContext";

const PsychologistLayout: React.FC = () => {
  const [isSidebarOpen,setIsSidebarOpen]=useState(false);
  document.documentElement.classList.remove("dark");
  const { inCall } = useContext(CallContext)!;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      {!inCall && (
        <header className="fixed top-0 left-0 h-16 right-0 z-40">
          <PsychologistHeader setIsSidebarOpen={setIsSidebarOpen}/>
        </header>
      )}
        {/* Sidebar */}
        {!inCall && (
          <aside className={`fixed w-fit md:w-64 z-40 top-16 left-0 md:block
           ${isSidebarOpen===true?"block":"hidden"}`}>
            <PsychologistSidebar />
          </aside>
        )}
     
        {/* Main content */}
        <main className={`flex-1 min-w-0 ${!inCall && "mt-16 md:ml-64 p-6"}`}>
          <Outlet />
        </main>
    </div>
  );
};

export default PsychologistLayout;
