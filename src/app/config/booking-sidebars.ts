import { SidebarSection } from './domains';

// Hotel Booking Sidebar - Only hotel-related sections
export const hotelSidebarSections: SidebarSection[] = [
  {
    id: 'hotel-details',
    title: 'Hotel Booking Details',
    icon: 'home',
    fields: [
      { label: 'Booking Type', value: 'Hotel' },
      { label: 'Destination / City', value: 'Not provided' },
      { label: 'Check-in Date', value: 'Not selected' },
      { label: 'Check-out Date', value: 'Not selected' },
      { label: 'Guests', value: 'Not specified' },
      { label: 'Rooms', value: 'Not specified' },
    ],
    defaultOpen: true,
  },
  {
    id: 'hotel-info',
    title: 'Hotel Information',
    icon: 'building',
    fields: [
      { label: 'Hotel Name', value: 'Not selected' },
      { label: 'Room Type', value: 'Not selected' },
      { label: 'Star Rating', value: 'TBD' },
      { label: 'Amenities', value: 'TBD' },
    ],
    collapsible: true,
    defaultOpen: false,
  },
  {
    id: 'hotel-guest',
    title: 'Guest Information',
    icon: 'user',
    fields: [
      { label: 'Guest Name', value: 'Not provided' },
      { label: 'Email', value: 'Not provided' },
      { label: 'Phone', value: 'Not provided' },
      { label: 'Special Requests', value: 'None' },
    ],
    collapsible: true,
    defaultOpen: false,
  },
  {
    id: 'hotel-payment',
    title: 'Pricing Summary',
    icon: 'dollar-sign',
    fields: [
      { label: 'Room Rate (per night)', value: 'TBD' },
      { label: 'Number of Nights', value: 'TBD' },
      { label: 'Taxes & Fees', value: 'TBD' },
      { label: 'Total', value: 'TBD', bold: true },
    ],
    collapsible: true,
    defaultOpen: false,
  },
  {
    id: 'hotel-confirmation',
    title: 'Booking Confirmation',
    icon: 'check-circle',
    fields: [
      { label: 'Confirmation Number', value: 'Pending' },
      { label: 'Status', value: 'In Progress' },
    ],
    collapsible: true,
    defaultOpen: false,
  },
];

// Flight Booking Sidebar - Only flight-related sections
export const flightSidebarSections: SidebarSection[] = [
  {
    id: 'trip',
    title: 'Flight Details',
    icon: 'plane',
    fields: [
      { label: 'Booking Type', value: 'Flight' },
      { label: 'From', value: 'Not provided' },
      { label: 'To', value: 'Not provided' },
      { label: 'Trip Type', value: 'Not selected' },
      { label: 'Departure Date', value: 'Not selected' },
      { label: 'Return Date', value: 'Not selected' },
      { label: 'Passengers', value: 'Not specified' },
      { label: 'Cabin Class', value: 'Not selected' },
    ],
    defaultOpen: true,
  },
  {
    id: 'flight',
    title: 'Flight Information',
    icon: 'calendar',
    fields: [
      { label: 'Airline', value: 'Not selected' },
      { label: 'Flight Number', value: 'Pending' },
      { label: 'Departure Time', value: 'TBD' },
      { label: 'Arrival Time', value: 'TBD' },
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
      { label: 'Total', value: 'TBD', bold: true },
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
];

// Package Deal Sidebar - Combined flight + hotel sections
export const packageSidebarSections: SidebarSection[] = [
  {
    id: 'package-overview',
    title: 'Package Deal Overview',
    icon: 'package',
    fields: [
      { label: 'Booking Type', value: 'Package Deal' },
      { label: 'Destination', value: 'Not provided' },
      { label: 'Travel Dates', value: 'Not selected' },
      { label: 'Travelers', value: 'Not specified' },
    ],
    defaultOpen: true,
  },
  {
    id: 'package-flight',
    title: 'Flight Details',
    icon: 'plane',
    fields: [
      { label: 'From', value: 'Not provided' },
      { label: 'To', value: 'Not provided' },
      { label: 'Departure Date', value: 'Not selected' },
      { label: 'Return Date', value: 'Not selected' },
      { label: 'Passengers', value: 'Not specified' },
      { label: 'Cabin Class', value: 'Not selected' },
    ],
    collapsible: true,
    defaultOpen: true,
  },
  {
    id: 'package-hotel',
    title: 'Hotel Details',
    icon: 'home',
    fields: [
      { label: 'Hotel Location', value: 'Not selected' },
      { label: 'Check-in', value: 'Not selected' },
      { label: 'Check-out', value: 'Not selected' },
      { label: 'Rooms', value: 'Not specified' },
      { label: 'Room Type', value: 'Not selected' },
    ],
    collapsible: true,
    defaultOpen: true,
  },
  {
    id: 'package-traveler',
    title: 'Traveler Information',
    icon: 'user',
    fields: [
      { label: 'Lead Traveler', value: 'Not provided' },
      { label: 'Email', value: 'Not provided' },
      { label: 'Phone', value: 'Not provided' },
    ],
    collapsible: true,
    defaultOpen: false,
  },
  {
    id: 'package-payment',
    title: 'Package Pricing',
    icon: 'dollar-sign',
    fields: [
      { label: 'Flight Cost', value: 'TBD' },
      { label: 'Hotel Cost', value: 'TBD' },
      { label: 'Package Discount', value: 'TBD' },
      { label: 'Total', value: 'TBD', bold: true },
    ],
    collapsible: true,
    defaultOpen: false,
  },
  {
    id: 'package-confirmation',
    title: 'Booking Confirmation',
    icon: 'check-circle',
    fields: [
      { label: 'Package Reference', value: 'Pending' },
      { label: 'Status', value: 'In Progress' },
    ],
    collapsible: true,
    defaultOpen: false,
  },
];

// Helper function to get sidebar sections based on booking type
export function getSidebarForBookingType(bookingType: 'hotel' | 'flight' | 'package'): SidebarSection[] {
  switch (bookingType) {
    case 'hotel':
      return JSON.parse(JSON.stringify(hotelSidebarSections)); // Deep clone
    case 'flight':
      return JSON.parse(JSON.stringify(flightSidebarSections)); // Deep clone
    case 'package':
      return JSON.parse(JSON.stringify(packageSidebarSections)); // Deep clone
    default:
      return JSON.parse(JSON.stringify(flightSidebarSections)); // Default to flight
  }
}
