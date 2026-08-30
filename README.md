# Pashu Sevak Vaani

A sector-specific digital newsroom for India's animal husbandry community.

## Tech Stack

- **Framework**: React 19 with TanStack Start
- **Routing**: TanStack Router
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Language**: TypeScript

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will run on `http://localhost:5173`

Backend:

1. cd backend
2. npm install
3. copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`, and `ADMIN_PASSWORD_HASH` (see backend/README.md)
4. run Postgres migration: `psql $DATABASE_URL -f backend/migrations/init.sql`
5. start backend: `npm run dev`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/ui/    # Radix UI component wrappers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── routes/          # Page routes
├── assets/          # Images and static files
├── styles.css       # Global styles
├── router.tsx       # Router configuration
├── server.ts        # Server logic
└── start.ts         # App entry point
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
