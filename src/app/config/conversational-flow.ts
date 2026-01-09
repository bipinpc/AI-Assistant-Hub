import { Message, QuickReply, InputField, ProgressStep, SidebarSection } from './domains';
import { insuranceEnhancedFlow } from './insurance-flow';
import { flightBookingFlow } from './booking-flow';

// Conversational Flow State Management
export interface FlowStep {
  id: string;
  botMessage: string;
  quickReplies?: QuickReply[];
  inputField?: InputField;
  delay?: number; // Delay before showing this step (ms)
  onComplete?: (value: string) => void;
  nextStepId?: string | ((value: string) => string);
  updateProgress?: (steps: ProgressStep[]) => ProgressStep[];
  updateSidebar?: (sections: SidebarSection[], value: string) => SidebarSection[];
}

export interface ConversationalFlowConfig {
  steps: FlowStep[];
  startStepId: string;
}

// Insurance Domain - Complete Conversational Flow
export const insuranceConversationalFlow: ConversationalFlowConfig = {
  startStepId: 'welcome',
  steps: [
    {
      id: 'welcome',
      botMessage: "Hello! I'm your Virtual Claims Assistant. I'm here to help you file your insurance claim quickly and easily. Let's get started!",
      delay: 500,
      nextStepId: 'policy_number',
    },
    {
      id: 'policy_number',
      botMessage: 'First, I need to verify your policy. Could you please provide your policy number?',
      inputField: {
        id: 'policyNumber',
        type: 'text',
        label: 'Policy Number',
        placeholder: 'e.g., POL-887654321',
        required: true,
      },
      delay: 800,
      nextStepId: 'policy_verified',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'claim') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Policy Number' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'policy_verified',
      botMessage: '✅ Great! I found your policy. Your coverage is active and includes comprehensive collision coverage.',
      delay: 1200,
      nextStepId: 'policyholder_name',
      updateProgress: (steps) => {
        return steps.map(step =>
          step.id === 'policy' ? { ...step, status: 'completed' as const } :
          step.id === 'incident' ? { ...step, status: 'current' as const } : step
        );
      },
    },
    {
      id: 'policyholder_name',
      botMessage: 'For verification purposes, please confirm your full name as it appears on the policy.',
      inputField: {
        id: 'policyholderName',
        type: 'text',
        label: 'Full Name',
        placeholder: 'e.g., John Doe',
        required: true,
      },
      delay: 1000,
      nextStepId: 'name_verified',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'claim') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Policyholder' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'name_verified',
      botMessage: "Perfect! Your identity has been verified. Now let's gather details about the incident.",
      delay: 1000,
      nextStepId: 'incident_type',
    },
    {
      id: 'incident_type',
      botMessage: 'What type of incident are you filing a claim for?',
      quickReplies: [
        { id: '1', label: '🚗 Vehicle Accident', value: 'Vehicle Accident' },
        { id: '2', label: '🏠 Property Damage', value: 'Property Damage' },
        { id: '3', label: '🔥 Fire Damage', value: 'Fire Damage' },
        { id: '4', label: '💧 Water Damage', value: 'Water Damage' },
      ],
      delay: 1000,
      nextStepId: 'incident_date',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'incident') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Type' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'incident_date',
      botMessage: 'When did this incident occur?',
      inputField: {
        id: 'incidentDate',
        type: 'date',
        label: 'Incident Date',
        required: true,
      },
      delay: 1000,
      nextStepId: 'incident_location',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'incident') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Date' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'incident_location',
      botMessage: 'Where did the incident take place? Please provide the full address or location.',
      inputField: {
        id: 'incidentLocation',
        type: 'text',
        label: 'Location',
        placeholder: 'e.g., 123 Maple Ave, Springfield, IL',
        required: true,
      },
      delay: 1000,
      nextStepId: 'incident_description',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'incident') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Location' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'incident_description',
      botMessage: 'Please describe what happened in your own words. Include as many details as possible.',
      inputField: {
        id: 'incidentDescription',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Describe the incident...',
        required: true,
      },
      delay: 1000,
      nextStepId: 'injuries_question',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'incident') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Description' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'injuries_question',
      botMessage: 'Were there any injuries reported as a result of this incident?',
      quickReplies: [
        { id: '1', label: '✅ Yes', value: 'Yes' },
        { id: '2', label: '❌ No', value: 'No' },
      ],
      delay: 1000,
      nextStepId: 'triage_info',
      updateProgress: (steps) => {
        return steps.map(step =>
          step.id === 'incident' ? { ...step, status: 'completed' as const } :
          step.id === 'triage' ? { ...step, status: 'current' as const } : step
        );
      },
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'incident') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Injuries' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'triage_info',
      botMessage: "Thank you for providing those details. I'm analyzing the information to assess the damage and estimate repair costs...",
      delay: 1500,
      nextStepId: 'damage_assessment',
    },
    {
      id: 'damage_assessment',
      botMessage: '📊 Based on the information provided, I estimate this is a MODERATE damage claim. The vehicle appears to be drivable.',
      delay: 1200,
      nextStepId: 'vehicle_info',
      updateSidebar: (sections) => {
        return sections.map(section => {
          if (section.id === 'damage') {
            return {
              ...section,
              badge: { label: 'MODERATE', variant: 'warning' as const },
            };
          }
          return section;
        });
      },
    },
    {
      id: 'vehicle_info',
      botMessage: 'To calculate accurate repair costs, what is the make, model, and year of your vehicle?',
      inputField: {
        id: 'vehicleInfo',
        type: 'text',
        label: 'Vehicle Information',
        placeholder: 'e.g., 2018 Honda Civic',
        required: true,
      },
      delay: 1000,
      nextStepId: 'cost_estimate',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'damage') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Vehicle' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'cost_estimate',
      botMessage: '💰 Calculating repair costs based on your vehicle information and damage assessment...',
      delay: 2000,
      nextStepId: 'cost_breakdown',
      updateSidebar: (sections) => {
        return sections.map(section => {
          if (section.id === 'cost') {
            return {
              ...section,
              fields: [
                { label: 'Parts', value: '$2,450' },
                { label: 'Labor', value: '$1,800' },
                { label: 'Paint/Refinish', value: '$950' },
                { label: 'Total', value: '$5,200' },
              ],
            };
          }
          return section;
        });
      },
    },
    {
      id: 'cost_breakdown',
      botMessage: '✅ Cost estimate complete! Total estimated repair cost: $5,200\n\nBreakdown:\n• Parts: $2,450\n• Labor: $1,800\n• Paint/Refinish: $950',
      delay: 1000,
      nextStepId: 'timeline_estimate',
      updateProgress: (steps) => {
        return steps.map(step =>
          step.id === 'triage' ? { ...step, status: 'completed' as const } :
          step.id === 'documents' ? { ...step, status: 'current' as const } : step
        );
      },
    },
    {
      id: 'timeline_estimate',
      botMessage: '⏱️ Estimated repair time: 3-5 business days. Your vehicle is drivable and safe to operate.',
      delay: 1000,
      nextStepId: 'photo_upload',
    },
    {
      id: 'photo_upload',
      botMessage: 'Now I need to collect some documentation. Please upload photos of the damage. You can attach multiple files.',
      inputField: {
        id: 'damagePhotos',
        type: 'file',
        label: 'Damage Photos',
        required: true,
      },
      delay: 1000,
      nextStepId: 'police_report',
    },
    {
      id: 'police_report',
      botMessage: 'Was a police report filed for this incident?',
      quickReplies: [
        { id: '1', label: '✅ Yes', value: 'Yes' },
        { id: '2', label: '❌ No', value: 'No' },
      ],
      delay: 1000,
      nextStepId: (value) => value === 'Yes' ? 'police_report_number' : 'witnesses',
    },
    {
      id: 'police_report_number',
      botMessage: 'Please provide the police report number.',
      inputField: {
        id: 'policeReportNumber',
        type: 'text',
        label: 'Police Report Number',
        placeholder: 'e.g., PR-2025-12345',
        required: true,
      },
      delay: 1000,
      nextStepId: 'witnesses',
    },
    {
      id: 'witnesses',
      botMessage: 'Were there any witnesses to the incident?',
      quickReplies: [
        { id: '1', label: '✅ Yes', value: 'Yes' },
        { id: '2', label: '❌ No', value: 'No' },
      ],
      delay: 1000,
      nextStepId: (value) => value === 'Yes' ? 'witness_details' : 'documents_complete',
    },
    {
      id: 'witness_details',
      botMessage: 'Please provide witness contact information (name and phone number).',
      inputField: {
        id: 'witnessDetails',
        type: 'textarea',
        label: 'Witness Information',
        placeholder: 'Name, phone number, and brief description...',
        required: true,
      },
      delay: 1000,
      nextStepId: 'documents_complete',
    },
    {
      id: 'documents_complete',
      botMessage: '📄 Excellent! All required documentation has been collected.',
      delay: 1000,
      nextStepId: 'claim_evaluation',
      updateProgress: (steps) => {
        return steps.map(step =>
          step.id === 'documents' ? { ...step, status: 'completed' as const } :
          step.id === 'evaluation' ? { ...step, status: 'current' as const } : step
        );
      },
    },
    {
      id: 'claim_evaluation',
      botMessage: '🔍 Evaluating your claim based on policy coverage, damage assessment, and documentation...',
      delay: 2500,
      nextStepId: 'evaluation_complete',
    },
    {
      id: 'evaluation_complete',
      botMessage: '✅ Claim evaluation complete!\n\n• Coverage: Comprehensive Collision\n• Deductible: $500\n• Approved Amount: $4,700\n• Processing Time: 2-3 business days',
      delay: 1200,
      nextStepId: 'preferred_contact',
      updateProgress: (steps) => {
        return steps.map(step =>
          step.id === 'evaluation' ? { ...step, status: 'completed' as const } :
          step.id === 'settlement' ? { ...step, status: 'current' as const } : step
        );
      },
      updateSidebar: (sections) => {
        return sections.map(section => {
          if (section.id === 'claim') {
            return {
              ...section,
              badge: { label: 'APPROVED', variant: 'success' as const },
            };
          }
          return section;
        });
      },
    },
    {
      id: 'preferred_contact',
      botMessage: 'How would you prefer to be contacted regarding your claim status?',
      quickReplies: [
        { id: '1', label: '📧 Email', value: 'Email' },
        { id: '2', label: '📱 Phone', value: 'Phone' },
        { id: '3', label: '💬 SMS', value: 'SMS' },
      ],
      delay: 1000,
      nextStepId: 'contact_info',
    },
    {
      id: 'contact_info',
      botMessage: 'Please provide your contact information.',
      inputField: {
        id: 'contactInfo',
        type: 'text',
        label: 'Contact Information',
        placeholder: 'Email or phone number',
        required: true,
      },
      delay: 1000,
      nextStepId: 'payment_method',
    },
    {
      id: 'payment_method',
      botMessage: 'How would you like to receive your settlement payment?',
      quickReplies: [
        { id: '1', label: '🏦 Direct Deposit', value: 'Direct Deposit' },
        { id: '2', label: '✉️ Check by Mail', value: 'Check' },
        { id: '3', label: '💳 PayPal', value: 'PayPal' },
      ],
      delay: 1000,
      nextStepId: 'claim_complete',
    },
    {
      id: 'claim_complete',
      botMessage: '🎉 Congratulations! Your claim has been successfully filed!\n\n📋 Claim ID: CLM-8447024\n💰 Approved Amount: $4,700\n⏱️ Expected Payment: 2-3 business days\n\nYou will receive a confirmation email shortly with all the details. Is there anything else I can help you with?',
      quickReplies: [
        { id: '1', label: '📄 View Summary', value: 'summary' },
        { id: '2', label: '🔄 File Another Claim', value: 'restart' },
        { id: '3', label: '✅ All Done', value: 'done' },
      ],
      delay: 1500,
      updateProgress: (steps) => {
        return steps.map(step => ({ ...step, status: 'completed' as const }));
      },
    },
  ],
};

