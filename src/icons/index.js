// Lucide Icons Configuration for RehamerPaint ERP

// Import all needed icons
export {
  // Navigation & Layout
  Home,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  UserCheck,
  Truck,
  FileText,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  
  // Actions
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Save,
  Check,
  XCircle,
  AlertCircle,
  
  // Status
  CheckCircle,
  Clock,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  
  // Admin & Users
  Shield,
  Key,
  Lock,
  Unlock,
  User,
  UserPlus,
  UserMinus,
  
  // Sales & Orders
  Receipt,
  CreditCard,
  Building,
  Mail,
  Phone,
  Calendar,
  
  // Finance
  Banknote,
  CreditCard as Card,
  Wallet,
  PiggyBank,
  TrendingUp as TrendUp,
  TrendingDown as TrendDown,
  
  // HR
  Briefcase,
  GraduationCap,
  Award,
  Target,
  Activity,
  CalendarDays,
  
  // Manufacturing
  Wrench,
  Cog,
  Zap,
  Package as Box,
  BarChart3,
  
  // Logistics
  MapPin,
  Navigation,
  Fuel,
  Wrench as Tool,
  
  // Reports & Analytics
  BarChart,
  PieChart,
  LineChart,
  FileSpreadsheet,
  Printer,
  
  // System
  Database,
  Server,
  HardDrive,
  Wifi,
  WifiOff,
  
  // File Operations
  File,
  Folder,
  FolderOpen,
  FilePlus,
  FileEdit,
  FileX,
  
  // Communication
  MessageSquare,
  Send,
  Bell,
  BellOff,
  
  // Other
  MoreVertical,
  MoreHorizontal,
  LogOut,
  LogIn,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

// Icon mapping for easy usage
export const ICONS = {
  // Navigation
  dashboard: Home,
  users: Users,
  inventory: Package,
  sales: ShoppingCart,
  finance: DollarSign,
  hr: UserCheck,
  logistics: Truck,
  reports: FileText,
  admin: Settings,
  
  // Actions
  add: Plus,
  edit: Edit,
  delete: Trash2,
  view: Eye,
  search: Search,
  filter: Filter,
  download: Download,
  upload: Upload,
  refresh: RefreshCw,
  save: Save,
  close: X,
  cancel: XCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  
  // Status
  active: CheckCircle,
  inactive: XCircle,
  pending: Clock,
  completed: CheckCircle,
  failed: XCircle,
  paid: CheckCircle,
  unpaid: Clock,
  
  // Admin
  security: Shield,
  auth: Key,
  lock: Lock,
  unlock: Unlock,
  user: User,
  addUser: UserPlus,
  removeUser: UserMinus,
  
  // Sales
  order: ShoppingCart,
  customer: Building,
  invoice: Receipt,
  payment: CreditCard,
  email: Mail,
  phone: Phone,
  date: Calendar,
  
  // Finance
  transaction: DollarSign,
  account: Wallet,
  bank: Building,
  savings: PiggyBank,
  revenue: TrendUp,
  expense: TrendDown,
  
  // HR
  employee: Briefcase,
  department: Building,
  attendance: CalendarDays,
  payroll: DollarSign,
  performance: Award,
  training: GraduationCap,
  
  // Manufacturing
  production: Wrench,
  quality: CheckCircle,
  bom: FileText,
  machine: Cog,
  efficiency: Zap,
  
  // Logistics
  delivery: Truck,
  vehicle: Truck,
  driver: User,
  location: MapPin,
  route: Navigation,
  fuel: Fuel,
  
  // Reports
  analytics: BarChart,
  chart: PieChart,
  graph: LineChart,
  spreadsheet: FileSpreadsheet,
  print: Printer,
  
  // System
  database: Database,
  server: Server,
  storage: HardDrive,
  online: Wifi,
  offline: WifiOff,
  
  // Files
  file: File,
  folder: Folder,
  newFile: FilePlus,
  editFile: FileEdit,
  deleteFile: FileX,
  
  // Communication
  message: MessageSquare,
  send: Send,
  notification: Bell,
  mute: BellOff,
  
  // UI
  menu: Menu,
  more: MoreVertical,
  moreHorizontal: MoreHorizontal,
  logout: LogOut,
  login: LogIn,
  help: HelpCircle,
  external: ExternalLink,
  
  // Navigation
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  
  // Status indicators
  onlineStatus: CheckCircle,
  offlineStatus: XCircle,
  busyStatus: Clock,
  awayStatus: AlertCircle
};

// Default icon sizes
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40
};

// Default icon colors (using Tailwind classes)
export const ICON_COLORS = {
  primary: 'text-primaryClr',
  secondary: 'text-place',
  accent: 'text-accentClr',
  danger: 'text-dangerClr',
  warning: 'text-logoGold',
  success: 'text-accentClr',
  info: 'text-primaryClrLight',
  muted: 'text-place'
};

// Helper function to get icon with default props
export const getIcon = (iconName, size = 'md', color = 'primary', className = '') => {
  const IconComponent = ICONS[iconName] || HelpCircle;
  const iconSize = ICON_SIZES[size];
  const iconColor = ICON_COLORS[color];
  
  return (
    <IconComponent 
      size={iconSize} 
      className={`${iconColor} ${className}`}
    />
  );
};

export default ICONS;
