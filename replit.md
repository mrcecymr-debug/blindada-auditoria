# Casa Blindada MR@ - Replit Agent Guide

## Overview

Casa Blindada MR@ is a home security audit mobile application built with Expo (React Native). It allows users to conduct structured security assessments of residential properties by answering categorized questions across five security domains (Perimeter & Structure, Lighting & Visibility, Access Control, Electronic Systems, and Human Factors). The app calculates security scores, generates dashboards with visual analytics, provides prioritized action items for improving security, allows users to save/load audit reports, shows score evolution history across saved audits, and generates professional A4 PDF reports with full audit data, SVG charts, and MR ENG branding.

The project follows a full-stack architecture with an Express backend server and an Expo/React Native frontend, designed to run on iOS, Android, and web platforms. Production hosting is on **Vercel** via GitHub integration, with the domain **www.mrserver.com.br**.

## User Preferences

Preferred communication style: Simple, everyday language. Portuguese (Brazilian).

## System Architecture

### Frontend (Expo / React Native)

- **Framework**: Expo SDK 54 with React Native 0.81, using the new architecture (`newArchEnabled: true`)
- **Routing**: expo-router v6 with file-based routing and typed routes. The app uses a tab-based navigation layout with four tabs: Diagnóstico (Diagnostic/Survey), Painel (Dashboard), Ações (Actions), and Relatório (Report)
- **State Management**: React Context API (`AuditProvider` in `lib/audit-context.tsx`) for audit state, with `@tanstack/react-query` available for server-state management
- **Persistence**: `@react-native-async-storage/async-storage` for local storage of audit answers and saved audits — the app works primarily offline with local data
- **UI Components**: Custom components using React Native primitives, `expo-linear-gradient`, `expo-blur`, `react-native-reanimated` for animations, and `@expo/vector-icons` (Ionicons) for icons
- **Styling**: StyleSheet-based styling with a centralized color theme in `constants/colors.ts` using a dark theme (navy/teal color scheme)
- **Platform Support**: iOS, Android, and Web. Uses platform-specific adaptations (e.g., `KeyboardAwareScrollViewCompat` for web vs native, native tabs on iOS 26+ with liquid glass)
- **Option Hints**: Each diagnostic question option has a brief explanation (`OPTION_HINTS` in `lib/audit-data.ts`) shown below the option label in the picker modal

### Backend (Express - Development)

- **Framework**: Express v5 running on Node.js
- **Location**: `server/` directory with `index.ts` (entry point), `routes.ts` (API route registration), `hotmart-webhook.ts` (Hotmart webhook handler), and `storage.ts` (data storage layer)
- **Storage**: Currently uses in-memory storage (`MemStorage` class) with a `Map`-based implementation
- **CORS**: Dynamic CORS configuration supporting Replit domains and localhost for development
- **Static Serving**: Serves `public/`, `dist/`, `static-build/`, and `assets/` directories

### Vercel Serverless Functions (Production)

- **Location**: `api/` directory at project root
- **Hotmart Webhook**: `api/hotmart/webhook.ts` — Vercel serverless function that handles Hotmart purchase webhooks
- **Config**: `vercel.json` with rewrite rules for API routes
- **Environment Variables (Vercel)**: `HOTMART_HOTTOK`, `SUPABASE_SERVICE_ROLE_KEY`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_SUPABASE_URL`

### Database Layer

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` — currently contains a `users` table with id, username, and password fields
- **Validation**: Uses `drizzle-zod` for schema-to-Zod validation schema generation
- **Note**: The core audit data (questions, answers, scores) is handled entirely on the client side via AsyncStorage, not through the server/database

### Authentication

- **Provider**: Supabase Auth (email/password)
- **Frontend**: `lib/supabase.ts` with anon key, `lib/session-guard.ts` for single-session enforcement
- **Session Control**: Only one active session per user — logging in on another device forces logout on the previous one
- **SUPABASE_URL**: `https://guczydknusnhpooaxvtb.supabase.co`

