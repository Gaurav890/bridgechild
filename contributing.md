# Contributing to Helping Hands Sponsorship Platform

Thank you for considering contributing to this project! This platform aims to safely connect sponsors with children through verified NGO partnerships.

## Code of Conduct

This project prioritizes child safety and ethical development practices. All contributors must:

- Prioritize child safety in all feature development
- Respect user privacy and data protection
- Follow security best practices
- Maintain professional and inclusive communication

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Follow the [DEPLOYMENT.md](DEPLOYMENT.md) guide to set up your development environment
4. Create a feature branch from `develop`

## Development Workflow

### Branch Structure
- `main` - Production-ready code
- `develop` - Integration branch for new features
- `feature/[feature-name]` - Individual feature development
- `hotfix/[issue]` - Critical bug fixes

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Ensure existing tests pass
   - Follow existing code style

3. **Test your changes**
   ```bash
   # Backend tests
   cd backend && npm test
   
   # Frontend tests
   cd frontend && npm test
   
   # Integration tests
   docker-compose up -d
   # Test the full application manually
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add [feature description]"
   ```

   **Commit Message Format:**
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or fixing tests
   - `chore:` - Maintenance tasks

5. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```
   
   Create a pull request from your branch to `develop`.

## Code Style Guidelines

### Backend (Node.js/Express)
- Use ESLint configuration provided
- Follow RESTful API conventions
- Implement proper error handling
- Add input validation for all endpoints
- Use async/await for asynchronous operations
- Document API endpoints

### Frontend (React)
- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries
- Use descriptive component and variable names
- Add PropTypes or TypeScript for type checking
- Ensure accessibility (WCAG 2.1 AA compliance)

### Database
- Use migrations for schema changes
- Include both up and down migrations
- Add appropriate indexes
- Follow PostgreSQL naming conventions
- Document complex queries

## Testing Requirements

### Backend Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Authentication and authorization tests
- Database operation tests

### Frontend Testing
- Component unit tests
- Integration tests for user flows
- Accessibility testing
- Cross-browser compatibility

### Security Testing
- Input validation tests
- Authentication bypass attempts
- SQL injection prevention
- XSS protection verification

## Feature Development Priorities

### High Priority
1. Child safety features
2. Authentication and authorization
3. Data privacy and protection
4. Payment security
5. NGO verification systems

### Medium Priority
1. User experience improvements
2. Performance optimizations
3. Mobile responsiveness
4. Admin tools

### Low Priority
1. UI enhancements
2. Additional integrations
3. Analytics and reporting

## Documentation Requirements

When contributing, please update:

- README.md if you change core functionality
- API documentation for new endpoints
- Inline code comments for complex logic
- User guides for new features
- DEPLOYMENT.md if setup changes

## Security Considerations

This platform handles sensitive data including:
- Child personal information
- Payment data
- Authentication credentials
- NGO verification documents

**Security Requirements:**
- Never commit sensitive data or credentials
- Implement proper input validation
- Use parameterized queries to prevent SQL injection
- Implement rate limiting for all endpoints
- Encrypt sensitive data at rest and in transit
- Follow OWASP security guidelines

## Child Safety Protocols

**Critical Requirements:**
- All child communications must be moderated
- PII must be protected and redacted when necessary
- Document uploads must be securely handled
- Age verification must be implemented
- Parental/guardian consent required
- NGO oversight mandatory for all child interactions

## Review Process

All pull requests require:

1. **Code Review** - At least one team member review
2. **Testing** - All tests must pass
3. **Security Review** - Security implications assessed
4. **Documentation** - Relevant docs updated
5. **Manual Testing** - Feature tested in development environment

## Getting Help

- **Technical Issues**: Create a GitHub issue with detailed description
- **Security Concerns**: Email security@helpinghands.org (private)
- **Feature Questions**: Discuss in GitHub Discussions
- **Setup Problems**: Check DEPLOYMENT.md or create an issue

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for their contributions
- Project documentation credits

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Note**: This project prioritizes child safety above all other considerations. Any contribution that could potentially compromise child safety will not be accepted, regardless of technical merit.