import { useState, useEffect } from 'react';
import { Headphones, User, Phone, Mail, MessageCircle, X, Circle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { DomainId } from '../config/domains';
import { toast } from 'sonner';

interface SupportAgentProps {
  onClose: () => void;
  onConnect: (agentName: string) => void;
  domain: DomainId;
  primaryColor?: string;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  specialization: string;
  rating: number;
  responseTime: string;
}

const domainAgents: Record<DomainId, Agent[]> = {
  insurance: [
    {
      id: 'ins-1',
      name: 'Sarah Martinez',
      role: 'Claims Adjuster',
      avatar: '👩‍💼',
      status: 'online',
      specialization: 'Auto & Property Claims',
      rating: 4.9,
      responseTime: '< 2 min',
    },
    {
      id: 'ins-2',
      name: 'Michael Chen',
      role: 'Senior Adjuster',
      avatar: '👨‍💼',
      status: 'online',
      specialization: 'Complex Claims & Appeals',
      rating: 4.8,
      responseTime: '< 3 min',
    },
    {
      id: 'ins-3',
      name: 'Emma Johnson',
      role: 'Claims Specialist',
      avatar: '👩‍💻',
      status: 'busy',
      specialization: 'Health & Life Insurance',
      rating: 4.7,
      responseTime: '< 5 min',
    },
  ],
  banking: [
    {
      id: 'bank-1',
      name: 'David Williams',
      role: 'Banking Advisor',
      avatar: '👨‍💼',
      status: 'online',
      specialization: 'Accounts & Transfers',
      rating: 4.9,
      responseTime: '< 1 min',
    },
    {
      id: 'bank-2',
      name: 'Lisa Anderson',
      role: 'Financial Specialist',
      avatar: '👩‍💼',
      status: 'online',
      specialization: 'Loans & Investments',
      rating: 4.8,
      responseTime: '< 2 min',
    },
    {
      id: 'bank-3',
      name: 'Robert Taylor',
      role: 'Senior Advisor',
      avatar: '👨‍💻',
      status: 'busy',
      specialization: 'Business Banking',
      rating: 4.9,
      responseTime: '< 4 min',
    },
  ],
  booking: [
    {
      id: 'book-1',
      name: 'Jessica Brown',
      role: 'Travel Consultant',
      avatar: '👩‍✈️',
      status: 'online',
      specialization: 'Flight & Hotel Bookings',
      rating: 4.9,
      responseTime: '< 2 min',
    },
    {
      id: 'book-2',
      name: 'Alex Turner',
      role: 'Senior Travel Agent',
      avatar: '👨‍✈️',
      status: 'online',
      specialization: 'Package Deals & Groups',
      rating: 4.8,
      responseTime: '< 3 min',
    },
    {
      id: 'book-3',
      name: 'Maria Garcia',
      role: 'Booking Specialist',
      avatar: '👩‍💼',
      status: 'busy',
      specialization: 'International Travel',
      rating: 4.7,
      responseTime: '< 5 min',
    },
  ],
  healthcare: [
    {
      id: 'health-1',
      name: 'Dr. Emily White',
      role: 'Patient Coordinator',
      avatar: '👩‍⚕️',
      status: 'online',
      specialization: 'Appointments & Records',
      rating: 4.9,
      responseTime: '< 2 min',
    },
    {
      id: 'health-2',
      name: 'James Wilson',
      role: 'Healthcare Advisor',
      avatar: '👨‍⚕️',
      status: 'online',
      specialization: 'Insurance & Billing',
      rating: 4.8,
      responseTime: '< 3 min',
    },
    {
      id: 'health-3',
      name: 'Sophia Lee',
      role: 'Medical Support',
      avatar: '👩‍💼',
      status: 'busy',
      specialization: 'Specialist Referrals',
      rating: 4.7,
      responseTime: '< 5 min',
    },
  ],
};

export function SupportAgent({ onClose, onConnect, domain, primaryColor = '#3b82f6' }: SupportAgentProps) {
  const [agents, setAgents] = useState<Agent[]>(domainAgents[domain] || []);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Helper function to convert hex to rgb with opacity
  const hexToRgba = (hex: string, alpha: number = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleConnect = async (agent: Agent) => {
    if (agent.status === 'offline') {
      toast.error('This agent is currently offline');
      return;
    }

    setSelectedAgent(agent);
    setIsConnecting(true);

    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsConnecting(false);
    toast.success(`Connected to ${agent.name}`);
    onConnect(agent.name);
    onClose();
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'online':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div 
          className="rounded-t-2xl px-6 py-4"
          style={{ backgroundColor: hexToRgba(primaryColor, 0.05) }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: hexToRgba(primaryColor, 0.1) }}
              >
                <Headphones className="h-5 w-5" style={{ color: primaryColor }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Connect with Support</h3>
                <p className="text-sm text-gray-600">Speak with a real person for personalized assistance</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[600px] overflow-y-auto p-6">
          {/* Info Banner */}
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 flex-shrink-0 text-blue-600" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Need human assistance?</p>
                <p className="mt-1 text-blue-700">
                  Our support team is available to help you with complex inquiries or if you prefer speaking with a person.
                </p>
              </div>
            </div>
          </div>

          {/* Agents List */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Available Agents</h4>
            
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`group rounded-xl border-2 p-4 transition-all ${
                  selectedAgent?.id === agent.id
                    ? 'border-opacity-100 shadow-md'
                    : 'border-transparent hover:border-opacity-50 hover:shadow-sm'
                } ${agent.status === 'offline' ? 'opacity-60' : ''}`}
                style={{
                  borderColor: selectedAgent?.id === agent.id ? primaryColor : 'transparent',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                        {agent.avatar}
                      </div>
                      <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(agent.status)}`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-semibold text-gray-900">{agent.name}</h5>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {agent.role}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{agent.specialization}</p>
                      
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Circle className={`h-2 w-2 ${getStatusColor(agent.status)}`} />
                          <span>{getStatusText(agent.status)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{agent.responseTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{agent.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connect Button */}
                  <Button
                    size="sm"
                    disabled={agent.status === 'offline' || (isConnecting && selectedAgent?.id === agent.id)}
                    onClick={() => handleConnect(agent)}
                    className="gap-2"
                    style={{ 
                      backgroundColor: agent.status === 'offline' ? undefined : primaryColor,
                    }}
                  >
                    {isConnecting && selectedAgent?.id === agent.id ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Options */}
          <div className="mt-6 rounded-lg border bg-gray-50 p-4">
            <h4 className="mb-3 text-sm font-semibold text-gray-700">Other Contact Options</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              <button className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100">
                <Mail className="h-4 w-4" />
                Email Support
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100">
                <Phone className="h-4 w-4" />
                Call Us: 1-800-SUPPORT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
