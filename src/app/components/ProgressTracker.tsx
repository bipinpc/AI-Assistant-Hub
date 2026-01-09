import { Check } from 'lucide-react';
import { ProgressStep } from '../config/domains';
import { cn } from './ui/utils';

interface ProgressTrackerProps {
  steps: ProgressStep[];
  primaryColor?: string;
}

export function ProgressTracker({ steps, primaryColor = '#3b82f6' }: ProgressTrackerProps) {
  // Helper function to convert hex to rgb with opacity
  const hexToRgba = (hex: string, alpha: number = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="border-b bg-gray-50 dark:bg-[#1a1a1a] dark:border-white/10 px-4 sm:px-6 py-3 sm:py-4 overflow-x-auto">
      <div className="flex items-center justify-between min-w-max sm:min-w-0">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-colors',
                  step.status === 'upcoming' && 'border-gray-300 dark:border-white/20 bg-white dark:bg-[#2a2a2a] text-gray-400'
                )}
                style={
                  step.status === 'completed'
                    ? { borderColor: '#10b981', backgroundColor: '#10b981', color: 'white' }
                    : step.status === 'current'
                    ? { borderColor: primaryColor, backgroundColor: primaryColor, color: 'white' }
                    : undefined
                }
              >
                {step.status === 'completed' ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <span className="text-xs sm:text-sm">{index + 1}</span>
                )}
              </div>
              <div className="mt-1.5 sm:mt-2 text-center">
                <div
                  className={cn(
                    'text-[10px] sm:text-xs font-medium whitespace-nowrap',
                    step.status === 'completed' && 'text-green-600 dark:text-green-400',
                    step.status === 'upcoming' && 'text-gray-500 dark:text-gray-400'
                  )}
                  style={step.status === 'current' ? { color: primaryColor } : undefined}
                >
                  {step.label}
                </div>
                {step.sublabel && (
                  <div className="hidden sm:block text-xs text-gray-400 dark:text-gray-500">{step.sublabel}</div>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-1.5 sm:mx-2 h-0.5 flex-1 transition-colors min-w-[20px] sm:min-w-[40px]',
                  step.status === 'upcoming' && 'bg-gray-300 dark:bg-white/20'
                )}
                style={
                  step.status === 'completed'
                    ? { backgroundColor: '#10b981' }
                    : undefined
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}