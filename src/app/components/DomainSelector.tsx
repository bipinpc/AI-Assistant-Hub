import { Building2, Bot, Landmark, Plane, Stethoscope, ArrowRight, Sparkles, CheckCircle2, User, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { DomainId, domainConfigs } from '../config/domains';
import { ThemeToggle } from './ThemeToggle';
import { Footer } from './Footer';

interface DomainSelectorProps {
  onSelectDomain: (domain: DomainId) => void;
}

const domains = [
  {
    id: 'insurance' as DomainId,
    name: 'Insurance Claims',
    description: 'File and manage insurance claims with AI-powered assistance',
    icon: Bot,
    theme: 'blue-theme',
    version: "1.0.0",
    active: true,
    author: "Insurance Claims Solutions",
    license: "MIT",
    dependencies: {
        "some-insurance-api-client": "^2.3.4",
        "another-dependency": "^5.6.7",
    },
    features: ['Auto damage assessment', 'Document processing', 'Real-time estimates'],
    statLabel: '3-5 min',
    statValue: 'Avg. time',
    assistant_url: 'https://insurance-assistant.claims.com/api',
    
  },
  {
    id: 'banking' as DomainId,
    name: 'Banking Services',
    description: 'Access account services, loans, and fraud protection',
    icon: Landmark,
    theme: 'green-theme',
    version: "1.0.0",
    active: true,
    author: "Fintech Solutions",
    license: "MIT",
    dependencies: {
        "some-banking-api-client": "^2.3.4",
        "another-dependency": "^5.6.7",
    },
    features: ['Account management', 'Loan applications', 'Fraud detection'],
    statLabel: '24/7',
    statValue: 'Available',
    assistant_url: 'https://banking-assistant.finance.com/api',
  },
  {
    id: 'booking' as DomainId,
    name: 'Travel Booking',
    description: 'Book flights, hotels, and manage your travel plans',
    icon: Plane,
    theme: 'purple-theme',
    version: "1.0.0",
    active: true,
    author: "Travel Booking Inc.",
    license: "MIT",
    dependencies: {
        "some-travel-api-client": "^2.3.4",
        "another-dependency": "^5.6.7",
    },
    features: ['Flight search', 'Hotel booking', 'Trip management'],
    statLabel: '100k+',
    statValue: 'Destinations',
    assistant_url: 'https://travel-assistant.booking.com/api',
  },
  {
    id: 'healthcare' as DomainId,
    name: 'Healthcare Assistant',
    description: 'Schedule appointments, check symptoms, and manage prescriptions',
    icon: Stethoscope,
   theme: 'red-theme',
    version: "1.0.0",
    active: true,
    author: "Healthcare Solutions",
    license: "MIT",
    dependencies: {
        "some-healthcare-api-client": "^2.3.4",
        "another-dependency": "^5.6.7",
    },
    
    features: ['Appointment scheduling', 'Symptom checker', 'Prescription refills'],
    statLabel: '1-2 hr',
    statValue: 'Response time',
    assistant_url: 'https://healthcare-assistant.med.com/api',
  },
];

export function DomainSelector({ onSelectDomain }: DomainSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0a0a0a] dark:via-[#0f0f0f] dark:to-[#0a0a0a]">
      {/* Hero Section - Static (no animation) */}
      <div className="border-b bg-white dark:bg-[#1a1a1a] dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Left Side: Product Logo + Title */}
            <div className="flex items-center gap-3">
              {/* Product Logo */}
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>

              {/* Title and Subtitle */}
              <div className="leading-none">
                <div className="mb-0.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                  <h1 className="text-base sm:text-lg font-bold leading-none tracking-tight text-gray-900 dark:text-white">
                    AI Assistant Hub
                  </h1>
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Powered by AI</span>
                  </div>
                </div>
                <p className="leading-tight text-xs text-gray-600 dark:text-gray-400">
                  Select a domain to start your intelligent conversation
                </p>
              </div>
            </div>

            {/* Right Side: User Profile + Theme Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
              <ThemeToggle />
              
              {/* Enhanced Profile Section */}
              <div className="group relative flex items-center gap-2.5 rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 dark:from-purple-900/20 dark:via-blue-900/10 dark:to-purple-900/20 px-2.5 sm:px-3 py-1.5 border-2 border-blue-200/50 dark:border-purple-500/30 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
                {/* Gradient Avatar with Ring */}
                <div className="relative">
                  {/* Animated Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 animate-spin-slow opacity-75 blur-sm"></div>
                  
                  {/* Avatar Container */}
                  <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 shadow-lg ring-2 ring-white dark:ring-gray-900 transform group-hover:scale-110 transition-transform duration-300">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white drop-shadow-sm" />
                  </div>
                  
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900 shadow-sm">
                    <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
                  </div>
                </div>
                
                {/* User Info */}
                <div className="flex flex-col leading-none">
                  <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 dark:from-blue-300 dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent">
                    John Smith
                  </span>
                </div>
                
                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={() => console.log('Logout')}
                aria-label="Logout"
                className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-br from-red-50 via-orange-50 to-red-50 dark:from-red-900/20 dark:via-orange-900/10 dark:to-red-900/20 px-2.5 sm:px-3 py-1.5 border-2 border-red-200/50 dark:border-red-500/30 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.05] active:scale-[0.95] overflow-hidden"
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/20 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon Container with Gradient */}
                <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 via-orange-500 to-red-600 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:rotate-12">
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white drop-shadow-sm" />
                </div>
                
                {/* Optional: Text Label (Hidden on mobile) */}
                <span className="hidden md:block text-xs font-bold bg-gradient-to-r from-red-700 via-orange-700 to-red-700 dark:from-red-300 dark:via-orange-300 dark:to-red-300 bg-clip-text text-transparent">
                  Logout
                </span>
                
                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Cards Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="mb-1 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Choose Your Assistant</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Select the service that best matches your needs</p>
        </div>
        
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            const theme = domainConfigs[domain.id].theme;
            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`group cursor-pointer border-2 transition-all hover:shadow-xl hover:border-opacity-100 dark:bg-[#1a1a1a] dark:border-white/10 ${theme.borderDark} ${theme.border} border-opacity-0 hover:${theme.border}`}
                  onClick={() => onSelectDomain(domain.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`rounded-lg sm:rounded-xl ${theme.bg} ${theme.bgDark} ${theme.bgHover} ${theme.bgHoverDark} p-2 sm:p-3 transition-colors`}>
                          <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${theme.text} ${theme.textDark}`} />
                        </div>
                        <div>
                          <CardTitle className="mb-0.5 text-base sm:text-lg dark:text-white">{domain.name}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm dark:text-gray-400">{domain.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-2 sm:space-y-3">
                    {/* Features List */}
                    <div className="space-y-1 sm:space-y-1.5 h-[115px] overflow-auto">
                      {domain.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle2 className={`h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 ${theme.text} ${theme.textDark}`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stat Badge */}
                    <div className={`rounded-lg ${theme.bg} ${theme.bgDark} p-2 sm:p-2.5`}>
                      <div className={`text-sm sm:text-base font-semibold ${theme.text} ${theme.textDark}`}>
                        {domain.statLabel}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {domain.statValue}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      className="w-full gap-2 group-hover:gap-3 transition-all text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg" 
                      onClick={() => onSelectDomain(domain.id)}
                    >
                      Start Conversation
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
}