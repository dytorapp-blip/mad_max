# Dytor Manager - Next.js 16 Edition

> Successfully upgraded from Create React App to Next.js 16 with the App Router

## 🎯 What's New

✅ **Next.js 16** with App Router architecture  
✅ **Full TypeScript** support throughout  
✅ **Built-in optimizations** (code splitting, caching, image optimization)  
✅ **Tailwind CSS 3.4** integrated  
✅ **React 19** with latest features  
✅ **Modern folder structure** using app/ router  
✅ **Route groups** for organized layouts  
✅ **Path aliases** (@/) for clean imports  

## 🚀 Quick Start

### 1. Install & Setup

```bash
cd dytor_man
npm install
cp .env.example .env.local
npm run dev
```

### 2. Access the App

```
http://localhost:3000
```

### 3. Available Routes

```
/                    Dashboard
/users               User Management
/teams               Team Management
/infrastructure      Infrastructure Monitoring
/settings            System Settings
```

## 📁 Project Structure

```
dytor_man/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Route group for admin pages
│   │   ├── layout.tsx            # Admin layout (Sidebar + Header)
│   │   ├── page.tsx              # Dashboard
│   │   ├── users/page.tsx
│   │   ├── teams/page.tsx
│   │   ├── infrastructure/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles with @tailwind
│
├── components/                   # Reusable components
│   ├── Sidebar.tsx
│   └── Header.tsx
│
├── lib/                          # Utilities & business logic
│   ├── context/
│   │   └── AdminContext.tsx      # Global state
│   └── api/
│       ├── client.ts             # Axios instance
│       └── endpoints.ts          # API calls
│
├── public/                       # Static files
├── docs/                         # Documentation
│
├── package.json
├── next.config.js               # Next.js config
├── tailwind.config.js           # Tailwind config
├── tsconfig.json                # TypeScript config
├── postcss.config.js            # PostCSS config
└── .env.example                 # Environment template
```

## 🔧 Configuration Files

### next.config.js
```javascript
// Next.js configuration
- SWC minification enabled
- Security headers configured
- Image optimization settings
```

### tailwind.config.js
```javascript
// Updated for Next.js App Router
- Content paths point to app/ and components/
- Custom color palette
- Typography and spacing extensions
```

### tsconfig.json
```json
// Full TypeScript support
- Path aliases (@/)
- Strict mode enabled
- Next.js plugin configured
```

### app/globals.css
```css
/* Global styles with Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🎨 Key Components

### app/(admin)/layout.tsx
Wraps all admin pages with:
- Sidebar navigation
- Top header bar
- Responsive design

### app/(admin)/page.tsx
Dashboard with:
- Real-time metrics
- Activity feed
- System status

### components/Sidebar.tsx
- Navigation menu
- Active route highlighting
- Quick links
- Responsive drawer

### components/Header.tsx
- User profile dropdown
- Notifications bell
- Menu toggle for mobile

## 🔌 API Integration

### lib/api/client.ts
```typescript
- Axios instance with baseURL from env
- Automatic JWT token injection
- 401 redirect handling
- Error interceptors
```

### lib/api/endpoints.ts
```typescript
- userAPI: User management
- teamAPI: Team operations
- infrastructureAPI: Monitoring
- settingsAPI: Configuration
- dashboardAPI: Dashboard data
- authAPI: Authentication
```

## 🎯 State Management

### lib/context/AdminContext.tsx
```typescript
- currentUser: Authenticated user info
- notifications: App-wide notifications
- systemStatus: System health
- hasPermission(): Permission checking
- addNotification(): Toast-like notifications
```

Usage:
```typescript
'use client';
import { useAdmin } from '@/lib/context/AdminContext';

export default function Component() {
  const { currentUser, addNotification } = useAdmin();
  // ...
}
```

## 🎨 Styling

All components use **Tailwind CSS** utility classes:

```typescript
<div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
  <h2 className="text-xl font-bold text-white">Title</h2>
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
    Click Me
  </button>
</div>
```

**Color Palette:**
- Primary: Blue (#2563eb)
- Success: Green
- Warning: Yellow
- Danger: Red
- Background: Gray-900 (#111827)
- Surfaces: Gray-800 (#1f2937)

## 📦 Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # ESLint check
npm run type-check       # TypeScript check
```

## 🚀 Deployment

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
Next.js deploys to Netlify, AWS, Heroku, and self-hosted servers.

## 📚 Documentation

- **NEXT_UPGRADE.md** - Detailed migration guide from CRA to Next.js
- **docs/SETUP.md** - Installation and configuration
- **docs/ARCHITECTURE.md** - System design patterns
- **docs/API.md** - API endpoint documentation
- **QUICKSTART.md** - Quick reference guide

## 🆚 What Changed from CRA

| Feature | CRA | Next.js 16 |
|---------|-----|-----------|
| Bundler | Webpack | SWC (faster) |
| File Structure | src/pages | app/ router |
| CSS | CSS imports | Tailwind + CSS modules |
| TypeScript | Optional | Built-in |
| API Routes | External API | /app/api/route.ts |
| Image Optimization | Manual | Built-in <Image> |
| Code Splitting | Manual | Automatic |
| Caching | None | Built-in strategies |

## ✨ Next.js 16 Benefits

1. **Faster Build Times**: SWC compiler (3x faster than Babel)
2. **Better Performance**: Automatic code splitting
3. **Improved DX**: Hot module replacement, better errors
4. **Server Components**: Render on server to reduce JS
5. **Built-in Optimizations**: Images, fonts, scripts
6. **API Routes**: No need for external backend for simple APIs
7. **Middleware**: Edge runtime for custom logic
8. **Analytics**: Built-in Core Web Vitals

## 🐛 Troubleshooting

### Port 3000 in Use
```bash
PORT=3001 npm run dev
```

### Module Not Found
Make sure imports use path aliases:
```typescript
// ✅ Correct
import { useAdmin } from '@/lib/context/AdminContext';

// ❌ Wrong
import { useAdmin } from '../context/AdminContext';
```

### Hydration Errors
Add `'use client'` at the top of interactive components:
```typescript
'use client';

export default function Component() {
  // ...
}
```

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Update Environment Variables

For Next.js, environment variables accessible in the browser must start with `NEXT_PUBLIC_`:

```env
# Public (available in browser)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Dytor Manager

# Private (server-only)
DATABASE_URL=...
SECRET_KEY=...
```

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [React 19 Features](https://react.dev/blog/2024/12/19/react-19)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript in Next.js](https://nextjs.org/docs/basic-features/typescript)

## 🤝 Contributing

When adding new features:
1. Create pages in `app/(admin)/feature/page.tsx`
2. Add components in `components/`
3. Use TypeScript (.tsx) files
4. Follow the Tailwind CSS utility pattern
5. Add `'use client'` for interactive components

## 📝 License

Part of the Dytor ecosystem.

---

**Happy building with Next.js 16! 🚀**

For detailed migration information, see **NEXT_UPGRADE.md**
