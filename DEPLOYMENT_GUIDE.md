# ResearchSentinel Deployment Guide

## 🚀 Deploying to Vercel (Frontend)

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Code pushed to GitHub repository

### Step 1: Prepare Your Repository

1. **Ensure your code is pushed to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify frontend structure**:
   - Your Next.js app should be in the `frontend/` directory
   - `package.json` should be at `frontend/package.json`
   - `next.config.mjs` should be properly configured

### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)
   - **Install Command**: `npm install` (or leave default)

3. **Environment Variables** (CRITICAL):
   Add these in Vercel dashboard under "Environment Variables":
   
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_APP_NAME=ResearchSentinel
   NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
   NEXT_PUBLIC_ENABLE_AI_SUGGESTIONS=true
   NEXT_PUBLIC_ENABLE_REFERENCE_RECOMMENDATIONS=true
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)

### Step 3: Verify Deployment

1. Visit your deployed URL
2. Check browser console for errors
3. Test login/registration
4. Verify API calls work

---

## 🐍 Deploying Backend (Multiple Options)

### Option A: Railway (Recommended for Python)

1. **Create Railway Account**: https://railway.app

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**:
   ```
   SECRET_KEY=your-super-secret-production-key-change-this
   DATABASE_URL=sqlite:///./research_sentinel.db
   FRONTEND_URL=https://your-vercel-app.vercel.app
   OPENAI_API_KEY=sk-your-key-here (optional)
   SENDGRID_API_KEY=SG.your-key-here (optional)
   CROSSREF_EMAIL=your-email@university.edu
   ```

5. **Deploy**: Railway will auto-deploy

### Option B: Render

1. **Create Render Account**: https://render.com

2. **Create Web Service**:
   - Connect GitHub repository
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables** (same as Railway)

### Option C: Heroku

1. **Install Heroku CLI**

2. **Create Procfile** in `backend/`:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

3. **Create runtime.txt** in `backend/`:
   ```
   python-3.11.0
   ```

4. **Deploy**:
   ```bash
   cd backend
   heroku create your-app-name
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set FRONTEND_URL=https://your-vercel-app.vercel.app
   git push heroku main
   ```

---

## 🔧 Common Deployment Issues & Fixes

### Issue 1: CORS Errors
**Symptom**: API calls fail with CORS error in browser console

**Fix**:
1. Update `backend/main.py` CORS origins to include your Vercel URL
2. Add environment variable `FRONTEND_URL` in backend deployment
3. Redeploy backend

### Issue 2: Environment Variables Not Working
**Symptom**: App shows "undefined" or uses localhost URLs

**Fix**:
1. Ensure all `NEXT_PUBLIC_*` variables are set in Vercel
2. Redeploy frontend after adding variables
3. Check browser console for actual values

### Issue 3: Build Fails on Vercel
**Symptom**: Build fails with module errors

**Fix**:
1. Run `npm install` locally to update `package-lock.json`
2. Ensure all dependencies are in `package.json`, not `devDependencies`
3. Check Node.js version compatibility

### Issue 4: API Timeout Errors
**Symptom**: 504 Gateway Timeout

**Fix**:
1. Increase timeout in `next.config.mjs`
2. Optimize backend API responses
3. Add loading states in frontend

### Issue 5: Database Issues
**Symptom**: Database errors in production

**Fix**:
1. For production, use PostgreSQL instead of SQLite
2. Update `DATABASE_URL` environment variable
3. Run migrations on production database

### Issue 6: File Upload Fails
**Symptom**: File uploads don't work in production

**Fix**:
1. Check file size limits (Vercel: 4.5MB for serverless)
2. Use cloud storage (AWS S3, Cloudinary) for files
3. Update backend to handle cloud storage

---

## 📊 Production Checklist

### Security
- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Enable HTTPS only
- [ ] Add rate limiting
- [ ] Sanitize user inputs
- [ ] Add CSRF protection

### Performance
- [ ] Enable caching
- [ ] Optimize images
- [ ] Minimize bundle size
- [ ] Use CDN for static assets
- [ ] Add database indexes

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Monitor API performance
- [ ] Set up uptime monitoring
- [ ] Configure logging

### Database
- [ ] Migrate from SQLite to PostgreSQL
- [ ] Set up automated backups
- [ ] Add database connection pooling
- [ ] Optimize queries

---

## 🎯 Post-Deployment Steps

1. **Update API URL**:
   - Update `NEXT_PUBLIC_API_URL` in Vercel to point to deployed backend
   - Redeploy frontend

2. **Test All Features**:
   - User registration/login
   - File upload
   - Audit processing
   - Report viewing
   - AI suggestions
   - Reference recommendations

3. **Set Up Custom Domain** (Optional):
   - In Vercel: Settings → Domains
   - Add your custom domain
   - Update DNS records

4. **Enable Analytics**:
   - Add Vercel Analytics
   - Set up backend monitoring

---

## 🆘 Troubleshooting

### Check Logs
- **Vercel**: Dashboard → Your Project → Deployments → View Logs
- **Railway**: Dashboard → Your Service → Logs
- **Render**: Dashboard → Your Service → Logs

### Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| 502 | Bad Gateway | Backend is down or unreachable |
| 503 | Service Unavailable | Backend is overloaded |
| 504 | Gateway Timeout | Request took too long |
| 404 | Not Found | Route doesn't exist |
| 500 | Internal Server Error | Check backend logs |

### Debug Mode
Enable debug mode in production (temporarily):
1. Add `DEBUG=true` to environment variables
2. Check detailed error messages
3. Remove after debugging

---

## 📞 Support

If you encounter issues not covered here:
1. Check browser console for errors
2. Check backend logs
3. Verify all environment variables are set
4. Ensure backend is running and accessible
5. Test API endpoints directly using Postman

---

## 🎉 Success!

Once deployed:
- Frontend URL: `https://your-app.vercel.app`
- Backend URL: `https://your-backend.railway.app`
- Share with users and start collecting feedback!

---

**Remember**: Always test in a staging environment before deploying to production!
