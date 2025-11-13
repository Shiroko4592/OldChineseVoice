# Old Chinese Translation Web Application

## Overview

A web application that translates Korean text into Old Chinese (上古漢語, Archaic Chinese) with romanized pronunciations. The application uses OpenAI's GPT-4 models to generate historically accurate translations using classical Chinese characters and scholarly reconstruction systems like Baxter-Sagart for pronunciation.

The application features a clean, Material Design-inspired interface optimized for displaying Korean and Chinese characters, with real-time translation, history tracking, and a responsive design supporting both desktop and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript running on Vite for development and production builds.

**UI Component System**: Shadcn UI (New York style variant) built on Radix UI primitives with Tailwind CSS for styling. The component library provides accessible, customizable components following Material Design principles with emphasis on typography and clarity for CJK (Chinese-Japanese-Korean) character display.

**Routing**: Wouter for lightweight client-side routing.

**State Management**: 
- TanStack Query (React Query) for server state management, data fetching, and caching
- Local React state for UI interactions and form inputs

**Styling Approach**:
- Tailwind CSS with custom design tokens for consistent spacing, colors, and typography
- Custom CSS variables for theme support (light/dark mode capability)
- Typography system optimized for CJK characters using Noto Sans CJK and Inter fonts
- Monospace font (JetBrains Mono) for romanization display

**Key Design Decisions**:
- Single-page application with minimal routing (home page and 404)
- Component-based architecture with reusable UI components for translation input, output, and history
- Responsive design with mobile-first approach using Tailwind breakpoints
- Focus on readability with large text sizes for Chinese characters and clear visual hierarchy

### Backend Architecture

**Runtime**: Node.js with Express.js web framework.

**API Design**: RESTful API with JSON request/response format.

**Development Setup**: 
- tsx for TypeScript execution in development
- esbuild for production bundling with ESM module format
- Separate client and server build processes

**Middleware Stack**:
- express.json() with raw body preservation for webhook compatibility
- express.urlencoded() for form data
- Custom request logging middleware for API endpoints

**Key Architectural Patterns**:
- Separation of concerns with dedicated routing and storage modules
- Environment-based configuration (development vs production)
- Vite integration for development with HMR (Hot Module Replacement)
- Static file serving for production builds

**Storage Strategy**: 
- Abstracted storage interface (IStorage) allowing for multiple implementations
- In-memory storage (MemStorage) for development/testing
- Schema designed to support database migration (Drizzle ORM ready)

### Data Storage Solutions

**Database ORM**: Drizzle ORM configured for PostgreSQL with Neon serverless driver.

**Schema Design**:
- `users` table: User authentication with username/password (prepared for future auth implementation)
- `translations` table: Stores translation history with Korean input, Chinese output, romanization, and timestamps

**Migration Strategy**: Drizzle Kit for schema migrations with PostgreSQL dialect.

**Current Implementation**: In-memory storage with database-compatible schema, allowing seamless migration to PostgreSQL when needed.

**Data Models**:
- Zod schemas for runtime validation derived from Drizzle schemas
- TypeScript types generated from database schema for type safety
- Translation model includes: Korean text, Chinese text, romanization, creation timestamp

### Authentication and Authorization

**Current State**: Authentication schema defined but not actively implemented in the application flow.

**Prepared Infrastructure**:
- User schema with username and password fields
- Storage interface methods for user creation and retrieval
- Session management prepared with connect-pg-simple for PostgreSQL-backed sessions

**Design Intent**: Foundation laid for future authentication feature without blocking current functionality.

### Translation Logic

**AI Provider**: OpenAI GPT-4 models (specifically gpt-4o-mini) for cost-effective, high-quality translations.

**Translation Approach**:
- Structured prompts specifying Old Chinese period (1000 BCE - 200 CE)
- JSON-formatted responses for consistent parsing
- Validation using Zod schemas to ensure response completeness
- Error handling for empty, invalid, or malformed translations

**Quality Controls**:
- Minimum length requirements for both Chinese text and romanization
- Trim whitespace from inputs and outputs
- Client-side validation before API calls
- Server-side validation with detailed error messages

**Historical Accuracy Requirements**:
- Classical Chinese characters appropriate to Old Chinese period
- Baxter-Sagart or similar scholarly reconstruction systems for pronunciation
- Natural, period-authentic translations rather than modern transliterations

## External Dependencies

### Third-Party APIs

**OpenAI API**: Primary translation service using GPT-4 models. Requires `OPENAI_API_KEY` environment variable.
- Model: gpt-4o-mini
- Usage: System and user prompts for Old Chinese translation
- Response format: JSON with structured translation data

### Database Services

**Neon (PostgreSQL)**: Serverless PostgreSQL database provider (configured but not actively used).
- Connection: Via `@neondatabase/serverless` driver
- Configuration: Requires `DATABASE_URL` environment variable
- Migration: Drizzle Kit manages schema migrations

### UI Component Libraries

**Radix UI**: Headless component primitives providing accessibility and behavior.
- Components: Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, Popover, Select, Tabs, Toast, Tooltip, and more
- Purpose: Accessible, unstyled components as foundation for custom design system

**Shadcn UI**: Pre-built component patterns built on Radix UI with Tailwind styling.
- Style: New York variant
- Configuration: Custom paths for components, utils, and hooks

### Styling and Build Tools

**Tailwind CSS**: Utility-first CSS framework with custom configuration.
- Custom colors using HSL with CSS variables for theming
- Custom border radius values
- Extended color palette for components

**Vite**: Build tool and development server.
- Plugins: React, runtime error overlay, Replit-specific development tools
- Configuration: Custom alias paths for imports (@, @shared, @assets)

**PostCSS**: CSS processing with Tailwind and Autoprefixer plugins.

### Utility Libraries

**class-variance-authority (CVA)**: Utility for creating variant-based component APIs.

**clsx**: Utility for conditional className construction.

**date-fns**: Date formatting and manipulation, using Korean locale for display.

**zod**: Schema validation for runtime type checking.

**wouter**: Lightweight routing library for React.

### Development Tools

**TypeScript**: Static type checking with strict mode enabled.
- Configuration: ESNext modules, DOM types, path aliases
- Build: Type checking without emit (handled by build tools)

**Replit Integration**: Development environment plugins for enhanced Replit experience.
- Vite plugins: Cartographer and dev banner for development mode
- Runtime error modal for better debugging