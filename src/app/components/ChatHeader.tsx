import { Menu, RotateCcw, X, Circle, Headphones } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';

interface ChatHeaderProps {
  title: string;
  subtitle: string;
  logo?: string;
  primaryColor?: string;
  onMenuClick?: () => void;
  onRestartClick?: () => void;
  onCloseClick?: () => void;
  onSupportClick?: () => void;
  isOnline?: boolean;
}

export function ChatHeader({
  title,
  subtitle,
  logo,
  primaryColor = '#3b82f6',
  onMenuClick,
  onRestartClick,
  onCloseClick,
  onSupportClick,
  isOnline = true,
}: ChatHeaderProps) {
  // Helper function to convert hex to rgb with opacity
  const hexToRgba = (hex: string, alpha: number = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="border-b bg-white dark:bg-[#1a1a1a] dark:border-white/10 px-4 sm:px-6 py-2.5 sm:py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {logo && (
            <div 
              className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-lg text-base sm:text-lg"
              style={{ backgroundColor: hexToRgba(primaryColor, 0.1) }}
            >
              <span style={{ color: primaryColor }}>{logo}</span>
            </div>
          )}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm sm:text-base font-semibold leading-tight text-gray-900 dark:text-white truncate">{title}</h1>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
            </div>
            {isOnline && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-500/20 px-2.5 py-1 flex-shrink-0">
                <Circle 
                  className="h-1.5 w-1.5 fill-current text-green-500 dark:text-green-400" 
                />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">Online</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={onMenuClick}
              aria-label="Menu"
            >
              <Menu className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
          <ThemeToggle />
          {onSupportClick && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={onSupportClick}
              aria-label="Connect to Support"
            >
              <Headphones className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
          {onRestartClick && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={onRestartClick}
              aria-label="Restart conversation"
            >
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
          {onCloseClick && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={onCloseClick}
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}