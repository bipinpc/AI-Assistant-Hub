import { ConversationalFlowConfig, FlowStep } from './conversational-flow';
import { insuranceEnhancedConfig } from './insurance-config';
import { ProgressStep, SidebarSection } from './domains';

// Helper function to create flow steps from workflow stages
function createFlowFromWorkflow(): FlowStep[] {
  const flowSteps: FlowStep[] = [];
  const stages = insuranceEnhancedConfig.workflow.stages;
  
  // Welcome message
  flowSteps.push({
    id: 'welcome',
    botMessage: `👋 Welcome to ${insuranceEnhancedConfig.branding.name}!\n\nI'm your ${insuranceEnhancedConfig.branding.tagline}. I'm here to guide you through the claims process step by step. This should take about 10-15 minutes.\n\nLet's get started by verifying your policy information.`,
    delay: 500,
    nextStepId: 'policy_number',
  });

  // STAGE 1: Policy Verification
  flowSteps.push({
    id: 'policy_number',
    botMessage: '🔐 **Policy Verification**\n\nWhat is your policy number? (8-10 digits)',
    inputField: {
      id: 'policyNumber',
      type: 'text',
      label: 'Policy Number',
      placeholder: 'Enter 8-10 digit policy number (e.g., 887654321)',
      required: true,
    },
    delay: 800,
    nextStepId: 'policy_holder_name',
    updateSidebar: (sections, value) => {
      return sections.map(section => {
        if (section.id === 'claim_summary') {
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
  });

  flowSteps.push({
    id: 'policy_holder_name',
    botMessage: '✅ Policy found! Your coverage is active.\n\nFor verification, please confirm the policy holder\'s full name as it appears on the policy.',
    inputField: {
      id: 'policyHolderName',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter full name (e.g., John Michael Doe)',
      required: true,
    },
    delay: 1000,
    nextStepId: 'policy_holder_email',
    updateSidebar: (sections, value) => {
      return sections.map(section => {
        if (section.id === 'claim_summary') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Policy Holder' ? { ...field, value } : field
            ),
          };
        }
        return section;
      });
    },
  });

  flowSteps.push({
    id: 'policy_holder_email',
    botMessage: '📧 What email address should we use for claim updates and notifications?',
    inputField: {
      id: 'policyHolderEmail',
      type: 'email',
      label: 'Email Address',
      placeholder: 'your.email@example.com',
      required: true,
    },
    delay: 1000,
    nextStepId: 'policy_holder_phone',
    updateSidebar: (sections, value) => {
      return sections.map(section => {
        if (section.id === 'contact_info') {
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
  });

  flowSteps.push({
    id: 'policy_holder_phone',
    botMessage: '📱 Please provide your phone number for urgent updates.',
    inputField: {
      id: 'policyHolderPhone',
      type: 'tel',
      label: 'Phone Number',
      placeholder: '(555) 123-4567',
      required: true,
    },
    delay: 1000,
    nextStepId: 'verification_complete',
    updateSidebar: (sections, value) => {
      return sections.map(section => {
        if (section.id === 'contact_info') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Phone' ? { ...field, value } : field
            ),
          };
        }
        return section;
      });
    },
  });

  flowSteps.push({
    id: 'verification_complete',
    botMessage: '✅ **Verification Complete!**\n\nYour identity has been confirmed. Now let\'s gather details about the incident.',
    delay: 1200,
    nextStepId: 'incident_type',
    updateProgress: (steps) => {
      return steps.map(step =>
        step.id === 'policy_verification' ? { ...step, status: 'completed' as const } :
        step.id === 'incident_details' ? { ...step, status: 'current' as const } : step
      );
    },
    updateSidebar: (sections) => {
      return sections.map(section => {
        if (section.id === 'timeline_status') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Current Stage' ? { ...field, value: 'Incident Details' } : field
            ),
          };
        }
        return section;
      });
    },
  });

  // STAGE 2: Incident Details
  flowSteps.push({
    id: 'incident_type',
    botMessage: '📋 **Incident Details**\n\nWhat type of incident are you reporting?',
    quickReplies: [
      { id: '1', label: '🚗 Vehicle Accident', value: 'Vehicle Accident' },
      { id: '2', label: '🔒 Theft', value: 'Theft' },
      { id: '3', label: '🌪️ Natural Disaster', value: 'Natural Disaster' },
      { id: '4', label: '🎨 Vandalism', value: 'Vandalism' },
      { id: '5', label: '🔥 Fire Damage', value: 'Fire Damage' },
      { id: '6', label: '💧 Water Damage', value: 'Water Damage' },
    ],
    delay: 1000,
    nextStepId: 'incident_date',
    updateSidebar: (sections, value) => {
      return sections.map(section => {
        if (section.id === 'claim_summary') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Incident Type' ? { ...field, value } : field
            ),
          };
        }
        return section;
      });
    },
  });

  flowSteps.push({
    id: 'incident_date',
    botMessage: '📅 When did this incident occur? Please select the date.',
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
        if (section.id === 'claim_summary') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Incident Date' ? { ...field, value } : field
            ),
          };
        }
        return section;
      });
    },
  });

  flowSteps.push({
    id: 'incident_location',
    botMessage: '📍 Where did the incident take place? Please provide the full address or location.',
    inputField: {
      id: 'incidentLocation',
      type: 'text',
      label: 'Location',
      placeholder: 'e.g., 123 Maple Ave, Springfield, IL 62701',
      required: true,
    },
    delay: 1000,
    nextStepId: 'incident_description',
  });

  flowSteps.push({
    id: 'incident_description',
    botMessage: '📝 Please describe what happened in detail. Include:\n• What you were doing before the incident\n• Exactly what happened\n• Weather and road conditions\n• Any other relevant details\n\n(Minimum 50 characters)',
    inputField: {
      id: 'incidentDescription',
      type: 'textarea',
      label: 'Incident Description',
      placeholder: 'I was driving southbound on Main Street when...',
      required: true,
    },
    delay: 1000,
    nextStepId: 'injuries_question',
  });

  flowSteps.push({
    id: 'injuries_question',
    botMessage: '🏥 Were there any injuries reported as a result of this incident?',
    quickReplies: [
      { id: '1', label: '✅ Yes', value: 'Yes' },
      { id: '2', label: '❌ No', value: 'No' },
    ],
    delay: 1000,
    nextStepId: (value) => value === 'Yes' ? 'injury_severity' : 'other_parties_question',
  });

  flowSteps.push({
    id: 'injury_severity',
    botMessage: '🩺 How severe were the injuries?',
    quickReplies: [
      { id: '1', label: 'Minor (First aid only)', value: 'Minor' },
      { id: '2', label: 'Moderate (Medical attention)', value: 'Moderate' },
      { id: '3', label: 'Severe (Hospitalization)', value: 'Severe' },
    ],
    delay: 1000,
    nextStepId: 'other_parties_question',
  });

  flowSteps.push({
    id: 'other_parties_question',
    botMessage: '👥 Were there any other parties (people or vehicles) involved in this incident?',
    quickReplies: [
      { id: '1', label: '✅ Yes', value: 'Yes' },
      { id: '2', label: '❌ No', value: 'No' },
    ],
    delay: 1000,
    nextStepId: (value) => value === 'Yes' ? 'other_party_details' : 'incident_complete',
  });

  flowSteps.push({
    id: 'other_party_details',
    botMessage: '📇 Please provide details about the other party:\n• Name\n• Contact information\n• Insurance company (if known)\n• License plate number',
    inputField: {
      id: 'otherPartyDetails',
      type: 'textarea',
      label: 'Other Party Information',
      placeholder: 'Name: Jane Smith\nPhone: (555) 987-6543\nInsurance: State Farm\nLicense: ABC-1234',
      required: true,
    },
    delay: 1000,
    nextStepId: 'incident_complete',
  });

  flowSteps.push({
    id: 'incident_complete',
    botMessage: '✅ Thank you for providing the incident details. Now let\'s assess the vehicle damage.',
    delay: 1200,
    nextStepId: 'vehicle_make',
    updateProgress: (steps) => {
      return steps.map(step =>
        step.id === 'incident_details' ? { ...step, status: 'completed' as const } :
        step.id === 'vehicle_damage_assessment' ? { ...step, status: 'current' as const } : step
      );
    },
    updateSidebar: (sections) => {
      return sections.map(section => {
        if (section.id === 'timeline_status') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Current Stage' ? { ...field, value: 'Damage Assessment' } : field
            ),
          };
        }
        return section;
      });
    },
  });

  // STAGE 3: Vehicle Damage Assessment
  flowSteps.push({
    id: 'vehicle_make',
    botMessage: '🚗 **Vehicle Information**\n\nWhat is the make of your vehicle?',
    inputField: {
      id: 'vehicleMake',
      type: 'text',
      label: 'Vehicle Make',
      placeholder: 'e.g., Honda, Toyota, Ford',
      required: true,
    },
    delay: 1000,
    nextStepId: 'vehicle_model',
  });

  flowSteps.push({
    id: 'vehicle_model',
    botMessage: 'What is the model?',
    inputField: {
      id: 'vehicleModel',
      type: 'text',
      label: 'Vehicle Model',
      placeholder: 'e.g., Civic, Camry, F-150',
      required: true,
    },
    delay: 800,
    nextStepId: 'vehicle_year',
  });

  flowSteps.push({
    id: 'vehicle_year',
    botMessage: 'What year is your vehicle?',
    inputField: {
      id: 'vehicleYear',
      type: 'number',
      label: 'Vehicle Year',
      placeholder: 'e.g., 2018',
      required: true,
    },
    delay: 800,
    nextStepId: 'vehicle_info_complete',
  });

  flowSteps.push({
    id: 'vehicle_info_complete',
    botMessage: '✅ Vehicle information recorded.',
    delay: 800,
    nextStepId: 'damage_severity',
    updateSidebar: (sections, value) => {
      // Get the last three user inputs for vehicle make, model, year
      return sections.map(section => {
        if (section.id === 'damage_assessment') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Vehicle' ? { ...field, value: 'Vehicle information recorded' } : field
            ),
          };
        }
        return section;
      });
    },
  });

  flowSteps.push({
    id: 'damage_severity',
    botMessage: '🔍 How would you describe the overall damage severity?',
    quickReplies: [
      { id: '1', label: 'Minor (Cosmetic only)', value: 'Minor' },
      { id: '2', label: 'Moderate (Some damage)', value: 'Moderate' },
      { id: '3', label: 'Major (Significant damage)', value: 'Major' },
      { id: '4', label: 'Total Loss', value: 'Total Loss' },
    ],
    delay: 1000,
    nextStepId: 'vehicle_drivable',
    updateSidebar: (sections, value) => {
      return sections.map(section => {
        if (section.id === 'damage_assessment') {
          return {
            ...section,
            badge: { 
              label: value.toUpperCase(), 
              variant: value === 'Minor' ? 'success' as const : 
                       value === 'Moderate' ? 'warning' as const : 'error' as const
            },
            fields: section.fields.map(field =>
              field.label === 'Severity' ? { ...field, value } : field
            ),
          };
        }
        return section;
      });
    },
  });

  flowSteps.push({
    id: 'vehicle_drivable',
    botMessage: '🚦 Is the vehicle still drivable and safe to operate?',
    quickReplies: [
      { id: '1', label: '✅ Yes, fully drivable', value: 'Yes' },
      { id: '2', label: '⚠️ Drivable but unsafe', value: 'Partially' },
      { id: '3', label: '❌ Not drivable', value: 'No' },
    ],
    delay: 1000,
    nextStepId: 'damage_assessment_analyzing',
    updateSidebar: (sections, value) => {
      return sections.map(section => {
        if (section.id === 'damage_assessment') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Drivable' ? { ...field, value } : field
            ),
          };
        }
        return section;
      });
    },
  });

  flowSteps.push({
    id: 'damage_assessment_analyzing',
    botMessage: '🔄 Analyzing damage information and calculating repair estimates...',
    delay: 2000,
    nextStepId: 'cost_estimate_complete',
    updateSidebar: (sections) => {
      return sections.map(section => {
        if (section.id === 'cost_breakdown') {
          return {
            ...section,
            fields: [
              { label: 'Parts', value: '$2,450.00' },
              { label: 'Labor', value: '$1,800.00' },
              { label: 'Paint/Refinish', value: '$950.00' },
              { label: 'Other Costs', value: '$280.00' },
              { label: 'Subtotal', value: '$5,480.00', bold: true },
              { label: 'Deductible', value: '-$500.00' },
              { label: 'Total Payout', value: '$4,980.00', bold: true, highlight: true },
            ],
          };
        }
        if (section.id === 'timeline_status') {
          return {
            ...section,
            fields: section.fields.map(field => {
              if (field.label === 'Est. Repair Time') return { ...field, value: '3-5 business days' };
              if (field.label === 'Est. Completion') return { ...field, value: 'January 2, 2026' };
              return field;
            }),
          };
        }
        return section;
      });
    },
  });

  flowSteps.push({
    id: 'cost_estimate_complete',
    botMessage: '💰 **Repair Cost Estimate**\n\n• Parts: $2,450.00\n• Labor: $1,800.00\n• Paint/Refinish: $950.00\n• Other: $280.00\n\n**Subtotal:** $5,480.00\n**Your Deductible:** -$500.00\n**Total Payout:** $4,980.00\n\n⏱️ Estimated repair time: 3-5 business days',
    delay: 1200,
    nextStepId: 'documentation_intro',
    updateProgress: (steps) => {
      return steps.map(step =>
        step.id === 'vehicle_damage_assessment' ? { ...step, status: 'completed' as const } :
        step.id === 'documentation' ? { ...step, status: 'current' as const } : step
      );
    },
    updateSidebar: (sections) => {
      return sections.map(section => {
        if (section.id === 'timeline_status') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Current Stage' ? { ...field, value: 'Documentation' } : field
            ),
          };
        }
        return section;
      });
    },
  });

  // STAGE 4: Documentation
  flowSteps.push({
    id: 'documentation_intro',
    botMessage: '📸 **Documentation Required**\n\nNow I need you to upload photos and documents to support your claim. This helps us process your claim faster!',
    delay: 1000,
    nextStepId: 'damage_photos',
  });

  flowSteps.push({
    id: 'damage_photos',
    botMessage: '📷 Please upload photos of the damage from multiple angles.\n\n💡 **Tip:** Include photos of:\n• All damaged areas\n• VIN number\n• License plate\n• Overall vehicle\n• Close-ups of damage\n\n(Maximum 10 photos, 10MB each)',
    inputField: {
      id: 'damagePhotos',
      type: 'file',
      label: 'Damage Photos',
      required: true,
    },
    delay: 1000,
    nextStepId: 'police_report_question',
    updateSidebar: (sections) => {
      return sections.map(section => {
        if (section.id === 'documentation_status') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Photos' ? { ...field, value: 'Photos uploaded ✓' } : field
            ),
          };
        }
        return section;
      });
    },
  });

  flowSteps.push({
    id: 'police_report_question',
    botMessage: '👮 Was a police report filed for this incident?',
    quickReplies: [
      { id: '1', label: '✅ Yes', value: 'Yes' },
      { id: '2', label: '❌ No', value: 'No' },
    ],
    delay: 1000,
    nextStepId: (value) => value === 'Yes' ? 'police_report_number' : 'witnesses_question',
  });

  flowSteps.push({
    id: 'police_report_number',
    botMessage: '🆔 What is the police report number?',
    inputField: {
      id: 'policeReportNumber',
      type: 'text',
      label: 'Police Report Number',
      placeholder: 'e.g., PR-2025-12345',
      required: true,
    },
    delay: 1000,
    nextStepId: 'police_department',
    updateSidebar: (sections, value) => {
      return sections.map(section => {
        if (section.id === 'documentation_status') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Police Report' ? { ...field, value } : field
            ),
          };
        }
        return section;
      });
    },
  });

  flowSteps.push({
    id: 'police_department',
    botMessage: '🏢 Which police department filed the report?',
    inputField: {
      id: 'policeDepartment',
      type: 'text',
      label: 'Police Department',
      placeholder: 'e.g., Springfield Police Department',
      required: true,
    },
    delay: 1000,
    nextStepId: 'witnesses_question',
  });

  flowSteps.push({
    id: 'witnesses_question',
    botMessage: '👁️ Were there any witnesses to the incident?',
    quickReplies: [
      { id: '1', label: '✅ Yes', value: 'Yes' },
      { id: '2', label: '❌ No', value: 'No' },
    ],
    delay: 1000,
    nextStepId: (value) => value === 'Yes' ? 'witness_details' : 'documentation_complete',
  });

  flowSteps.push({
    id: 'witness_details',
    botMessage: '📋 Please provide witness information:\n• Full name\n• Phone number\n• Email (if available)\n• Brief description of what they witnessed',
    inputField: {
      id: 'witnessDetails',
      type: 'textarea',
      label: 'Witness Information',
      placeholder: 'Name: Sarah Johnson\nPhone: (555) 234-5678\nEmail: sarah.j@email.com\nWitnessed the collision from the sidewalk',
      required: true,
    },
    delay: 1000,
    nextStepId: 'documentation_complete',
  });

  flowSteps.push({
    id: 'documentation_complete',
    botMessage: '✅ **Documentation Complete!**\n\nAll required documents and photos have been received. Your claim is being evaluated.',
    delay: 1200,
    nextStepId: 'settlement_preferences',
    updateProgress: (steps) => {
      return steps.map(step =>
        step.id === 'documentation' ? { ...step, status: 'completed' as const } :
        step.id === 'cost_estimation' ? { ...step, status: 'current' as const } : step
      );
    },
    updateSidebar: (sections) => {
      return sections.map(section => {
        if (section.id === 'timeline_status') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Current Stage' ? { ...field, value: 'Settlement Preferences' } : field
            ),
          };
        }
        return section;
      });
    },
  });

  // STAGE 5: Settlement Preferences
  flowSteps.push({
    id: 'settlement_preferences',
    botMessage: '💳 **Settlement & Payment**\n\nHow would you prefer to be contacted regarding your claim status?',
    quickReplies: [
      { id: '1', label: '📧 Email', value: 'Email' },
      { id: '2', label: '📱 Phone', value: 'Phone' },
      { id: '3', label: '💬 SMS', value: 'SMS' },
      { id: '4', label: '🔔 App Notification', value: 'App' },
    ],
    delay: 1000,
    nextStepId: 'payment_method',
    updateSidebar: (sections, value) => {
      return sections.map(section => {
        if (section.id === 'contact_info') {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.label === 'Preferred Method' ? { ...field, value } : field
            ),
          };
        }
        return section;
      });
    },
  });

  flowSteps.push({
    id: 'payment_method',
    botMessage: '💰 How would you like to receive your settlement payment of $4,980.00?',
    quickReplies: [
      { id: '1', label: '🏦 Direct Deposit', value: 'Direct Deposit' },
      { id: '2', label: '✉️ Check by Mail', value: 'Check' },
      { id: '3', label: '💳 PayPal', value: 'PayPal' },
      { id: '4', label: '🔧 Pay Repair Shop', value: 'Repair Shop' },
    ],
    delay: 1000,
    nextStepId: 'rental_car_question',
  });

  flowSteps.push({
    id: 'rental_car_question',
    botMessage: '🚗 Do you need a rental car while your vehicle is being repaired?\n\n💡 Your comprehensive policy includes rental car coverage.',
    quickReplies: [
      { id: '1', label: '✅ Yes, I need a rental', value: 'Yes' },
      { id: '2', label: '❌ No, not needed', value: 'No' },
    ],
    delay: 1000,
    nextStepId: 'claim_processing',
  });

  flowSteps.push({
    id: 'claim_processing',
    botMessage: '⏳ Processing your claim and finalizing all details...',
    delay: 2500,
    nextStepId: 'claim_complete',
    updateProgress: (steps) => {
      return steps.map(step =>
        step.id === 'settlement_preferences' ? { ...step, status: 'completed' as const } : 
        { ...step, status: 'completed' as const }
      );
    },
  });

  flowSteps.push({
    id: 'claim_complete',
    botMessage: '🎉 **Claim Successfully Filed!**\n\n✅ **Claim Summary:**\n• Claim ID: CLM-8447024\n• Status: APPROVED\n• Payout Amount: $4,980.00\n• Processing Time: 2-3 business days\n• Estimated Repair: 3-5 business days\n\n📧 You will receive a confirmation email with all details and next steps.\n\n📱 You can track your claim status anytime in your account.\n\nIs there anything else I can help you with?',
    quickReplies: [
      { id: '1', label: '📄 Download Summary PDF', value: 'download' },
      { id: '2', label: '📞 Speak to Adjuster', value: 'adjuster' },
      { id: '3', label: '🔄 File Another Claim', value: 'restart' },
      { id: '4', label: '✅ All Done', value: 'done' },
    ],
    delay: 1500,
    updateSidebar: (sections) => {
      return sections.map(section => {
        if (section.id === 'claim_summary') {
          return {
            ...section,
            badge: { label: 'APPROVED', variant: 'success' as const },
          };
        }
        if (section.id === 'timeline_status') {
          return {
            ...section,
            fields: section.fields.map(field => {
              if (field.label === 'Current Stage') return { ...field, value: 'Completed' };
              if (field.label === 'Next Action') return { ...field, value: 'Await payment' };
              return field;
            }),
          };
        }
        return section;
      });
    },
  });

  return flowSteps;
}

// Export the insurance conversational flow
export const insuranceEnhancedFlow: ConversationalFlowConfig = {
  startStepId: 'welcome',
  steps: createFlowFromWorkflow(),
};
