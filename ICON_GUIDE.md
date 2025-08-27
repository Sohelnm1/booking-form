# Icon Guide - HospiPal Booking Website

## Lucide React Icons Library

We're using **Lucide React** for professional, consistent icons throughout the application.

### Installation

```bash
npm install lucide-react
```

### Usage

```jsx
import { Phone, Mail, Shield, Heart } from 'lucide-react';

// Basic usage
<Phone size={24} color="#1890ff" />

// With custom styling
<Shield
  size={20}
  style={{ color: '#52c41a', transition: 'all 0.2s ease' }}
/>
```

## Commonly Used Icons

### Navigation & Actions

-   `Home` - Home page
-   `BookOpen` - Booking, services
-   `Calendar` - Appointments, bookings
-   `User` - Profile, user account
-   `LogIn` - Sign in
-   `LogOut` - Sign out
-   `Menu` - Hamburger menu
-   `Search` - Search functionality

### Communication

-   `Phone` - Phone number
-   `Mail` - Email
-   `MessageCircle` - Chat, messaging
-   `Send` - Send message

### Trust & Security

-   `Shield` - Security, protection
-   `CheckCircle` - Success, verification
-   `Lock` - Security, privacy
-   `Zap` - Fast, instant

### Healthcare & Support

-   `Heart` - Care, compassion
-   `Users` - People, community
-   `UserCheck` - Verified users
-   `HandHeart` - Care, support
-   `MapPin` - Location, hospital

### Business & Features

-   `Gift` - Extras, bonuses
-   `Star` - Ratings, favorites
-   `Award` - Quality, excellence
-   `Clock` - Time, scheduling
-   `Globe` - Global, worldwide

### UI Elements

-   `Plus` - Add, create
-   `Minus` - Remove, subtract
-   `X` - Close, cancel
-   `ChevronRight` - Next, forward
-   `ChevronLeft` - Previous, back
-   `ArrowRight` - Continue, proceed
-   `ArrowLeft` - Go back

### Information

-   `Info` - Information
-   `HelpCircle` - Help, FAQ
-   `FileText` - Documents, terms
-   `ClipboardList` - Checklist, tasks

## Icon Sizing Guidelines

### Small Icons (16px)

-   Used in buttons, small UI elements
-   Footer contact icons
-   Inline icons with text

### Medium Icons (20px)

-   Trust indicators
-   Feature highlights
-   Navigation items

### Large Icons (24px)

-   Hero section icons
-   Main feature icons
-   Call-to-action buttons

### Extra Large Icons (32px+)

-   Hero section highlights
-   Major feature displays
-   Landing page focal points

## Color Guidelines

### Primary Blue (#1890ff)

-   Main actions, primary buttons
-   Navigation elements
-   Brand-related icons

### Success Green (#52c41a)

-   Success states, confirmations
-   Security, trust indicators
-   Positive actions

### Warning/Error Colors

-   `#ff4d4f` - Errors, warnings
-   `#faad14` - Caution, alerts

### Neutral Colors

-   `#666666` - Secondary text
-   `#999999` - Disabled states
-   `#ffffff` - On dark backgrounds

## Best Practices

1. **Consistency**: Use the same icon style throughout
2. **Accessibility**: Always provide alt text or aria-labels
3. **Sizing**: Use consistent sizes within similar contexts
4. **Color**: Follow the color guidelines for different contexts
5. **Animation**: Use subtle transitions for hover states

## Example Implementation

```jsx
// Trust indicator with icon
<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <Shield
    size={20}
    style={{ color: '#52c41a' }}
  />
  <Text>Secure booking</Text>
</div>

// Button with icon
<Button
  type="primary"
  icon={<BookOpen size={16} />}
>
  Book Now
</Button>

// Feature card with icon
<div style={{ textAlign: 'center' }}>
  <div style={{
    width: 48,
    height: 48,
    background: 'rgba(24, 144, 255, 0.1)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  }}>
    <Heart size={24} color="#1890ff" />
  </div>
  <Text>Compassionate Care</Text>
</div>
```

## Finding More Icons

Visit [Lucide Icons](https://lucide.dev/icons) to browse all available icons and their names.

## Migration from Emojis

When replacing emojis, choose semantically appropriate icons:

-   📞 → `Phone`
-   📧 → `Mail`
-   💬 → `MessageCircle`
-   ✅ → `CheckCircle`
-   🛡️ → `Shield`
-   💙 → `Heart`
-   🤝 → `Users`
-   📋 → `ClipboardList`
-   🏥 → `MapPin`
-   ⭐ → `Star`
