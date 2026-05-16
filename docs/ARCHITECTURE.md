# Dytor Manager - System Architecture

## Overview

Dytor Manager is a modern, modular React-based admin dashboard designed to manage all aspects of the Dytor infrastructure and user base. The application follows a component-driven architecture with separation of concerns.

## Technology Stack

### Frontend
- **React 18**: Core UI library
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client for API communication
- **React Icons**: Icon library (Feather icons)

### State Management
- **React Context API**: Global state management
- **Local Storage**: Client-side persistence

### Build & Development
- **React Scripts**: Create React App tooling
- **ESLint**: Code linting
- **Jest**: Testing framework

## Folder Structure

```
src/
├── components/        # Reusable UI components
│   ├── Sidebar.jsx   # Navigation sidebar
│   └── Header.jsx    # Top header bar
├── pages/            # Page components (route-based)
│   ├── Dashboard.jsx
│   ├── UserManagement.jsx
│   ├── TeamManagement.jsx
│   ├── Infrastructure.jsx
│   └── Settings.jsx
├── context/          # React Context for state
│   └── AdminContext.jsx
├── hooks/            # Custom React hooks
│   └── useAdmin.js
├── utils/            # Utility functions
│   └── api.js       # API service layer
├── styles/           # Global styles
│   ├── index.css
│   └── variables.css
├── App.jsx          # Main app component
└── index.jsx        # Entry point
```

## Core Components

### Sidebar Component
- Fixed navigation menu
- Menu items with icons and badges
- Responsive (collapses on mobile)
- Quick links to documentation and support

### Header Component
- User profile dropdown
- Notification bell with counter
- Responsive layout with hamburger menu

### Pages
Each page follows a consistent pattern:
1. Page header with title and description
2. Primary action button (e.g., "Add User")
3. Search/filter controls
4. Main content area (table, grid, or form)
5. Optional footer with pagination

## Data Flow

```
Component
    ↓
AdminContext (useAdmin hook)
    ↓
API Service (utils/api.js)
    ↓
Backend API
```

### Example: Fetching Users

```javascript
// 1. In UserManagement.jsx
const { currentUser } = useAdmin();

// 2. Hook calls API service
useEffect(() => {
  userAPI.getAll()
    .then(response => setUsers(response.data))
    .catch(error => console.error(error));
}, []);

// 3. API service (utils/api.js) handles the request
export const userAPI = {
  getAll: () => api.get('/users'),
};

// 4. Axios interceptors handle auth tokens and errors
```

## Styling Strategy

### Tailwind CSS
- Utility-first approach
- Dark theme (gray-900 background)
- Consistent spacing and sizing
- Reusable component classes

### Color Palette
- **Primary**: Blue (#2563eb)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Background**: Gray-900 (#111827)
- **Surfaces**: Gray-800 (#1f2937)

## State Management

### AdminContext
Provides:
- `currentUser`: Authenticated user info
- `notifications`: App notifications
- `systemStatus`: System health data
- `addNotification()`: Add notification
- `removeNotification()`: Remove notification
- `hasPermission()`: Check user permissions

### Usage
```javascript
import { useAdmin } from '../context/AdminContext';

function MyComponent() {
  const { currentUser, addNotification } = useAdmin();
  
  return <div>{currentUser.name}</div>;
}
```

## API Service Layer

### Organization
The API service (`utils/api.js`) is organized by domain:
- `userAPI`: User management endpoints
- `teamAPI`: Team management endpoints
- `infrastructureAPI`: Infrastructure monitoring endpoints
- `settingsAPI`: System settings endpoints
- `dashboardAPI`: Dashboard data endpoints
- `authAPI`: Authentication endpoints

### Error Handling
- Automatic 401 redirect to login
- Request/response interceptors
- Token management in headers

## Security Considerations

### Authentication
- JWT token-based authentication
- Token stored in localStorage
- Automatic token refresh on 401

### Authorization
- Role-based access control (RBAC)
- Permission checking via `hasPermission()`
- Admin-only routes and actions

### Data Protection
- HTTPS for all API communication
- Secure token transmission in headers
- Sensitive data handling in forms

## Performance Optimizations

### Code Splitting
- Route-based code splitting (lazy loading)
- Component-level splitting via React.lazy()

### Memoization
- React.memo for pure components
- useCallback for function optimization
- useMemo for computed values

### Rendering
- Virtualization for large lists
- Pagination for data-heavy tables
- Conditional rendering to reduce DOM

## Testing Strategy

### Unit Tests
- Component snapshot tests
- Utility function tests
- API service mocking

### Integration Tests
- Page-level integration tests
- Context Provider testing
- Navigation testing

### E2E Tests
- Critical user flows
- Form submissions
- Error scenarios

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Docker
```bash
docker build -t dytor-manager .
docker run -p 3000:3000 dytor-manager
```

## Future Enhancements

1. **Advanced Features**
   - Real-time notifications via WebSocket
   - Advanced filtering and search
   - Custom dashboard widgets
   - Data export functionality

2. **Performance**
   - React Query for data caching
   - Suspense for async operations
   - Service Worker for offline capability

3. **Developer Experience**
   - Storybook for component documentation
   - TypeScript for type safety
   - Vitest for faster testing

4. **Infrastructure**
   - Multi-environment deployment
   - CI/CD pipeline integration
   - Automated testing and linting
   - Performance monitoring

## Contributing Guidelines

1. Follow the existing folder structure
2. Use functional components with hooks
3. Write components with default exports
4. Keep components focused and single-purpose
5. Use Tailwind CSS utility classes
6. Document complex logic with comments
7. Write tests for new features

## Support

For questions about architecture or development:
- Check existing code patterns
- Review component documentation
- Consult the API service layer
- Reference Tailwind CSS docs
