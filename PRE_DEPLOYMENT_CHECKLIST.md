# Pre-Deployment Checklist ✅

## Before You Deploy - Complete This Checklist

### 1. Code Quality ✅
- [x] All files saved
- [x] No syntax errors
- [x] TypeScript compiles successfully
- [x] ESLint passes (or warnings acknowledged)
- [x] All imports resolve correctly

### 2. Environment Setup 🔧
- [ ] Create `.env.local` in `frontend/` with:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  NEXT_PUBLIC_APP_NAME=ResearchSentinel
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```
- [ ] Verify `backend/.env` has all required variables
- [ ] Test locally before deploying

### 3. Git & GitHub 📦
- [ ] All changes committed:
  ```bash
  git add .
  git commit -m "Add AI features, fix deployment issues, enhance UI"
  git push origin main
  ```
- [ ] Repository is public or accessible to Vercel
- [ ] No sensitive data in commits (check .gitignore)

### 4. Backend Deployment (Choose One) 🐍

#### Option A: Railway (Recommended)
- [ ] Create Railway account: https://railway.app
- [ ] Create new project from GitHub
- [ ] Set Root Directory: `backend`
- [ ] Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Add environment variables:
  ```
  SECRET_KEY=<generate-strong-random-key>
  FRONTEND_URL=https://your-app.vercel.app
  DATABASE_URL=sqlite:///./research_sentinel.db
  CROSSREF_EMAIL=your-email@university.edu
  ```
- [ ] Deploy and note the URL (e.g., `https://your-backend.railway.app`)

#### Option B: Render
- [ ] Create Render account: https://render.com
- [ ] Create Web Service from GitHub
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `pip install -r requirements.txt`
- [ ] Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Add same environment variables as Railway
- [ ] Deploy and note the URL

### 5. Frontend Deployment (Vercel) 🌐
- [ ] Create Vercel account: https://vercel.com
- [ ] Import GitHub repository
- [ ] Configure project:
  - Framework Preset: **Next.js**
  - Root Directory: **frontend**
  - Build Command: `npm run build` (default)
  - Output Directory: `.next` (default)
  - Install Command: `npm install` (default)

- [ ] Add Environment Variables in Vercel:
  ```
  NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
  NEXT_PUBLIC_APP_NAME=ResearchSentinel
  NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
  NEXT_PUBLIC_ENABLE_AI_SUGGESTIONS=true
  NEXT_PUBLIC_ENABLE_REFERENCE_RECOMMENDATIONS=true
  ```

- [ ] Deploy!
- [ ] Note your Vercel URL (e.g., `https://your-app.vercel.app`)

### 6. Post-Deployment Configuration 🔄
- [ ] Update backend `FRONTEND_URL` to your Vercel URL
- [ ] Redeploy backend if needed
- [ ] Update frontend `NEXT_PUBLIC_API_URL` to your backend URL
- [ ] Redeploy frontend if needed

### 7. Testing 🧪
- [ ] Visit your deployed frontend URL
- [ ] Check browser console for errors
- [ ] Test user registration
- [ ] Test user login
- [ ] Test file upload
- [ ] Test audit processing
- [ ] Test report viewing
- [ ] Test AI corrections tab
- [ ] Test reference recommendations tab

### 8. Monitoring & Analytics 📊
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up error tracking with Sentry (optional)
- [ ] Monitor backend logs
- [ ] Monitor frontend logs

### 9. Security Review 🔐
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] CORS properly configured
- [ ] No API keys in frontend code
- [ ] Environment variables set correctly
- [ ] Security headers enabled (already in config)

### 10. Documentation 📚
- [ ] Update README with deployed URLs
- [ ] Document any deployment-specific changes
- [ ] Share access with team members

---

## Quick Deploy Commands

### If Everything is Ready:

```bash
# 1. Commit and push
git add .
git commit -m "Ready for production deployment"
git push origin main

# 2. Deploy backend on Railway
# (Use Railway dashboard - no CLI needed)

# 3. Deploy frontend on Vercel
# (Use Vercel dashboard - no CLI needed)

# 4. Test everything!
```

---

## Troubleshooting Common Issues

### Build Fails on Vercel
**Solution**: 
1. Check build logs in Vercel dashboard
2. Run `npm run build` locally first
3. Fix any TypeScript/ESLint errors
4. Ensure all dependencies are in `package.json`

### API Calls Fail (CORS Error)
**Solution**:
1. Verify `FRONTEND_URL` in backend matches your Vercel URL
2. Check backend CORS configuration in `main.py`
3. Redeploy backend after changes

### Environment Variables Not Working
**Solution**:
1. Ensure variables start with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding/changing variables
3. Check browser console for actual values

### 404 Errors on Routes
**Solution**:
1. Ensure file structure matches Next.js conventions
2. Check `next.config.mjs` for any redirect/rewrite issues
3. Clear browser cache

---

## Success Indicators ✨

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Frontend loads at your Vercel URL
- ✅ No console errors in browser
- ✅ Login/registration works
- ✅ File upload works
- ✅ Audits process successfully
- ✅ Reports display correctly
- ✅ AI corrections load
- ✅ Reference recommendations load

---

## Next Steps After Deployment

1. **Custom Domain** (Optional):
   - Add custom domain in Vercel settings
   - Update DNS records
   - Update environment variables with new domain

2. **Database Migration** (Recommended for Production):
   - Migrate from SQLite to PostgreSQL
   - Use Railway PostgreSQL or Supabase
   - Update `DATABASE_URL` environment variable

3. **Monitoring**:
   - Set up Sentry for error tracking
   - Enable Vercel Analytics
   - Monitor API performance

4. **Scaling**:
   - Upgrade Vercel plan if needed
   - Upgrade Railway plan for more resources
   - Consider CDN for static assets

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com

---

## Emergency Rollback

If something goes wrong:

### Vercel:
1. Go to Deployments tab
2. Find last working deployment
3. Click "..." → "Promote to Production"

### Railway:
1. Go to Deployments
2. Find last working deployment
3. Click "Redeploy"

---

**You've got this! 🚀 Follow the checklist step by step and you'll be deployed in no time!**
