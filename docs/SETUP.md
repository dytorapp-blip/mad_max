# Dytor Manager - Setup Guide

## Prerequisites

Before installing Dytor Manager, ensure you have:
- **Node.js** 16.x or higher
- **npm** 7.x or higher (or yarn/pnpm)
- **Git** for version control
- A backend API server running (See API Configuration below)

Check your versions:
```bash
node --version
npm --version
```

## Installation

### Step 1: Clone or Download the Repository

```bash
cd dytor_man
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including React, React Router, Tailwind CSS, and other dependencies.

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration
REACT_APP_APP_NAME=Dytor Manager
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

**Environment Variables Explanation:**

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `REACT_APP_APP_NAME` | Application display name | `Dytor Manager` |
| `REACT_APP_VERSION` | Version number | `1.0.0` |
| `REACT_APP_ENABLE_ANALYTICS` | Enable analytics tracking | `true` |
| `REACT_APP_ENABLE_NOTIFICATIONS` | Enable real-time notifications | `true` |

## Development Server

Start the development server:

```bash
npm run dev
```

The app will be available at:
- **Local**: http://localhost:3000
- **Network**: http://<your-ip>:3000

### Hot Module Reloading (HMR)
Changes to files are automatically reloaded in the browser without a full page refresh.

## Building for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized build in the `build/` directory with:
- Minified JavaScript and CSS
- Tree-shaken unused code
- Optimized images and assets

### Serve Production Build Locally

```bash
npm start
```

Or using `serve`:

```bash
npm install -g serve
serve -s build
```

## Docker Deployment

### Build Docker Image

Create a `Dockerfile` in the root directory:

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

### Build and Run

```bash
# Build image
docker build -t dytor-manager .

# Run container
docker run -p 3000:3000 dytor-manager

# Run with environment file
docker run -p 3000:3000 --env-file .env.local dytor-manager
```

## Backend API Configuration

### API Endpoints Required

The backend API should provide these endpoints:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh auth token
- `GET /api/auth/profile` - Get current user profile

#### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/search?q=query` - Search users

#### Teams
- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `GET /api/teams/:id/members` - Get team members

#### Infrastructure
- `GET /api/infrastructure/servers` - Get all servers
- `GET /api/infrastructure/servers/:id` - Get server status
- `GET /api/infrastructure/metrics` - Get system metrics
- `GET /api/infrastructure/health` - Get system health

#### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings
- `GET /api/settings/email` - Get email config
- `PUT /api/settings/email` - Update email config
- `POST /api/settings/email/test` - Test email connection

#### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get recent activity

### API Response Format

All API responses should follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Testing

### Run Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Test File Organization

Tests should be placed next to their source files:

```
src/
├── components/
│   ├── Button.jsx
│   └── Button.test.jsx
├── pages/
│   ├── Dashboard.jsx
│   └── Dashboard.test.jsx
```

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already in use, specify a different port:

```bash
PORT=3001 npm run dev
```

Or kill the process using the port:

```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind CSS Not Loading

Ensure the Tailwind CSS file is imported in `src/index.jsx`:

```javascript
import './styles/tailwind.css';
```

And check that `tailwind.config.js` includes all content paths:

```javascript
content: [
  "./index.html",
  "./src/**/*.{js,jsx}",
]
```

### API Connection Issues

1. Verify backend is running
2. Check `REACT_APP_API_URL` in `.env.local`
3. Ensure CORS is configured on backend
4. Check browser console for error messages

## Performance Optimization

### Code Splitting

The app automatically code-splits by route. No additional configuration needed.

### Bundle Analysis

Analyze bundle size:

```bash
npm install -g source-map-explorer
npm run build
source-map-explorer 'build/static/js/*.js'
```

### Environment-Specific Builds

Create separate `.env` files:

```
.env.local       # Local development
.env.staging     # Staging environment
.env.production  # Production environment
```

Then build with:

```bash
REACT_APP_ENV=staging npm run build
```

## Deployment Platforms

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### AWS S3 + CloudFront

```bash
npm run build
aws s3 sync build/ s3://your-bucket-name/
```

### Heroku

```bash
heroku login
git push heroku main
```

## Security

### Environment Variables
- Never commit `.env.local` to git
- Add `.env.local` to `.gitignore`
- Use different credentials for each environment

### HTTPS
- Always use HTTPS in production
- Configure SSL certificates

### Authentication
- Store JWT tokens securely (httpOnly cookies recommended)
- Implement token refresh mechanism
- Clear tokens on logout

### API Security
- Validate all inputs on backend
- Implement rate limiting
- Use CORS appropriately

## Monitoring & Logging

### Development
- Check browser console for errors
- Use Redux DevTools for state debugging
- Network tab for API calls

### Production
- Set up error tracking (e.g., Sentry)
- Enable analytics
- Monitor performance metrics
- Track user actions and errors

## Support & Resources

- **React Docs**: https://react.dev
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com
- **Axios**: https://axios-http.com
- **Node.js**: https://nodejs.org

## Getting Help

1. Check the troubleshooting section above
2. Review existing code patterns in the codebase
3. Check the ARCHITECTURE.md for design decisions
4. Consult React and dependency documentation
5. Check browser console for error messages
