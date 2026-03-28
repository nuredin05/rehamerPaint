import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-bgLight shadow-sm border-b border-secondaryClr">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-primaryClr">
              Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-place hover:text-primaryClr relative">
              <span className="text-xl">🔔</span>
              <span className="absolute top-1 right-1 h-2 w-2 bg-dangerClr rounded-full"></span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryClr">
                <span className="text-2xl">👤</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-bgLight border border-secondaryClr hidden">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-primaryClr border-b border-secondaryClr">
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-place text-xs">{user?.email}</p>
                    <p className="text-xs text-place opacity-60">Role: {user?.role}</p>
                  </div>
                  <button className="block w-full text-left px-4 py-2 text-sm text-primaryClr hover:bg-secondaryClr">
                    Profile
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-primaryClr hover:bg-secondaryClr">
                    Settings
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-dangerClr hover:bg-secondaryClr"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
