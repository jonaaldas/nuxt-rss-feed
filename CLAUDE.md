# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an RSS feed reader application built with Nuxt 3, Vue 3, and tRPC. The application uses TypeScript throughout and follows a full-stack architecture with server-side API routes powered by tRPC.

## Architecture

### Tech Stack
- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Backend API**: tRPC (via trpc-nuxt)
- **Styling**: Tailwind CSS v4 with Shadcn-vue components
- **Database**: PostgreSQL (via Docker Compose)
- **Package Manager**: Bun/npm

### Project Structure
- `/app` - Frontend application code
  - `/components/ui` - Shadcn-vue UI components
  - `/pages` - Vue page components
  - `/plugins` - Nuxt plugins (tRPC client setup)
  - `/lib` - Utilities (tailwind utilities)
- `/server` - Backend API code
  - `/api/trpc` - tRPC API endpoint
  - `/trpc/init.ts` - tRPC initialization and context
  - `/trpc/routers` - tRPC router definitions
- `/styles.css` - Global CSS with Tailwind directives

### Key Architectural Decisions
- **tRPC Integration**: The app uses tRPC for type-safe API communication between frontend and backend. The tRPC client is configured as a Nuxt plugin and accessible via `$trpc`.
- **UI Components**: Using Shadcn-vue (Reka UI) components with the New York theme variant. Components are pre-configured in `/app/components/ui`.
- **Path Aliases**: `@/` maps to the `/app` directory for cleaner imports.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 9292)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate

# Start PostgreSQL database
docker compose up -d db
```

## Working with tRPC

### Adding New API Routes
1. Define procedures in `/server/trpc/routers/index.ts`
2. Use `baseProcedure` for public endpoints
3. The router type is automatically exported and available to the client

### Using tRPC in Components
```typescript
const { $trpc } = useNuxtApp();
const result = await $trpc.procedureName.query();
```

## Database Configuration

PostgreSQL runs via Docker Compose with these defaults:
- Port: 5432
- Database: rss_app
- User: rss_app
- Password: rss_app

Environment variables can override defaults via `.env` file.

## Development Port

The development server runs on port **9292** (not the default 3000).