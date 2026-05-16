# Dytor Manager - Next.js 16 Migration Guide

## What Changed

This project has been upgraded from **Create React App (CRA)** to **Next.js 16** with the App Router. This provides better performance, server-side rendering, and improved developer experience.

## Key Differences

### Project Structure

**Before (CRA):**
```
src/
├── components/
├── pages/
├── context/
├── utils/
└── index.jsx
```

**After (Next.js 16):**
```
app/
├── (admin)/          # Route group for admin layout
│   ├── layout.tsx    # Admin layout with Sidebar + Header
│   ├── page.tsx      # Dashboard
│   ├── users/page.tsx
│   ├── teams/page.tsx
│   ├── infrastructure/page.tsx
│   └── settings/page.tsx
├── layout.tsx        # Root layout
└── globals.css       # Global styles
lib/
├── context/          # React Context
├── api/
│   ├── client.ts     # Axios instance
│   └── endpoints.ts  # API calls
components/
├── Sidebar.tsx
└── Header.tsx
```

### Configuration Files

**Added:**
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.js` - PostCSS with Tailwind
- `tailwind.config.js` - Updated for Next.js
- `app/globals.css` - Global styles with @tailwind directives

**Removed:**
- `react-scripts` dependencies
- Public folder with manifest.json
- Index.html (Next.js handles it automatically)

## Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env.local
```

Update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Note: Variables with `NEXT_PUBLIC_` prefix are exposed to the browser.

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## File Structure Guide

### app/(admin)/layout.tsx
The layout wrapper for all admin pages. Contains Sidebar and Header. The `(admin)` is a route group that doesn't affect URLs.

### app/(admin)/page.tsx
The dashboard at `/`

### app/(admin)/users/page.tsx
User management at `/users`

### app/(admin)/teams/page.tsx
Team management at `/teams`

### app/(admin)/infrastructure/page.tsx
Infrastructure monitoring at `/infrastructure`

### app/(admin)/settings/page.tsx
Settings at `/settings`

### app/layout.tsx
Root layout that wraps entire app. Good place for providers.

### app/globals.css
Global styles with Tailwind directives.

## API Integration

### Making API Calls

**File:** `lib/api/endpoints.ts`

```typescript
import { userAPI } from '@/lib/api/endpoints';

// In your component
useEffect(() => {
  userAPI.getAll()
    .then(response => setUsers(response.data.data))
    .catch(error => console.error(error));
}, []);
```

### API Configuration

**File:** `lib/api/client.ts`

- Axios instance with baseURL from `NEXT_PUBLIC_API_URL`
- Automatic JWT token injection from localStorage
- 401 redirect handling

## Context API

### Using Global State

```typescript
'use client';

import { useAdmin } from '@/lib/context/AdminContext';

export default function MyComponent() {
  const { currentUser, addNotification } = useAdmin();
  
  return <div>{currentUser.name}</div>;
}
```

The `AdminProvider` is in `app/layout.tsx`, so it's available everywhere.

## Styling

### Tailwind CSS

All components use Tailwind utility classes:

```tsx
<div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
  <h2 className="text-xl font-bold text-white">Title</h2>
</div>
```

### Global Styles

Update `app/globals.css` for global styles. Avoid CSS modules - Tailwind is preferred.

## TypeScript

### Using TypeScript

Files use `.tsx` extension. Full type safety:

```typescript
interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  // ...
}
```

### Type Definitions

```typescript
// lib/types/admin.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'team_lead';
}
```

## Client vs Server Components

### Client Component (Default for Interactivity)

```typescript
'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  // ...
}
```

### Server Component (Default for Static Content)

```typescript
// No 'use client' directive
export default function Page() {
  // Can access environment variables directly
  // Can fetch data from databases
  return <div>{staticContent}</div>;
}
```

Most admin pages are client components for interactivity.

## Routing

### URL Structure

```
/ → app/(admin)/page.tsx → Dashboard
/users → app/(admin)/users/page.tsx → User Management
/teams → app/(admin)/teams/page.tsx → Team Management
/infrastructure → app/(admin)/infrastructure/page.tsx → Infrastructure
/settings → app/(admin)/settings/page.tsx → Settings
```

### Navigation

```typescript
import Link from 'next/link';

export default function Nav() {
  return <Link href="/users">Go to Users</Link>;
}
```

Use `next/link` instead of `<a>` tags for client-side navigation.

### usePathname Hook

```typescript
'use client';

import { usePathname } from 'next/navigation';

export default function Component() {
  const pathname = usePathname();
  
  if (pathname === '/') return <div>Dashboard</div>;
  return null;
}
```

## Commands

```bash
# Development
npm run dev              # Start dev server on :3000

# Production Build
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript check
```

## Common Issues

### Port 3000 in Use

```bash
PORT=3001 npm run dev
```

### Module Not Found Errors

Make sure imports use correct paths:
```typescript
// ✅ Correct
import { useAdmin } from '@/lib/context/AdminContext';
import Sidebar from '@/components/Sidebar';

// ❌ Wrong
import { useAdmin } from '../context/AdminContext';
```

### 'use client' Directive

If you get hydration errors, add `'use client'` at the top of the file:
```typescript
'use client';

export default function Component() {
  // ...
}
```

## Performance Benefits

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Built-in `<Image>` component
- **API Routes**: Create API endpoints without external server
- **Server Components**: Render on server to reduce JS
- **Caching**: Built-in caching strategies

## Deployment

### Vercel (Recommended)

```bash
vercel
```

### Docker

```bash
docker build -t dytor-manager .
docker run -p 3000:3000 dytor-manager
```

### Other Platforms

Next.js can deploy to:
- Netlify
- AWS
- Heroku
- Self-hosted servers

## Migration Checklist

- [x] Updated dependencies to Next.js 16
- [x] Migrated folder structure to app/ router
- [x] Converted pages to route segments
- [x] Updated imports to use path aliases (@/)
- [x] Added 'use client' directives to interactive components
- [x] Updated Tailwind config for Next.js
- [x] Created lib/ folder for utilities and context
- [x] Updated environment variable names (NEXT_PUBLIC_ prefix)
- [x] Created TypeScript configuration
- [x] Added layout.tsx files

## Next Steps

1. Review the new file structure in the `/app` folder
2. Test all pages and functionality
3. Update API endpoints in `lib/api/endpoints.ts`
4. Add more pages following the pattern
5. Deploy to Vercel or your preferred platform

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Support](https://nextjs.org/docs/basic-features/typescript)

## Support

For issues with:
- **Next.js**: https://github.com/vercel/next.js
- **React**: https://react.dev
- **Tailwind**: https://tailwindcss.com

Enjoy the improved performance and developer experience! 🚀
