# Universal Exhibition Cost Calculator

## Overview
This React-based web application calculates exhibition and trade show costs, offering AI-powered vendor recommendations and comprehensive admin management. It's designed as a complete exhibition planning solution, featuring real-time cost calculations, multi-currency support, market-level adjustments, and professional quote generation. The platform includes a step-by-step wizard for planning (Details → Flights → Hotels → Quote), an exhibitions database, industry insights, and integrates both AI-driven and admin-managed vendor systems. Its business vision is to streamline exhibition planning, offering a robust tool for cost estimation and vendor management in the Indian market with global coverage.

## User Preferences
Preferred communication style: Simple, everyday language.
Primary market focus: Indian markets with comprehensive global coverage as secondary priority.
Brand preferences: Green color scheme throughout, EaseMyExpo branding prominently displayed, "Trade Show Cost Calculator powered by EaseMyExpo" as main title.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, using Vite for development and bundling. It employs a component-based structure, utilizing Tailwind CSS for styling, shadcn/ui for UI components, Wouter for routing, and TanStack Query for server state management. The design emphasizes a dark theme with gradient backgrounds and glass morphism effects, ensuring responsiveness across devices.

### Backend Architecture
The backend is an Express.js server providing a RESTful API. Key features include:
- Integration with Perplexity API for AI-powered vendor recommendations.
- A comprehensive Admin Vendor Management API for CRUD operations on a manual vendor database.
- A Smart Vendor Matching System that combines database vendors with AI search results based on location, services, keywords, and specialties.
- PostgreSQL database with Drizzle ORM for vendor data persistence.
- In-memory storage for user data, with interfaces for future database integration.

### Data Management
The application employs a hybrid data management approach:
- Client-side calculations for real-time cost estimation.
- Shared schema definitions using Drizzle ORM types.
- React hooks for form state management.
- TanStack Query for API response caching.

### Styling and UI System
A comprehensive design system is implemented using Tailwind CSS with custom configurations, CSS variables for theming, and a dark theme with gradient backgrounds and glass morphism effects. It is responsive and includes CSS animations for enhanced user experience.

### Technical Implementations
- **Dynamic Budget Allocation Wizard**: Integrates functionally with stall design pricing, applying proportional scaling to all stall cost components based on allocated booth construction budget.
- **Smart Pricing Adjustments**: Automatically adjusts pricing calculations based on allocated booth construction budget.
- **Admin Panel for Vendor Management**: Secure CRUD operations for vendors, enabling intelligent client matching.
- **Gamified Pricing System**: Interactive bar charts and an achievement system integrated into live pricing panels for real-time cost visualization.
- **Brevo Email Notifications**: Automatic admin notifications with comprehensive form data upon user completion of exhibition planning.
- **Enterprise PDF Generation**: Single-page professional quotes with clean layout, branded letterhead, proper formatting, and comprehensive cost breakdowns without encoding issues.
- **First-timer user engagement system**: Incorporates social proof and return incentives.
- **Personalized Exhibition Planning Wizard**: Offers 5-step intelligent recommendations.
- **Exhibition and Industry Database**: Includes real exhibition data and industry-specific insights with intelligent filtering.
- **Indian Market Integration**: Comprehensive location coverage, India-specific travel options (airlines, hotels, logistics), and an Indian vendor ecosystem with market-researched pricing.

## External Dependencies

- **Core Frameworks**: React 18, React DOM, Vite, TypeScript.
- **UI & Styling**: Tailwind CSS, Radix UI, shadcn/ui, Lucide React, Class Variance Authority.
- **State Management & Data Fetching**: TanStack Query, React Hook Form, Hookform Resolvers.
- **Database & Backend**: Drizzle ORM, Neon Database (configured), Express.js.
- **API Integrations**: Perplexity API (for AI vendor recommendations), Brevo (for email notifications).
- **Utilities**: date-fns, clsx, nanoid.
```