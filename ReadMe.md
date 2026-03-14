# UniHack26 - Parallel Dilemma Platform

🎯 **Project Purpose**  
A social platform where users can post moral/ethical dilemmas and the community votes on them. Built for the UniHack26 hackathon, it combines social interaction with AI-powered insights.

## 🏗️ Architecture

### Frontend: React + Vite
- **Framework**: React with hooks and context
- **Routing**: React Router
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with interceptors
- **UI Components**: Custom components with Lucide icons

### Backend: FastAPI (Python)
- **Framework**: FastAPI with async support
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Deployment**: Railway

## 📱 Core Features

### 1. User Management
- User registration/login
- JWT-based authentication
- Profile management
- Secure password hashing

### 2. Dilemma System
- Post dilemmas with categories (personal, community, civic)
- Rich text content support
- Image uploads to Cloudflare R2
- Outcome tracking

### 3. Voting System
- Yes/No voting on dilemmas
- Vote tracking and statistics
- Real-time vote counts
- User voting history

### 4. Social Features
- Comment system on dilemmas
- User profiles with dilemma history
- Leaderboard system
- Community interaction

### 5. AI Integration (Planned)
- AI-powered dilemma analysis
- Civic dilemma synthesis
- Recommendation generation

## 🗂️ Project Structure

```
Dockerfile
railway.toml
ReadMe.md
backend/
    Procfile
    requirements.txt
    app/
        auth.py
        database.py
        main.py
        models.py
        routers/
            auth.py
            communities.py
            dilemmas.py
            users.py
frontend/
    eslint.config.js
    index.html
    package.json
    postcss.config.js
    README.md
    vite.config.js
    public/
        serve.json
    src/
        App.css
        App.jsx
        index.css
        main.jsx
        assets/
        components/
            BottomNav.jsx
            CategoryBadge.jsx
            DilemmaCard.jsx
            RightPanel.jsx
            SideNav.jsx
        lib/
            api.js
            mock.js
        pages/
            AI.jsx
            Auth.jsx
            Feed.jsx
            Leaderboard.jsx
            Post.jsx
            Profile.jsx
        stores/
            authStore.js
            feedStore.js
```

## 🗄️ Database Schema
*(To be documented based on models.py)*

## 🔐 Security Features
- JWT authentication with secure secrets
- Password hashing with bcrypt
- CORS protection
- Input validation with Pydantic
- SQL injection protection via SQLAlchemy

## ☁️ Infrastructure
- **Frontend**: Deployed via Railway (static hosting)
- **Backend**: Railway (Python/FastAPI)
- **Database**: Railway PostgreSQL
- **File Storage**: Cloudflare R2
- **CDN**: Cloudflare for static assets

## 🎨 UI/UX Design
- **Dark Theme**: Modern dark color scheme (#0f0f0f, #1a1a1a, #2a2a2a)
- **Responsive**: Mobile-first design with adaptive layouts
- **Interactive**: Smooth animations with Framer Motion
- **Accessible**: Proper contrast and semantic HTML

## 🚀 Deployment Status
- ✅ Backend deployed on Railway
- ✅ Database migrations working
- ✅ Authentication system live
- ✅ R2 image uploads functional
- ✅ Frontend ready for deployment

## 📈 Future Enhancements
- AI-powered dilemma analysis
- Real-time notifications
- Advanced voting analytics
- Mobile app development
- Multi-language support

## 🏆 Hackathon Focus
Built for UniHack26 with emphasis on:
- **Social Impact**: Civic dilemma resolution
- **Technical Innovation**: AI integration
- **Scalability**: Cloud-native architecture
- **User Experience**: Intuitive dilemma-sharing platform

## Getting Started

### Prerequisites
- Node.js (for frontend)
- Python 3.8+ (for backend)
- PostgreSQL (for database)

### Installation

#### Backend
```bash
cd backend
pip install -r requirements.txt
# Set up environment variables
# Run migrations
# Start server
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Deployment
- Backend: Railway
- Frontend: Railway static hosting
- Database: Railway PostgreSQL

## Contributing
*(Add contribution guidelines)*

## License
*(Add license information)*