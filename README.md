# 🚀 PlacePrep — Full Stack Placement Training Platform

A complete, production-ready placement preparation platform with AI-powered chatbot, coding practice, mock tests, company-specific guides, and performance dashboards.

---

## 📁 Project Structure

```
placement-platform/
├── backend/          # Node.js + Express + MongoDB API
└── frontend/         # React + Vite SPA
```

---

## ⚡ Quick Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Anthropic API key (for AI chatbot)

---

### 1. Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/placement_platform
JWT_SECRET=your_super_secret_jwt_key_change_this
ANTHROPIC_API_KEY=sk-ant-your-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

```bash
# Seed the database with sample data
npm run seed

# Start development server
npm run dev
```

Backend runs on: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🔑 Demo Credentials

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@placeprep.com      | admin123    |
| Student | arjun@student.com        | student123  |
| Student | priya@student.com        | student123  |

---

## 🎯 Features

### 👤 User Management
- JWT-based authentication (register/login)
- Role-based access (Student / Admin)
- Profile with skills, target companies, resume upload

### 📚 Learning
- Courses: Aptitude, Technical (DSA/DBMS/OS), Company-wise
- Rich content viewer with markdown support

### 📝 Tests & Quizzes
- Topic-wise, Mock, Company-specific tests
- Timed exams with auto-submit
- Auto-evaluation with score & explanations
- XP rewards for performance

### 💻 Coding Platform
- DSA problems (Easy → Hard)
- In-browser code editor (JavaScript execution)
- Multi-language support (Python, Java, C++ stubs)
- Test cases, leaderboard

### 🤖 AI Chatbot (Main Feature)
- Powered by **Claude claude-opus-4-5** via Anthropic API
- Modes: General / DSA / Aptitude / Interview / Resume
- Multi-turn conversation with history
- Resume review & personalized study plan generation
- Suggested questions for quick access

### 🏢 Companies
- 6 pre-seeded companies (TCS, Infosys, Wipro, Google, Microsoft, Amazon)
- Interview process, top topics, active placement drives
- Difficulty ratings

### 🏆 Gamification
- XP points for tests and coding solutions
- Streak tracking
- Leaderboard (top 50 students)

### 📊 Dashboard
- Weekly activity charts (Recharts)
- Category performance breakdown
- Recent results & submissions
- Quick access links

### 🛡️ Admin Panel
- Platform stats overview
- Create tests and courses
- View all registered users

---

## 🛠 Tech Stack

| Layer     | Technology                                |
|-----------|-------------------------------------------|
| Frontend  | React 18, Vite, React Router v6           |
| Styling   | Pure CSS with CSS Variables (dark theme)  |
| Charts    | Recharts                                  |
| Editor    | CodeMirror 6 via @uiw/react-codemirror   |
| Markdown  | react-markdown + remark-gfm              |
| Backend   | Node.js, Express.js                       |
| Database  | MongoDB + Mongoose                        |
| Auth      | JWT + bcryptjs                            |
| AI        | Anthropic SDK (Claude claude-opus-4-5)          |
| File Upload | Multer                                  |
| Toasts    | react-hot-toast                           |

---

## 🔗 API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user (protected)

### Users
- `GET /api/users/profile` — Get profile
- `PUT /api/users/profile` — Update profile
- `POST /api/users/resume` — Upload resume
- `GET /api/users/leaderboard` — Get leaderboard

### Courses
- `GET /api/courses` — List all courses (with filters)
- `GET /api/courses/:id` — Get single course
- `POST /api/courses` — Create course (admin)

### Tests
- `GET /api/tests` — List tests (with type/category filters)
- `GET /api/tests/:id` — Get test (without answers)
- `POST /api/tests/:id/submit` — Submit test answers
- `GET /api/tests/my-results` — Get user's results

### Coding
- `GET /api/coding` — List problems
- `GET /api/coding/:id` — Get problem detail
- `POST /api/coding/run` — Run code
- `POST /api/coding/:id/submit` — Submit solution

### Chat (AI)
- `POST /api/chat/send` — Send message to AI
- `GET /api/chat/history` — Get chat history
- `POST /api/chat/review-resume` — AI resume review
- `POST /api/chat/study-plan` — Generate study plan

### Companies
- `GET /api/companies` — List companies
- `GET /api/companies/:id` — Get company detail

### Dashboard
- `GET /api/dashboard/student` — Student dashboard data
- `GET /api/dashboard/admin` — Admin dashboard data (admin only)

---

## 🚀 Production Deployment

### Backend (e.g., Railway / Render)
1. Set env vars (MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY)
2. `npm start`

### Frontend (e.g., Vercel / Netlify)
1. Update `vite.config.js` proxy or use env var for API URL
2. `npm run build`
3. Deploy `dist/` folder

### MongoDB
- Use MongoDB Atlas free tier
- Update MONGO_URI in backend .env

---

## 📦 Seed Data Included

- ✅ 3 student accounts + 1 admin
- ✅ 4 courses (DSA, Aptitude, DBMS, TCS-specific)
- ✅ 3 tests (Aptitude Mock, DSA Arrays, TCS Mock)
- ✅ 5 coding problems (Two Sum, Valid Parentheses, Max Subarray, etc.)
- ✅ 6 companies (TCS, Infosys, Wipro, Google, Microsoft, Amazon)

---

## 🔧 Extending the Platform

### Adding Questions to Tests
Use the MongoDB shell or a REST client:
```json
POST /api/tests
{
  "title": "OS Mock Test",
  "type": "topic-wise",
  "category": "technical",
  "duration": 45,
  "questions": [
    {
      "text": "What is a deadlock?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "...",
      "difficulty": "medium"
    }
  ]
}
```

### Adding Coding Problems
The starter code supports 4 languages. Add problems with test cases via the API.

---

Built with ❤️ for placement warriors
