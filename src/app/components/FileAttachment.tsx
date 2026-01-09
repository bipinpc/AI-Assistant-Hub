import { X, FileText, Image, Loader2, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { Button } from './ui/button';
import { FileAttachment as FileAttachmentType, formatFileSize, getFileIcon, getFileColor } from '../utils/fileAttachment';
import { cn } from './ui/utils';

interface FileAttachmentProps {
  file: FileAttachmentType;
  onRemove?: () => void;
  variant?: 'compact' | 'full';
  primaryColor?: string;
  showDownload?: boolean;
}

export function FileAttachment({ 
  file, 
  onRemove, 
  variant = 'compact',
  primaryColor = '#3b82f6',
  showDownload = false,
}: FileAttachmentProps) {
  const isImage = file.type.startsWith('image/');
  const fileColor = getFileColor(file.type);

  const renderStatusIcon = () => {
    if (file.status === 'uploading') {
      return (
        <div className="flex items-center gap-1.5">
          <Loader2 className="h-4 w-4 animate-spin" style={{ color: primaryColor }} />
          <span className="text-xs font-medium" style={{ color: primaryColor }}>
            {file.uploadProgress}%
          </span>
        </div>
      );
    }
    
    if (file.status === 'error') {
      return (
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-xs text-red-600">Failed</span>
        </div>
      );
    }
    
    return (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    );
  };

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'group relative flex items-center gap-3 rounded-lg border bg-white p-3 transition-all',
          file.status === 'error' && 'border-red-200 bg-red-50',
          file.status === 'success' && 'border-gray-200 hover:border-gray-300 hover:shadow-sm',
          file.status === 'uploading' && 'border-blue-200 bg-blue-50'
        )}
      >
        {/* File Icon/Preview */}
        <div 
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xl"
          style={{ backgroundColor: `${fileColor}15` }}
        >
          {isImage && file.url ? (
            <img 
              src={file.url} 
              alt={file.name}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <span>{getFileIcon(file.type)}</span>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-gray-900">
              {file.name}
            </p>
            {renderStatusIcon()}
          </div>
          <p className="text-xs text-gray-500">
            {formatFileSize(file.size)}
          </p>
          
          {/* Upload Progress Bar */}
          {file.status === 'uploading' && (
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${file.uploadProgress}%`,
                  backgroundColor: primaryColor 
                }}
              />
            </div>
          )}
          
          {/* Error Message */}
          {file.status === 'error' && file.error && (
            <p className="mt-1 text-xs text-red-600">
              {file.error}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {showDownload && file.status === 'success' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                const a = document.createElement('a');
                a.href = file.url;
                a.download = file.name;
                a.click();
              }}
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onRemove}
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Full variant with larger preview
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-white transition-all',
        file.status === 'error' && 'border-red-200 bg-red-50',
        file.status === 'success' && 'border-gray-200 hover:border-gray-300 hover:shadow-md',
        file.status === 'uploading' && 'border-blue-200 bg-blue-50'
      )}
    >
      {/* Image Preview or Icon */}
      {isImage && file.url ? (
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <img 
            src={file.url} 
            alt={file.name}
            className="h-full w-full object-cover"
          />
          {file.status === 'uploading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="text-center text-white">
                <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
                <p className="text-sm font-medium">{file.uploadProgress}%</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div 
          className="flex h-32 items-center justify-center"
          style={{ backgroundColor: `${fileColor}10` }}
        >
          <div className="text-center">
            <div className="text-5xl mb-2">{getFileIcon(file.type)}</div>
            {file.status === 'uploading' && (
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: primaryColor }}>
                <Loader2 className="h-4 w-4 animate-spin" />
                {file.uploadProgress}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Details */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {file.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatFileSize(file.size)}
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            {renderStatusIcon()}
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Upload Progress Bar */}
        {file.status === 'uploading' && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{ 
                width: `${file.uploadProgress}%`,
                backgroundColor: primaryColor 
              }}
            />
          </div>
        )}

        {/* Error Message */}
        {file.status === 'error' && file.error && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{file.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// File List Component
interface FileAttachmentListProps {
  attachments: FileAttachmentType[];
  onRemove?: (fileId: string) => void;
  variant?: 'compact' | 'full';
  primaryColor?: string;
  showDownload?: boolean;
}

export function FileAttachmentList({
  attachments,
  onRemove,
  variant = 'compact',
  primaryColor,
  showDownload = false,
}: FileAttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className={cn(
      'space-y-2',
      variant === 'full' && 'grid grid-cols-2 gap-3 sm:grid-cols-3'
    )}>
      {attachments.map((file) => (
        <FileAttachment
          key={file.id}
          file={file}
          onRemove={onRemove ? () => onRemove(file.id) : undefined}
          variant={variant}
          primaryColor={primaryColor}
          showDownload={showDownload}
        />
      ))}
    </div>
  );
}