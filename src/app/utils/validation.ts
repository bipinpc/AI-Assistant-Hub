// Input validation utility for chat-based forms

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ValidationRule {
  validate: (value: string) => ValidationResult;
  type: 'policyNumber' | 'email' | 'phone' | 'date' | 'text' | 'name' | 'number' | 'ssn' | 'location' | 'textarea';
}

export const validators = {
  // Policy number: 8-10 digits only, no letters or symbols
  policyNumber: (value: string): ValidationResult => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { isValid: false, error: '❌ Policy number is required' };
    }
    
    // Check if contains only digits
    if (!/^\d+$/.test(trimmed)) {
      return { isValid: false, error: '❌ Policy number must contain only numbers (no letters or symbols)' };
    }
    
    // Check length
    if (trimmed.length < 8) {
      return { isValid: false, error: `❌ Policy number must be at least 8 digits (currently ${trimmed.length})` };
    }
    
    if (trimmed.length > 10) {
      return { isValid: false, error: `❌ Policy number cannot exceed 10 digits (currently ${trimmed.length})` };
    }
    
    return { isValid: true };
  },

  // Email validation
  email: (value: string): ValidationResult => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { isValid: false, error: '❌ Email address is required' };
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(trimmed)) {
      return { isValid: false, error: '❌ Please enter a valid email address (e.g., name@example.com)' };
    }
    
    return { isValid: true };
  },

  // Phone number validation (10 digits)
  phone: (value: string): ValidationResult => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { isValid: false, error: '❌ Phone number is required' };
    }
    
    // Remove common formatting characters
    const digitsOnly = trimmed.replace(/[\s\-\(\)\.]/g, '');
    
    if (!/^\d+$/.test(digitsOnly)) {
      return { isValid: false, error: '❌ Phone number must contain only digits' };
    }
    
    if (digitsOnly.length !== 10) {
      return { isValid: false, error: `❌ Phone number must be exactly 10 digits (currently ${digitsOnly.length})` };
    }
    
    return { isValid: true };
  },

  // Date validation
  date: (value: string): ValidationResult => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { isValid: false, error: '❌ Date is required' };
    }
    
    const date = new Date(trimmed);
    
    if (isNaN(date.getTime())) {
      return { isValid: false, error: '❌ Please enter a valid date' };
    }
    
    // Check if date is in the past (before today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);
    
    if (inputDate < today) {
      return { isValid: false, error: 'Please select a valid travel date.' };
    }
    
    return { isValid: true };
  },

  // Text input (general) - at least 1 character
  text: (value: string, minLength: number = 1): ValidationResult => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { isValid: false, error: '❌ This field is required' };
    }
    
    if (trimmed.length < minLength) {
      return { isValid: false, error: `❌ Must be at least ${minLength} characters` };
    }
    
    return { isValid: true };
  },

  // Name validation (letters, spaces, hyphens, apostrophes only)
  name: (value: string): ValidationResult => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { isValid: false, error: '❌ Name is required' };
    }
    
    if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
      return { isValid: false, error: '❌ Name can only contain letters, spaces, hyphens, and apostrophes' };
    }
    
    if (trimmed.length < 2) {
      return { isValid: false, error: '❌ Name must be at least 2 characters' };
    }
    
    return { isValid: true };
  },

  // Textarea validation - longer text required
  textarea: (value: string, minLength: number = 50): ValidationResult => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { isValid: false, error: '❌ This field is required' };
    }
    
    if (trimmed.length < minLength) {
      return { 
        isValid: false, 
        error: `❌ Please provide at least ${minLength} characters (currently ${trimmed.length})` 
      };
    }
    
    return { isValid: true };
  },

  // Number validation
  number: (value: string, min?: number, max?: number): ValidationResult => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { isValid: false, error: '❌ This field is required' };
    }
    
    if (!/^\d+$/.test(trimmed)) {
      return { isValid: false, error: '❌ Please enter a valid number (digits only)' };
    }
    
    const num = parseInt(trimmed, 10);
    
    if (min !== undefined && num < min) {
      return { isValid: false, error: `❌ Number must be at least ${min}` };
    }
    
    if (max !== undefined && num > max) {
      return { isValid: false, error: `❌ Number cannot exceed ${max}` };
    }
    
    return { isValid: true };
  },

  // SSN last 4 digits
  ssnLast4: (value: string): ValidationResult => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { isValid: false, error: '❌ SSN last 4 digits is required' };
    }
    
    if (!/^\d{4}$/.test(trimmed)) {
      return { isValid: false, error: '❌ Please enter exactly 4 digits' };
    }
    
    return { isValid: true };
  },

  // Location/address validation
  location: (value: string): ValidationResult => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { isValid: false, error: '❌ Location is required' };
    }
    
    if (trimmed.length < 5) {
      return { isValid: false, error: '❌ Please provide a complete address or location' };
    }
    
    return { isValid: true };
  },
};

// Get validator based on field type and id
export const getValidatorForField = (fieldType: string, fieldId: string): ((value: string) => ValidationResult) => {
  const lowerFieldId = fieldId.toLowerCase();
  
  // Policy number - strict validation
  if (lowerFieldId.includes('policy') && lowerFieldId.includes('number')) {
    return validators.policyNumber;
  }
  
  // Email
  if (fieldType === 'email' || lowerFieldId.includes('email')) {
    return validators.email;
  }
  
  // Phone
  if (fieldType === 'tel' || lowerFieldId.includes('phone')) {
    return validators.phone;
  }
  
  // Date
  if (fieldType === 'date' || lowerFieldId.includes('date')) {
    return validators.date;
  }
  
  // SSN
  if (lowerFieldId.includes('ssn')) {
    return validators.ssnLast4;
  }
  
  // Name fields
  if (lowerFieldId.includes('name') || lowerFieldId.includes('holder')) {
    return validators.name;
  }
  
  // Location
  if (lowerFieldId.includes('location') || lowerFieldId.includes('address')) {
    return validators.location;
  }
  
  // Vehicle year or other numbers
  if (fieldType === 'number' || lowerFieldId.includes('year')) {
    if (lowerFieldId.includes('year')) {
      return (value: string) => validators.number(value, 1990, new Date().getFullYear() + 1);
    }
    return validators.number;
  }
  
  // Textarea - longer descriptions
  if (fieldType === 'textarea' || lowerFieldId.includes('description') || lowerFieldId.includes('details')) {
    return (value: string) => validators.textarea(value, 50);
  }
  
  // Default text validation
  return validators.text;
};

// Export helper to determine if a field needs validation
export const needsValidation = (fieldId: string): boolean => {
  // All fields need validation
  return true;
};