# Helping Hands Sponsorship Platform - Deployment Guide

## Project Overview
A web application connecting sponsors with children through verified NGO partnerships for ongoing financial support and mentorship.

## Prerequisites

### Required Software
- **Git** - Latest version
- **Docker Desktop** - Latest version with Docker Compose
- **Node.js** - Version 18 or higher
- **npm** - Version 8 or higher

### System Requirements
- **OS**: Windows 10/11 with WSL2, macOS, or Linux
- **RAM**: Minimum 8GB recommended
- **Disk Space**: At least 5GB free space
- **Network**: Internet connection for downloading dependencies

## Step 1: Environment Setup

### For Windows Users (Recommended: WSL2)
```bash
# Install WSL2 if not already installed
wsl --install -d Ubuntu

# Open WSL2 terminal and update
sudo apt update && sudo apt upgrade -y

# Install Node.js in WSL2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installations
node --version  # Should be 18.x or higher
npm --version   # Should be 8.x or higher
```

### For macOS Users
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@18

# Verify installation
node --version
npm --version
```

### For Linux Users
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

## Step 2: Clone and Setup Project

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/helping-hands-sponsorship.git
cd helping-hands-sponsorship

# Verify project structure
ls -la
# You should see: backend/, frontend/, database/, docker-compose.yml, etc.
```

## Step 3: Environment Configuration

### Create Environment File
```bash
# Copy environment template
cp .env.example .env

# Edit the environment file with your preferred editor
nano .env
# or
code .env
```

### Required Environment Variables
```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=helping_hands_dev
DB_USER=postgres
DB_PASSWORD=postgres

# Redis Configuration  
REDIS_HOST=redis
REDIS_PORT=6379

# JWT Authentication
JWT_SECRET=your-super-secure-random-string-change-this
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Email Configuration (for development - logs to console)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional: Stripe (for payment testing - use test keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### Important Security Note
**NEVER commit the `.env` file to Git.** The `.gitignore` already excludes it, but always verify your environment variables are secure.

## Step 4: Docker Setup

### Install Docker Desktop
- **Windows**: Download from https://www.docker.com/products/docker-desktop/
- **macOS**: Download from https://www.docker.com/products/docker-desktop/
- **Linux**: 
```bash
# Install Docker
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (requires logout/login)
sudo usermod -aG docker $USER
```

### Verify Docker Installation
```bash
# Check Docker is running
docker --version
docker-compose --version

# Test Docker
docker run hello-world
```

## Step 5: Application Startup

### Start All Services
```bash
# Start the complete application stack
docker-compose up -d

# Verify all containers are running
docker-compose ps
```

You should see:
- `helping-hands-backend` - Running on port 3001
- `helping-hands-frontend` - Running on port 3000  
- `helping-hands-db` (PostgreSQL) - Running on port 5432
- `helping-hands-redis` - Running on port 6379

### Install Dependencies (if needed)
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies  
cd ../frontend && npm install

# Return to project root
cd ..
```

## Step 6: Database Setup

### Initialize Database
```bash
# Check database connection
docker exec -it helping-hands-db psql -U postgres -d helping_hands_dev -c "SELECT version();"

# Run migrations (if available)
docker-compose exec backend npm run migrate

# Seed database with test data (if available)
docker-compose exec backend npm run seed
```

## Step 7: Access Application

### Application URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database Admin** (optional): http://localhost:5050 (if pgAdmin is enabled)

### Test the Installation
1. Open browser to http://localhost:3000
2. You should see the Helping Hands landing page
3. Try registering a new account
4. Verify login functionality works

## Step 8: Default Test Accounts

### Available Test Accounts
```
Admin Account:
- Email: admin@helpinghands.org  
- Password: Admin123!

Sponsor Account:
- Email: sponsor@test.com
- Password: Test123!

NGO Account:
- Email: ngo@test.com
- Password: Test123!

Child Account:
- Email: child@test.com  
- Password: Test123!
```

## Development Workflow

### Daily Development
```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Making Changes
```bash
# Backend changes auto-reload with nodemon
# Frontend changes auto-reload with React dev server

# To rebuild after major changes:
docker-compose up --build
```

### Database Management
```bash
# Access PostgreSQL directly
docker exec -it helping-hands-db psql -U postgres -d helping_hands_dev

# Backup database
docker exec helping-hands-db pg_dump -U postgres helping_hands_dev > backup.sql

# Restore database
docker exec -i helping-hands-db psql -U postgres -d helping_hands_dev < backup.sql
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using port 3000 or 3001
lsof -i :3000
lsof -i :3001

# Kill process if needed
kill -9 <process_id>
```

#### Docker Issues
```bash
# Reset Docker if having issues
docker-compose down
docker system prune -f
docker-compose up --build
```

#### Database Connection Issues
```bash
# Check if PostgreSQL container is running
docker-compose ps

# Check database logs
docker-compose logs postgres

# Restart database only
docker-compose restart postgres
```

#### Frontend Not Loading
```bash
# Check if frontend container is running
docker-compose logs frontend

# Rebuild frontend
docker-compose up --build frontend
```

### Getting Help

#### View Application Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

#### Check Application Status
```bash
# Test backend API
curl http://localhost:3001/api/health

# Test frontend
curl http://localhost:3000
```

## Project Structure

```
helping-hands-sponsorship/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication, validation
│   │   ├── services/       # Business logic
│   │   └── config/         # Configuration files
│   ├── tests/              # Backend tests
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API calls
│   │   └── styles/         # CSS files
│   └── package.json
├── database/               # Database migrations and seeds
├── docker-compose.yml      # Docker services configuration
├── .env.example           # Environment variables template
└── README.md              # Project documentation
```

## API Documentation

### Authentication Endpoints
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
GET  /api/auth/profile      # Get user profile
POST /api/auth/refresh      # Refresh JWT token
```

### Profile Endpoints
```
GET    /api/profiles/sponsor    # Get sponsor profile
POST   /api/profiles/sponsor    # Create sponsor profile
PUT    /api/profiles/sponsor    # Update sponsor profile

GET    /api/profiles/ngo        # Get NGO profile  
POST   /api/profiles/ngo        # Create NGO profile
PUT    /api/profiles/ngo        # Update NGO profile

GET    /api/profiles/child/:id  # Get child profile
POST   /api/profiles/child      # Create child profile
PUT    /api/profiles/child/:id  # Update child profile
```

## Contributing

### Code Style
- Backend: ESLint configuration provided
- Frontend: Prettier + ESLint for React
- Database: Use migrations for schema changes

### Testing
```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

### Git Workflow
1. Create feature branches from `develop`
2. Make changes with descriptive commits
3. Test thoroughly before pushing
4. Create pull requests to `develop` branch

## Security Considerations

- Never commit `.env` files
- Use strong JWT secrets in production
- Keep dependencies updated
- Review and test all user inputs
- Use HTTPS in production
- Implement proper CORS settings
- Regular security audits

## Production Deployment

This guide covers development setup. For production:

1. Use environment-specific `.env` files
2. Configure production database (not localhost)
3. Set up SSL certificates
4. Configure proper reverse proxy
5. Implement monitoring and logging
6. Set up automated backups
7. Use production-ready Docker images

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review application logs
3. Verify all prerequisites are installed
4. Ensure Docker containers are running
5. Contact the development team with specific error messages

**Note**: This application is in active development. Features and setup procedures may change between versions.