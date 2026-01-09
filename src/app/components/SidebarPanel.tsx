import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SidebarSection } from '../config/domains';
import { cn } from './ui/utils';

interface SidebarPanelProps {
  sections: SidebarSection[];
  primaryColor?: string;
  onFieldEdit?: (sectionId: string, fieldLabel: string, newValue: string) => void;
  onExport?: () => void;
}

// SVG Icon Components
const IconClipboard = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const IconDollarSign = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconClock = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconFileText = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconCircleAlert = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconUser = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconCalendar = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconShield = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconInfo = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconDownload = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const IconPencil = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const IconCircleCheck = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconExternalLink = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const IconTrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const IconPaperclip = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const IconDocument = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const IconCreditCard = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const IconPlane = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

const IconBriefcase = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconHome = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconBuilding = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const IconPackage = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const iconMap: Record<string, any> = {
  clipboard: IconClipboard,
  'dollar-sign': IconDollarSign,
  clock: IconClock,
  'file-text': IconFileText,
  'alert-circle': IconCircleAlert,
  user: IconUser,
  calendar: IconCalendar,
  shield: IconShield,
  info: IconInfo,
  paperclip: IconPaperclip,
  document: IconDocument,
  'credit-card': IconCreditCard,
  plane: IconPlane,
  briefcase: IconBriefcase,
  'check-circle': IconCircleCheck,
  home: IconHome,
  building: IconBuilding,
  package: IconPackage,
};

// Custom Badge component for sidebar
const CustomBadge = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-1 text-xs font-medium', className)}>
      {children}
    </span>
  );
};

const badgeVariants: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700 border border-gray-200',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  error: 'bg-red-50 text-red-700 border border-red-200',
};

export function SidebarPanel({ 
  sections, 
  primaryColor = '#3b82f6',
  onFieldEdit, 
  onExport 
}: SidebarPanelProps) {
  // ✅ All collapsible sections start collapsed by default
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(
      sections
        .filter((s) => s.collapsible)
        .map((s) => s.id)
    )
  );

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const totalFields = sections.reduce((acc, section) => acc + section.fields.length, 0);
    const filledFields = sections.reduce(
      (acc, section) => 
        acc + section.fields.filter(f => f.value && String(f.value) !== 'Not provided').length,
      0
    );
    return Math.round((filledFields / totalFields) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="flex h-full flex-col overflow-hidden border-l bg-gradient-to-br from-gray-50 to-white dark:from-[#0a0a0a] dark:to-[#0f0f0f] dark:border-white/10">
      {/* Enhanced Header with Progress */}
      <div className="flex-shrink-0 border-b bg-white dark:bg-[#1a1a1a] px-4 sm:px-6 py-4 sm:py-5 shadow-sm dark:border-white/10">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: hexToRgba(primaryColor, 0.1) }}
              >
                <IconInfo className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: primaryColor }} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Information Panel</h2>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Session details</p>
              </div>
            </div>
            {onExport && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onExport}
                className="hover:bg-gray-100 dark:hover:bg-white/10 h-8 sm:h-9"
              >
                <IconDownload className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600 dark:text-gray-400">Information Collected</span>
              <span className="font-semibold" style={{ color: primaryColor }}>
                {completionPercentage}%
              </span>
            </div>
            <div className="h-1.5 sm:h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-[#2a2a2a]">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${completionPercentage}%`,
                  backgroundColor: primaryColor 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {sections.map((section) => {
            const Icon = section.icon ? iconMap[section.icon] : IconFileText;
            const isCollapsed = collapsedSections.has(section.id);

            return (
              <Card 
                key={section.id} 
                className="overflow-hidden border border-gray-200 dark:border-white/10 dark:bg-[#1a1a1a] shadow-sm transition-all hover:shadow-md dark:hover:border-white/20"
              >
                <CardHeader
                  className={cn(
                    'cursor-pointer transition-colors bg-white dark:bg-[#1a1a1a]',
                    section.collapsible ? 'hover:bg-gray-50 dark:hover:bg-[#222222]' : ''
                  )}
                  onClick={() => section.collapsible && toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div 
                        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: hexToRgba(primaryColor, 0.1) }}
                      >
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: primaryColor }} />
                      </div>
                      <CardTitle className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {section.badge && (
                        <CustomBadge
                          className={cn(
                            'border dark:bg-[#2a2a2a] dark:border-white/10 dark:text-gray-300 text-[10px] sm:text-xs',
                            badgeVariants[section.badge.variant]
                          )}
                        >
                          {section.badge.label}
                        </CustomBadge>
                      )}
                      {section.collapsible && (
                        <div className="text-gray-400">
                          {isCollapsed ? (
                            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {!isCollapsed && (
                  <CardContent className="space-y-2 sm:space-y-2.5 bg-gray-50/50 dark:bg-[#0f0f0f] pt-0">
                    {section.fields.map((field, index) => (
                      <div 
                        key={index}
                        className="rounded-lg bg-white dark:bg-[#2a2a2a] p-2.5 sm:p-3 shadow-sm transition-shadow hover:shadow"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="mb-0.5 sm:mb-1 text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
                              {field.label}
                            </div>
                            <div className="flex items-center gap-2">
                              <div 
                                className={cn(
                                  "text-xs sm:text-sm break-words",
                                  field.highlight 
                                    ? "font-semibold"
                                    : field.bold
                                    ? "font-medium text-gray-900 dark:text-gray-200"
                                    : "text-gray-700 dark:text-gray-300"
                                )}
                                style={field.highlight ? { color: primaryColor } : undefined}
                              >
                                {field.value}
                              </div>
                            </div>
                          </div>
                          {field.editable && onFieldEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 hover:bg-gray-100 dark:hover:bg-white/10"
                              onClick={() =>
                                onFieldEdit(
                                  section.id,
                                  field.label,
                                  String(field.value)
                                )
                              }
                            >
                              <IconPencil className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 dark:text-gray-400" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* Enhanced Coverage/Status Indicator */}
          {sections.some((s) => s.id === 'claim') && (
            <Card className="overflow-hidden border-2 shadow-sm dark:bg-[#1a1a1a]" style={{ borderColor: '#10b981' }}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div 
                    className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: '#10b981' }}
                  >
                    <IconCircleCheck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                      Coverage Verified
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                      All requirements met
                    </div>
                  </div>
                  <IconShield className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Action Button */}
          <Button 
            variant="outline" 
            className="w-full justify-between border-gray-300 dark:border-white/10 bg-white dark:bg-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#333333] dark:text-gray-200 text-xs sm:text-sm" 
            size="sm"
          >
            <span className="font-medium">View Full Details</span>
            <IconExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>

          {/* Info Footer */}
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-2.5 sm:p-3">
            <div className="flex items-start gap-1.5 sm:gap-2">
              <IconTrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-gray-400 mt-0.5" />
              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Information updates in real-time as you provide details through the conversation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}