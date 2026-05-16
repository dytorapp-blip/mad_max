# Dytor Manager - Quick Start Guide

## What is Dytor Manager?

Dytor Manager (dytor_man) is the admin and infrastructure management system for Dytor. It provides a comprehensive dashboard for managing users, teams, infrastructure, and system settings across your Dytor deployment.

## 5-Minute Setup

### 1. Install Dependencies

```bash
cd dytor_man
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and update API URL:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
dytor_man/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Sidebar.jsx   # Navigation sidebar
│   │   └── Header.jsx    # Top header
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── UserManagement.jsx
│   │   ├── TeamManagement.jsx
│   │   ├── Infrastructure.jsx
│   │   └── Settings.jsx
│   ├── context/         # React Context state
│   │   └── AdminContext.jsx
│   ├── utils/           # Utility functions
│   │   └── api.js       # API service
│   ├── styles/          # CSS files
│   └── App.jsx          # Main app component
├── public/              # Static files
├── docs/                # Documentation
├── package.json         # Dependencies
└── tailwind.config.js   # Tailwind CSS config
```

## Key Features

### Dashboard
- Real-time metrics and statistics
- System health monitoring
- Recent activity feed

### User Management
- Create/edit/delete users
- Role and permission assignment
- User search and filtering

### Team Management
- Create and manage teams
- Assign team members
- Team analytics

### Infrastructure Monitoring
- Server status and health checks
- Resource utilization (CPU, memory, storage)
- Performance metrics

### Settings
- Email configuration
- Security settings
- Backup and recovery options

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start                # Serve production build

# Testing
npm test                 # Run tests
npm run test:coverage    # Coverage report

# Code Quality
npm run lint             # Run linter
npm run format           # Format code
```

## Directory Overview

### `/src/components`
Reusable UI components like Sidebar, Header, and form elements. Keep components focused and single-purpose.

### `/src/pages`
Full page components that represent routes. Each page imports necessary components and handles page-level logic.

### `/src/context`
React Context for global state management. Currently includes AdminContext for user, notifications, and permissions.

### `/src/utils`
Utility functions including:
- `api.js` - API service layer with axios configuration

### `/src/styles`
Global CSS and Tailwind configuration. Uses Tailwind CSS utility classes for styling.

## Making Changes

### Add a New Page

1. Create file: `src/pages/MyPage.jsx`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/mypage" element={<MyPage />} />
   ```
3. Add menu item in `src/components/Sidebar.jsx`

### Add a New Component

1. Create file: `src/components/MyComponent.jsx`
2. Use it in pages:
   ```jsx
   import MyComponent from '../components/MyComponent';
   ```

### Make API Calls

Use the API service in `src/utils/api.js`:

```javascript
import { userAPI } from '../utils/api';

// In your component
useEffect(() => {
  userAPI.getAll()
    .then(response => setUsers(response.data))
    .catch(error => console.error(error));
}, []);
```

### Access Global State

Use the AdminContext:

```javascript
import { useAdmin } from '../context/AdminContext';

function MyComponent() {
  const { currentUser, addNotification } = useAdmin();
  
  return <div>{currentUser.name}</div>;
}
```

## Styling with Tailwind CSS

Dytor Manager uses Tailwind CSS for styling. Use utility classes directly in JSX:

```jsx
<div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
  <h2 className="text-xl font-bold text-white mb-4">Title</h2>
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
    Click Me
  </button>
</div>
```

## API Integration

Dytor Manager communicates with a backend API. Required endpoints are documented in `docs/API.md`.

### Example: Fetching Users

```javascript
// 1. Import API service
import { userAPI } from '../utils/api';

// 2. Make request
const response = await userAPI.getAll();

// 3. Handle response
const users = response.data;
```

### Authentication

The API service automatically:
- Adds JWT token from localStorage to requests
- Handles token refresh on 401
- Redirects to login if needed

## Debugging

### Browser DevTools
- **Console**: See errors and logs
- **Network**: Check API calls
- **Elements**: Inspect component structure

### React Developer Tools
Install React DevTools browser extension for component inspection and state debugging.

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` directory with:
- Minified code
- Tree-shaken dependencies
- Optimized assets

Serve locally:
```bash
npm start
```

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
See `docs/SETUP.md` for Netlify, AWS, Heroku, etc.

## Documentation

- **README.md** - Project overview and features
- **docs/SETUP.md** - Detailed installation and configuration
- **docs/ARCHITECTURE.md** - System design and patterns
- **docs/API.md** - API endpoints and usage

## Troubleshooting

### Port 3000 in use?
```bash
PORT=3001 npm run dev
```

### Dependencies not installing?
```bash
rm -rf node_modules package-lock.json
npm install
```

### API not connecting?
- Check `REACT_APP_API_URL` in `.env.local`
- Verify backend API is running
- Check CORS configuration on backend
- Look at Network tab in DevTools

### Styling issues?
- Clear browser cache
- Rebuild with `npm run build`
- Check Tailwind config is correct

## Next Steps

1. **Customize Colors**: Edit `tailwind.config.js`
2. **Add More Pages**: Follow "Add a New Page" guide
3. **Connect API**: Update API endpoints in `src/utils/api.js`
4. **Add Branding**: Replace "Dytor Manager" with your app name
5. **Deploy**: Follow deployment instructions

## Getting Help

1. Check the documentation in `/docs`
2. Review existing code patterns
3. Check browser console for errors
4. Verify backend API is running and accessible

## Support

For issues with:
- **React**: https://react.dev
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com
- **Axios**: https://axios-http.com

Happy building! 🚀
