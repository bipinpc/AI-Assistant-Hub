import { DomainConfig, ProgressStep, SidebarSection, Message } from './domains';
import { getTheme } from './themes';

// Enhanced Insurance Domain Configuration matching JSON structure
export const insuranceEnhancedConfig = {
  domain: "insurance_claims",
  branding: {
    name: "Umbrella Insurance",
    logo: "🏢",
    primaryColor: "#4169E1",
    tagline: "Virtual Claims Assistant"
  },
  modes: {
    conversational: true,
    formView: true,
    defaultMode: "conversational"
  },
  workflow: {
    stages: [
      {
        id: "policy_verification",
        label: "Policy Verification",
        sublabel: "Identity Check",
        icon: "shield",
        steps: [
          {
            id: "policy_number",
            type: "text_input",
            question: "What is your policy number?",
            validation: "^[0-9]{8,10}$",
            placeholder: "Enter 8-10 digit policy number (e.g., 887654321)",
            required: true,
            errorMessage: "Please enter a valid 8-10 digit policy number",
            aiSuggestion: "Your policy number can be found on your insurance card or policy documents"
          },
          {
            id: "policy_holder_name",
            type: "text_input",
            question: "What is the policy holder's full name?",
            placeholder: "Enter full name as it appears on policy",
            required: true,
            errorMessage: "Please enter the policy holder's name",
            aiSuggestion: "This should match the name on your policy documents exactly"
          },
          {
            id: "policy_holder_email",
            type: "email",
            question: "What is your email address for claim updates?",
            placeholder: "your.email@example.com",
            required: true,
            validation: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            errorMessage: "Please enter a valid email address"
          },
          {
            id: "policy_holder_phone",
            type: "tel",
            question: "What is your phone number?",
            placeholder: "(555) 123-4567",
            required: true,
            validation: "^[0-9]{10}$",
            errorMessage: "Please enter a valid 10-digit phone number"
          }
        ]
      },
      {
        id: "incident_details",
        label: "Incident Details",
        sublabel: "What Happened",
        icon: "alert",
        steps: [
          {
            id: "incident_type",
            type: "single_choice",
            question: "What type of incident are you reporting?",
            options: [
              { value: "vehicle_accident", label: "🚗 Vehicle Accident", description: "Collision or road incident" },
              { value: "theft", label: "🔒 Theft", description: "Stolen property or vehicle" },
              { value: "natural_disaster", label: "🌪️ Natural Disaster", description: "Weather-related damage" },
              { value: "vandalism", label: "🎨 Vandalism", description: "Intentional damage to property" },
              { value: "fire", label: "🔥 Fire Damage", description: "Fire or smoke damage" },
              { value: "water_damage", label: "💧 Water Damage", description: "Flooding or water leaks" },
              { value: "other", label: "📋 Other", description: "Other type of incident" }
            ],
            displayAs: "buttons",
            required: true
          },
          {
            id: "incident_date",
            type: "date_picker",
            question: "When did the incident occur?",
            maxDate: "today",
            required: true,
            errorMessage: "Please select a valid date (cannot be in the future)",
            aiSuggestion: "Select the exact date when the incident happened"
          },
          {
            id: "incident_time",
            type: "time_picker",
            question: "What time did the incident occur?",
            placeholder: "HH:MM AM/PM",
            required: false,
            aiSuggestion: "Approximate time is fine if you don't remember exactly"
          },
          {
            id: "incident_location",
            type: "location",
            question: "Where did the incident take place?",
            placeholder: "Enter address or location (e.g., 123 Maple Ave, Springfield, IL)",
            enableAutocomplete: true,
            required: true,
            errorMessage: "Please provide the incident location"
          },
          {
            id: "incident_description",
            type: "text_area",
            question: "Please describe what happened in detail.",
            minLength: 50,
            maxLength: 1000,
            placeholder: "Provide as much detail as possible about the incident, including what led up to it, what happened during, and the aftermath...",
            required: true,
            errorMessage: "Please provide at least 50 characters describing the incident",
            characterCounter: true,
            aiSuggestion: "Include details like: What were you doing? Who was involved? Weather conditions? Any witnesses?"
          },
          {
            id: "injuries_reported",
            type: "yes_no",
            question: "Were there any injuries reported as a result of this incident?",
            required: true,
            conditionalSteps: {
              yes: [
                {
                  id: "injury_severity",
                  type: "single_choice",
                  question: "How severe were the injuries?",
                  options: [
                    { value: "minor", label: "Minor (First aid only)" },
                    { value: "moderate", label: "Moderate (Medical attention required)" },
                    { value: "severe", label: "Severe (Hospitalization required)" }
                  ],
                  displayAs: "buttons"
                },
                {
                  id: "injury_details",
                  type: "text_area",
                  question: "Please describe the injuries and medical treatment received.",
                  placeholder: "Describe the injuries, medical treatment, and current condition...",
                  maxLength: 500
                }
              ]
            }
          },
          {
            id: "other_parties_involved",
            type: "yes_no",
            question: "Were there any other parties (people or vehicles) involved?",
            required: true,
            conditionalSteps: {
              yes: [
                {
                  id: "other_party_details",
                  type: "text_area",
                  question: "Please provide details about the other party (name, contact, insurance info).",
                  placeholder: "Name, phone number, insurance company, policy number...",
                  maxLength: 500
                }
              ]
            }
          }
        ]
      },
      {
        id: "vehicle_damage_assessment",
        label: "Damage Assessment",
        sublabel: "Vehicle Details",
        icon: "clipboard",
        steps: [
          {
            id: "vehicle_make",
            type: "text_input",
            question: "What is the make of your vehicle?",
            placeholder: "e.g., Honda, Toyota, Ford",
            required: true
          },
          {
            id: "vehicle_model",
            type: "text_input",
            question: "What is the model?",
            placeholder: "e.g., Civic, Camry, F-150",
            required: true
          },
          {
            id: "vehicle_year",
            type: "number",
            question: "What year is your vehicle?",
            placeholder: "e.g., 2018",
            min: 1990,
            max: 2025,
            required: true,
            errorMessage: "Please enter a valid year between 1990 and 2025"
          },
          {
            id: "vehicle_vin",
            type: "text_input",
            question: "What is your vehicle's VIN (Vehicle Identification Number)?",
            placeholder: "17-character VIN",
            validation: "^[A-HJ-NPR-Z0-9]{17}$",
            required: false,
            errorMessage: "VIN must be 17 characters (letters and numbers, excluding I, O, Q)",
            aiSuggestion: "VIN can be found on your registration, insurance card, or driver-side dashboard"
          },
          {
            id: "damage_areas",
            type: "multi_choice",
            question: "Which areas of the vehicle were damaged? (Select all that apply)",
            options: [
              { value: "front_bumper", label: "Front Bumper" },
              { value: "rear_bumper", label: "Rear Bumper" },
              { value: "front_left", label: "Front Left Quarter Panel" },
              { value: "front_right", label: "Front Right Quarter Panel" },
              { value: "rear_left", label: "Rear Left Quarter Panel" },
              { value: "rear_right", label: "Rear Right Quarter Panel" },
              { value: "hood", label: "Hood" },
              { value: "roof", label: "Roof" },
              { value: "trunk", label: "Trunk/Tailgate" },
              { value: "windshield", label: "Windshield" },
              { value: "windows", label: "Side Windows" },
              { value: "doors", label: "Doors" },
              { value: "undercarriage", label: "Undercarriage" }
            ],
            displayAs: "checkboxes",
            required: true
          },
          {
            id: "damage_severity",
            type: "single_choice",
            question: "How would you describe the overall damage severity?",
            options: [
              { value: "minor", label: "Minor (Cosmetic only, fully drivable)" },
              { value: "moderate", label: "Moderate (Some functional damage, still drivable)" },
              { value: "major", label: "Major (Significant damage, may not be drivable)" },
              { value: "totaled", label: "Total Loss (Vehicle appears to be totaled)" }
            ],
            displayAs: "buttons",
            required: true
          },
          {
            id: "vehicle_drivable",
            type: "yes_no",
            question: "Is the vehicle still drivable and safe to operate?",
            required: true
          },
          {
            id: "airbags_deployed",
            type: "yes_no",
            question: "Did any airbags deploy during the incident?",
            required: false
          }
        ]
      },
      {
        id: "documentation",
        label: "Documentation",
        sublabel: "Upload Files",
        icon: "document",
        steps: [
          {
            id: "damage_photos",
            type: "file_upload",
            question: "Please upload photos of the damage from multiple angles.",
            acceptedFormats: ["image/jpeg", "image/png", "image/heic"],
            maxFiles: 10,
            maxSize: "10MB",
            required: true,
            errorMessage: "Please upload at least 1 photo of the damage",
            aiSuggestion: "Take clear photos from: front, rear, both sides, and close-ups of damaged areas. Include photos of VIN and license plate."
          },
          {
            id: "police_report_filed",
            type: "yes_no",
            question: "Was a police report filed for this incident?",
            required: true,
            conditionalSteps: {
              yes: [
                {
                  id: "police_report_number",
                  type: "text_input",
                  question: "What is the police report number?",
                  placeholder: "e.g., PR-2025-12345",
                  required: true
                },
                {
                  id: "police_department",
                  type: "text_input",
                  question: "Which police department filed the report?",
                  placeholder: "e.g., Springfield Police Department",
                  required: true
                },
                {
                  id: "police_report_upload",
                  type: "file_upload",
                  question: "Please upload a copy of the police report (if available).",
                  acceptedFormats: ["application/pdf", "image/jpeg", "image/png"],
                  maxFiles: 1,
                  maxSize: "5MB",
                  required: false
                }
              ]
            }
          },
          {
            id: "witnesses_present",
            type: "yes_no",
            question: "Were there any witnesses to the incident?",
            required: true,
            conditionalSteps: {
              yes: [
                {
                  id: "witness_count",
                  type: "number",
                  question: "How many witnesses were there?",
                  min: 1,
                  max: 10,
                  required: true
                },
                {
                  id: "witness_details",
                  type: "text_area",
                  question: "Please provide witness information (name, contact information).",
                  placeholder: "For each witness, provide:\n- Full name\n- Phone number\n- Email (if available)\n- Brief description of what they witnessed",
                  maxLength: 1000,
                  required: true
                }
              ]
            }
          },
          {
            id: "additional_documents",
            type: "file_upload",
            question: "Do you have any additional documents to upload? (Medical records, repair estimates, etc.)",
            acceptedFormats: ["application/pdf", "image/jpeg", "image/png", "application/msword"],
            maxFiles: 5,
            maxSize: "10MB",
            required: false,
            aiSuggestion: "Additional documents can include: medical records, repair estimates, receipts, or any other relevant documentation."
          }
        ]
      },
      {
        id: "cost_estimation",
        label: "Cost Estimation",
        sublabel: "Repair Costs",
        icon: "dollar-sign",
        steps: [
          {
            id: "repair_estimate_obtained",
            type: "yes_no",
            question: "Have you already obtained a repair estimate from a shop?",
            required: true,
            conditionalSteps: {
              yes: [
                {
                  id: "repair_shop_name",
                  type: "text_input",
                  question: "What is the name of the repair shop?",
                  placeholder: "e.g., Joe's Auto Body",
                  required: true
                },
                {
                  id: "estimated_cost",
                  type: "currency",
                  question: "What is the estimated repair cost?",
                  placeholder: "$0.00",
                  required: true
                },
                {
                  id: "repair_estimate_upload",
                  type: "file_upload",
                  question: "Please upload the repair estimate.",
                  acceptedFormats: ["application/pdf", "image/jpeg", "image/png"],
                  maxFiles: 1,
                  maxSize: "5MB",
                  required: false
                }
              ],
              no: [
                {
                  id: "preferred_repair_shop",
                  type: "single_choice",
                  question: "Do you have a preferred repair shop?",
                  options: [
                    { value: "network", label: "Use Umbrella Insurance network shop" },
                    { value: "own", label: "I have my own preferred shop" },
                    { value: "undecided", label: "I'm not sure yet" }
                  ],
                  displayAs: "buttons",
                  required: true
                }
              ]
            }
          }
        ]
      },
      {
        id: "settlement_preferences",
        label: "Settlement",
        sublabel: "Payment Info",
        icon: "credit-card",
        steps: [
          {
            id: "preferred_contact_method",
            type: "single_choice",
            question: "How would you prefer to be contacted regarding your claim status?",
            options: [
              { value: "email", label: "📧 Email" },
              { value: "phone", label: "📱 Phone Call" },
              { value: "sms", label: "💬 Text Message (SMS)" },
              { value: "app", label: "🔔 Mobile App Notification" }
            ],
            displayAs: "buttons",
            required: true
          },
          {
            id: "payment_method",
            type: "single_choice",
            question: "How would you like to receive your settlement payment?",
            options: [
              { value: "direct_deposit", label: "🏦 Direct Deposit (ACH Transfer)" },
              { value: "check", label: "✉️ Check by Mail" },
              { value: "paypal", label: "💳 PayPal" },
              { value: "repair_direct", label: "🔧 Direct payment to repair shop" }
            ],
            displayAs: "buttons",
            required: true,
            conditionalSteps: {
              direct_deposit: [
                {
                  id: "bank_routing_number",
                  type: "text_input",
                  question: "Bank Routing Number (9 digits)",
                  placeholder: "123456789",
                  validation: "^[0-9]{9}$",
                  required: true,
                  errorMessage: "Please enter a valid 9-digit routing number"
                },
                {
                  id: "bank_account_number",
                  type: "text_input",
                  question: "Bank Account Number",
                  placeholder: "Account number",
                  required: true
                },
                {
                  id: "account_type",
                  type: "single_choice",
                  question: "Account Type",
                  options: [
                    { value: "checking", label: "Checking" },
                    { value: "savings", label: "Savings" }
                  ],
                  displayAs: "buttons",
                  required: true
                }
              ],
              paypal: [
                {
                  id: "paypal_email",
                  type: "email",
                  question: "PayPal Email Address",
                  placeholder: "your.email@example.com",
                  required: true
                }
              ]
            }
          },
          {
            id: "rental_car_needed",
            type: "yes_no",
            question: "Do you need a rental car while your vehicle is being repaired?",
            required: true,
            aiSuggestion: "Most comprehensive policies include rental car coverage. We'll verify your coverage."
          },
          {
            id: "claim_communication_preferences",
            type: "multi_choice",
            question: "What updates would you like to receive? (Select all that apply)",
            options: [
              { value: "status_changes", label: "Claim status changes" },
              { value: "payment_updates", label: "Payment processing updates" },
              { value: "document_requests", label: "Additional document requests" },
              { value: "adjuster_contact", label: "Adjuster contact information" },
              { value: "repair_updates", label: "Repair shop updates" }
            ],
            displayAs: "checkboxes",
            required: true
          }
        ]
      }
    ]
  },
  sidebar: {
    enabled: true,
    position: "right",
    width: "384px",
    collapsible: true,
    sections: [
      {
        id: "claim_summary",
        title: "Claim Summary",
        icon: "file-text",
        badge: { 
          key: "status",
          label: "IN PROGRESS", 
          variant: "warning" 
        },
        fields: [
          { key: "claim_id", label: "Claim ID", format: "text", value: "CLM-8447024" },
          { key: "policy_number", label: "Policy Number", format: "text", value: "Not provided", editable: false },
          { key: "policy_holder", label: "Policy Holder", format: "text", value: "Not provided" },
          { key: "incident_date", label: "Incident Date", format: "date", value: "Not provided" },
          { key: "incident_type", label: "Incident Type", format: "text", value: "Not provided" },
          { key: "claim_filed_date", label: "Filed On", format: "date", value: new Date().toLocaleDateString() }
        ],
        collapsible: true,
        defaultOpen: true
      },
      {
        id: "damage_assessment",
        title: "Damage Assessment",
        icon: "clipboard",
        badge: { 
          key: "severity",
          label: "PENDING", 
          variant: "default" 
        },
        fields: [
          { key: "vehicle_info", label: "Vehicle", format: "text", value: "Not provided" },
          { key: "damage_severity", label: "Severity", format: "text", value: "Not assessed" },
          { key: "drivable", label: "Drivable", format: "text", value: "Unknown" },
          { key: "damage_areas", label: "Damaged Areas", format: "text", value: "Not specified" }
        ],
        collapsible: true,
        defaultOpen: true
      },
      {
        id: "cost_breakdown",
        title: "Cost Breakdown",
        icon: "dollar-sign",
        fields: [
          { key: "parts", label: "Parts", format: "currency", value: "$0.00" },
          { key: "labor", label: "Labor", format: "currency", value: "$0.00" },
          { key: "paint", label: "Paint/Refinish", format: "currency", value: "$0.00" },
          { key: "other", label: "Other Costs", format: "currency", value: "$0.00" },
          { key: "subtotal", label: "Subtotal", format: "currency", value: "$0.00", bold: true },
          { key: "deductible", label: "Deductible", format: "currency", value: "-$500.00" },
          { key: "total", label: "Total Payout", format: "currency", value: "$0.00", bold: true, highlight: true }
        ],
        collapsible: true,
        defaultOpen: true
      },
      {
        id: "timeline_status",
        title: "Timeline & Status",
        icon: "clock",
        fields: [
          { key: "current_stage", label: "Current Stage", format: "text", value: "Policy Verification" },
          { key: "estimated_completion", label: "Est. Completion", format: "text", value: "Not available" },
          { key: "repair_time", label: "Est. Repair Time", format: "text", value: "Not available" },
          { key: "next_action", label: "Next Action", format: "text", value: "Complete verification" }
        ],
        collapsible: true,
        defaultOpen: true
      },
      {
        id: "documentation_status",
        title: "Documentation",
        icon: "paperclip",
        fields: [
          { key: "photos_uploaded", label: "Photos", format: "text", value: "0 uploaded" },
          { key: "police_report", label: "Police Report", format: "text", value: "Not provided" },
          { key: "repair_estimate", label: "Repair Estimate", format: "text", value: "Not provided" },
          { key: "additional_docs", label: "Other Documents", format: "text", value: "0 uploaded" }
        ],
        collapsible: true,
        defaultOpen: false
      },
      {
        id: "contact_info",
        title: "Contact Information",
        icon: "user",
        fields: [
          { key: "email", label: "Email", format: "text", value: "Not provided" },
          { key: "phone", label: "Phone", format: "text", value: "Not provided" },
          { key: "preferred_contact", label: "Preferred Method", format: "text", value: "Not selected" }
        ],
        collapsible: true,
        defaultOpen: false
      }
    ]
  },
  features: {
    voiceInput: true,
    multiLanguage: ["en", "es", "fr"],
    darkMode: true,
    aiSuggestions: true,
    contextualHelp: true,
    autoSave: true,
    exportOptions: ["pdf", "json", "csv"],
    accessibility: {
      wcagLevel: "AA",
      keyboardNavigation: true,
      screenReader: true,
      highContrast: true,
      textResize: true
    },
    performance: {
      lazyLoading: true,
      imageCompression: true,
      offlineSupport: true,
      progressiveWebApp: true
    },
    validation: {
      realtime: true,
      errorPrevention: true,
      smartDefaults: true,
      preFillSuggestions: true
    },
    microInteractions: {
      typingAnimation: true,
      messageSendAnimation: true,
      buttonFeedback: true,
      fileUploadProgress: true,
      successConfirmations: true,
      errorShake: true
    }
  }
};

