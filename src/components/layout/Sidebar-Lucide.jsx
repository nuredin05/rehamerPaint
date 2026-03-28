import React from 'react';
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

const SidebarItem = ({ icon: Icon, label, href, active = false }) => {
  return (
    <a
      href={href}
      className={`block px-4 py-3 text-primaryClrText hover:bg-primaryClrLight transition-colors duration-200 ${active ? 'bg-primaryClr' : ''}`}
    >
      <div className="flex items-center">
        <div className="mr-3">
          <Icon size={20} />
        </div>
        {label}
      </div>
    </a>
  );
};

export const Sidebar = () => {
  const currentPath = window.location.pathname;

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

  return (
    <div className="bg-primaryClr text-primaryClrText w-64 min-h-screen">
      <div className="p-6">
        <div className="flex items-center">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-logoGold mr-3">
            <span className="text-primaryClr font-bold text-xl">RP</span>
          </div>
          <div>
            <h1 className="text-primaryClrText font-bold text-lg">RehamerPaint</h1>
            <p className="text-primaryClrText text-xs opacity-75">ERP System</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-4">
          <p className="text-xs text-primaryClrText opacity-50 uppercase tracking-wider mb-2">Main Menu</p>
        </div>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={currentPath === item.href}
          />
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-primaryClrLight">
        <a
          href="/login"
          className="flex items-center text-primaryClrText hover:text-logoGold transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
