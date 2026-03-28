import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isNavItemVisible } from '../../utils/authRoles';
import {
  Home,
  Package,
  DollarSign,
  ShoppingCart,
  Wrench,
  Banknote,
  Users,
  Truck,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-3 text-primaryClrText hover:bg-primaryClrLight transition-colors duration-200 ${
          isActive ? 'bg-primaryClr' : ''
        }`
      }
    >
      <div className="flex items-center">
        <div className="mr-3">
          <Icon size={20} />
        </div>
        {label}
      </div>
    </NavLink>
  );
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role;

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Package, label: 'Inventory', href: '/inventory' },
    { icon: DollarSign, label: 'Sales', href: '/sales' },
    { icon: ShoppingCart, label: 'Procurement', href: '/procurement' },
    { icon: Wrench, label: 'Manufacturing', href: '/manufacturing' },
    { icon: Banknote, label: 'Finance', href: '/finance' },
    { icon: Users, label: 'HR', href: '/hr' },
    { icon: Truck, label: 'Logistics', href: '/logistics' },
    { icon: BarChart3, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Admin', href: '/admin' },
  ];

  const visibleItems = menuItems.filter((item) => isNavItemVisible(role, item.href));

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="bg-primaryClr text-primaryClrText w-64 min-h-screen relative">
      <div className="p-6">
        <div className="flex items-center">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-logoGold mr-3">
            <span className="text-primaryClr font-bold text-xl">RP</span>
          </div>
          <div>
            <h1 className="text-primaryClrText font-bold text-lg">RehamerPaint</h1>
            <p className="text-primaryClrText text-xs opacity-75"> System</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-4">
          <p className="text-xs text-primaryClrText opacity-50 uppercase tracking-wider mb-2">Main Menu</p>
        </div>
        {visibleItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            to={item.href}
          />
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-primaryClrLight">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center w-full text-left text-primaryClrText hover:text-logoGold transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
