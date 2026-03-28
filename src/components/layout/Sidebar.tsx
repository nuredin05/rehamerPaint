import React from 'react';

interface SidebarItemProps {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href, active = false }) => {
  return (
    <a
      href={href}
      className={`block px-4 py-3 text-primaryClrText hover:bg-primaryClrLight transition-colors duration-200 ${active ? 'bg-primaryClr' : ''}`}
    >
      <div className="flex items-center">
        <div className="mr-3 text-lg">
          {icon}
        </div>
        {label}
      </div>
    </a>
  );
};

export const Sidebar: React.FC = () => {
  const currentPath = window.location.pathname;

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
    { icon: '📦', label: 'Inventory', href: '/inventory' },
    { icon: '💰', label: 'Sales', href: '/sales' },
    { icon: '🛒', label: 'Procurement', href: '/procurement' },
    { icon: '🔧', label: 'Manufacturing', href: '/manufacturing' },
    { icon: '💵', label: 'Finance', href: '/finance' },
    { icon: '👥', label: 'HR', href: '/hr' },
    { icon: '🚚', label: 'Logistics', href: '/logistics' },
    { icon: '📊', label: 'Reports', href: '/reports' },
    { icon: '⚙️', label: 'Admin', href: '/admin' },
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
          <h3 className="text-xs font-semibold text-primaryClrText opacity-60 uppercase tracking-wider mb-3">
            Main Menu
          </h3>
        </div>
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={currentPath === item.href}
          />
        ))}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-primaryClrDark rounded-lg p-3">
          <div className="flex items-center text-primaryClrText">
            <div className="h-8 w-8 rounded-full bg-secondaryClr mr-3 flex items-center justify-center">
              <span className="text-primaryClr font-bold">A</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs opacity-60">System Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
