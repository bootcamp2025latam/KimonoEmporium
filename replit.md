# WuWei Neurodiversity Fashion E-commerce Platform

## Overview

WuWei is a specialized e-commerce platform focused on selling sensory-friendly kimonos designed for the neurodivergent community. The application features a modern web interface for browsing products, managing a shopping cart, and processing payments through Stripe. The platform emphasizes comfort, inclusivity, and accessibility in both its products and user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and React Context for cart state
- **UI Framework**: Shadcn/UI components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM for type-safe database interactions
- **Development**: Hot module replacement and middleware integration with Vite in development mode
- **Session Management**: In-memory storage with session-based cart persistence using browser localStorage

### Data Storage
- **Primary Database**: PostgreSQL configured through Drizzle with Neon serverless database
- **Schema Design**: 
  - Products table with pricing, inventory, sizing, and categorization
  - Cart items with session-based tracking and size selection
  - Orders table storing payment intent IDs and order history
- **Development Storage**: In-memory storage implementation for rapid development and testing

### Authentication & Authorization
- **Session Management**: UUID-based session IDs stored in localStorage for cart persistence
- **Payment Authentication**: Stripe integration for secure payment processing
- **No User Accounts**: Simplified checkout flow using email-based order tracking

### Payment Processing
- **Payment Provider**: Stripe integration with payment intents for secure transactions
- **Frontend**: Stripe Elements for PCI-compliant payment forms
- **Backend**: Stripe webhooks and server-side payment confirmation
- **Order Management**: Email-based order tracking with Stripe receipt system

### UI/UX Design Decisions
- **Accessibility**: Radix UI primitives ensure ARIA compliance and keyboard navigation
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Color Scheme**: Neurodiversity-friendly color palette with high contrast ratios
- **Typography**: Multiple font families including Inter for readability
- **Components**: Modular shadcn/ui component library for consistent design

## External Dependencies

### Core Technologies
- **Neon Database**: Serverless PostgreSQL hosting for production data storage
- **Stripe**: Payment processing platform for secure e-commerce transactions
- **Vite**: Build tool and development server with HMR capabilities

### UI Component Libraries
- **Radix UI**: Headless UI primitives for accessible components (accordion, dialog, select, etc.)
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

### Development Tools
- **TypeScript**: Static type checking across frontend and backend
- **Drizzle Kit**: Database migration and schema management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form validation and management
- **Wouter**: Lightweight routing for single-page application navigation

### Asset Management
- **Static Assets**: Local file serving for product images through Express middleware
- **Font Loading**: Google Fonts integration for typography variety
- **Build Optimization**: Vite bundling with tree-shaking and code splitting