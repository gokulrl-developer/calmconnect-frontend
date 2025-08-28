import React from 'react';
import { Outlet } from 'react-router-dom';
import PsychologistSidebar from './PsychologistSidebar';
import PsychologistHeader from './PsychologistHeader';

const PsychologistLayout: React.FC = () => {
  document.documentElement.classList.remove("dark");
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PsychologistSidebar />
      <PsychologistHeader />
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PsychologistLayout;