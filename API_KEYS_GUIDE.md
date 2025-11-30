# API Keys Setup Guide

## 🔑 Required API Keys

### 1. **OpenAI API** (Optional but Recommended)
**Purpose**: Powers AI analysis for methodology, AI detection, and suggestions

**How to Get**:
1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Create an account
3. Add payment method (pay-as-you-go)
4. Go to [API Keys](https://platform.openai.com/api-keys)
5. Click "Create new secret key"
6. Copy the key (starts with `sk-`)

**Cost**: ~$0.50 per audit with GPT-4 (or $0.05 with GPT-3.5-turbo)

**Add to `.env`**:
```bash
OPENAI_API_KEY=sk-your-key-here
```

---

### 2. **Crossref API** (FREE - No Key Needed!)
**Purpose**: Validates citations against academic databases

**How to Use**:
- Already integrated!
- No API key required
- Just add your email for better rate limits

**Add to `.env`**:
```bash
CROSSREF_EMAIL=your-email@university.edu
```

**Rate Limits**: 50 requests/second (very generous)

---

### 3. **SendGrid API** (Optional - for Email Notifications)
**Purpose**: Send email notifications when audits complete

**How to Get**:
1. Go to [https://signup.sendgrid.com/](https://signup.sendgrid.com/)
2. Create free account (100 emails/day free)
3. Verify your email
4. Go to [Settings > API Keys](https://app.sendgrid.com/settings/api_keys)
5. Click "Create API Key"
6. Give it "Full Access" permissions
7. Copy the key (starts with `SG.`)

**Cost**: FREE for 100 emails/day

**Add to `.env`**:
```bash
SENDGRID_API_KEY=SG.your-key-here
SENDGRID_FROM_EMAIL=noreply@researchsentinel.com
```

---

## 📝 Setup Instructions

### Step 1: Create `.env` file

In the `backend` folder, create a file named `.env`:

```bash
cd backend
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Mac/Linux
```

### Step 2: Add Your API Keys

Edit the `.env` file and add your keys:

```bash
# Required
SECRET_KEY=change-this-to-a-random-string-in-production

# Optional but recommended for real AI analysis
OPENAI_API_KEY=sk-your-openai-key-here

# Free - just add your email
CROSSREF_EMAIL=your-email@university.edu

# Optional for email notifications
SENDGRID_API_KEY=SG.your-sendgrid-key-here
SENDGRID_FROM_EMAIL=noreply@researchsentinel.com

# Database
DATABASE_URL=sqlite:///./research_sentinel.db

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Restart Backend

```bash
uvicorn main:app --reload
```

---

## 💰 Cost Breakdown

### Current Implementation (FREE!)
- ✅ PDF text extraction: FREE
- ✅ Crossref citation checking: FREE
- ✅ Basic methodology analysis: FREE
- ✅ Reproducibility checks: FREE
- ✅ AI content detection (heuristic): FREE

**Total Cost**: $0 per audit

### With OpenAI (Recommended)
- ✅ Everything above
- ✅ Advanced AI analysis with GPT-4
- ✅ Better methodology insights
- ✅ Smarter suggestions

**Cost with GPT-4**: ~$0.50 per audit
**Cost with GPT-3.5-turbo**: ~$0.05 per audit

**You can charge**: $2.99 per audit → **$2.49 profit per audit!**

### With Email Notifications
- ✅ 100 emails/day: FREE
- ✅ Up to 40,000 emails/month: $19.95/month
- ✅ Up to 100,000 emails/month: $89.95/month

---

## 🚀 What Works Without API Keys

**Currently Functional (No Keys Needed)**:
1. ✅ User registration/login
2. ✅ File upload (PDF, DOCX, CSV)
3. ✅ Real PDF text extraction
4. ✅ Citation validation via Crossref API
5. ✅ Methodology analysis (keyword-based)
6. ✅ Reproducibility checks
7. ✅ AI content detection (heuristic)
8. ✅ Report generation
9. ✅ Beautiful dashboards
10. ✅ Landing page

**What You Get With OpenAI Key**:
- 🎯 Much smarter analysis
- 🎯 Better accuracy
- 🎯 More detailed suggestions
- 🎯 Professional-grade insights

---

## 🔧 Testing Without API Keys

You can test the entire system without any API keys:

1. The system will use **heuristic-based analysis** (still pretty good!)
2. Citations will be checked via **Crossref** (free!)
3. Everything else works perfectly

**To add OpenAI later**:
1. Just add the API key to `.env`
2. Restart the backend
3. That's it! No code changes needed

---

## 📊 Recommended Setup for Launch

### Phase 1: Beta (FREE)
```bash
# Use free tier
OPENAI_API_KEY=  # Leave empty
CROSSREF_EMAIL=your-email@university.edu
```
- Test with 50-100 users
- Collect feedback
- Refine the system

### Phase 2: Paid Launch ($50/month)
```bash
# Add OpenAI for better quality
OPENAI_API_KEY=sk-your-key-here
CROSSREF_EMAIL=your-email@university.edu
SENDGRID_API_KEY=SG.your-key-here
```
- Better analysis quality
- Email notifications
- Ready to charge users

### Phase 3: Scale ($200-500/month)
- Upgrade OpenAI usage
- Add more API integrations
- Consider dedicated servers

---

## 🎯 Next Steps

1. **Now**: Run without OpenAI key (it still works great!)
2. **Week 1**: Test with real papers, collect feedback
3. **Week 2**: Add OpenAI key for better analysis
4. **Week 3**: Launch to first 100 users
5. **Month 2**: Start charging ($2.99/audit or $9.99/month)

---

## ❓ FAQ

**Q: Do I need OpenAI to launch?**
A: No! The system works without it. Add it later for better quality.

**Q: Is Crossref really free?**
A: Yes! It's funded by publishers. Just be nice and add your email.

**Q: How much will OpenAI cost me?**
A: ~$0.50 per audit with GPT-4. If you charge $2.99, that's $2.49 profit.

**Q: Can I use a different LLM?**
A: Yes! You can use Anthropic Claude, Google Gemini, or local models.

**Q: What if I run out of SendGrid free tier?**
A: Upgrade to $19.95/month for 40K emails. Or use a different service.

---

## 🔐 Security Best Practices

1. **Never commit `.env` to git**
   - Already in `.gitignore`
   - Use `.env.example` for templates

2. **Rotate keys regularly**
   - Change API keys every 3-6 months
   - Especially if exposed

3. **Use environment variables in production**
   - Vercel: Add in dashboard
   - Railway: Add in settings
   - AWS: Use Secrets Manager

4. **Monitor API usage**
   - Check OpenAI dashboard weekly
   - Set spending limits
   - Get alerts for unusual activity

---

**You're all set! The system is ready to use with or without API keys. Start free, add keys as you grow! 🚀**
