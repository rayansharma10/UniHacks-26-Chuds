# UniHack26 - Parallel Dilemma Platform

🎯 **Project Purpose**  
A social platform where users can post moral/ethical dilemmas and the community votes on them. Built for the UniHack26 hackathon, it combines social interaction with AI-powered insights.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Technical Architecture](#-technical-architecture)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Authentication System](#-authentication-system)
- [Frontend Architecture](#-frontend-architecture)
- [Backend Architecture](#-backend-architecture)
- [File Upload System](#-file-upload-system)
- [Voting System](#-voting-system)
- [State Management](#-state-management)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Development Setup](#-development-setup)
- [Security Features](#-security-features)
- [Future Enhancements](#-future-enhancements)

## 🎯 Project Overview

**Parallel Dilemma Platform** is a full-stack web application that allows users to:
- Post ethical/moral dilemmas with categories (personal, community, civic)
- Upload images to support their dilemmas
- Vote on dilemmas (Yes/No)
- Comment on dilemmas
- View leaderboards and user profiles
- Track voting statistics and outcomes

### Core Features

1. **User Management**: Registration, login, JWT authentication, profiles
2. **Dilemma System**: CRUD operations for dilemmas with categories and images
3. **Voting System**: Binary voting with statistics and user history
4. **Social Features**: Comments, leaderboards, user interactions
5. **AI Integration**: Planned civic dilemma analysis and recommendations

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React 19.2.4 with Vite
- **Language**: JavaScript (ES6+)
- **Routing**: React Router 7.13.1
- **State Management**: Zustand 5.90.21
- **Styling**: Tailwind CSS 3.x
- **HTTP Client**: Axios 1.13.6 with interceptors
- **Icons**: Lucide React 0.577.0
- **Build Tool**: Vite 8.0.0

### Backend Stack
- **Framework**: FastAPI 0.115.0 (Python)
- **Database**: PostgreSQL with SQLAlchemy 2.0.35 ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Validation**: Pydantic 2.9.2
- **Migration**: Alembic 1.13.3
- **CORS**: FastAPI middleware

### Infrastructure
- **Frontend Hosting**: Railway (static hosting)
- **Backend Hosting**: Railway (Python/FastAPI)
- **Database**: Railway PostgreSQL
- **File Storage**: Cloudflare R2
- **CDN**: Cloudflare for static assets

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    points INTEGER DEFAULT 0,
    season_rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Dilemmas Table
```sql
CREATE TABLE dilemmas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR NOT NULL, -- 'personal' | 'community' | 'civic'
    outcome TEXT,
    image_url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Votes Table
```sql
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    dilemma_id INTEGER REFERENCES dilemmas(id) NOT NULL,
    choice VARCHAR NOT NULL, -- 'yes' | 'no'
    points_earned INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, dilemma_id) -- One vote per user per dilemma
);
```

### Comments Table
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    dilemma_id INTEGER REFERENCES dilemmas(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Relationships
- **User → Dilemmas**: One-to-many (author relationship)
- **User → Votes**: One-to-many
- **User → Comments**: One-to-many
- **Dilemma → Votes**: One-to-many
- **Dilemma → Comments**: One-to-many

## 📡 API Documentation

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "string"
}
```

#### POST `/auth/login`
Authenticate user and return JWT token.

**Request Body (Form Data):**
```
username: string
password: string
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer"
}
```

### User Endpoints

#### GET `/users/me`
Get current authenticated user's profile.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "points": 150,
  "season_rank": 5
}
```

#### GET `/users/leaderboard`
Get top users by points.

**Response:**
```json
[
  {
    "id": 1,
    "username": "user1",
    "points": 200,
    "season_rank": 1
  }
]
```

### Dilemma Endpoints

#### GET `/dilemmas`
Get list of dilemmas with optional filtering.

**Query Parameters:**
- `category`: Filter by category (personal/community/civic)
- `community`: (Reserved for future use)

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "username": "user1",
    "content": "Should I tell my friend the truth?",
    "category": "personal",
    "outcome": null,
    "votes_yes": 15,
    "votes_no": 8,
    "image_url": "https://...",
    "created_at": "2024-01-01T12:00:00Z"
  }
]
```

#### GET `/dilemmas/mine`
Get current user's dilemmas.

**Headers:** `Authorization: Bearer {token}`

#### POST `/dilemmas`
Create a new dilemma.

**Headers:** `Authorization: Bearer {token}`

**Request Body (Form Data):**
```
content: string
category: personal|community|civic
image: File (optional)
```

**Response:** Same as dilemma object above.

#### GET `/dilemmas/test-connection`
Test R2 connection (development/debugging).

**Response:**
```json
{
  "success": true,
  "message": "R2 connection successful",
  "buckets": ["dilemmas/file1.jpg", "dilemmas/file2.png"]
}
```

#### PATCH `/dilemmas/{dilemma_id}/outcome`
Set outcome for a dilemma (author only).

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "outcome": "I decided to tell the truth and it went well"
}
```

### Voting Endpoints

#### POST `/dilemmas/{dilemma_id}/vote`
Vote on a dilemma.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "choice": "yes" | "no"
}
```

**Response:**
```json
{
  "points_earned": 10,
  "dilemma": { /* updated dilemma object */ }
}
```

### Comment Endpoints

#### GET `/dilemmas/{dilemma_id}/comments`
Get comments for a dilemma.

**Response:**
```json
[
  {
    "id": 1,
    "dilemma_id": 1,
    "user_id": 1,
    "username": "user1",
    "content": "Great dilemma!",
    "created_at": "2024-01-01T12:30:00Z"
  }
]
```

#### POST `/dilemmas/{dilemma_id}/comments`
Add comment to dilemma.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "content": "This is my comment"
}
```

**Response:** Comment object as shown above.

## 🔐 Authentication System

### JWT Token Flow

1. **Registration/Login**: User provides credentials
2. **Token Generation**: Server creates JWT with user ID, expiration (7 days)
3. **Token Storage**: Frontend stores token in localStorage
4. **Request Authorization**: All API requests include `Authorization: Bearer {token}`
5. **Token Validation**: Server validates token on protected routes
6. **Auto Logout**: Invalid/expired tokens trigger logout and redirect

### Password Security

- **Hashing**: bcrypt with 12 rounds
- **Length Limit**: 72 characters (bcrypt limitation)
- **No Plaintext Storage**: Passwords never stored in plain text

### Route Protection

- **Public Routes**: `/auth/*`, `/` (health check)
- **Protected Routes**: All others require valid JWT token
- **Automatic Redirects**: Unauthenticated users redirected to `/auth`

## 🎨 Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── BottomNav.jsx      # Mobile navigation
│   ├── CategoryBadge.jsx  # Category labels
│   ├── DilemmaCard.jsx    # Dilemma display component
│   ├── RightPanel.jsx     # Sidebar content
│   └── SideNav.jsx        # Desktop navigation
├── pages/
│   ├── AI.jsx            # AI analysis page (planned)
│   ├── Auth.jsx          # Login/register forms
│   ├── Feed.jsx          # Main dilemma feed
│   ├── Leaderboard.jsx   # User rankings
│   ├── Post.jsx          # Create dilemma form
│   └── Profile.jsx       # User profile page
├── stores/
│   ├── authStore.js      # Authentication state
│   └── feedStore.js      # Feed data state
├── lib/
│   ├── api.js           # Axios configuration
│   └── mock.js          # Development mock data
└── App.jsx              # Main app component
```

### Key Components

#### App.jsx
- **Routing**: React Router setup with protected routes
- **Authentication Guards**: Redirect logic for auth states
- **Layout**: Main app structure with navigation

#### Auth.jsx
- **Dual Forms**: Login and registration in one component
- **State Management**: Form validation and submission
- **Navigation**: Automatic redirects after auth

#### Feed.jsx
- **Data Fetching**: React Query for dilemma list
- **Infinite Scroll**: Planned pagination
- **Real-time Updates**: Cache invalidation after actions

#### Post.jsx
- **Form Handling**: Multi-part form data for images
- **Image Preview**: Local file preview before upload
- **Validation**: Content and category requirements

#### DilemmaCard.jsx
- **Voting Interface**: Yes/No buttons with state
- **Statistics Display**: Vote counts and percentages
- **Image Handling**: Responsive image display

### State Management (Zustand)

#### authStore.js
```javascript
{
  user: User | null,
  token: string | null,
  login: (username, password) => Promise<void>,
  register: (username, email, password) => Promise<void>,
  logout: () => void,
  fetchMe: () => Promise<void>
}
```

#### feedStore.js
```javascript
{
  dilemmas: Dilemma[],
  loading: boolean,
  error: string | null,
  fetchDilemmas: () => Promise<void>,
  invalidateCache: () => void
}
```

## ⚙️ Backend Architecture

### Service Layer Structure

```
backend/app/
├── main.py              # FastAPI app initialization
├── database.py          # SQLAlchemy setup and migrations
├── models.py            # Database models
├── auth.py              # JWT utilities
├── routers/
│   ├── auth.py          # Authentication endpoints
│   ├── users.py         # User management
│   ├── dilemmas.py      # Dilemma CRUD and voting
│   └── communities.py   # Community features (planned)
```

### Key Services

#### Authentication Service (auth.py)
- **Token Creation**: JWT encoding with user ID and expiration
- **Password Hashing**: bcrypt for secure password storage
- **Token Validation**: Decode and verify JWT tokens
- **User Lookup**: Retrieve user from database by token

#### Database Service (database.py)
- **Connection**: PostgreSQL connection with SQLAlchemy
- **Migrations**: Alembic for schema changes
- **Session Management**: Database session lifecycle

#### File Upload Service (dilemmas.py)
- **R2 Integration**: boto3 client for Cloudflare R2
- **Image Processing**: File validation and upload
- **URL Generation**: Public URLs for uploaded files

### Error Handling

- **HTTP Exceptions**: FastAPI HTTPException for API errors
- **Validation**: Pydantic models for request validation
- **Database Errors**: Transaction rollback on failures
- **Logging**: Structured logging for debugging

## 📁 File Upload System

### R2 Configuration

```python
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")
R2_BUCKET = os.getenv("R2_BUCKET_NAME", "unihacks26")
R2_PUBLIC_URL = os.getenv("R2_PUBLIC_URL", "https://pub-...r2.dev")
```

### Upload Process

1. **File Reception**: FastAPI UploadFile in form data
2. **Validation**: File type checking (PNG, JPEG, GIF, WebP)
3. **Key Generation**: `dilemmas/{uuid}.{extension}`
4. **Upload**: boto3 put_object to R2 bucket
5. **URL Generation**: Public URL for frontend access

### Security Considerations

- **File Type Validation**: Only allowed image formats
- **Size Limits**: Client-side and potential server-side limits
- **Public Access**: Images stored publicly accessible
- **Unique Names**: UUID prevents filename collisions

## 🗳️ Voting System

### Vote Mechanics

1. **Single Vote**: Users can vote once per dilemma
2. **Binary Choice**: Yes/No voting system
3. **Point System**: +10 points per vote
4. **Real-time Updates**: Vote counts update immediately

### Database Constraints

- **Unique Constraint**: `(user_id, dilemma_id)` prevents duplicate votes
- **Foreign Keys**: Ensure referential integrity
- **Indexing**: Optimized queries for vote counts

### Vote Processing

```python
@router.post("/{dilemma_id}/vote")
def vote(dilemma_id: int, body: VoteBody, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Check for existing vote
    existing = db.query(models.Vote).filter_by(user_id=current_user.id, dilemma_id=dilemma_id).first()
    if existing:
        raise HTTPException(400, "Already voted")

    # Create vote
    vote = models.Vote(user_id=current_user.id, dilemma_id=dilemma_id, choice=body.choice, points_earned=10)
    db.add(vote)

    # Update user points
    current_user.points += 10
    db.commit()

    return {"points_earned": 10, "dilemma": fmt(dilemma)}
```

## 🔄 State Management

### React Query Integration

- **Caching**: Automatic caching of API responses
- **Background Updates**: Refetch on window focus
- **Optimistic Updates**: Immediate UI updates
- **Error Handling**: Retry logic and error states

### Zustand Stores

#### Authentication Store
- **Persistent State**: Token survives page refreshes
- **Auto-login**: Attempt to fetch user on app start
- **Logout Cleanup**: Clear all auth-related state

#### Feed Store
- **Dilemma List**: Cached dilemma data
- **Loading States**: UI feedback during API calls
- **Cache Invalidation**: Update feed after new posts

### Data Flow

1. **User Action** → Component event handler
2. **API Call** → Axios with auth headers
3. **State Update** → React Query cache update
4. **UI Re-render** → Components reflect new state

## 🚀 Deployment

### Railway Configuration

#### railway.toml
```toml
[build]
builder = "dockerfile"
```

#### Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

#### Backend
```
SECRET_KEY=your-jwt-secret-key
DATABASE_URL=postgresql://...
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY=your-r2-access-key
R2_SECRET_KEY=your-r2-secret-key
R2_BUCKET_NAME=unihacks26
R2_PUBLIC_URL=https://pub-...r2.dev
FRONTEND_URL=https://your-frontend-url.railway.app
```

#### Frontend
```
VITE_API_URL=https://your-backend-url.railway.app
```

### Build Process

1. **Git Push**: Code pushed to GitHub main branch
2. **Railway Trigger**: Automatic deployment starts
3. **Docker Build**: Backend container built
4. **Database Migration**: Alembic runs migrations
5. **Static Deploy**: Frontend built and deployed
6. **Health Check**: Services verified running

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | JWT signing key | `your-256-bit-secret` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host:5432/db` |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID | `abc123def456` |
| `R2_ACCESS_KEY` | R2 access key | `r2_access_key` |
| `R2_SECRET_KEY` | R2 secret key | `r2_secret_key` |
| `R2_BUCKET_NAME` | R2 bucket name | `unihacks26` |
| `R2_PUBLIC_URL` | Custom R2 domain | `https://pub-xxx.r2.dev` |
| `ADMIN_USERNAMES` | Comma-separated list of usernames that are allowed to delete any post | `admin,moderator` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |
| `VITE_API_URL` | `http://localhost:8000` | Frontend API endpoint |

## 🛠️ Development Setup

### Prerequisites

- **Node.js**: 18+ for frontend
- **Python**: 3.11+ for backend
- **PostgreSQL**: 13+ for database
- **Git**: For version control

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your values

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with API URL

# Start development server
npm run dev
```

### Database Setup

```bash
# Create PostgreSQL database
createdb unihack26

# Or use Docker
docker run -d \
  --name postgres \
  -e POSTGRES_DB=unihack26 \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:13
```

### Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Manual testing
# Visit http://localhost:5173 for frontend
# API available at http://localhost:8000
```

## 🔒 Security Features

### Authentication Security

- **JWT Tokens**: Stateless authentication with expiration
- **Password Hashing**: bcrypt with high work factor (12 rounds)
- **Token Blacklisting**: Automatic logout on invalid tokens
- **CORS Protection**: Configured allowed origins

### API Security

- **Input Validation**: Pydantic models for all requests
- **SQL Injection Prevention**: SQLAlchemy parameterized queries
- **Rate Limiting**: Planned for production deployment
- **HTTPS Only**: Railway enforces SSL/TLS

### File Upload Security

- **Type Validation**: Only allowed image formats
- **Size Limits**: Client-side file size restrictions
- **Unique Filenames**: UUID prevents path traversal
- **Public Access**: Images stored with public read access

### Data Protection

- **No Plaintext Passwords**: All passwords hashed
- **Secure Tokens**: JWT with proper signing
- **Environment Variables**: Sensitive data not in code
- **Database Encryption**: PostgreSQL with proper configuration

## 🚀 Future Enhancements

### Planned Features

1. **AI Integration**
   - Civic dilemma analysis using OpenAI/Claude
   - Automated outcome suggestions
   - Sentiment analysis on comments

2. **Real-time Features**
   - WebSocket connections for live updates
   - Real-time voting notifications
   - Live comment threads

3. **Advanced Analytics**
   - Voting pattern analysis
   - User engagement metrics
   - Dilemma outcome tracking

4. **Mobile App**
   - React Native implementation
   - Push notifications
   - Offline voting capability

5. **Multi-language Support**
   - Internationalization (i18n)
   - Multiple language dilemma categories
   - Global user base expansion

### Technical Improvements

- **Performance**: Database query optimization, caching
- **Scalability**: Microservices architecture, load balancing
- **Monitoring**: Application monitoring, error tracking
- **Testing**: Comprehensive test coverage, CI/CD pipeline

## 🏆 Hackathon Achievements

Built for UniHack26 with focus on:

- **Social Impact**: Platform for ethical decision-making
- **Technical Innovation**: Modern full-stack architecture
- **User Experience**: Intuitive dilemma-sharing interface
- **Scalability**: Cloud-native deployment ready

## 📞 Support

For questions or issues:
- Check the [API Documentation](#-api-documentation)
- Review [Environment Setup](#-development-setup)
- Examine Railway deployment logs
- Test with the `/dilemmas/test-connection` endpoint

## 📄 License

This project is built for educational and hackathon purposes. See individual component licenses for details.