// Convert to DomainConfig format for compatibility
export const insuranceConfig: DomainConfig = {
  id: 'insurance',
  name: 'Insurance Claims',
  title: insuranceEnhancedConfig.branding.name,
  subtitle: insuranceEnhancedConfig.branding.tagline,
  logo: insuranceEnhancedConfig.branding.logo,
  primaryColor: insuranceEnhancedConfig.branding.primaryColor,
  themeName: 'blue-theme',
  theme: getTheme('blue-theme'),
  steps: insuranceEnhancedConfig.workflow.stages.map((stage, index) => ({
    id: stage.id,
    label: stage.label,
    sublabel: stage.sublabel,
    status: index === 0 ? 'current' as const : 'upcoming' as const,
  })),
  initialMessages: [],
  sidebarSections: insuranceEnhancedConfig.sidebar.sections.map(section => ({
    id: section.id,
    title: section.title,
    icon: section.icon,
    badge: section.badge ? {
      label: section.badge.label,
      variant: section.badge.variant as 'default' | 'success' | 'warning' | 'error'
    } : undefined,
    fields: section.fields.map(field => ({
      label: field.label,
      value: field.value || 'Not provided',
      editable: field.editable,
      bold: field.bold,
      highlight: field.highlight
    })),
    collapsible: section.collapsible,
    defaultOpen: section.defaultOpen
  })),
  conversationFlow: {}
};