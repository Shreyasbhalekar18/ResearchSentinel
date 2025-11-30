# Vercel Deployment Error Prevention Guide

## 🛡️ Common Vercel Errors & Solutions

This guide addresses all the common Vercel deployment errors you mentioned and how to prevent them.

---

## 📋 Error Categories

### 1. Function Errors

#### FUNCTION_INVOCATION_FAILED (500)
**Cause**: Serverless function crashed during execution
**Prevention**:
- ✅ Add try-catch blocks in all API routes
- ✅ Validate all inputs
- ✅ Use error boundaries in React components
- ✅ Test functions locally before deploying

#### FUNCTION_INVOCATION_TIMEOUT (504)
**Cause**: Function exceeded 10-second timeout (Hobby plan)
**Prevention**:
- ✅ Optimize database queries
- ✅ Use caching for expensive operations
- ✅ Move long-running tasks to background jobs
- ✅ Upgrade to Pro plan for 60-second timeout

#### EDGE_FUNCTION_INVOCATION_TIMEOUT (504)
**Cause**: Edge function exceeded timeout
**Prevention**:
- ✅ Keep edge functions lightweight
- ✅ Avoid heavy computations in edge runtime
- ✅ Use standard serverless functions for heavy tasks

#### NO_RESPONSE_FROM_FUNCTION (502)
**Cause**: Function didn't return a response
**Prevention**:
- ✅ Always return a Response object
- ✅ Handle all code paths
- ✅ Add fallback responses

```typescript
// ✅ Good
export default async function handler(req: Request) {
  try {
    const data = await fetchData();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ❌ Bad - might not return response
export default async function handler(req: Request) {
  const data = await fetchData(); // Could throw error
  return new Response(JSON.stringify(data));
}
```

---

### 2. Request Errors

#### REQUEST_HEADER_TOO_LARGE (431)
**Cause**: Request headers exceed 16KB limit
**Prevention**:
- ✅ Don't store large data in headers
- ✅ Use request body for large payloads
- ✅ Minimize cookie size

#### URL_TOO_LONG (414)
**Cause**: URL exceeds 8KB limit
**Prevention**:
- ✅ Use POST instead of GET for large data
- ✅ Paginate results
- ✅ Use request body for complex queries

#### FUNCTION_PAYLOAD_TOO_LARGE (413)
**Cause**: Request body exceeds size limit
**Prevention**:
- ✅ Set proper body size limits in next.config.js
- ✅ Use chunked uploads for large files
- ✅ Compress data before sending

```javascript
// next.config.js
module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Adjust as needed
    },
  },
}
```

---

### 3. Deployment Errors

#### DEPLOYMENT_NOT_FOUND (404)
**Cause**: Deployment was deleted or doesn't exist
**Prevention**:
- ✅ Don't delete deployments manually
- ✅ Use proper deployment URLs
- ✅ Check deployment status before accessing

#### DEPLOYMENT_NOT_READY_REDIRECTING (303)
**Cause**: Deployment is still building
**Prevention**:
- ✅ Wait for build to complete
- ✅ Use deployment webhooks for notifications
- ✅ Check deployment status via API

---

### 4. Routing Errors

#### ROUTER_CANNOT_MATCH (502)
**Cause**: No route matches the request
**Prevention**:
- ✅ Define catch-all routes
- ✅ Add proper 404 pages
- ✅ Validate route configurations

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}
```

#### TOO_MANY_FILESYSTEM_CHECKS (502)
**Cause**: Too many file system operations
**Prevention**:
- ✅ Use dynamic imports
- ✅ Optimize file structure
- ✅ Cache file reads

---

### 5. Image Optimization Errors

#### INVALID_IMAGE_OPTIMIZE_REQUEST (400)
**Cause**: Invalid image optimization parameters
**Prevention**:
- ✅ Use Next.js Image component correctly
- ✅ Validate image URLs
- ✅ Configure allowed domains

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },
}
```

---

### 6. DNS & Network Errors

#### DNS_HOSTNAME_NOT_FOUND (502)
**Cause**: Cannot resolve hostname
**Prevention**:
- ✅ Verify domain configuration
- ✅ Check DNS propagation
- ✅ Use valid hostnames

#### DNS_HOSTNAME_RESOLVED_PRIVATE (404)
**Cause**: Hostname resolves to private IP
**Prevention**:
- ✅ Don't use localhost in production
- ✅ Use public URLs
- ✅ Configure environment variables correctly

---

## 🔧 ResearchSentinel-Specific Fixes

### 1. Environment Variables Setup

Create `.env.local` (for local development):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=ResearchSentinel
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

In Vercel Dashboard, add:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_NAME=ResearchSentinel
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 2. API Client Configuration

We've created `src/lib/api-client.ts` that:
- ✅ Handles all API errors gracefully
- ✅ Auto-retries failed requests
- ✅ Manages authentication tokens
- ✅ Provides consistent error messages

### 3. Error Boundary Implementation

We've added `ErrorBoundary` component that:
- ✅ Catches React errors
- ✅ Shows user-friendly error messages
- ✅ Prevents white screen of death
- ✅ Logs errors for debugging

### 4. Next.js Configuration

Our `next.config.mjs` includes:
- ✅ Security headers
- ✅ Image optimization
- ✅ Webpack fallbacks
- ✅ Production optimizations

---

## 🚀 Pre-Deployment Checklist

### Code Quality
- [ ] All API calls use error handling
- [ ] All components wrapped in error boundaries
- [ ] Environment variables configured
- [ ] No hardcoded URLs (use config)
- [ ] All imports resolve correctly

### Testing
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All pages load correctly
- [ ] API integration works

### Configuration
- [ ] `next.config.mjs` properly configured
- [ ] `vercel.json` present (if needed)
- [ ] Environment variables set in Vercel
- [ ] CORS configured in backend
- [ ] Database connection string updated

### Performance
- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] No memory leaks
- [ ] Lazy loading implemented
- [ ] Caching configured

---

## 🔍 Debugging Deployed App

### 1. Check Vercel Logs
```bash
vercel logs [deployment-url]
```

### 2. Enable Debug Mode
Add to Vercel environment variables:
```
DEBUG=true
NODE_ENV=production
```

### 3. Test API Endpoints
Use browser console or Postman to test:
```javascript
fetch('https://your-app.vercel.app/api/test')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### 4. Check Network Tab
- Open browser DevTools
- Go to Network tab
- Look for failed requests
- Check response headers and body

---

## 📊 Monitoring

### Set Up Error Tracking
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Add Analytics
```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🆘 Emergency Fixes

### If Build Fails
1. Check build logs in Vercel dashboard
2. Run `npm run build` locally
3. Fix any TypeScript/ESLint errors
4. Commit and push again

### If App Crashes
1. Check Vercel function logs
2. Add more error handling
3. Roll back to previous deployment
4. Fix issue and redeploy

### If API Calls Fail
1. Verify backend is running
2. Check CORS configuration
3. Verify environment variables
4. Test API endpoints directly

---

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ All pages load correctly
- ✅ API calls work
- ✅ No console errors
- ✅ Authentication works
- ✅ File uploads work
- ✅ Reports generate correctly

---

## 📞 Getting Help

1. **Vercel Documentation**: https://vercel.com/docs
2. **Next.js Documentation**: https://nextjs.org/docs
3. **Vercel Support**: support@vercel.com
4. **Community**: https://github.com/vercel/next.js/discussions

---

**Remember**: Most deployment errors are due to:
1. Missing environment variables
2. Incorrect API URLs
3. CORS configuration
4. Missing error handling
5. Timeout issues

We've addressed all of these in the updated code! 🎉
