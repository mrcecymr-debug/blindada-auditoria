# Casa Blindada MR@ - Replit Agent Guide

## Overview

Casa Blindada MR@ is a home security audit mobile application built with Expo (React Native). It allows users to conduct structured security assessments of residential properties by answering categorized questions across five security domains (Perimeter & Structure, Lighting & Visibility, Access Control, Electronic Systems, and Human Factors). The app calculates security scores, generates dashboards with visual analytics, provides prioritized action items for improving security, allows users to save/load audit reports, shows score evolution history across saved audits, and generates professional A4 PDF reports with full audit data, SVG charts, and MR ENG branding.

The project follows a full-stack architecture with an Express backend server and an Expo/React Native frontend, designed to run on iOS, Android, and web platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)

- **Framework**: Expo SDK 54 with React Native 0.81, using the new architecture (`newArchEnabled: true`)
- **Routing**: expo-router v6 with file-based routing and typed routes. The app uses a tab-based navigation layout with four tabs: Levantamento (Survey), Painel (Dashboard), Ações (Actions), and Relatório (Report)
- **State Management**: React Context API (`AuditProvider` in `lib/audit-context.tsx`) for audit state, with `@tanstack/react-query` available for server-state management
- **Persistence**: `@react-native-async-storage/async-storage` for local storage of audit answers and saved audits — the app works primarily offline with local data
- **UI Components**: Custom components using React Native primitives, `expo-linear-gradient`, `expo-blur`, `react-native-reanimated` for animations, and `@expo/vector-icons` (Ionicons) for icons
- **Styling**: StyleSheet-based styling with a centralized color theme in `constants/colors.ts` using a dark theme (navy/teal color scheme)
- **Platform Support**: iOS, Android, and Web. Uses platform-specific adaptations (e.g., `KeyboardAwareScrollViewCompat` for web vs native, native tabs on iOS 26+ with liquid glass)

### Backend (Express)

- **Framework**: Express v5 running on Node.js
- **Location**: `server/` directory with `index.ts` (entry point), `routes.ts` (API route registration), and `storage.ts` (data storage layer)
- **Storage**: Currently uses in-memory storage (`MemStorage` class) with a `Map`-based implementation. The storage interface (`IStorage`) is designed for easy swapping to a database-backed implementation
- **CORS**: Dynamic CORS configuration supporting Replit domains and localhost for development
- **Static Serving**: In production, serves the built Expo web bundle; in development, proxies to the Expo dev server

### Database Layer

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` — currently contains a `users` table with id, username, and password fields
- **Validation**: Uses `drizzle-zod` for schema-to-Zod validation schema generation
- **Migrations**: Drizzle Kit configured for push-based migrations (`npm run db:push`)
- **Note**: The database schema is minimal. The core audit data (questions, answers, scores) is currently handled entirely on the client side via AsyncStorage, not through the server/database. The `DATABASE_URL` environment variable is required for the Drizzle config but the server itself uses in-memory storage

### Key Design Decisions

1. **Offline-first architecture**: Audit data lives in AsyncStorage on the device. This was chosen because security audits happen on-site where connectivity may be unreliable
2. **Shared schema directory**: `shared/` contains types and schemas used by both frontend and backend, ensuring type consistency
3. **Audit engine in `lib/audit-data.ts`**: Contains all question definitions, scoring logic, category definitions, and action items as static data — no server dependency needed for the core functionality
4. **Tab-based UX flow**: The four tabs represent the natural workflow: Survey → Dashboard → Actions → Report

### Build & Development

- **Development**: Two processes run simultaneously — `expo:dev` for the Expo frontend and `server:dev` for the Express backend
- **Production build**: `expo:static:build` creates a static web bundle, `server:build` bundles the server with esbuild, and `server:prod` serves everything
- **TypeScript**: Strict mode enabled throughout, with path aliases `@/*` and `@shared/*`

## External Dependencies

### Core Framework
- **Expo SDK 54**: Mobile app framework with managed workflow
- **React 19.1** / **React Native 0.81**: UI rendering
- **Express 5**: Backend HTTP server

### Database & ORM
- **PostgreSQL**: Database (configured via `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe SQL query builder and schema management
- **pg**: PostgreSQL client driver

### Data & State
- **@tanstack/react-query**: Server-state management and API caching
- **@react-native-async-storage/async-storage**: Local persistent storage for audit data
- **Zod**: Runtime type validation (via drizzle-zod)

### UI & UX
- **expo-router**: File-based navigation
- **react-native-reanimated**: Smooth animations
- **react-native-gesture-handler**: Touch gesture support
- **expo-linear-gradient**: Gradient backgrounds
- **expo-blur / expo-glass-effect**: Visual effects
- **expo-haptics**: Tactile feedback
- **@expo/vector-icons**: Icon library (Ionicons, Feather)
- **react-native-keyboard-controller**: Keyboard-aware layouts
- **react-native-safe-area-context**: Safe area handling

### Build Tools
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development
- **drizzle-kit**: Database migration tooling
- **babel-preset-expo**: Babel configuration for Expo
- **patch-package**: Post-install patching