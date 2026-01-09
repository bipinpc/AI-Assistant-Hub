# AI Chat Board Panel - Configuration Guide

## Overview

This AI Chat Board Panel is a fully configurable, domain-agnostic chatbot interface that can be customized for different use cases through JSON-based configuration.

## Domain Configuration Structure

Each domain configuration includes:

### 1. Basic Information
- `id`: Unique identifier for the domain
- `name`: Display name
- `title`: Chat header title
- `subtitle`: Current stage/status subtitle
- `primaryColor`: Theme color for the domain
- `logo`: Optional logo or icon

### 2. Progress Steps
Define the journey stages:
```typescript
steps: [
  {
    id: 'step-id',
    label: 'Step Name',
    sublabel: 'Optional subtitle',
    status: 'completed' | 'current' | 'upcoming'
  }
]
```

### 3. Initial Messages
Messages displayed when the conversation starts:
```typescript
initialMessages: [
  {
    id: 'unique-id',
    type: 'bot' | 'user',
    content: 'Message text',
    timestamp: new Date(),
    quickReplies?: [...],  // Optional quick reply buttons
    inputField?: {...}      // Optional input field
  }
]
```

### 4. Sidebar Sections
Real-time information panel:
```typescript
sidebarSections: [
  {
    id: 'section-id',
    title: 'Section Title',
    icon: 'lucide-icon-name',
    badge: {
      label: 'STATUS',
      variant: 'default' | 'success' | 'warning' | 'error'
    },
    fields: [
      {
        label: 'Field Label',
        value: 'Current value',
        editable: true  // Optional
      }
    ],
    collapsible: true,
    defaultOpen: true
  }
]
```

## Adding a New Domain

### Example: E-commerce Support

```typescript
export const ecommerceConfig: DomainConfig = {
  id: 'ecommerce',
  name: 'E-commerce',
  title: 'Shopping Assistant',
  subtitle: 'Product Search',
  primaryColor: '#f59e0b',
  
  steps: [
    { id: 'search', label: 'Search', status: 'current' },
    { id: 'select', label: 'Select', status: 'upcoming' },
    { id: 'cart', label: 'Cart', status: 'upcoming' },
    { id: 'checkout', label: 'Checkout', status: 'upcoming' },
    { id: 'confirm', label: 'Confirm', status: 'upcoming' },
  ],
  
  initialMessages: [
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m your Shopping Assistant. What are you looking for today?',
      timestamp: new Date(),
      quickReplies: [
        { id: '1', label: 'Electronics', value: 'electronics' },
        { id: '2', label: 'Clothing', value: 'clothing' },
        { id: '3', label: 'Home & Garden', value: 'home' },
      ],
    },
  ],
  
  sidebarSections: [
    {
      id: 'cart',
      title: 'Shopping Cart',
      icon: 'shopping-cart',
      fields: [
        { label: 'Items', value: '0' },
        { label: 'Subtotal', value: '$0.00' },
        { label: 'Shipping', value: 'TBD' },
        { label: 'Total', value: '$0.00' },
      ],
      defaultOpen: true,
    },
  ],
  
  conversationFlow: {},
};

// Then add it to domainConfigs:
export const domainConfigs = {
  insurance: insuranceConfig,
  banking: bankingConfig,
  booking: bookingConfig,
  healthcare: healthcareConfig,
  ecommerce: ecommerceConfig,  // Add new domain
};
```

## Message Types

### Quick Replies
Pill-shaped buttons for common responses:
```typescript
quickReplies: [
  { id: '1', label: 'Yes', value: 'yes' },
  { id: '2', label: 'No', value: 'no' },
]
```

### Input Fields
Inline input prompts:
```typescript
inputField: {
  id: 'field-id',
  type: 'text' | 'email' | 'date' | 'tel' | 'number' | 'file' | 'textarea',
  label: 'Field Label',
  placeholder: 'Hint text',
  required: true,
  validation: 'regex-pattern'  // Optional
}
```

## Available Icons

Use any Lucide React icon name:
- `clipboard`
- `dollar-sign`
- `clock`
- `file-text`
- `circle-alert`
- `user`
- `calendar`
- `building-2`
- `landmark`
- `plane`
- `stethoscope`

See [Lucide Icons](https://lucide.dev/icons/) for the full list.

## Customization Tips

1. **Color Scheme**: Update `primaryColor` to match your brand
2. **Steps**: Adjust based on your workflow (3-6 steps recommended)
3. **Initial Messages**: Start with 1-2 messages to avoid overwhelming users
4. **Sidebar**: Show only the most relevant information
5. **Quick Replies**: Limit to 3-4 options for best UX

## Real-time Updates

Update sidebar sections dynamically as the conversation progresses by modifying the `sidebarSections` array in your state management.

## Form Mode (Future Enhancement)

The design supports switching between conversational and form modes. Implement by:
1. Creating a form view component
2. Adding a toggle button in the header
3. Syncing data between chat and form views
