# 🚀 Vytara Wellbeing App - Quick Reference Card

## 📍 URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:5173 | ✅ Running |
| **Backend API** | http://localhost:3000/api | ✅ Running |
| **Database** | localhost:5432/vytara_wellbeing | ✅ Running |

---

## 🎯 Quick Commands

### Start Backend
```bash
cd /Users/sairamvarma/Desktop/ProjectZ/vytara/wellbeingapp
./mvnw spring-boot:run
```

### Start Frontend
```bash
cd /Users/sairamvarma/Desktop/ProjectZ/vytara/wellbeingapp-frontend
npm run dev
```

### Check Services
```bash
# Backend
lsof -i :3000

# Frontend
lsof -i :5173

# Database
psql -U sairamvarma -d vytara_wellbeing -c "SELECT 1;"
```

---

## 🔑 Test Credentials

### Create New User
- Navigate to http://localhost:5173
- Click "Create Account"
- Fill in details and sign up

### Example User
```
Email: testuser@example.com
Password: Test@1234
```

---

## 📊 Features to Test

### ✅ Authentication
- [ ] Sign up
- [ ] Login
- [ ] Logout
- [ ] Token refresh

### ✅ Nutrition
- [ ] View daily goals
- [ ] Add meals
- [ ] Track water
- [ ] View progress

### ✅ Tasks
- [ ] Create task list
- [ ] Add tasks
- [ ] Complete tasks
- [ ] Earn XP
- [ ] View leaderboard

### ✅ Chat
- [ ] Create chat
- [ ] Send message
- [ ] Get AI response
- [ ] Delete chat

---

## 🐛 Quick Fixes

### Clear All Data
```javascript
// In browser console
localStorage.clear();
window.location.reload();
```

### Restart Backend
```bash
# Stop: Ctrl+C in backend terminal
# Start:
cd /Users/sairamvarma/Desktop/ProjectZ/vytara/wellbeingapp
./mvnw spring-boot:run
```

### Restart Frontend
```bash
# Stop: Ctrl+C in frontend terminal
# Start:
cd /Users/sairamvarma/Desktop/ProjectZ/vytara/wellbeingapp-frontend
npm run dev
```

---

## 📁 Key Files

### Configuration
- `.env` - Frontend environment variables
- `src/main/resources/application.properties` - Backend config

### API Integration
- `src/services/api.js` - API client
- `src/context/AuthContext.jsx` - Auth state management

### Components
- `src/components/Auth/Login.jsx` - Login
- `src/components/Nutrition/NutritionLayout.jsx` - Nutrition
- `src/components/Tasks/TasksLayout.jsx` - Tasks
- `src/components/Chat/ChatLayout.jsx` - Chat

---

## 🔍 Debugging

### Check Backend Logs
```bash
# In backend terminal, look for:
POST /api/auth/login - 200 OK
GET /api/nutrition/meals - 200 OK
```

### Check Frontend Console
```javascript
// Open browser DevTools (F12)
// Check for errors in Console tab
// Check API calls in Network tab
```

### Check Database
```sql
-- Connect to database
psql -U sairamvarma -d vytara_wellbeing

-- Check users
SELECT * FROM users;

-- Check meals
SELECT * FROM meals;

-- Check tasks
SELECT * FROM tasks;
```

---

## 📞 Support

### Documentation
- `INTEGRATION_SUMMARY.md` - Overview
- `INTEGRATION_COMPLETE.md` - Detailed docs
- `TESTING_GUIDE.md` - Testing instructions
- `BACKEND_API_REQUIREMENTS.md` - API specs

### Common Issues
1. **Network Error** → Check backend is running
2. **401 Unauthorized** → Clear localStorage and login
3. **CORS Error** → Check backend CORS config
4. **Database Error** → Check PostgreSQL is running

---

## ✅ Status

**Integration**: ✅ Complete  
**Core Features**: ✅ 100%  
**API Endpoints**: ✅ 24/33 (73%)  
**Ready for Testing**: ✅ Yes

---

**Last Updated**: January 19, 2026  
**Version**: 1.0.0

🚀 **Start Testing**: http://localhost:5173

