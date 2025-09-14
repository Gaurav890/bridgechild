# Helping Hands Sponsorship Platform

A web application that safely connects sponsors with children (directly or via NGOs) for ongoing financial support and mentorship through verified partnerships.

## 🌟 Features

- **Safe Connections**: All interactions moderated through verified NGO partnerships
- **Multi-Role Support**: Sponsors, Children, NGOs, and Administrators
- **Secure Payments**: Stripe integration for recurring donations and one-time gifts
- **Smart Matching**: AI-powered sponsor-child compatibility system
- **Document Verification**: OCR-powered document processing with manual review
- **Mobile Responsive**: Works seamlessly on all devices

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/helping-hands-sponsorship.git
cd helping-hands-sponsorship

# Copy environment variables
cp .env.example .env

# Start with Docker
docker-compose up -d

# Access the application
open http://localhost:3000
```

## 📖 Documentation

- **[Deployment Guide](DEPLOYMENT.md)** - Complete setup instructions
- **[API Documentation](docs/api-spec.md)** - API endpoints and usage
- **[User Guide](docs/user-guide.md)** - How to use the platform

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Redis caching
- **Authentication**: JWT with bcrypt
- **Payments**: Stripe (Test mode)
- **File Processing**: Multer + Sharp + Tesseract.js

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Custom CSS
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **State Management**: React Context + React Query

### DevOps
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL 15
- **Caching**: Redis 7
- **Environment**: WSL2/Linux/macOS compatible

## 🎯 User Roles

### 🤝 Sponsor
- Browse children profiles
- Request sponsorships
- Make recurring or one-time donations
- Communicate with children (moderated)
- Track donation impact

### 👨‍👩‍👧‍👦 NGO
- Manage child profiles
- Verify documents and information
- Moderate communications
- Approve sponsorship matches
- Generate progress reports

### 🧒 Child
- Create profiles (with or without device access)
- Upload documents for verification
- Communicate with sponsors (through NGO)
- Share progress updates
- Receive educational/health support

### 🛡️ Admin
- System oversight and monitoring
- User management and verification
- Fraud detection and prevention
- Audit logs and compliance
- Platform configuration

## 🚦 Project Status

### ✅ Completed Features
- User authentication system (JWT)
- Role-based access control
- User profile management (all roles)
- Child registration (self-serve + NGO-assisted)
- Basic frontend with authentication UI
- Docker development environment
- PostgreSQL database schema

### 🔄 In Progress
- Frontend styling and UX improvements
- Database migration to PostgreSQL
- Authentication bug fixes
- Test account creation

### 📋 Upcoming Features
- Sponsor-child matching algorithm
- Payment integration (Stripe)
- Document upload and verification
- Messaging system
- Admin dashboard
- NGO management tools

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Test with provided accounts
# See DEPLOYMENT.md for test credentials
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and linting rules
- Write tests for new features
- Update documentation as needed
- Ensure Docker builds succeed
- Test on multiple user roles

## 📋 Prerequisites

- **Docker Desktop** - For containerized development
- **Node.js 18+** - For local development
- **Git** - Version control
- **WSL2** (Windows users) - For optimal development experience

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DB_HOST=postgres
DB_NAME=helping_hands_dev
DB_USER=postgres
DB_PASSWORD=postgres

# Authentication  
JWT_SECRET=your-super-secure-secret

# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Optional: Stripe keys for payment testing
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

## 🐛 Known Issues

- Authentication system occasionally reverts to SQLite (fix in progress)
- Frontend styling needs refinement
- Test accounts require manual database seeding

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/helping-hands-sponsorship/issues)
- **Documentation**: [Wiki](https://github.com/YOUR_USERNAME/helping-hands-sponsorship/wiki)
- **Email**: support@helpinghands.org (development team)

## 🌍 Impact

This platform aims to connect sponsors with children in need through verified NGO partnerships, ensuring safe, transparent, and impactful support for education, health, and skills development.

---

**Note**: This is a capstone project in active development. The platform prioritizes child safety and requires NGO oversight for all sponsor-child interactions.