### Hotmart Integration (IMPLEMENTED ✅)

- **Webhook URL**: `https://www.mrserver.com.br/api/hotmart/webhook` (must include `www` — Vercel redirects non-www to www with 308)
- **Flow**: Hotmart sale → webhook POST → validate hottok → `createUser` com senha temporária → `resetPasswordForEmail` para disparar email → usuário faz login com senha temporária → tela set-password → cria senha definitiva
- **Events handled**: `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`
- **User creation**: `supabase.auth.admin.createUser()` com `email_confirm: true` e `temp_password` no metadata + `supabase.auth.resetPasswordForEmail()` para disparar email de boas-vindas
- **Duplicate prevention**: Checks if user already exists before creating
- **Files**: `api/hotmart/webhook.ts` (Vercel), `server/hotmart-webhook.ts` (Express dev)
- **Secrets**: `HOTMART_HOTTOK` (webhook token), `SUPABASE_SERVICE_ROLE_KEY` (admin access)
- **Product**: R$ 257,00 pagamento único, primeiros 1.000 acessos
- **Email template**: Supabase Dashboard → Authentication → Email Templates → **Reset Password** (branding CasaBlindada MR@ + senha temporária em `{{ .Data.temp_password }}`)
- **Login flow**: login.tsx detecta `needs_password_reset` no metadata → `markInviteFlow()` → redireciona para `/set-password` → ao trocar senha, `registerSessionToken()` → entra no app
- **Session guard bypass**: `isInviteFlowActive()` (sessionStorage) impede sign-out automático durante troca de senha

### PWA (IMPLEMENTED)

- **Files**: `public/manifest.json`, `public/sw.js`, `public/pwa-icon-192.png`, `public/pwa-icon-512.png`, `public/apple-touch-icon.png`
- **Custom HTML**: `app/+html.tsx` injects PWA meta tags at build time
- **Service Worker**: `lib/register-sw.ts` — registers SW on web platform at app startup
- **Express**: Serves `public/` directory for manifest, icons, and SW
- **iOS meta tags**: apple-mobile-web-app-capable, apple-touch-icon, black-translucent status bar
- **Install**: iPhone via Safari Share → "Add to Home Screen"; Android via Chrome menu → "Install app"
- **Icon**: Golden shield with padlock, navy background, teal accent, MR ENG branding

### Key Design Decisions

1. **Offline-first architecture**: Audit data lives in AsyncStorage on the device
2. **Shared schema directory**: `shared/` contains types and schemas used by both frontend and backend
3. **Audit engine in `lib/audit-data.ts`**: Contains all question definitions, scoring logic, category definitions, option hints, and action items as static data
4. **Tab-based UX flow**: Diagnóstico → Painel → Ações → Relatório
5. **Dual deployment**: Vercel for production (serverless + static), Replit for development
6. **Painel button**: Only appears after all 32 questions are answered (32/32)

### ⚠️ Princípio Fundamental de Coerência — NUNCA VIOLAR

**O sistema inteiro deve ser sempre 100% coerente entre si.** As quatro abas formam um único organismo integrado:

- **Diagnóstico** → as respostas são a única fonte de verdade (`answers` no AuditContext)
- **Painel** → reflete o score calculado em tempo real a partir das respostas (`calculateScore(answers)`)
- **Ações** → geradas dinamicamente a partir das respostas (`generateActionItems(answers)`). Cada ação propõe como meta uma **opção real existente no próprio questionário** (não texto genérico inventado separadamente). Ao marcar uma ação como feita, o diagnóstico da pergunta correspondente é atualizado automaticamente para o nível-meta
- **Relatório** → consolidação final de tudo acima

