# ResearchSentinel 🛡️

**AI-Powered Research Integrity Auditor for Universities**

ResearchSentinel is a comprehensive platform that automatically audits research papers for citation accuracy, methodology quality, reproducibility, and AI-generated content. Get professional audit reports in minutes, not days.

---

## ✨ Features

### 🎯 Core Auditing
- ✅ **Real PDF/DOCX Text Extraction** - Extract and analyze content from research papers
- ✅ **Citation Validation** - Verify citations against Crossref database (FREE!)
- ✅ **Methodology Analysis** - Check for statistical rigor and experimental design
- ✅ **Reproducibility Check** - Ensure code, data, and parameters are documented
- ✅ **AI Content Detection** - Identify potentially AI-generated sections
- ✅ **Novelty Assessment** - Compare against existing literature

### 👥 User Roles
- **Student Portal**: Upload papers, view audit reports, track submissions
- **Faculty Portal**: Manage student submissions, view analytics, batch processing
- **Admin Portal**: System-wide analytics, user management, department insights

### 🎨 Modern UI/UX
- ✅ Beautiful landing page with pricing
- ✅ Responsive dashboards for all roles
- ✅ Real-time toast notifications
- ✅ Progress tracking during audits
- ✅ Comprehensive report visualizations
- ✅ Optimized login/registration flow

### 🚀 Performance
- ✅ Fast authentication (single API call)
- ✅ Auto-login after registration
- ✅ Background task processing
- ✅ Memory-optimized (4GB limit)
- ✅ Results in minutes

---

## 🏗️ Project Structure

```
ResearchSentinel/
├── backend/                 # FastAPI application
│   ├── main.py             # Main application entry
│   ├── auth.py             # Authentication logic
│   ├── audit_engine.py     # AI audit engine (REAL PDF extraction + Crossref)
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # Database configuration
│   ├── routers/            # API routes
│   │   ├── auth.py         # Auth endpoints
│   │   ├── submissions.py  # Submission endpoints
│   │   └── analytics.py    # Analytics endpoints
│   ├── uploads/            # Uploaded files
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
│
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── (auth)/            # Auth pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── (dashboard)/       # Dashboard pages
│   │   │       ├── student/
│   │   │       ├── faculty/
│   │   │       ├── admin/
│   │   │       └── report/[id]/
│   │   └── components/ui/  # Reusable components
│   ├── package.json
│   └── tailwind.config.ts
│
├── API_KEYS_GUIDE.md       # How to get API keys
├── IMPLEMENTATION_STATUS.md # What's done vs what's missing
├── ROADMAP.md              # Feature roadmap & pricing strategy
├── EXECUTIVE_SUMMARY.md    # Business analysis & market opportunity
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 18+ (for frontend)
- npm or yarn

### Backend Setup

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables** (optional):
   ```bash
   # Edit .env file
   # Add OpenAI API key for advanced AI analysis (optional)
   # See API_KEYS_GUIDE.md for details
   ```

4. **Run the server**:
   ```bash
   uvicorn main:app --reload
   ```
   - API: `http://localhost:8000`
   - Swagger Docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the dev server**:
   ```bash
   npm run dev
   ```
   - App: `http://localhost:3000`

---

## 🎯 Quick Start Guide

1. **Visit** `http://localhost:3000`
2. **Click** "Start Free Trial" or "Register"
3. **Create account** (choose Student, Faculty, or Admin role)
4. **Upload** a research paper (PDF or DOCX)
5. **Wait** 1-2 minutes for AI analysis
6. **View** comprehensive audit report with scores and suggestions

---

## 🔑 API Keys (Optional)

The system works **without any API keys** using free services!

**What works for FREE**:
- ✅ PDF text extraction
- ✅ Citation validation (Crossref API)
- ✅ Methodology analysis
- ✅ Reproducibility checks
- ✅ AI content detection (heuristic)

**Optional upgrades**:
- 🎯 **OpenAI API** (~$0.50/audit) - Better AI analysis
- 📧 **SendGrid** (100 emails/day free) - Email notifications

See `API_KEYS_GUIDE.md` for detailed setup instructions.

---

## 📊 Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLite (easily upgradable to PostgreSQL)
- **ORM**: SQLAlchemy
- **Auth**: JWT with bcrypt
- **PDF Processing**: PyPDF2, python-docx
- **APIs**: Crossref (free), OpenAI (optional)

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Components**: Custom UI components
- **Charts**: Recharts
- **Notifications**: Sonner
- **HTTP Client**: Axios

---

## 💰 Monetization (Recommended)

### Pricing Tiers
- **Free**: 3 audits/month
- **Student Pro**: $9.99/month (unlimited audits)
- **Faculty Pro**: $29.99/month (batch processing, grading)
- **Institution**: $5K-50K/year (white-label, unlimited users)

### Revenue Projections
- **Year 1**: $150K (500 students, 50 faculty, 5 institutions)
- **Year 2**: $900K (3K students, 300 faculty, 20 institutions)
- **Year 3**: $5.3M (15K students, 1.5K faculty, 100 institutions)

See `ROADMAP.md` for detailed business strategy.

---

## 📈 What's Next?

### Completed ✅
- [x] User authentication with roles
- [x] Real PDF/DOCX text extraction
- [x] Crossref citation validation
- [x] Methodology & reproducibility analysis
- [x] Beautiful landing page
- [x] Student/Faculty/Admin dashboards
- [x] Report visualization
- [x] Performance optimizations

### Coming Soon 🚀
- [ ] OpenAI integration for advanced AI analysis
- [ ] PDF report generation
- [ ] Plagiarism detection
- [ ] Batch upload for faculty
- [ ] Email notifications
- [ ] Payment integration (Stripe)
- [ ] LMS integration (Canvas, Moodle)

See `IMPLEMENTATION_STATUS.md` for complete feature checklist.

---

## 🤝 Contributing

This is a commercial project. For collaboration opportunities, please contact the development team.

---

## 📄 License

Proprietary - All rights reserved

---

## 🎓 Use Cases

### For Students
- Ensure your research meets academic standards
- Identify and fix issues before submission
- Get actionable suggestions for improvement
- Build confidence in your work

### For Faculty
- Quickly review student submissions
- Identify potential integrity issues
- Save hours of manual checking
- Provide data-driven feedback

### For Institutions
- Maintain research quality standards
- Track department-wide metrics
- Identify trends and patterns
- Ensure compliance with academic integrity policies

---

## 📞 Support

- **Documentation**: See `API_KEYS_GUIDE.md` and other docs
- **Issues**: Check `IMPLEMENTATION_STATUS.md` for known limitations
- **Business Inquiries**: See `EXECUTIVE_SUMMARY.md` for market analysis

---

**Built with ❤️ for the academic community. Ensuring research integrity, one paper at a time. 🎓**
