import { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, Send, Loader, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { InputField, SidebarSection } from '../config/domains';
import { getValidatorForField, ValidationResult } from '../utils/validation';
import { 
  FileAttachment as FileAttachmentType,
  validateFileType,
  validateFileSize,
  validateFileCount,
  uploadFile,
  generateFileId,
  domainFileConfigs,
} from '../utils/fileAttachment';
import { FileAttachmentList } from './FileAttachment';
import { DomainId } from '../config/domains';
import { toast } from 'sonner';
import { DatePicker } from './DatePicker';
import { getTimezoneForField } from '../utils/timezone';

interface MessageInputProps {
  primaryColor?: string;
  onSendMessage: (message: string, attachments?: FileAttachmentType[]) => void;
  onAttachment?: () => void;
  onVoiceInput?: () => void;
  disabled?: boolean;
  placeholder?: string;
  isTyping?: boolean;
  expectedInput?: InputField;
  domain: DomainId;
  sidebarSections?: SidebarSection[];
}

export function MessageInput({
  primaryColor = '#3b82f6',
  onSendMessage,
  onAttachment,
  onVoiceInput,
  disabled = false,
  placeholder = 'Type your message...',
  isTyping = false,
  expectedInput,
  domain,
  sidebarSections,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [attachments, setAttachments] = useState<FileAttachmentType[]>([]);

  const validateMessage = (value: string): ValidationResult => {
    if (!expectedInput) {
      // No specific validation required, just check if not empty
      if (!value.trim()) {
        return { isValid: false, error: '❌ Please enter a message' };
      }
      return { isValid: true };
    }

    // Get the appropriate validator for this field
    const validator = getValidatorForField(expectedInput.type, expectedInput.id);
    return validator(value);
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    
    // Clear validation error when user starts typing after an attempt
    if (hasAttemptedSubmit && validationError) {
      const result = validateMessage(value);
      if (result.isValid) {
        setValidationError(null);
      } else {
        setValidationError(result.error);
      }
    }
  };

  const handleSend = () => {
    setHasAttemptedSubmit(true);
    
    if (disabled) return;

    const result = validateMessage(message);
    
    if (!result.isValid) {
      setValidationError(result.error || 'Invalid input');
      return;
    }

    // Validation passed
    setValidationError(null);
    setHasAttemptedSubmit(false);
    
    // Get successful attachments only
    const successfulAttachments = attachments.filter(att => att.status === 'success');
    
    onSendMessage(message.trim(), successfulAttachments.length > 0 ? successfulAttachments : undefined);
    setMessage('');
    setAttachments([]); // Clear attachments after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 96; // 4 lines * 24px
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [message]);

  // Generate dynamic placeholder based on expected input
  const getDynamicPlaceholder = (): string => {
    if (!expectedInput) return placeholder;
    
    const lowerFieldId = expectedInput.id.toLowerCase();
    
    if (lowerFieldId.includes('policy') && lowerFieldId.includes('number')) {
      return 'Enter policy number (8-10 digits, numbers only)...';
    }
    if (expectedInput.type === 'email' || lowerFieldId.includes('email')) {
      return 'Enter email address...';
    }
    if (expectedInput.type === 'tel' || lowerFieldId.includes('phone')) {
      return 'Enter phone number (10 digits)...';
    }
    if (expectedInput.type === 'date' || lowerFieldId.includes('date')) {
      return 'Enter date (YYYY-MM-DD)...';
    }
    if (lowerFieldId.includes('name')) {
      return 'Enter full name...';
    }
    if (lowerFieldId.includes('location') || lowerFieldId.includes('address')) {
      return 'Enter location or address...';
    }
    if (expectedInput.type === 'textarea' || lowerFieldId.includes('description')) {
      return 'Provide detailed description (minimum 50 characters)...';
    }
    
    return expectedInput.placeholder || placeholder;
  };

  const handleAttachment = async (files: FileList) => {
    const fileConfig = domainFileConfigs[domain];
    if (!fileConfig) {
      toast.error('File configuration not found for this domain.');
      return;
    }

    const fileArray = Array.from(files);
    
    // Validate file count
    const countValidation = validateFileCount(attachments.length, fileArray.length, domain);
    if (!countValidation.valid) {
      toast.error(countValidation.error || 'Too many files');
      return;
    }

    // Process each file
    for (const file of fileArray) {
      // Validate file type
      const typeValidation = validateFileType(file, domain);
      if (!typeValidation.valid) {
        toast.error(`${file.name}: ${typeValidation.error}`);
        continue;
      }

      // Validate file size
      const sizeValidation = validateFileSize(file, domain);
      if (!sizeValidation.valid) {
        toast.error(`${file.name}: ${sizeValidation.error}`);
        continue;
      }

      // Create temporary attachment with uploading status
      const fileId = generateFileId();
      const tempAttachment: FileAttachmentType = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: '',
        uploadProgress: 0,
        status: 'uploading',
      };

      setAttachments(prev => [...prev, tempAttachment]);

      // Upload file
      const uploadResult = await uploadFile(file, (progress) => {
        setAttachments(prev =>
          prev.map(att =>
            att.id === fileId
              ? { ...att, uploadProgress: Math.round(progress) }
              : att
          )
        );
      });

      // Update attachment status
      if (uploadResult.success && uploadResult.url) {
        setAttachments(prev =>
          prev.map(att =>
            att.id === fileId
              ? { ...att, url: uploadResult.url!, status: 'success', uploadProgress: 100 }
              : att
          )
        );
        toast.success(`${file.name} uploaded successfully`);
      } else {
        setAttachments(prev =>
          prev.map(att =>
            att.id === fileId
              ? { ...att, status: 'error', error: uploadResult.error || 'Upload failed' }
              : att
          )
        );
        toast.error(`${file.name}: ${uploadResult.error || 'Upload failed'}`);
      }
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prevAttachments => prevAttachments.filter(attachment => attachment.id !== id));
  };

  // Handle date selection
  const handleDateChange = (dateValue: string) => {
    // Format date for display
    const date = new Date(dateValue + 'T12:00:00');
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    
    setMessage(formattedDate);
    setValidationError(null);
    setHasAttemptedSubmit(false);
  };

  // Validate if date is in the past
  const validateDateInput = (value: string): boolean => {
    if (!value.trim()) return true; // Empty is handled by standard validation
    
    try {
      // Try to parse the date
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if it's a valid date
      if (isNaN(inputDate.getTime())) {
        return true; // Let standard validation handle invalid formats
      }
      
      // Check if date is in the past
      if (inputDate < today) {
        setValidationError('Please select a valid travel date.');
        return false;
      }
      
      return true;
    } catch {
      return true; // Let standard validation handle parse errors
    }
  };

  // Check if current input is a date field
  const isDateInput = expectedInput?.type === 'date';

  // Get min date for return date fields
  const getMinDateForField = (): string | undefined => {
    if (!expectedInput || !sidebarSections) return undefined;
    
    const fieldId = expectedInput.id.toLowerCase();
    
    // For return date, look for departure date in sidebar sections
    if (fieldId.includes('return')) {
      // Find trip details section
      const tripSection = sidebarSections.find(section => section.id === 'trip');
      if (tripSection) {
        // Find departure date field
        const departureField = tripSection.fields.find(field => 
          field.label === 'Departure Date' && field.value && field.value !== 'Not selected'
        );
        
        if (departureField && departureField.value) {
          // Convert "March 18, 2026" to "2026-03-18"
          try {
            const date = new Date(departureField.value);
            if (!isNaN(date.getTime())) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            }
          } catch {
            // Ignore parsing errors
          }
        }
      }
    }
    
    return undefined;
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] px-4 sm:px-6 py-3 sm:py-4">
      {isTyping && (
        <div className="mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
          <span>Assistant is typing...</span>
        </div>
      )}
      
      {/* Validation Error Display */}
      {validationError && (
        <div className="mb-2 sm:mb-3 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30">
          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Date Picker for date inputs */}
      {isDateInput && (
        <div className="mb-3 sm:mb-4">
          <DatePicker
            value={message}
            onChange={handleDateChange}
            primaryColor={primaryColor}
            label={expectedInput?.label || 'Select date'}
            disablePastDates={true}
            timezone={getTimezoneForField(expectedInput?.id)}
            minDate={getMinDateForField()}
          />
        </div>
      )}
      
      <div className="flex items-end gap-1.5 sm:gap-2">
        {onAttachment && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = domainFileConfigs[domain]?.allowedTypes.join(',');
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) {
                  handleAttachment(files);
                }
              };
              input.click();
            }}
            disabled={disabled}
            aria-label="Attach file"
            className="h-9 w-9 sm:h-10 sm:w-10"
          >
            <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
        <div 
          className="flex-1 rounded-lg border dark:border-white/10 bg-white dark:bg-[#2a2a2a] focus-within:ring-2"
          style={{ 
            '--ring-color': primaryColor,
          } as React.CSSProperties}
          onFocus={(e) => {
            const parent = e.currentTarget;
            parent.style.boxShadow = `0 0 0 2px ${primaryColor}40`;
          }}
          onBlur={(e) => {
            const parent = e.currentTarget;
            parent.style.boxShadow = '';
          }}
        >
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDateInput ? 'Select from calendar or type date' : getDynamicPlaceholder()}
            disabled={disabled}
            className="max-h-24 min-h-[40px] resize-none border-0 focus-visible:ring-0 dark:bg-[#2a2a2a] dark:text-gray-100 dark:placeholder:text-gray-500 text-sm sm:text-base"
            rows={1}
          />
        </div>
        {onVoiceInput && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onVoiceInput}
            disabled={disabled || message.length > 0}
            aria-label="Voice input"
            className="h-9 w-9 sm:h-10 sm:w-10"
          >
            <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          style={{ backgroundColor: primaryColor }}
          className="hover:opacity-90 h-9 w-9 sm:h-10 sm:w-10"
          aria-label="Send message"
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </Button>
      </div>
      <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-400">
        Press Enter to send, Shift+Enter for new line
      </p>
      {attachments.length > 0 && (
        <div className="mt-3 sm:mt-4">
          <FileAttachmentList attachments={attachments} onRemove={removeAttachment} />
        </div>
      )}
    </div>
  );
}