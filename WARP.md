# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an Express.js-based authentication API service named "acquisitions" built with ES modules and modern Node.js practices. The project implements a secure authentication system with role-based access control, JWT tokens, and advanced security middleware using Arcjet.

## Development Commands

### Core Development
- **Start development server**: `npm run dev` - Runs with Node.js watch mode for auto-restart
- **Lint code**: `npm run lint` - Check code with ESLint
- **Fix linting issues**: `npm run lint:fix` - Auto-fix ESLint issues
- **Format code**: `npm run format` - Format with Prettier
- **Check formatting**: `npm run format:check` - Verify Prettier formatting

### Database Operations (Drizzle ORM)
- **Generate migrations**: `npm run db:generate` - Generate database migration files
- **Run migrations**: `npm run db:migrate` - Apply migrations to database
- **Database studio**: `npm run db:studio` - Launch Drizzle Studio for database management

## Architecture Overview

### Module Structure
The project uses ES modules with custom import path mapping defined in `package.json`:
- `#config/*` → `./src/config/*` - Configuration files (logger, database, Arcjet)
- `#controllers/*` → `./src/controllers/*` - Request handlers
- `#middleware/*` → `./src/middleware/*` - Express middleware
- `#models/*` → `./src/models/*` - Drizzle ORM models
- `#routes/*` → `./src/routes/*` - Route definitions
- `#services/*` → `./src/services/*` - Business logic layer
- `#utils/*` → `./src/utils/*` - Utility functions
- `#validations/*` → `./src/validations/*` - Zod validation schemas

### Core Components

#### Security Layer
- **Arcjet Integration**: Advanced bot detection, rate limiting, and shield protection
- **Role-based Rate Limiting**: Different limits for admin (20/min), user (10/min), guest (5/min)
- **JWT Authentication**: Secure token-based authentication with configurable expiration
- **Password Hashing**: bcrypt with salt rounds for secure password storage

#### Database Layer
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Neon Serverless**: Cloud PostgreSQL database connection
- **User Model**: Complete user management with roles, timestamps, and unique constraints

#### Middleware Stack
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logging integrated with Winston
- **Cookie Parser**: Secure cookie handling with proper security options
- **Express**: JSON and URL-encoded body parsing

#### Logging System
- **Winston Logger**: Structured logging with file rotation
- **Log Levels**: Configurable via `LOG_LEVEL` environment variable
- **File Outputs**: `logs/error.log` (errors only), `logs/combined.log` (all logs)
- **Console Output**: Development mode only with colorized format

### Authentication Flow
1. **Sign-up**: `/api/auth/sign-up` - User registration with validation, password hashing, and JWT token generation
2. **Sign-in**: `/api/auth/sign-in` - User authentication (placeholder implementation)
3. **Sign-out**: `/api/auth/sign-out` - Session termination (placeholder implementation)

### Validation System
Uses Zod for robust input validation:
- **Sign-up Schema**: Name (2-255 chars), email validation, password (6-128 chars), role enum
- **Sign-in Schema**: Email and password validation
- **Error Formatting**: Custom utility for user-friendly validation error messages

## Environment Configuration

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string (for Neon)
- `JWT_SECRET` - Secret key for JWT signing (defaults to development key)
- `JWT_EXPIRES_IN` - Token expiration time (default: 1h)
- `ARCJET_KEY` - Arcjet API key for security features
- `LOG_LEVEL` - Winston logging level (default: info)
- `NODE_ENV` - Environment setting (affects cookie security, console logging)
- `PORT` - Server port (default: 3000)

## Development Patterns

### Error Handling
- Service layer throws specific error messages (e.g., "User with this email already exists")
- Controllers catch and transform errors into appropriate HTTP responses
- Winston logger captures all errors with context
- Consistent error response format with `error` and `message` fields

### Code Style
- ES modules with import/export syntax
- Async/await for asynchronous operations
- Custom path aliases to avoid relative import hell
- Consistent use of destructuring and modern JavaScript features
- ESLint + Prettier configuration for code quality and formatting

### Security Considerations
- All passwords are hashed before storage
- JWT tokens stored in secure, HTTP-only cookies
- Comprehensive input validation on all endpoints
- Rate limiting based on user roles
- Bot detection and protection via Arcjet
- Proper CORS and security headers configuration

## Health Monitoring

- **Health Check**: `GET /health` - Returns server status, timestamp, and uptime
- **API Status**: `GET /api` - Confirms API service availability
- **Root Endpoint**: `GET /` - Basic service confirmation

## File Structure Notes

- Server entry point: `src/index.js` (referenced in package.json)
- Application setup: `src/server.js` and `src/app.js` separation
- Migration files: `drizzle/` directory with SQL and metadata
- Docker support: `Dockerfile` and `docker-compose.yaml` present but minimal
- Git ignore patterns include logs, environment files, and Docker-related files