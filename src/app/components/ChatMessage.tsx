import { useState } from 'react';
import { Pencil, Check, X, Sparkles, User, Circle } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Message, QuickReply } from '../config/domains';
import { cn } from './ui/utils';
import { FileAttachment as FileAttachmentType } from '../utils/fileAttachment';
import { FileAttachmentList } from './FileAttachment';

interface ChatMessageProps {
  message: Message;
  primaryColor?: string;
  onQuickReplyClick?: (reply: QuickReply) => void;
  onInputSubmit?: (fieldId: string, value: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  selectedPrimaryAction?: string | null;
  exclusiveSelections?: Record<string, string>;
}

export function ChatMessage({
  message,
  primaryColor = '#3b82f6',
  onQuickReplyClick,
  onInputSubmit,
  onEdit,
  selectedPrimaryAction,
  exclusiveSelections,
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [inputValue, setInputValue] = useState('');

  const handleEdit = () => {
    if (onEdit) {
      onEdit(message.id, editValue);
      setIsEditing(false);
    }
  };

  const handleInputSubmit = () => {
    if (message.inputField && onInputSubmit && inputValue.trim()) {
      onInputSubmit(message.inputField.id, inputValue);
      setInputValue('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });
  };

  if (message.type === 'bot') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start gap-2 sm:gap-3"
      >
        {/* AI Avatar */}
        <div 
          className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: primaryColor }}
        >
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          {/* AI Assistant Label with Status */}
          <div className="flex items-center gap-1.5">
            <Circle 
              className="h-1.5 w-1.5 sm:h-2 sm:w-2 fill-current" 
              style={{ color: primaryColor }}
            />
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">AI Assistant</span>
          </div>

          {/* Message Content */}
          <div className="max-w-[calc(100vw-8rem)] sm:max-w-[600px] space-y-2 sm:space-y-3">
            <div className="rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-[#2a2a2a] px-3 py-2 sm:px-4 sm:py-3">
              <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">{message.content}</p>
            </div>
            
            {/* Quick Replies */}
            {message.quickReplies && message.quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {message.quickReplies.map((reply) => {
                  // Check if this is a primary action button
                  const isPrimaryAction = reply.isPrimaryAction;
                  
                  // Check if this belongs to an exclusive group
                  const exclusiveGroup = reply.exclusiveGroup;
                  const groupSelection = exclusiveGroup && exclusiveSelections ? exclusiveSelections[exclusiveGroup] : null;
                  
                  // Determine if button should be disabled
                  let isDisabled = false;
                  let isActive = false;
                  
                  if (isPrimaryAction) {
                    // Primary action logic: disable if another primary action was selected
                    isDisabled = selectedPrimaryAction && isPrimaryAction && reply.value !== selectedPrimaryAction;
                    isActive = selectedPrimaryAction && reply.value === selectedPrimaryAction;
                  } else if (exclusiveGroup && groupSelection) {
                    // Exclusive group logic: disable if another option in the group was selected
                    isDisabled = groupSelection !== reply.value;
                    isActive = groupSelection === reply.value;
                  }
                  
                  return (
                    <Button
                      key={reply.id}
                      variant="outline"
                      size="sm"
                      onClick={() => !isDisabled && onQuickReplyClick?.(reply)}
                      disabled={isDisabled}
                      className={cn(
                        "rounded-full transition-all",
                        isActive && "ring-2 ring-offset-2",
                        !isDisabled && "hover:text-white",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                      style={{
                        '--hover-bg': primaryColor,
                        borderColor: isActive ? primaryColor : (isDisabled ? '#d1d5db' : primaryColor),
                        color: isActive ? 'white' : (isDisabled ? '#9ca3af' : primaryColor),
                        backgroundColor: isActive ? primaryColor : 'transparent',
                        ringColor: isActive ? primaryColor : undefined,
                      } as React.CSSProperties}
                      onMouseEnter={(e) => {
                        if (!isDisabled && !isActive) {
                          e.currentTarget.style.backgroundColor = primaryColor;
                          e.currentTarget.style.color = 'white';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isDisabled && !isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = primaryColor;
                        }
                      }}
                    >
                      {reply.label}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Timestamp */}
            <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // User message
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start justify-end gap-3"
    >
      <div className="flex flex-col items-end gap-2">
        {/* Message Content */}
        <div className="max-w-[600px] space-y-2">
          {isEditing ? (
            <div className="space-y-2 rounded-lg border bg-white p-3">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleEdit();
                  }
                  if (e.key === 'Escape') {
                    setIsEditing(false);
                    setEditValue(message.content);
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditValue(message.content);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div 
                className="rounded-2xl rounded-tr-sm px-4 py-3"
                style={{ backgroundColor: primaryColor }}
              >
                <p className="text-white">{message.content}</p>
              </div>
              
              {/* File Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 max-w-[600px]">
                  <FileAttachmentList
                    attachments={message.attachments.map(att => ({
                      ...att,
                      uploadProgress: 100,
                      status: 'success' as const,
                    }))}
                    variant="compact"
                    primaryColor={primaryColor}
                    showDownload={true}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
      </div>

      {/* User Avatar */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-700">
        <User className="h-5 w-5 text-white" />
      </div>
    </motion.div>
  );
}