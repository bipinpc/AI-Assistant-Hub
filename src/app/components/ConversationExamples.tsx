import { Message } from '../config/domains';

/**
 * Example conversation flows for different domains
 * These can be used to simulate AI responses based on user inputs
 */

export const insuranceFlow = {
  // Policy verification flow
  policyNumber: (value: string): Message[] => [
    {
      id: Date.now().toString(),
      type: 'bot',
      content: `Great! I found your policy ${value}. Now, let's get details about the incident. What type of incident occurred?`,
      timestamp: new Date(),
      quickReplies: [
        { id: '1', label: 'Vehicle Accident', value: 'vehicle' },
        { id: '2', label: 'Property Damage', value: 'property' },
        { id: '3', label: 'Theft', value: 'theft' },
        { id: '4', label: 'Other', value: 'other' },
      ],
    },
  ],
  
  // Incident type response
  incidentType: (value: string): Message[] => [
    {
      id: Date.now().toString(),
      type: 'bot',
      content: `I understand this is a ${value.toLowerCase()} incident. When did this happen?`,
      timestamp: new Date(),
      inputField: {
        id: 'incidentDate',
        type: 'date',
        label: 'Incident Date',
        placeholder: 'Select date',
        required: true,
      },
    },
  ],
  
  // Date response
  incidentDate: (value: string): Message[] => [
    {
      id: Date.now().toString(),
      type: 'bot',
      content: `Thank you. Where did the incident occur?`,
      timestamp: new Date(),
      inputField: {
        id: 'incidentLocation',
        type: 'text',
        label: 'Location',
        placeholder: 'Enter address or location',
        required: true,
      },
    },
  ],
  
  // Location response
  incidentLocation: (value: string): Message[] => [
    {
      id: Date.now().toString(),
      type: 'bot',
      content: `Please describe what happened in your own words.`,
      timestamp: new Date(),
      inputField: {
        id: 'incidentDescription',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Describe the incident...',
        required: true,
      },
    },
  ],
  
  // Description response
  incidentDescription: (value: string): Message[] => [
    {
      id: Date.now().toString(),
      type: 'bot',
      content: `Thank you for the details. Were there any injuries?`,
      timestamp: new Date(),
      quickReplies: [
        { id: '1', label: 'Yes', value: 'yes' },
        { id: '2', label: 'No', value: 'no' },
      ],
    },
  ],
};

export const bankingFlow = {
  serviceType: (value: string): Message[] => {
    switch (value) {
      case 'open_account':
        return [
          {
            id: Date.now().toString(),
            type: 'bot',
            content: 'Great! What type of account would you like to open?',
            timestamp: new Date(),
            quickReplies: [
              { id: '1', label: 'Checking', value: 'checking' },
              { id: '2', label: 'Savings', value: 'savings' },
              { id: '3', label: 'Business', value: 'business' },
            ],
          },
        ];
      case 'loan':
        return [
          {
            id: Date.now().toString(),
            type: 'bot',
            content: 'What type of loan are you interested in?',
            timestamp: new Date(),
            quickReplies: [
              { id: '1', label: 'Personal Loan', value: 'personal' },
              { id: '2', label: 'Home Loan', value: 'home' },
              { id: '3', label: 'Auto Loan', value: 'auto' },
            ],
          },
        ];
      case 'fraud':
        return [
          {
            id: Date.now().toString(),
            type: 'bot',
            content: 'I\'m sorry to hear that. Please provide your account number so I can assist you.',
            timestamp: new Date(),
            inputField: {
              id: 'accountNumber',
              type: 'text',
              label: 'Account Number',
              placeholder: 'Enter your account number',
              required: true,
            },
          },
        ];
      default:
        return [];
    }
  },
};

export const bookingFlow = {
  bookingType: (value: string): Message[] => {
    switch (value) {
      case 'hotel':
        return [
          {
            id: Date.now().toString(),
            type: 'bot',
            content: 'Perfect! Where would you like to stay?',
            timestamp: new Date(),
            inputField: {
              id: 'destination',
              type: 'text',
              label: 'Destination',
              placeholder: 'City or hotel name',
              required: true,
            },
          },
        ];
      case 'flight':
        return [
          {
            id: Date.now().toString(),
            type: 'bot',
            content: 'Great! Where are you flying from?',
            timestamp: new Date(),
            inputField: {
              id: 'departure',
              type: 'text',
              label: 'Departure City',
              placeholder: 'Enter departure city',
              required: true,
            },
          },
        ];
      default:
        return [];
    }
  },
};

export const healthcareFlow = {
  serviceType: (value: string): Message[] => {
    switch (value) {
      case 'appointment':
        return [
          {
            id: Date.now().toString(),
            type: 'bot',
            content: 'I can help you schedule an appointment. What type of visit do you need?',
            timestamp: new Date(),
            quickReplies: [
              { id: '1', label: 'General Checkup', value: 'general' },
              { id: '2', label: 'Specialist', value: 'specialist' },
              { id: '3', label: 'Follow-up', value: 'followup' },
            ],
          },
        ];
      case 'symptoms':
        return [
          {
            id: Date.now().toString(),
            type: 'bot',
            content: 'Please describe your symptoms.',
            timestamp: new Date(),
            inputField: {
              id: 'symptoms',
              type: 'textarea',
              label: 'Symptoms',
              placeholder: 'Describe your symptoms...',
              required: true,
            },
          },
        ];
      default:
        return [];
    }
  },
};
