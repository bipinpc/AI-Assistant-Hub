import { ConversationalFlowConfig, FlowStep } from './conversational-flow';
import { ProgressStep, SidebarSection } from './domains';
import { getSidebarForBookingType } from './booking-sidebars';

// State tracker for booking flow
let tripType: 'One-way' | 'Round-trip' | null = null;
let departureDate: string | null = null;

// Flight Booking Domain - Complete U.S. Flight Reservation Flow
export const flightBookingFlow: ConversationalFlowConfig = {
  startStepId: 'welcome',
  steps: [
    // Welcome & Service Selection
    {
      id: 'welcome',
      botMessage: "Hi! I'm your Virtual Booking Assistant. Let me help you find the perfect stay or flight!",
      quickReplies: [
        { id: '1', label: '🏨 Book Hotel', value: 'hotel', isPrimaryAction: true },
        { id: '2', label: '✈️ Book Flight', value: 'flight', isPrimaryAction: true },
        { id: '3', label: '📦 Package Deal', value: 'package', isPrimaryAction: true },
      ],
      delay: 500,
      nextStepId: (value: string) => {
        if (value === 'flight') return 'departure_city';
        // For hotel/package, use generic destination flow
        return 'hotel_destination';
      },
      updateSidebar: (sections, value) => {
        // Dynamically replace entire sidebar based on booking type
        const bookingType = value as 'hotel' | 'flight' | 'package';
        return getSidebarForBookingType(bookingType);
      },
    },

    // === FLIGHT BOOKING FLOW ===

    // Step 1: Departure City
    {
      id: 'departure_city',
      botMessage: 'Where will you be departing from?',
      inputField: {
        id: 'departureCity',
        type: 'text',
        label: 'Departure City',
        placeholder: 'e.g., New York',
        required: true,
      },
      delay: 800,
      nextStepId: 'destination_city',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'trip') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'From' ? { ...field, value: `${value} (${getCityCode(value)})` } : field
              ),
            };
          }
          return section;
        });
      },
      updateProgress: (steps) => {
        return steps.map(step =>
          step.id === 'search' ? { ...step, status: 'current' as const } : step
        );
      },
    },

    // Step 2: Destination City
    {
      id: 'destination_city',
      botMessage: 'Where would you like to fly to?',
      inputField: {
        id: 'destinationCity',
        type: 'text',
        label: 'Destination City',
        placeholder: 'e.g., Los Angeles',
        required: true,
      },
      delay: 800,
      nextStepId: 'trip_type',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'trip') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'To' ? { ...field, value: `${value} (${getCityCode(value)})` } : field
              ),
            };
          }
          return section;
        });
      },
    },

    // Step 3: Trip Type
    {
      id: 'trip_type',
      botMessage: 'Is this a one-way or round-trip flight?',
      quickReplies: [
        { id: '1', label: 'One-way', value: 'One-way', exclusiveGroup: 'trip-type' },
        { id: '2', label: 'Round-trip', value: 'Round-trip', exclusiveGroup: 'trip-type' },
      ],
      delay: 800,
      nextStepId: 'departure_date',
      updateSidebar: (sections, value) => {
        tripType = value as 'One-way' | 'Round-trip';
        return sections.map(section => {
          if (section.id === 'trip') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Trip Type' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },

    // Step 4: Travel Dates - Departure
    {
      id: 'departure_date',
      botMessage: 'What date would you like to travel?',
      inputField: {
        id: 'departureDate',
        type: 'date',
        label: 'Departure Date',
        required: true,
      },
      delay: 800,
      nextStepId: (value: string) => {
        departureDate = value; // Store for return date validation
        
        // Conditional logic: skip return date if one-way
        if (tripType === 'One-way') {
          return 'passenger_count'; // Skip directly to passengers
        } else {
          return 'return_date'; // Ask for return date
        }
      },
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'trip') {
            // If one-way, remove return date field
            const fields = tripType === 'One-way'
              ? section.fields.filter(field => field.label !== 'Return Date')
              : section.fields;
            
            return {
              ...section,
              fields: fields.map(field =>
                field.label === 'Departure Date' ? { ...field, value: formatUSDate(value) } : field
              ),
            };
          }
          return section;
        });
      },
    },

    // Step 4b: Return Date (if Round-trip only)
    {
      id: 'return_date',
      botMessage: 'What date would you like to return?',
      inputField: {
        id: 'returnDate',
        type: 'date',
        label: 'Return Date',
        required: true,
      },
      delay: 800,
      nextStepId: 'passenger_count',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'trip') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Return Date' ? { ...field, value: formatUSDate(value) } : field
              ),
            };
          }
          return section;
        });
      },
    },

    // Step 5: Number of Travelers
    {
      id: 'passenger_count',
      botMessage: 'How many passengers will be traveling?',
      quickReplies: [
        { id: '1', label: '1 Adult', value: '1' },
        { id: '2', label: '2 Adults', value: '2' },
        { id: '3', label: '3 Adults', value: '3' },
        { id: '4', label: '4+ Travelers', value: '4+' },
      ],
      delay: 800,
      nextStepId: 'cabin_class',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'trip') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Passengers' ? { ...field, value: `${value} Adult(s)` } : field
              ),
            };
          }
          return section;
        });
      },
      updateProgress: (steps) => {
        return steps.map(step =>
          step.id === 'search' ? { ...step, status: 'completed' as const } :
          step.id === 'select' ? { ...step, status: 'current' as const } : step
        );
      },
    },

    // Step 6: Cabin Class
    {
      id: 'cabin_class',
      botMessage: 'Which cabin class would you prefer—Economy, Premium Economy, Business, or First Class?',
      quickReplies: [
        { id: '1', label: 'Economy', value: 'Economy' },
        { id: '2', label: 'Premium Economy', value: 'Premium Economy' },
        { id: '3', label: 'Business', value: 'Business' },
        { id: '4', label: 'First Class', value: 'First Class' },
      ],
      delay: 800,
      nextStepId: 'preferences',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'trip') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Cabin Class' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },

    // Step 7: Flight Preferences (Optional)
    {
      id: 'preferences',
      botMessage: 'Do you have any preferences, such as nonstop flights or a preferred airline?',
      inputField: {
        id: 'preferences',
        type: 'text',
        label: 'Preferences',
        placeholder: 'e.g., Nonstop only, Delta preferred',
        required: false,
      },
      delay: 800,
      nextStepId: 'flight_selection',
      updateSidebar: (sections, value) => {
        if (!value) return sections;
        return sections.map(section => {
          if (section.id === 'trip') {
            return {
              ...section,
              fields: [...section.fields, { label: 'Preferences', value }],
            };
          }
          return section;
        });
      },
    },

    // Step 8: Flight Selection
    {
      id: 'flight_selection',
      botMessage: "I've found flight options that match your preferences. Would you like to proceed with this selection?",
      quickReplies: [
        { id: '1', label: 'Yes, proceed', value: 'yes' },
        { id: '2', label: 'See other options', value: 'no' },
      ],
      delay: 1200,
      nextStepId: 'passenger_name',
      updateSidebar: (sections, value) => {
        if (value === 'yes') {
          return sections.map(section => {
            if (section.id === 'flight') {
              return {
                ...section,
                fields: [
                  { label: 'Airline', value: 'United Airlines' },
                  { label: 'Flight Number', value: 'UA 1234' },
                  { label: 'Departure', value: '10:30 AM ET' },
                  { label: 'Arrival', value: '1:45 PM PT' },
                ],
              };
            }
            return section;
          });
        }
        return sections;
      },
      updateProgress: (steps) => {
        return steps.map(step =>
          step.id === 'select' ? { ...step, status: 'completed' as const } :
          step.id === 'details' ? { ...step, status: 'current' as const } : step
        );
      },
    },

    // Step 9: Passenger Name
    {
      id: 'passenger_name',
      botMessage: 'Please provide the full name of the primary passenger as it appears on their government-issued ID.',
      inputField: {
        id: 'passengerName',
        type: 'text',
        label: 'Full Name',
        placeholder: 'e.g., John Michael Smith',
        required: true,
      },
      delay: 800,
      nextStepId: 'government_id',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'passenger') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Full Name' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },

    // Step 10: Government ID (TSA – USA)
    {
      id: 'government_id',
      botMessage: 'Will you be using a U.S. driver\'s license or a passport for this trip?',
      quickReplies: [
        { id: '1', label: 'Driver\'s License', value: 'Driver\'s License' },
        { id: '2', label: 'Passport', value: 'Passport' },
      ],
      delay: 800,
      nextStepId: 'contact_email',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'passenger') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'ID Type' ? { ...field, value } :
                field.label === 'TSA Status' ? { ...field, value: '✅ Secure Flight Approved' } : field
              ),
            };
          }
          return section;
        });
      },
    },

    // Step 11: Contact Email
    {
      id: 'contact_email',
      botMessage: 'What email address should I use to send your booking confirmation?',
      inputField: {
        id: 'contactEmail',
        type: 'email',
        label: 'Email Address',
        placeholder: 'e.g., john.smith@email.com',
        required: true,
      },
      delay: 800,
      nextStepId: 'seat_baggage',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'passenger') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Email' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },

    // Step 12: Seat & Baggage
    {
      id: 'seat_baggage',
      botMessage: 'Would you like to select a seat or add checked baggage?',
      quickReplies: [
        { id: '1', label: 'Select seat', value: 'seat' },
        { id: '2', label: 'Add baggage', value: 'baggage' },
        { id: '3', label: 'Both', value: 'both' },
        { id: '4', label: 'Skip for now', value: 'skip' },
      ],
      delay: 800,
      nextStepId: 'fare_summary',
      updateSidebar: (sections, value) => {
        if (value === 'skip') return sections;
        return sections.map(section => {
          if (section.id === 'services') {
            const updates: any[] = [];
            if (value === 'seat' || value === 'both') {
              updates.push({ label: 'Seat', value: '14A (Window)' });
            }
            if (value === 'baggage' || value === 'both') {
              updates.push({ label: 'Checked Bags', value: '1 bag ($35.00)' });
            }
            return {
              ...section,
              fields: [...section.fields, ...updates],
            };
          }
          return section;
        });
      },
      updateProgress: (steps) => {
        return steps.map(step =>
          step.id === 'details' ? { ...step, status: 'completed' as const } :
          step.id === 'payment' ? { ...step, status: 'current' as const } : step
        );
      },
    },

    // Step 13: Fare Summary
    {
      id: 'fare_summary',
      botMessage: 'The total fare is $350.00. Would you like to proceed to payment?',
      quickReplies: [
        { id: '1', label: 'Proceed to payment', value: 'yes' },
        { id: '2', label: 'Review details', value: 'review' },
      ],
      delay: 1000,
      nextStepId: 'booking_confirmation',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'payment') {
            return {
              ...section,
              badge: {
                label: 'Pending',
                variant: 'warning' as const,
              },
              fields: [
                { label: 'Base Fare', value: '$315.00' },
                { label: 'Taxes & Fees', value: '$35.00' },
                { label: 'Total', value: '$350.00', bold: true, highlight: true },
                { label: 'Payment Status', value: value === 'yes' ? 'Processing...' : 'Pending' },
              ],
            };
          }
          return section;
        });
      },
    },

    // Step 14: Booking Confirmation
    {
      id: 'booking_confirmation',
      botMessage: '✅ Your flight has been successfully booked! A confirmation email has been sent with your booking reference and e-ticket.',
      delay: 1500,
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'payment') {
            return {
              ...section,
              badge: {
                label: 'Confirmed',
                variant: 'success' as const,
              },
              fields: section.fields.map(field =>
                field.label === 'Payment Status' ? { ...field, value: '✅ Confirmed' } : field
              ),
            };
          }
          if (section.id === 'confirmation') {
            return {
              ...section,
              fields: [
                { label: 'Booking Reference', value: 'BK7X9M2P', bold: true },
                { label: 'Status', value: '✅ Confirmed', highlight: true },
                { label: 'E-Ticket', value: '#016-2358743219' },
                { label: 'Confirmation Sent', value: 'Yes' },
              ],
            };
          }
          return section;
        });
      },
      updateProgress: (steps) => {
        return steps.map(step => ({ ...step, status: 'completed' as const }));
      },
    },

    // === HOTEL BOOKING FLOW (Fallback) ===
    {
      id: 'hotel_destination',
      botMessage: 'Great choice! Where would you like to stay?',
      inputField: {
        id: 'destination',
        type: 'text',
        label: 'Destination',
        placeholder: 'e.g., Miami, FL',
        required: true,
      },
      delay: 1000,
      nextStepId: 'hotel_checkin_date',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'hotel-details') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Destination / City' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'hotel_checkin_date',
      botMessage: 'When would you like to check in?',
      inputField: {
        id: 'checkinDate',
        type: 'date',
        label: 'Check-in Date',
        required: true,
      },
      delay: 1000,
      nextStepId: 'hotel_checkout_date',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'hotel-details') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Check-in Date' ? { ...field, value: formatUSDate(value) } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'hotel_checkout_date',
      botMessage: 'And when would you like to check out?',
      inputField: {
        id: 'checkoutDate',
        type: 'date',
        label: 'Check-out Date',
        required: true,
      },
      delay: 1000,
      nextStepId: 'hotel_complete',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'hotel-details') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Check-out Date' ? { ...field, value: formatUSDate(value) } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'hotel_complete',
      botMessage: '🎉 Perfect! I found several great hotel options for you. Your booking details have been saved and you will receive recommendations shortly!',
      delay: 1500,
      updateProgress: (steps) => {
        return steps.map(step => ({ ...step, status: 'completed' as const }));
      },
    },
  ],
};

// Helper functions
function getCityCode(city: string): string {
  const codes: { [key: string]: string } = {
    'new york': 'JFK',
    'los angeles': 'LAX',
    'chicago': 'ORD',
    'san francisco': 'SFO',
    'miami': 'MIA',
    'boston': 'BOS',
    'seattle': 'SEA',
    'atlanta': 'ATL',
    'dallas': 'DFW',
    'denver': 'DEN',
  };
  return codes[city.toLowerCase()] || 'XXX';
}

function formatUSDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}