**Regras invioláveis:**
- Qualquer melhoria sugerida nas Ações DEVE corresponder a uma opção existente no `QUESTIONS[x].options` do Diagnóstico
- Ao marcar uma ação como feita, o `answers[questionCode]` DEVE ser atualizado para o `targetAnswer` correspondente
- O score no Painel DEVE sempre refletir o estado atual de `answers`, sem cache ou valor fixo
- Nunca criar texto de solução nas Ações que não tenha correspondência no Diagnóstico
- `calculateScore()` em `lib/audit-data.ts` é a ÚNICA fonte de verdade para pontuação — nunca calcular score em outro lugar

### Build & Development

- **Development**: Two processes — `expo:dev` (port 8081) + `server:dev` (port 5000)
- **Production**: Vercel via GitHub — auto-deploys on push to main
- **TypeScript**: Strict mode, path aliases `@/*` and `@shared/*`

## External Dependencies

### Core Framework
- **Expo SDK 54**: Mobile app framework with managed workflow
- **React 19.1** / **React Native 0.81**: UI rendering
- **Express 5**: Backend HTTP server (development)

### Authentication & Users
- **@supabase/supabase-js**: Supabase client for auth and user management
- **Supabase Auth**: Email/password authentication with session management

### Database & ORM
- **PostgreSQL**: Database (configured via `DATABASE_URL`)
- **Drizzle ORM**: Type-safe SQL query builder
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

### Shared Components
- **HeaderActions** (`components/HeaderActions.tsx`): Shared header buttons (Ajuda + Sair) used across all 4 tabs
- **GuideModal** (`components/GuideModal.tsx`): Central de Ajuda modal, extracted from index.tsx for reuse
- **FlowNavHint** (`components/FlowNavHint.tsx`): Navigation hint buttons guiding user flow between tabs

### Key Data Files
- **`lib/audit-data.ts`**: 32 questions, scoring logic, `OPTION_HINTS` (brief explanations for every option), action items, category definitions. `calculateScore()` is the SINGLE source of truth for all scoring
- **`lib/audit-context.tsx`**: React Context for audit state management (answers, observations, saved audits)
- **`lib/supabase.ts`**: Supabase client configuration
- **`lib/session-guard.ts`**: Single-session enforcement logic
- **`lib/register-sw.ts`**: PWA Service Worker registration

## Design Constants
- Background: `#060E1A` (dark navy)
- Accent: `#00C6AE` (teal)
- Gold: `#D4AF37`
- Warning/delete: `#FF9F43` (orange)
- Web paddingTop: 20px; tab bar height: 60px; content paddingBottom: 70px

### PDF / Relatório — Compartilhamento (IMPLEMENTED ✅)

- **iOS nativo** (Expo Go): `expo-print` gera PDF real → `expo-sharing` abre share sheet com WhatsApp, email, etc.
- **Android nativo** (Expo Go): `expo-print` com `width: 794, height: 1123` → cópia para `FileSystem.cacheDirectory` com nome legível → `expo-sharing`
- **Web/PWA (Android Chrome, iOS Safari)**: Web Share API (`navigator.share({ files: [htmlFile] })`) → abre menu nativo do sistema com WhatsApp, Gmail, Drive, etc. Fallback: print dialog para desktop
- **Impressão**: arquivo HTML recebido pode ser aberto no navegador e impresso via Ctrl+P / menu do browser — CSS `@media print` garante formatação A4 correta
- **CSS paginação**: `break-inside: avoid` + `page-break-inside: avoid` para compatibilidade WebKit e Chromium/Android
- **Target rendering**: `android` | `webkit` | `browser` — CSS e margens ajustados por plataforma
- **Dependência**: `expo-file-system` instalado para cópia de arquivo no Android nativo

## Planned Features (Not Yet Implemented)

- **Recuperação de senha**: Supabase email reset (botão "Esqueceu a senha?" na tela de login)
- **Fotos nas observações**: Até 3 fotos por pergunta usando expo-image-picker
- **IA para preços**: Integração com OpenAI para preços dinâmicos nas ações recomendadas
