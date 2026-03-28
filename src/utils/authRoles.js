/** Matches backend User.role ENUM */
export const ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
};

const ERP_PATHS = {
  dashboard: '/dashboard',
  inventory: '/inventory',
  sales: '/sales',
  procurement: '/procurement',
  manufacturing: '/manufacturing',
  finance: '/finance',
  hr: '/hr',
  logistics: '/logistics',
  reports: '/reports',
  admin: '/admin',
};

/** First screen after successful login */
export function getPostLoginPath(role) {
  switch (role) {
    case ROLE.ADMIN:
      return ERP_PATHS.admin;
    case ROLE.MANAGER:
      return ERP_PATHS.dashboard;
    case ROLE.OPERATOR:
      return ERP_PATHS.dashboard;
    case ROLE.VIEWER:
      return ERP_PATHS.dashboard;
    default:
      return ERP_PATHS.dashboard;
  }
}

/** Paths each role may open (pathname equals or starts with entry) */
const ALLOWED_PREFIXES = {
  [ROLE.ADMIN]: null,
  [ROLE.MANAGER]: [
    '/dashboard',
    '/inventory',
    '/sales',
    '/procurement',
    '/manufacturing',
    '/finance',
    '/hr',
    '/logistics',
    '/reports',
  ],
  [ROLE.OPERATOR]: [
    '/dashboard',
    '/inventory',
    '/sales',
    '/procurement',
    '/manufacturing',
    '/logistics',
  ],
  [ROLE.VIEWER]: ['/dashboard', '/reports'],
};

export function canAccessPath(role, pathname) {
  if (!role) return false;
  if (ALLOWED_PREFIXES[role] === null) return true;
  const prefixes = ALLOWED_PREFIXES[role];
  if (!prefixes?.length) return false;
  const path = pathname.split('?')[0] || '/';
  return prefixes.some(
    (p) => path === p || (p !== '/' && path.startsWith(`${p}/`))
  );
}

/** Which sidebar hrefs to show for a role */
export function getNavHrefRoles() {
  return [
    { href: ERP_PATHS.dashboard, roles: Object.values(ROLE) },
    { href: ERP_PATHS.inventory, roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.OPERATOR] },
    { href: ERP_PATHS.sales, roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.OPERATOR] },
    { href: ERP_PATHS.procurement, roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.OPERATOR] },
    { href: ERP_PATHS.manufacturing, roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.OPERATOR] },
    { href: ERP_PATHS.finance, roles: [ROLE.ADMIN, ROLE.MANAGER] },
    { href: ERP_PATHS.hr, roles: [ROLE.ADMIN, ROLE.MANAGER] },
    { href: ERP_PATHS.logistics, roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.OPERATOR] },
    { href: ERP_PATHS.reports, roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.VIEWER] },
    { href: ERP_PATHS.admin, roles: [ROLE.ADMIN] },
  ];
}

export function isNavItemVisible(role, href) {
  if (!role) return false;
  const item = getNavHrefRoles().find((n) => n.href === href);
  if (!item) return true;
  return item.roles.includes(role);
}