// Banking Domain - Complete Conversational Flow
export const bankingConversationalFlow: ConversationalFlowConfig = {
  startStepId: 'welcome',
  steps: [
    {
      id: 'welcome',
      botMessage: 'Welcome to your Virtual Banking Assistant! How can I help you today?',
      quickReplies: [
        { id: '1', label: '💳 Open Account', value: 'Open Account' },
        { id: '2', label: '💵 Apply for Loan', value: 'Apply for Loan' },
        { id: '3', label: '🚨 Report Fraud', value: 'Report Fraud' },
        { id: '4', label: '⚠️ Dispute Transaction', value: 'Dispute Transaction' },
      ],
      delay: 500,
      nextStepId: 'verify_identity',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'account') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Account Type' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'verify_identity',
      botMessage: 'To proceed, I need to verify your identity. Please provide your full name.',
      inputField: {
        id: 'fullName',
        type: 'text',
        label: 'Full Name',
        placeholder: 'e.g., Jane Smith',
        required: true,
      },
      delay: 1000,
      nextStepId: 'verify_ssn',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'account') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Account Holder' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'verify_ssn',
      botMessage: 'For security purposes, please provide the last 4 digits of your Social Security Number.',
      inputField: {
        id: 'ssn',
        type: 'text',
        label: 'Last 4 Digits of SSN',
        placeholder: 'XXXX',
        required: true,
      },
      delay: 1000,
      nextStepId: 'complete',
      updateProgress: (steps) => {
        return steps.map(step =>
          step.id === 'verify' ? { ...step, status: 'completed' as const } :
          step.id === 'service' ? { ...step, status: 'current' as const } : step
        );
      },
    },
    {
      id: 'complete',
      botMessage: '✅ Identity verified! Your request is being processed. You will receive a confirmation email within 24 hours.',
      delay: 1500,
      updateProgress: (steps) => {
        return steps.map(step => ({ ...step, status: 'completed' as const }));
      },
    },
  ],
};

