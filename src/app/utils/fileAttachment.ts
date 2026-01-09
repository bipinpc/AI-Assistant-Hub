import { DomainId } from '../config/domains';

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadProgress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export interface DomainFileConfig {
  allowedTypes: string[];
  maxSizeMB: number;
  maxFiles: number;
  description: string;
}

// Domain-specific file configurations
export const domainFileConfigs: Record<DomainId, DomainFileConfig> = {
  insurance: {
    allowedTypes: [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/heic',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    maxSizeMB: 10,
    maxFiles: 5,
    description: 'Images (JPEG, PNG, HEIC), PDFs, or Documents (DOC, DOCX) up to 10MB',
  },
  banking: {
    allowedTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png', 
      'application/pdf',
      'image/heic',
    ],
    maxSizeMB: 5,
    maxFiles: 3,
    description: 'Images (JPEG, PNG, HEIC) or PDFs up to 5MB',
  },
  booking: {
    allowedTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'text/calendar',
      'text/plain',
    ],
    maxSizeMB: 8,
    maxFiles: 4,
    description: 'Images (JPEG, PNG), PDFs, Calendar files (ICS), or Text files up to 8MB',
  },
  healthcare: {
    allowedTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/heic',
      'application/pdf',
      'application/dicom',
    ],
    maxSizeMB: 15,
    maxFiles: 10,
    description: 'Medical images (JPEG, PNG, HEIC, DICOM) or PDFs up to 15MB',
  },
};

// File type display names
export const fileTypeLabels: Record<string, { label: string; icon: string; color: string }> = {
  'image/jpeg': { label: 'JPEG Image', icon: '🖼️', color: '#3b82f6' },
  'image/jpg': { label: 'JPG Image', icon: '🖼️', color: '#3b82f6' },
  'image/png': { label: 'PNG Image', icon: '🖼️', color: '#06b6d4' },
  'image/heic': { label: 'HEIC Image', icon: '🖼️', color: '#8b5cf6' },
  'application/pdf': { label: 'PDF Document', icon: '📄', color: '#ef4444' },
  'application/msword': { label: 'Word Document', icon: '📝', color: '#2563eb' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { 
    label: 'Word Document', 
    icon: '📝', 
    color: '#2563eb' 
  },
  'text/calendar': { label: 'Calendar File', icon: '📅', color: '#10b981' },
  'text/plain': { label: 'Text File', icon: '📋', color: '#6b7280' },
  'application/dicom': { label: 'DICOM Image', icon: '🏥', color: '#dc2626' },
};

// Validation functions
export function validateFileType(file: File, domain: DomainId): { valid: boolean; error?: string } {
  const config = domainFileConfigs[domain];
  
  if (!config.allowedTypes.includes(file.type)) {
    const allowedExtensions = config.allowedTypes
      .map(type => {
        const parts = type.split('/');
        return parts[1].toUpperCase();
      })
      .join(', ');
    
    return {
      valid: false,
      error: `File type "${file.type}" not supported. Allowed: ${allowedExtensions}`,
    };
  }
  
  return { valid: true };
}

export function validateFileSize(file: File, domain: DomainId): { valid: boolean; error?: string } {
  const config = domainFileConfigs[domain];
  const maxSizeBytes = config.maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size ${formatFileSize(file.size)} exceeds maximum ${config.maxSizeMB}MB`,
    };
  }
  
  return { valid: true };
}

export function validateFileCount(
  currentCount: number, 
  newCount: number, 
  domain: DomainId
): { valid: boolean; error?: string } {
  const config = domainFileConfigs[domain];
  
  if (currentCount + newCount > config.maxFiles) {
    return {
      valid: false,
      error: `Maximum ${config.maxFiles} files allowed. You have ${currentCount} file(s) attached.`,
    };
  }
  
  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function getFileIcon(mimeType: string): string {
  return fileTypeLabels[mimeType]?.icon || '📎';
}

export function getFileLabel(mimeType: string): string {
  return fileTypeLabels[mimeType]?.label || 'File';
}

export function getFileColor(mimeType: string): string {
  return fileTypeLabels[mimeType]?.color || '#6b7280';
}

// Simulate file upload (in production, this would upload to a server)
export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; url?: string; error?: string }> {
  return new Promise((resolve) => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Create a local URL for the file (in production, this would be a server URL)
        const url = URL.createObjectURL(file);
        
        // Simulate success (95% success rate)
        const success = Math.random() > 0.05;
        
        if (success) {
          if (onProgress) onProgress(100);
          resolve({ success: true, url });
        } else {
          resolve({ 
            success: false, 
            error: 'Upload failed. Please try again.' 
          });
        }
      } else {
        if (onProgress) onProgress(Math.min(progress, 95));
      }
    }, 200);
  });
}

// Generate unique file ID
export function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}