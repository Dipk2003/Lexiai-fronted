# LexiAI Frontend Deployment Guide

## 🚀 Complete Legal Case Research Platform

This comprehensive guide covers deploying the LexiAI frontend application to production environments.

## 📋 Pre-Deployment Checklist

- [x] ✅ Professional login system with authentication
- [x] ✅ Comprehensive dashboard with analytics and charts
- [x] ✅ Advanced case research interface with AI-powered search
- [x] ✅ Detailed case viewing with full text and similar cases
- [x] ✅ User profile and settings management
- [x] ✅ Responsive Material-UI design for all devices
- [x] ✅ Complete TypeScript integration for type safety
- [x] ✅ Backend API integration with proper error handling
- [x] ✅ Environment configurations for different stages
- [x] ✅ Professional legal theme and branding

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Context + React Query
- **Routing**: React Router v7
- **HTTP Client**: Axios with interceptors
- **Charts**: Recharts for analytics visualization
- **Date Handling**: date-fns
- **Build Tool**: Create React App

## 🏗️ Build Process

### 1. Environment Setup

Create environment files for different stages:

```bash
# .env.development
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_APP_NAME=LexiAI
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development

# .env.production
REACT_APP_API_BASE_URL=https://api.lexiai.com
REACT_APP_APP_NAME=LexiAI
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Build for Production

```bash
# Standard build
npm run build

# Production build with environment
npm run build:prod

# Staging build
npm run build:staging
```

## 🌐 Deployment Options

### Option 1: Static Hosting (Recommended)

#### AWS S3 + CloudFront
```bash
# 1. Build the application
npm run build:prod

# 2. Upload to S3 bucket
aws s3 sync build/ s3://your-bucket-name --delete

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### Netlify
```bash
# 1. Build the application
npm run build:prod

# 2. Deploy to Netlify
netlify deploy --prod --dir=build
```

#### Vercel
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

### Option 2: Docker Deployment

Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps --only=production
COPY . .
RUN npm run build:prod

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional)
    location /api/ {
        proxy_pass http://backend:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Build and run:
```bash
docker build -t lexiai-frontend .
docker run -p 80:80 lexiai-frontend
```

### Option 3: Kubernetes Deployment

Create `k8s-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lexiai-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: lexiai-frontend
  template:
    metadata:
      labels:
        app: lexiai-frontend
    spec:
      containers:
      - name: frontend
        image: lexiai-frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_API_BASE_URL
          value: "https://api.lexiai.com"
---
apiVersion: v1
kind: Service
metadata:
  name: lexiai-frontend-service
spec:
  selector:
    app: lexiai-frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

Deploy:
```bash
kubectl apply -f k8s-deployment.yaml
```

## 🔧 Backend Integration

The frontend is designed to work with a REST API backend. Ensure your backend provides:

### Required Endpoints

1. **Authentication**
   - `POST /auth/login` - User login
   - `GET /auth/me` - Get current user
   - `POST /auth/logout` - User logout
   - `POST /auth/refresh` - Refresh token

2. **Case Research**
   - `POST /research/search` - Search cases
   - `GET /research/cases/:id` - Get case details
   - `GET /research/cases/:id/similar` - Get similar cases

3. **User Management**
   - `PATCH /users/profile` - Update user profile
   - `PATCH /users/settings` - Update user settings
   - `POST /users/avatar` - Upload avatar

4. **Analytics**
   - `GET /analytics/dashboard` - Get dashboard data

5. **Metadata**
   - `GET /metadata/courts` - Get available courts
   - `GET /metadata/categories` - Get case categories

### API Response Format

All endpoints should return responses in this format:
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

## 🔐 Security Considerations

### 1. Environment Variables
- Never commit `.env` files with sensitive data
- Use environment-specific configurations
- Ensure API URLs use HTTPS in production

### 2. Authentication
- JWT tokens are stored in localStorage
- Automatic token refresh on expiry
- Secure logout clears all auth data

### 3. API Security
- CORS configuration for your domain
- Rate limiting on backend APIs
- Input validation and sanitization

## 📊 Performance Optimization

### 1. Build Optimizations
- Code splitting with React.lazy()
- Tree shaking for unused code
- Minification and compression

### 2. Caching Strategy
```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Don't cache HTML
location ~* \.(html)$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

### 3. CDN Configuration
- Enable gzip compression
- Set appropriate cache headers
- Use HTTP/2 for improved performance

## 🔍 Monitoring and Analytics

### 1. Application Monitoring
```javascript
// Add to src/utils/monitoring.js
export const logError = (error, context) => {
  // Send to monitoring service
  console.error('Application Error:', error, context);
};

export const trackEvent = (event, properties) => {
  // Send to analytics service
  console.log('Event:', event, properties);
};
```

### 2. Performance Monitoring
- Monitor Core Web Vitals
- Track API response times
- Monitor error rates

## 🧪 Testing Strategy

### 1. Unit Tests
```bash
npm test
```

### 2. Integration Tests
```bash
npm run test:integration
```

### 3. E2E Tests
```bash
npm run test:e2e
```

## 🚀 Continuous Deployment

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci --legacy-peer-deps
      
    - name: Build application
      run: npm run build:prod
      
    - name: Deploy to S3
      run: aws s3 sync build/ s3://${{ secrets.S3_BUCKET }} --delete
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 📱 Mobile Optimization

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

### Progressive Web App (PWA)
Add PWA capabilities:
```json
// public/manifest.json
{
  "name": "LexiAI Legal Research",
  "short_name": "LexiAI",
  "description": "Professional legal case research platform",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1976d2",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🆘 Troubleshooting

### Common Issues

1. **Dependency Conflicts**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Build Errors**
   ```bash
   npm run build:prod 2>&1 | tee build.log
   ```

3. **Runtime Errors**
   - Check browser console for errors
   - Verify API endpoint connectivity
   - Ensure environment variables are set

### Debug Mode
```bash
REACT_APP_DEBUG=true npm start
```

## 📞 Support

For deployment issues or questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

## 🎯 Production Checklist

Before going live, ensure:

- [ ] Backend API is deployed and accessible
- [ ] Environment variables are configured
- [ ] SSL certificates are installed
- [ ] Domain DNS is configured
- [ ] Monitoring and logging are set up
- [ ] Error tracking is enabled
- [ ] Performance monitoring is active
- [ ] Security headers are configured
- [ ] CORS is properly configured
- [ ] CDN is set up for static assets

## 🔄 Post-Deployment

After successful deployment:

1. **Test all functionality**
   - Login/logout flow
   - Case search and filtering
   - Dashboard analytics
   - Profile management
   - Mobile responsiveness

2. **Monitor performance**
   - Page load times
   - API response times
   - Error rates

3. **User feedback**
   - Collect user feedback
   - Monitor support tickets
   - Track user engagement

---

**Your professional legal case research platform is now ready for production use!** 🎉

Built with ❤️ for legal professionals