// Travel Booking Domain - Complete Conversational Flow
export const bookingConversationalFlow: ConversationalFlowConfig = {
  startStepId: 'welcome',
  steps: [
    {
      id: 'welcome',
      botMessage: "Hi! I'm your Virtual Booking Assistant. Let me help you find the perfect stay or flight!",
      quickReplies: [
        { id: '1', label: '🏨 Book Hotel', value: 'Book Hotel', isPrimaryAction: true },
        { id: '2', label: '✈️ Book Flight', value: 'Book Flight', isPrimaryAction: true },
        { id: '3', label: '📦 Package Deal', value: 'Package Deal', isPrimaryAction: true },
      ],
      delay: 500,
      nextStepId: 'destination',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'booking') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Type' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'destination',
      botMessage: 'Great choice! Where would you like to go?',
      inputField: {
        id: 'destination',
        type: 'text',
        label: 'Destination',
        placeholder: 'e.g., Paris, France',
        required: true,
      },
      delay: 1000,
      nextStepId: 'checkin_date',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'booking') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Destination' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'checkin_date',
      botMessage: 'When would you like to check in?',
      inputField: {
        id: 'checkinDate',
        type: 'date',
        label: 'Check-in Date',
        required: true,
      },
      delay: 1000,
      nextStepId: 'checkout_date',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'booking') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Check-in' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'checkout_date',
      botMessage: 'And when would you like to check out?',
      inputField: {
        id: 'checkoutDate',
        type: 'date',
        label: 'Check-out Date',
        required: true,
      },
      delay: 1000,
      nextStepId: 'complete',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'booking') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Check-out' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'complete',
      botMessage: '🎉 Perfect! I found several great options for you. Your booking details have been saved and you will receive recommendations shortly!',
      delay: 1500,
      updateProgress: (steps) => {
        return steps.map(step => ({ ...step, status: 'completed' as const }));
      },
    },
  ],
};

