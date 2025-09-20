Bridgechild Sponsorship Web App - Development Context

# Project Overview
A web application that safely connects sponsors with children (directly or via NGOs) for ongoing financial support and mentorship. This is a capstone project with a 10-week development timeline.

# Current Status

**Phase: UI/UX Improvement Phase - Second Iteration Required**
**Location**: /home/crokx/capstone/bridgechild/
**Environment**: WSL2 Ubuntu 24.04.2 + VS Code + Docker
**Repository**: Ready for GitHub integration

## Backend Status: ✅ COMPLETE & OPERATIONAL
- Authentication system fully implemented and tested
- Complete user profile management system (Sponsor, NGO, Child profiles)
- PostgreSQL database with migrations and seed data working
- All API endpoints functional and tested
- Server running on localhost:3003
- Test credentials working: sponsor@test.com / Test123!

## Frontend Status: 🔄 UI/UX REDESIGN IN PROGRESS

### RECENT COMPLETION (First UI/UX Iteration):
✅ **Landing Page Complete**: Modern hero section, testimonials, features, CTA buttons
✅ **Dashboard Layouts Updated**: All user roles (Sponsor, Admin, NGO, Child) redesigned
✅ **Design System Implemented**: Warm social cause colors (orange #f97316, teal #14b8a6)
✅ **Modern Components**: Card layouts, hover effects, gradients, smooth transitions
✅ **Authentication Flow**: Login/register forms with consistent styling
✅ **Responsive Design**: Mobile-friendly layouts across all pages
✅ **Technical Integration**: Frontend (localhost:3000) and backend (localhost:3003) running
✅ **End-to-end Testing**: Login flow verified working

### FILES UPDATED IN FIRST UI/UX ITERATION:
1. `/frontend/src/index.css` - Complete design system with warm color palette
2. `/frontend/src/pages/LandingPage.js` - Modern landing page with hero, stats, testimonials
3. `/frontend/src/pages/SponsorDashboard.js` - Redesigned with modern cards and CTAs
4. `/frontend/src/pages/AdminDashboard.js` - Enhanced admin interface with actions panel
5. `/frontend/src/pages/NGODashboard.js` - Updated with quick actions and modern layout
6. `/frontend/src/pages/ChildDashboard.js` - Child-friendly design with profile completion
7. `/frontend/src/components/layouts/DashboardLayout.js` - Enhanced with logo and gradient background
8. `/frontend/src/components/auth/RegisterForm.js` - Consistent styling with login form

### ❌ CRITICAL ISSUE IDENTIFIED: UI/UX NOT ACCEPTABLE
**User Feedback**: The current UI/UX implementation is not meeting expectations and needs to be reworked

**IMMEDIATE PRIORITY**: Complete redesign and improvement of the UI/UX system

# Tech Stack & Architecture

## Backend (Node.js/Express)
- Framework: Express.js with middleware
- Database: PostgreSQL with Redis caching
- Authentication: JWT with bcrypt
- File Processing: Multer + Sharp for images, Tesseract.js for OCR
- Payments: Stripe (Test mode)
- Security: Helmet, CORS, rate limiting, input validation

## Frontend (React)
- Framework: React 18 with hooks
- Routing: React Router v6
- Styling: Tailwind CSS with Headless UI
- State: React Query for server state, Context for global state
- Forms: React Hook Form with validation
- Payments: Stripe Elements

# Database Schema
```sql
-- Core tables implemented
users(id, email, password_hash, role, status, created_at)
sponsor_profiles(user_id, name, country, languages, budget, interests)
ngo_profiles(user_id, org_name, reg_no, verified_status)
children(id, ngo_id, owner_user_id, public_name, age_range, region, story, mode, discovery_opt_in)
child_needs(id, child_id, category, description, est_monthly, urgency)
documents(id, owner_type, owner_id, doc_type, storage_url, ocr_conf, status)
refresh_tokens(id, user_id, token_hash, expires_at, created_at)
```

# Project Structure
```
bridgechild/
├── backend/                 # Node.js + Express API (✅ COMPLETE)
│   ├── src/                # Source code
│   ├── uploads/            # File uploads
│   ├── package.json        # ✅ Created
│   └── Dockerfile.dev      # ✅ Created
├── frontend/               # React application (🔄 UI/UX REDESIGN NEEDED)
│   ├── src/                # React components
│   ├── public/             # Static assets
│   ├── package.json        # ✅ Created
│   └── Dockerfile.dev      # ✅ Created
├── database/               # DB migrations and seeds (✅ COMPLETE)
├── docs/                   # Documentation
├── docker-compose.yml      # ✅ Created
├── context.md              # This file
└── .env                    # Environment variables
```

# User Roles & Permissions
- **Sponsor**: Browse children, request sponsorships, make payments, view updates
- **Child**: Create profiles (self or NGO-assisted), upload documents, accept sponsorships
- **NGO**: Manage child profiles, verify documents, moderate communications, approve matches
- **Admin**: System oversight, fraud detection, audit logs, user management

# Development Environment Status
- **Backend Server**: Running on localhost:3003 ✅
- **Frontend Server**: Running on localhost:3000 ✅
- **Database**: PostgreSQL connected and migrated ✅
- **Authentication**: Working with test credentials ✅
- **Deployment Ready**: Both servers operational ✅

# Test Credentials Available
- **Sponsor**: sponsor@test.com / Test123!
- **Admin**: admin@helpinghands.org / Admin123! (needs verification)
- **NGO**: ngo@test.com / Test123! (needs verification)
- **Child**: child@test.com / Test123! (needs verification)

# API Endpoints Available
- **Authentication**: 13 endpoints (/api/auth/*)
- **Profiles**: 13 endpoints (/api/profiles/*)
- **Total**: 26 production-ready API endpoints

]

### Next Steps:
1. The icons in sign in and sign up forms in input fields are touching the borders of input filds. Please add some padding so they are not touching the borders.

# Development Commands
```bash
# Start development environment
cd /home/crokx/capstone/bridgechild/

# Backend (already running)
cd backend && DB_HOST=localhost PORT=3003 npm run dev

# Frontend (already running)
cd frontend && npm start

# Visit application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3003/api
```

# Security Implementation
- Authentication: JWT with secure HTTP-only cookies
- Authorization: Role-based middleware on all protected routes
- Input Validation: express-validator on all inputs
- File Security: Type validation, size limits, virus scanning
- PII Protection: Automatic redaction in communications
- Child Safety: No direct unmoderated contact, NGO oversight required
