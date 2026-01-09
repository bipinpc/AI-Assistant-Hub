# AI Chat Board Panel

A generic, configurable AI Chat Board Panel that dynamically adapts to multiple domains (Banking, Insurance, Booking, Healthcare) using JSON-based configuration.

## Features

- 🎨 **Multi-Domain Support**: Pre-configured for Banking, Insurance, Travel Booking, and Healthcare
- 💬 **Conversational AI**: Modern chatbot interface with bot/user messages and quick replies
- 📊 **Real-time Information Panel**: Dynamic sidebar that updates as users provide information
- 🎯 **Progress Tracking**: Visual progress indicator showing conversation flow
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- 🌓 **Dark Mode**: Complete light and dark theme support with WCAG-compliant colors
- 🎤 **Voice Input**: Record voice messages with microphone support
- 📎 **File Attachments**: Upload and manage files with domain-specific configurations
- 📅 **Smart Date Validation**: Timezone-aware date picker with validation
- 🔄 **Chat History**: Navigate through previous conversations
- 👨‍💼 **Support Agent Connection**: Connect to domain-specific support agents
- ♿ **Accessible**: Built with accessibility in mind (WCAG 2.1 AA compliant)

## Tech Stack

- **React 18.3** - UI library
- **TypeScript 5.7** - Type safety
- **Vite 6.3** - Build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Motion (Framer Motion)** - Animation library
- **Lucide React** - Icon library
- **date-fns** - Date manipulation
- **Sonner** - Toast notifications

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or **pnpm** 8.x / **yarn** 1.22.x)

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-chat-board-panel
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Type Checking

Run TypeScript type checking:
```bash
npm run type-check
```

## Project Structure

```
ai-chat-board-panel/
├── src/
│   ├── app/
│   │   ├── components/          # React components
│   │   │   ├── ui/              # Reusable UI components
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── ProgressTracker.tsx
│   │   │   ├── SidebarPanel.tsx
│   │   │   ├── ChatHistorySidebar.tsx
│   │   │   ├── DomainSelector.tsx
│   │   │   └── ...
│   │   ├── config/              # Domain configurations
│   │   │   └── domains.ts
│   │   └── App.tsx              # Main app component
│   ├── styles/
│   │   ├── fonts.css            # Font imports
│   │   └── theme.css            # Tailwind theme & custom styles
│   └── main.tsx                 # Application entry point
├── index.html                   # HTML entry point
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Available Domains

The application comes pre-configured with 4 domains:

1. **Insurance Claims** - File and manage insurance claims with AI assistance
2. **Banking Services** - Manage accounts, transfers, and financial transactions
3. **Travel Booking** - Book hotels, flights, and complete travel packages
4. **Healthcare Assistant** - Schedule appointments and access medical services

## Configuration

Each domain can be configured with:
- Custom branding colors
- Conversation flow steps
- Input validation rules
- Quick reply options
- Sidebar information panels
- Progress tracking milestones

See `src/app/config/domains.ts` for domain configuration examples.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

This application follows WCAG 2.1 Level AA guidelines:
- Keyboard navigation support
- Screen reader compatibility
- High contrast color ratios
- Focus indicators
- Semantic HTML structure

## License

Proprietary - All rights reserved

## Support

For questions or issues, please contact the development team.
