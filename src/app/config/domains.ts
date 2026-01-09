// Domain Configuration Types
export interface QuickReply {
  id: string;
  label: string;
  value: string;
  isPrimaryAction?: boolean; // Flag for exclusive selection (e.g., Book Hotel, Book Flight)
  exclusiveGroup?: string; // Group name for exclusive selections (e.g., 'trip-type', 'cabin-class')
}

export interface InputField {
  id: string;
  type: 'text' | 'email' | 'date' | 'tel' | 'number' | 'file' | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
  inputField?: InputField;
  infoCard?: any;
  attachments?: FileAttachment[];
}

export interface ProgressStep {
  id: string;
  label: string;
  sublabel?: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface SidebarSection {
  id: string;
  title: string;
  icon?: string;
  badge?: {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'error';
  };
  fields: {
    label: string;
    value: string | number;
    editable?: boolean;
    bold?: boolean;
    highlight?: boolean;
  }[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export interface ColorTheme {
  primary: string; // Hex color
  secondary: string; // Hex color for accents
  text: string; // Text color class
  textDark: string; // Dark mode text color class
  bg: string; // Background color class
  bgDark: string; // Dark mode background color class
  bgHover: string; // Hover background color class
  bgHoverDark: string; // Dark mode hover background color class
  border: string; // Border color class
  borderDark: string; // Dark mode border color class
  accent: string; // Accent color class
  accentDark: string; // Dark mode accent color class
  gradient: string; // Gradient class
  gradientDark: string; // Dark mode gradient class
  iconBg: string; // Icon background class
  iconBgDark: string; // Dark mode icon background class
  button: string; // Button color class
  buttonHover: string; // Button hover color class
}

export interface DomainConfig {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  logo?: string;
  primaryColor: string;
  themeName: string; // NEW: Theme identifier (e.g., 'blue-theme', 'green-theme')
  theme: ColorTheme; // Computed theme object based on themeName
  steps: ProgressStep[];
  initialMessages: Message[];
  sidebarSections: SidebarSection[];
  conversationFlow: {
    [key: string]: {
      question: string;
      inputType?: InputField;
      quickReplies?: QuickReply[];
      nextStep?: string;
    };
  };
}

// Import centralized themes
import { themes, getTheme, ThemeName } from './themes';

// Import enhanced insurance configuration
import { insuranceConfig } from './insurance-config';

// Banking Domain Configuration
export const bankingConfig: DomainConfig = {
  id: 'banking',
  name: 'Banking',
  title: 'Virtual Banking Assistant',
  subtitle: 'Account Services',
  primaryColor: '#10b981',
  themeName: 'green-theme',
  theme: getTheme('green-theme'),
  steps: [
    { id: 'verify', label: 'Verify', sublabel: 'Identity', status: 'current' },
    { id: 'service', label: 'Service', sublabel: 'Selection', status: 'upcoming' },
    { id: 'details', label: 'Details', status: 'upcoming' },
    { id: 'review', label: 'Review', status: 'upcoming' },
    { id: 'confirm', label: 'Confirm', status: 'upcoming' },
  ],
  initialMessages: [
    {
      id: '1',
      type: 'bot',
      content: 'Welcome to your Virtual Banking Assistant! How can I help you today?',
      timestamp: new Date(),
      quickReplies: [
        { id: '1', label: 'Open Account', value: 'open_account' },
        { id: '2', label: 'Apply for Loan', value: 'loan' },
        { id: '3', label: 'Report Fraud', value: 'fraud' },
        { id: '4', label: 'Dispute Transaction', value: 'dispute' },
      ],
    },
  ],
  sidebarSections: [
    {
      id: 'account',
      title: 'Account Information',
      icon: 'user',
      fields: [
        { label: 'Account Holder', value: 'Not provided' },
        { label: 'Account Type', value: 'Not selected' },
      ],
      defaultOpen: true,
    },
  ],
  conversationFlow: {},
};

// Booking Domain Configuration
export const bookingConfig: DomainConfig = {
  id: 'booking',
  name: 'Booking',
  title: 'Virtual Booking Assistant',
  subtitle: 'Travel Reservations',
  primaryColor: '#8b5cf6',
  themeName: 'purple-theme',
  theme: getTheme('purple-theme'),
  steps: [
    { id: 'search', label: 'Search', status: 'current' },
    { id: 'select', label: 'Select', status: 'upcoming' },
    { id: 'details', label: 'Details', status: 'upcoming' },
    { id: 'payment', label: 'Payment', status: 'upcoming' },
    { id: 'confirm', label: 'Confirm', status: 'upcoming' },
  ],
  initialMessages: [
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m your Virtual Booking Assistant. Let me help you find the perfect stay or flight!',
      timestamp: new Date(),
      quickReplies: [
        { id: '1', label: '🏨 Book Hotel', value: 'hotel', isPrimaryAction: true },
        { id: '2', label: '✈️ Book Flight', value: 'flight', isPrimaryAction: true },
        { id: '3', label: '📦 Package Deal', value: 'package' },
      ],
    },
  ],
  sidebarSections: [
    {
      id: 'trip',
      title: 'Trip Details',
      icon: 'plane',
      fields: [
        { label: 'Booking Type', value: 'Not selected' },
        { label: 'From', value: 'Not provided' },
        { label: 'To', value: 'Not provided' },
        { label: 'Trip Type', value: 'Not selected' },
        { label: 'Departure Date', value: 'Not selected' },
        { label: 'Return Date', value: 'Not selected' },
        { label: 'Passengers', value: 'Not specified' },
        { label: 'Cabin Class', value: 'Not selected' },
      ],
      collapsible: true,
      defaultOpen: false,
    },
    {
      id: 'flight',
      title: 'Flight Information',
      icon: 'calendar',
      fields: [
        { label: 'Airline', value: 'Not selected' },
        { label: 'Flight Number', value: 'Pending' },
        { label: 'Departure', value: 'TBD' },
        { label: 'Arrival', value: 'TBD' },
      ],
      collapsible: true,
      defaultOpen: false,
    },
    {
      id: 'passenger',
      title: 'Passenger Information',
      icon: 'user',
      fields: [
        { label: 'Full Name', value: 'Not provided' },
        { label: 'ID Type', value: 'Not selected' },
        { label: 'TSA Status', value: 'Pending verification' },
        { label: 'Email', value: 'Not provided' },
      ],
      collapsible: true,
      defaultOpen: false,
    },
    {
      id: 'services',
      title: 'Additional Services',
      icon: 'briefcase',
      fields: [],
      collapsible: true,
      defaultOpen: false,
    },
    {
      id: 'payment',
      title: 'Fare Summary',
      icon: 'dollar-sign',
      fields: [
        { label: 'Base Fare', value: 'TBD' },
        { label: 'Taxes & Fees', value: 'TBD' },
        { label: 'Total', value: 'TBD' },
      ],
      collapsible: true,
      defaultOpen: false,
    },
    {
      id: 'confirmation',
      title: 'Booking Confirmation',
      icon: 'check-circle',
      fields: [
        { label: 'Booking Reference', value: 'Pending' },
        { label: 'Status', value: 'In Progress' },
      ],
      collapsible: true,
      defaultOpen: false,
    },
  ],
  conversationFlow: {},
};

// Healthcare Domain Configuration
export const healthcareConfig: DomainConfig = {
  id: 'healthcare',
  name: 'Healthcare',
  title: 'Virtual Healthcare Assistant',
  subtitle: 'Medical Services',
  primaryColor: '#ef4444',
  themeName: 'red-theme',
  theme: getTheme('red-theme'),
  steps: [
    { id: 'symptoms', label: 'Symptoms', status: 'current' },
    { id: 'history', label: 'History', status: 'upcoming' },
    { id: 'schedule', label: 'Schedule', status: 'upcoming' },
    { id: 'confirm', label: 'Confirm', status: 'upcoming' },
  ],
  initialMessages: [
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your Virtual Healthcare Assistant. I can help you with appointments, symptom checking, and more.',
      timestamp: new Date(),
      quickReplies: [
        { id: '1', label: 'Schedule Appointment', value: 'appointment' },
        { id: '2', label: 'Check Symptoms', value: 'symptoms' },
        { id: '3', label: 'Prescription Refill', value: 'prescription' },
      ],
    },
  ],
  sidebarSections: [
    {
      id: 'patient',
      title: 'Patient Information',
      icon: 'user',
      fields: [
        { label: 'Name', value: 'Not provided' },
        { label: 'Date of Birth', value: 'Not provided' },
      ],
      defaultOpen: true,
    },
  ],
  conversationFlow: {},
};

// Export all configurations
export const domainConfigs = {
  insurance: insuranceConfig,
  banking: bankingConfig,
  booking: bookingConfig,
  healthcare: healthcareConfig,
};

export type DomainId = keyof typeof domainConfigs;