import { ChevronLeft, ChevronRight, Plus, MessageSquare, Calendar, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { cn } from './ui/utils';
import { DomainId, domainConfigs } from '../config/domains';

export interface ConversationHistoryItem {
  id: string;
  domain: DomainId;
  title: string;
  timestamp: Date;
  messageCount: number;
}

interface ChatHistorySidebarProps {
  conversations: ConversationHistoryItem[];
  activeConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

const domainNames: Record<DomainId, string> = {
  insurance: 'Insurance',
  banking: 'Banking',
  booking: 'Travel',
  healthcare: 'Healthcare',
};

export function ChatHistorySidebar({
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  isCollapsed,
  onToggleCollapse,
  className,
}: ChatHistorySidebarProps) {
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 1 ? 'Just now' : `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isCollapsed) {
    return (
      <div className="flex h-full w-16 flex-col overflow-hidden border-r bg-gray-50 dark:bg-[#1a1a1a] dark:border-white/10">
        <div className="flex h-14 flex-shrink-0 items-center justify-center border-b dark:border-white/10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            title="Expand sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-1 flex-col items-center gap-2 overflow-hidden p-2">
          <Button
            variant="default"
            size="icon"
            onClick={onNewConversation}
            title="New Chat"
            className="flex-shrink-0 rounded-lg"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <div className="h-px w-8 flex-shrink-0 bg-gray-300 dark:bg-white/10" />
          <ScrollArea className="h-full w-full flex-1">
            <div className="space-y-2">
              {conversations.slice(0, 10).map((conv) => {
                const theme = domainConfigs[conv.domain].theme;
                return (
                  <button
                    key={conv.id}
                    onClick={() => onConversationSelect(conv.id)}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                      activeConversationId === conv.id
                        ? `${theme.bg} ${theme.bgDark} ${theme.text} ${theme.textDark}`
                        : 'bg-white dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333333]'
                    )}
                    title={conv.title}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-full w-80 flex-col overflow-hidden border-r bg-gray-50 dark:bg-[#1a1a1a] dark:border-white/10 ${className}`}>
      {/* Header */}
      <div className="flex h-14 flex-shrink-0 items-center justify-between border-b dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-white">Chat History</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          title="Collapse sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="flex-shrink-0 border-b dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-3">
        <Button
          onClick={onNewConversation}
          className="w-full gap-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          New Chat
        </Button>
      </div>

      {/* Conversation List */}
      <ScrollArea className="h-full flex-1">
        <div className="space-y-1 p-2">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No chat history yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start a new conversation to begin</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const theme = domainConfigs[conv.domain].theme;
              return (
                <div
                  key={conv.id}
                  className={cn(
                    'group relative rounded-lg border p-3 transition-all cursor-pointer',
                    activeConversationId === conv.id
                      ? `${theme.bg} ${theme.bgDark} ${theme.border} ${theme.borderDark} shadow-sm`
                      : 'bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-sm'
                  )}
                  onClick={() => onConversationSelect(conv.id)}
                >
                  {/* Domain Badge */}
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                        `${theme.bg} ${theme.text}`,
                        `${theme.bgDark} ${theme.textDark}`
                      )}
                    >
                      {domainNames[conv.domain]}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {formatTimestamp(conv.timestamp)}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                    {conv.title}
                  </h4>

                  {/* Message Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {conv.messageCount} {conv.messageCount === 1 ? 'message' : 'messages'}
                    </span>
                    
                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      title="Delete conversation"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}