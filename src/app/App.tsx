import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { ChatHeader } from './components/ChatHeader';
import { ProgressTracker } from './components/ProgressTracker';
import { ChatMessage } from './components/ChatMessage';
import { MessageInput } from './components/MessageInput';
import { SidebarPanel } from './components/SidebarPanel';
import { ChatHistorySidebar, ConversationHistoryItem } from './components/ChatHistorySidebar';
import { DomainSelector } from './components/DomainSelector';
import { VoiceRecorder } from './components/VoiceRecorder';
import { SupportAgent } from './components/SupportAgent';
import { ScrollArea } from './components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { Button } from './components/ui/button';
import { Menu, MessageSquare } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { DomainThemeProvider } from './context/DomainThemeContext';
import {
  domainConfigs,
  DomainId,
  DomainConfig,
  Message,
  QuickReply,
  ProgressStep,
  SidebarSection,
  FileAttachment,
} from './config/domains';
import { flowConfigs, FlowStep } from './config/conversational-flow';

interface Conversation {
  id: string;
  domain: DomainId;
  title: string;
  messages: Message[];
  steps: ProgressStep[];
  sidebarSections: SidebarSection[];
  currentFlowStepId: string | null;
  timestamp: Date;
}

function AppContent() {
  const [selectedDomain, setSelectedDomain] = useState<DomainId | null>(null);
  const [config, setConfig] = useState<DomainConfig | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [steps, setSteps] = useState<ProgressStep[]>([]);
  const [sidebarSections, setSidebarSections] = useState<SidebarSection[]>([]);
  const [currentFlowStepId, setCurrentFlowStepId] = useState<string | null>(null);
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);
  const [isHistorySidebarCollapsed, setIsHistorySidebarCollapsed] = useState(false);
  const [selectedPrimaryAction, setSelectedPrimaryAction] = useState<string | null>(null);
  const [exclusiveSelections, setExclusiveSelections] = useState<Record<string, string>>({});
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showSupportAgent, setShowSupportAgent] = useState(false);

  // Generate conversation title from first user message or domain
  const generateConversationTitle = (messages: Message[], domain: DomainId): string => {
    const firstUserMessage = messages.find(m => m.type === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '');
    }
    const domainNames: Record<DomainId, string> = {
      insurance: 'Insurance Chat',
      banking: 'Banking Chat',
      booking: 'Travel Booking Chat',
      healthcare: 'Healthcare Chat',
    };
    return domainNames[domain];
  };

  // Save current conversation state
  const saveCurrentConversation = () => {
    if (!activeConversationId || !selectedDomain) return;

    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversationId
          ? {
              ...conv,
              messages,
              steps,
              sidebarSections,
              currentFlowStepId,
              title: generateConversationTitle(messages, selectedDomain),
            }
          : conv
      )
    );
  };

  // Auto-save conversation when messages change
  useEffect(() => {
    if (activeConversationId && messages.length > 0 && selectedDomain) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversationId
            ? {
                ...conv,
                messages,
                steps,
                sidebarSections,
                currentFlowStepId,
                title: generateConversationTitle(messages, selectedDomain),
              }
            : conv
        )
      );
    }
  }, [messages, steps, sidebarSections, currentFlowStepId, activeConversationId, selectedDomain]);

  // Create new conversation
  const createNewConversation = (domain: DomainId) => {
    const domainConfig = domainConfigs[domain];
    const flow = flowConfigs[domain];
    
    const newConversation: Conversation = {
      id: Date.now().toString(),
      domain,
      title: generateConversationTitle([], domain),
      messages: [],
      steps: domainConfig.steps,
      sidebarSections: domainConfig.sidebarSections,
      currentFlowStepId: flow?.startStepId || null,
      timestamp: new Date(),
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setSelectedDomain(domain);
    setConfig(domainConfig);
    setMessages([]);
    setSteps(domainConfig.steps);
    setSidebarSections(domainConfig.sidebarSections);
    setFlowSteps(flow?.steps || []);
    setCurrentFlowStepId(flow?.startStepId || null);
  };

  // Load existing conversation
  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    setActiveConversationId(conversationId);
    setSelectedDomain(conversation.domain);
    setConfig(domainConfigs[conversation.domain]);
    setMessages(conversation.messages);
    setSteps(conversation.steps);
    setSidebarSections(conversation.sidebarSections);
    setCurrentFlowStepId(conversation.currentFlowStepId);
    setFlowSteps(flowConfigs[conversation.domain]?.steps || []);
    setSelectedPrimaryAction(null); // Reset primary action when switching conversations
    setExclusiveSelections({}); // Reset exclusive group selections when switching conversations
  };

  // Delete conversation
  const deleteConversation = (conversationId: string) => {
    const remainingConversations = conversations.filter(c => c.id !== conversationId);
    
    if (activeConversationId === conversationId) {
      // Load the next available conversation for the current domain or go back to selector
      const sameDomainConversations = remainingConversations.filter(c => c.domain === selectedDomain);
      
      if (sameDomainConversations.length > 0) {
        const nextConversation = sameDomainConversations[0];
        setActiveConversationId(nextConversation.id);
        setSelectedDomain(nextConversation.domain);
        setConfig(domainConfigs[nextConversation.domain]);
        setMessages(nextConversation.messages);
        setSteps(nextConversation.steps);
        setSidebarSections(nextConversation.sidebarSections);
        setCurrentFlowStepId(nextConversation.currentFlowStepId);
        setFlowSteps(flowConfigs[nextConversation.domain]?.steps || []);
      } else {
        // No more conversations for this domain, go back to domain selector
        setSelectedDomain(null);
        setActiveConversationId(null);
        setConfig(null);
        setMessages([]);
        setSteps([]);
        setSidebarSections([]);
        setCurrentFlowStepId(null);
        setFlowSteps([]);
      }
    }
    
    setConversations(remainingConversations);
    toast.success('Conversation deleted');
  };

  // Handle new chat
  const handleNewChat = () => {
    if (selectedDomain) {
      createNewConversation(selectedDomain);
      toast.success('New conversation started');
    }
  };

  // Initialize domain configuration and flow
  // FIXED: Added proper guards to prevent unwanted auto-initialization
  useEffect(() => {
    // Only initialize if:
    // 1. Domain is selected
    // 2. No active conversation exists
    // 3. No conversations exist for this domain yet (prevent re-initialization)
    if (!selectedDomain) return;
    
    const existingConversations = conversations.filter(c => c.domain === selectedDomain);
    
    // If we have existing conversations for this domain but no active one,
    // load the most recent instead of creating a new one
    if (existingConversations.length > 0 && !activeConversationId) {
      const mostRecent = existingConversations[0];
      setActiveConversationId(mostRecent.id);
      setConfig(domainConfigs[selectedDomain]);
      setMessages(mostRecent.messages);
      setSteps(mostRecent.steps);
      setSidebarSections(mostRecent.sidebarSections);
      setCurrentFlowStepId(mostRecent.currentFlowStepId);
      setFlowSteps(flowConfigs[selectedDomain]?.steps || []);
      return;
    }
    
    // Only create new conversation if none exists for this domain
    if (existingConversations.length === 0 && !activeConversationId) {
      const domainConfig = domainConfigs[selectedDomain];
      const flow = flowConfigs[selectedDomain];
      
      const newConversation: Conversation = {
        id: Date.now().toString(),
        domain: selectedDomain,
        title: generateConversationTitle([], selectedDomain),
        messages: [],
        steps: domainConfig.steps,
        sidebarSections: domainConfig.sidebarSections,
        currentFlowStepId: flow?.startStepId || null,
        timestamp: new Date(),
      };

      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);
      setConfig(domainConfig);
      setMessages([]);
      setSteps(domainConfig.steps);
      setSidebarSections(domainConfig.sidebarSections);
      setFlowSteps(flow?.steps || []);
      setCurrentFlowStepId(flow?.startStepId || null);
    }
  }, [selectedDomain, activeConversationId, conversations]);

  // Process flow steps automatically
  useEffect(() => {
    if (!currentFlowStepId || flowSteps.length === 0) return;

    const currentStep = flowSteps.find(step => step.id === currentFlowStepId);
    if (!currentStep) return;

    // Show typing indicator
    setIsTyping(true);

    // Delay before showing the bot message
    const timer = setTimeout(() => {
      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: currentStep.botMessage,
        timestamp: new Date(),
        quickReplies: currentStep.quickReplies,
        inputField: currentStep.inputField,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Update progress if defined
      if (currentStep.updateProgress) {
        setSteps(currentStep.updateProgress);
      }

      // Update sidebar if defined (with empty value for initial updates)
      if (currentStep.updateSidebar && !currentStep.inputField && !currentStep.quickReplies) {
        setSidebarSections(prev => currentStep.updateSidebar!(prev, ''));
      }

      // Auto-advance to next step if no user input required
      if (!currentStep.inputField && !currentStep.quickReplies && currentStep.nextStepId) {
        setTimeout(() => {
          setCurrentFlowStepId(typeof currentStep.nextStepId === 'string' ? currentStep.nextStepId : null);
        }, 500);
      }
    }, currentStep.delay || 500);

    return () => clearTimeout(timer);
  }, [currentFlowStepId, flowSteps]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleSendMessage = (content: string, attachments?: FileAttachment[]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      attachments: attachments && attachments.length > 0 ? attachments.map(att => ({
        id: att.id,
        name: att.name,
        size: att.size,
        type: att.type,
        url: att.url,
      })) : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Show toast for successful file attachments
    if (attachments && attachments.length > 0) {
      toast.success(`Message sent with ${attachments.length} file(s) attached`);
    }

    // Find current step and process user response
    const currentStep = flowSteps.find(step => step.id === currentFlowStepId);
    if (currentStep) {
      // Update sidebar if defined
      if (currentStep.updateSidebar) {
        setSidebarSections(prev => currentStep.updateSidebar!(prev, content));
      }

      // Determine next step
      let nextStepId: string | null = null;
      if (typeof currentStep.nextStepId === 'function') {
        nextStepId = currentStep.nextStepId(content);
      } else if (typeof currentStep.nextStepId === 'string') {
        nextStepId = currentStep.nextStepId;
      }

      // Move to next step
      if (nextStepId) {
        setTimeout(() => {
          setCurrentFlowStepId(nextStepId);
        }, 800);
      }
    }
  };

  const handleQuickReply = (reply: QuickReply) => {
    // If this is a primary action button, lock it in
    if (reply.isPrimaryAction) {
      setSelectedPrimaryAction(reply.value);
    }
    
    // If this belongs to an exclusive group, track the selection
    if (reply.exclusiveGroup) {
      setExclusiveSelections(prev => ({
        ...prev,
        [reply.exclusiveGroup!]: reply.value,
      }));
    }
    
    handleSendMessage(reply.value);
  };

  const handleInputSubmit = (fieldId: string, value: string) => {
    handleSendMessage(value);
  };

  const handleRestart = () => {
    if (config && selectedDomain && activeConversationId) {
      const flow = flowConfigs[selectedDomain];

      if (flow) {
        // Update current conversation with reset state
        setFlowSteps(flow.steps);
        setCurrentFlowStepId(flow.startStepId);
        setMessages([]);
        setSteps(config.steps);
        setSidebarSections(config.sidebarSections);
        setSelectedPrimaryAction(null); // Reset primary action selection
        setExclusiveSelections({}); // Reset all exclusive group selections
        
        // Update the conversation in the list
        setConversations(prev => 
          prev.map(conv => 
            conv.id === activeConversationId
              ? {
                  ...conv,
                  messages: [],
                  steps: config.steps,
                  sidebarSections: config.sidebarSections,
                  currentFlowStepId: flow.startStepId,
                  title: generateConversationTitle([], selectedDomain),
                }
              : conv
          )
        );
        
        toast.success('Conversation restarted');
      }
    }
  };

  const handleClose = () => {
    // Completely reset all state when closing
    setSelectedDomain(null);
    setConfig(null);
    setActiveConversationId(null);
    setMessages([]);
    setSteps([]);
    setSidebarSections([]);
    setCurrentFlowStepId(null);
    setFlowSteps([]);
    setIsTyping(false);
    setSelectedPrimaryAction(null);
    setExclusiveSelections({});
    setConversations([]); // Clear all conversations to ensure fresh start
    toast.info('Chat session ended');
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      )
    );
    toast.success('Message updated');
  };

  const handleVoiceInput = () => {
    setShowVoiceRecorder(true);
  };

  const handleVoiceTranscription = (transcription: string) => {
    setShowVoiceRecorder(false);
    handleSendMessage(transcription);
  };

  const handleSupportAgent = () => {
    setShowSupportAgent(true);
  };

  const handleConnectAgent = (agentName: string) => {
    // Add system message that agent has joined
    const systemMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: `🟢 ${agentName} has joined the conversation. You're now speaking with a human agent who can provide personalized assistance.`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  if (!selectedDomain || !config) {
    return <DomainSelector onSelectDomain={setSelectedDomain} />;
  }

  // Prepare conversation history for sidebar
  const conversationHistory: ConversationHistoryItem[] = conversations
    .filter(conv => conv.domain === selectedDomain) // Only show conversations for current domain
    .map(conv => ({
      id: conv.id,
      title: conv.title,
      domain: conv.domain,
      timestamp: conv.timestamp,
      messageCount: conv.messages.length,
      lastMessage: conv.messages[conv.messages.length - 1]?.content,
    }));

  return (
    <DomainThemeProvider themeName={config.themeName as any} primaryColor={config.primaryColor}>
      <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#0a0a0a]">
        {/* Chat History Sidebar - Desktop */}
        <div className="hidden h-full md:block">
          <ChatHistorySidebar
            conversations={conversationHistory}
            activeConversationId={activeConversationId}
            onSelectConversation={loadConversation}
            onNewConversation={handleNewChat}
            onDeleteConversation={deleteConversation}
            isCollapsed={isHistorySidebarCollapsed}
            onToggleCollapse={() => setIsHistorySidebarCollapsed(!isHistorySidebarCollapsed)}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex h-full flex-1 flex-col overflow-hidden">
          {/* Header */}
          <ChatHeader
            title={config.title}
            subtitle={config.subtitle}
            logo="🤖"
            primaryColor={config.primaryColor}
            onSupportClick={handleSupportAgent}
            onRestartClick={handleRestart}
            onCloseClick={handleClose}
            isOnline={true}
          />

          {/* Progress Tracker */}
          <ProgressTracker steps={steps} primaryColor={config.primaryColor} />

          {/* Main Content Area */}
          <div className="flex h-full flex-1 overflow-hidden">
            {/* Chat Messages Area */}
            <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-[#0f0f0f]">
              {/* Scrollable Messages Container */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea ref={scrollAreaRef} className="h-full w-full">
                  <div className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="mx-auto max-w-4xl space-y-3 sm:space-y-4 pb-4">
                      {messages.map((message) => (
                        <ChatMessage
                          key={message.id}
                          message={message}
                          primaryColor={config.primaryColor}
                          onQuickReplyClick={handleQuickReply}
                          onInputSubmit={handleInputSubmit}
                          onEdit={handleEditMessage}
                          selectedPrimaryAction={selectedPrimaryAction}
                          exclusiveSelections={exclusiveSelections}
                        />
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* Fixed Input Area - Always Visible at Bottom */}
              <div className="flex-shrink-0 border-t dark:border-white/10 bg-white dark:bg-[#1a1a1a] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
                <MessageInput
                  primaryColor={config.primaryColor}
                  onSendMessage={handleSendMessage}
                  onAttachment={() => console.log('Attachment clicked')}
                  onVoiceInput={handleVoiceInput}
                  isTyping={isTyping}
                  domain={selectedDomain}
                  sidebarSections={sidebarSections}
                  expectedInput={
                    currentFlowStepId 
                      ? flowSteps.find(step => step.id === currentFlowStepId)?.inputField
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Right Sidebar - Desktop */}
            <div className="hidden h-full w-80 xl:w-96 lg:block">
              <SidebarPanel
                sections={sidebarSections}
                primaryColor={config.primaryColor}
                onExport={() => toast.success('PDF export would be generated here')}
              />
            </div>

            {/* Right Sidebar - Mobile (Sheet) */}
            <div className="lg:hidden">
              <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="fixed bottom-20 right-4 h-12 w-12 rounded-full shadow-lg"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full p-0 sm:max-w-md">
                  <SidebarPanel
                    sections={sidebarSections}
                    primaryColor={config.primaryColor}
                    onExport={() => toast.success('PDF export would be generated here')}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Chat History Sidebar - Mobile (Sheet) */}
        <div className="md:hidden">
          <Sheet open={isMobileHistoryOpen} onOpenChange={setIsMobileHistoryOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="fixed bottom-20 left-4 h-12 w-12 rounded-full shadow-lg"
              >
                <MessageSquare className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full p-0 sm:max-w-md">
              <div className="h-full">
                <ChatHistorySidebar
                  conversations={conversationHistory}
                  activeConversationId={activeConversationId}
                  onSelectConversation={(id) => {
                    loadConversation(id);
                    setIsMobileHistoryOpen(false);
                  }}
                  onNewConversation={() => {
                    handleNewChat();
                    setIsMobileHistoryOpen(false);
                  }}
                  onDeleteConversation={deleteConversation}
                  isCollapsed={false}
                  onToggleCollapse={() => {}}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Toaster />

        {/* Voice Recorder Modal */}
        {showVoiceRecorder && (
          <VoiceRecorder
            onTranscription={handleVoiceTranscription}
            onClose={() => setShowVoiceRecorder(false)}
            primaryColor={config.primaryColor}
          />
        )}

        {/* Support Agent Modal */}
        {showSupportAgent && selectedDomain && (
          <SupportAgent
            onClose={() => setShowSupportAgent(false)}
            onConnect={handleConnectAgent}
            domain={selectedDomain}
            primaryColor={config.primaryColor}
          />
        )}
      </div>
    </DomainThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}