// Healthcare Domain - Complete Conversational Flow
export const healthcareConversationalFlow: ConversationalFlowConfig = {
  startStepId: 'welcome',
  steps: [
    {
      id: 'welcome',
      botMessage: "Hello! I'm your Virtual Healthcare Assistant. I can help you with appointments, symptom checking, and more.",
      quickReplies: [
        { id: '1', label: '📅 Schedule Appointment', value: 'Schedule Appointment' },
        { id: '2', label: '🩺 Check Symptoms', value: 'Check Symptoms' },
        { id: '3', label: '💊 Prescription Refill', value: 'Prescription Refill' },
      ],
      delay: 500,
      nextStepId: 'patient_name',
    },
    {
      id: 'patient_name',
      botMessage: 'Please provide your full name.',
      inputField: {
        id: 'patientName',
        type: 'text',
        label: 'Full Name',
        placeholder: 'e.g., Michael Johnson',
        required: true,
      },
      delay: 1000,
      nextStepId: 'patient_dob',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'patient') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Name' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'patient_dob',
      botMessage: 'What is your date of birth?',
      inputField: {
        id: 'patientDOB',
        type: 'date',
        label: 'Date of Birth',
        required: true,
      },
      delay: 1000,
      nextStepId: 'complete',
      updateSidebar: (sections, value) => {
        return sections.map(section => {
          if (section.id === 'patient') {
            return {
              ...section,
              fields: section.fields.map(field =>
                field.label === 'Date of Birth' ? { ...field, value } : field
              ),
            };
          }
          return section;
        });
      },
    },
    {
      id: 'complete',
      botMessage: '✅ Thank you! Your information has been recorded. A healthcare professional will contact you within 24 hours to schedule your appointment.',
      delay: 1500,
      updateProgress: (steps) => {
        return steps.map(step => ({ ...step, status: 'completed' as const }));
      },
    },
  ],
};

// Export flow configurations
export const flowConfigs = {
  insurance: insuranceEnhancedFlow,
  banking: bankingConversationalFlow,
  booking: flightBookingFlow,
  healthcare: healthcareConversationalFlow,
};