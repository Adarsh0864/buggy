# Deployment Guide

## Environment Variables

### Backend (Railway)
```
DATABASE_URL=postgresql://user:password@host:port/database
RAILWAY_ENVIRONMENT=production
FRONTEND_URL=https://your-app.netlify.app
```

### Frontend (Netlify)
```
REACT_APP_API_URL=https://your-backend.railway.app
```

## Deployment Steps

### 1. Backend Deployment (Railway)
1. Go to [Railway.app](https://railway.app) and create account
2. Create new project
3. Connect your GitHub repository
4. Add PostgreSQL service to your project
5. Set environment variables in Railway dashboard
6. Deploy will happen automatically

### 2. Frontend Deployment (Netlify)
1. Go to [Netlify.com](https://netlify.com) and create account
2. Connect your GitHub repository
3. Set build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`
4. Set environment variables in Netlify dashboard
5. Deploy will happen automatically

## Production URLs
- Backend: https://your-backend.railway.app
- Frontend: https://your-frontend.netlify.app 