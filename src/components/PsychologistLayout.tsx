import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import PsychologistSidebar from "./PsychologistSidebar";
import PsychologistHeader from "./PsychologistHeader";
import { CallContext } from "../contexts/CallContext";

const PsychologistLayout: React.FC = () => {
  document.documentElement.classList.remove("dark");
  const { inCall } = useContext(CallContext)!;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Header */}
      {!inCall && (
        <header className="fixed top-0 left-0 h-16 right-0 z-40">
          <PsychologistHeader />
        </header>
      )}
      {/* Main wrapper: sidebar + content */}
      <div className="flex mt-16">
        {/* Sidebar */}
        {!inCall && (
          <aside className="md:w-1/5 z-40">
            <PsychologistSidebar />
          </aside>
        )}

        {/* Main content pushed right */}
        <main className="p-6 flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PsychologistLayout;
