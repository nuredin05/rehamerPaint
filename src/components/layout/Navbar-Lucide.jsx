import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-bgLight shadow-sm border-b border-secondaryClr">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-place hover:text-primaryClr mr-4"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-semibold text-primaryClr">
              Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-place hover:text-primaryClr relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-dangerClr rounded-full"></span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryClr p-2 hover:bg-secondaryClr transition-colors"
              >
                <User size={20} className="text-primaryClr" />
                <ChevronDown size={16} className="text-place" />
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-bgLight border border-secondaryClr z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-primaryClr border-b border-secondaryClr">
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-place text-xs">{user?.email}</p>
                      <p className="text-xs text-place opacity-60">Role: {user?.role}</p>
                    </div>
                    <button className="flex items-center w-full text-left px-4 py-2 text-sm text-primaryClr hover:bg-secondaryClr">
                      <User size={16} className="mr-2" />
                      Profile
                    </button>
                    <button className="flex items-center w-full text-left px-4 py-2 text-sm text-primaryClr hover:bg-secondaryClr">
                      <Settings size={16} className="mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-dangerClr hover:bg-secondaryClr"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
