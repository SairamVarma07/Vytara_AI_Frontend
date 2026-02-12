# 🧪 Vytara Wellbeing App - Testing Guide

## 🎯 Quick Start Testing

### Prerequisites Check
```bash
# 1. Check if backend is running
lsof -i :3000

# 2. Check if PostgreSQL is running
psql -U sairamvarma -d vytara_wellbeing -c "SELECT 1;"

# 3. Check if frontend dev server is running
lsof -i :5173
```

---

## 🔐 Test 1: Authentication Flow

### A. Sign Up New User
1. Navigate to `http://localhost:5173`
2. Click **"Create Account"** button
3. Fill in the form:
   - **Full Name**: Test User
   - **Email**: testuser@example.com
   - **Password**: Test@1234
   - **Confirm Password**: Test@1234
   - ✅ Check "I agree to terms"
4. Click **"Create Account"**

**Expected Result:**
- ✅ User is created in database
- ✅ JWT tokens are stored in localStorage
- ✅ Redirected to `/nutrition` page
- ✅ Navbar shows user profile

**Check Backend Logs:**
```
POST /api/auth/signup - 200 OK
```

**Check Browser Console:**
```javascript
localStorage.getItem('accessToken') // Should return JWT token
localStorage.getItem('refreshToken') // Should return refresh token
localStorage.getItem('userData') // Should return user object
```

---

### B. Log Out
1. Click on profile icon in navbar
2. Click **"Logout"**

**Expected Result:**
- ✅ Tokens removed from localStorage
- ✅ Redirected to login page
- ✅ Backend logout endpoint called

---

### C. Log In Existing User
1. Navigate to `http://localhost:5173`
2. Enter credentials:
   - **Email**: testuser@example.com
   - **Password**: Test@1234
3. ✅ Check "Remember Me" (optional)
4. Click **"Login"**

**Expected Result:**
- ✅ User is authenticated
- ✅ JWT tokens stored
- ✅ Redirected to `/nutrition`

**Check Backend Logs:**
```
POST /api/auth/login - 200 OK
```

---

## 🍽️ Test 2: Nutrition Tracking

### A. View Daily Goals
1. Navigate to `/nutrition`
2. Observe the calorie ring and macro rings

**Expected Result:**
- ✅ Daily calorie goal displayed (default: 2000 kcal)
- ✅ Macro goals displayed (Protein: 150g, Carbs: 200g, Fats: 65g)
- ✅ Current progress shown as 0 (no meals yet)

**API Call:**
```
GET /api/nutrition/goal - 200 OK
```

---

### B. Add a Meal
1. Scroll to "Add Meal" section
2. Select **Meal Type**: Breakfast
3. Enter **Meal Name**: "Oatmeal with banana"
4. Click **"Add Meal"**

**Expected Result:**
- ✅ Meal appears in meal list
- ✅ Calorie ring updates
- ✅ Macro rings update
- ✅ Meal saved to database

**API Call:**
```
POST /api/nutrition/meals - 200 OK
```

**Check Database:**
```sql
SELECT * FROM meals WHERE user_id = (SELECT id FROM users WHERE email = 'testuser@example.com');
```

---

### C. Add Water Intake
1. Find the "Water Tracker" card
2. Click the **"+ Add Glass"** button multiple times

**Expected Result:**
- ✅ Water glass count increases
- ✅ Progress bar fills up
- ✅ Water intake saved to database

**API Call:**
```
PUT /api/nutrition/water - 200 OK
```

---

### D. Test Data Persistence
1. Refresh the page (`Ctrl+R` or `Cmd+R`)

**Expected Result:**
- ✅ All meals still visible
- ✅ Water intake preserved
- ✅ Calorie and macro progress maintained

**API Calls:**
```
GET /api/nutrition/meals?date=2026-01-19 - 200 OK
GET /api/nutrition/goal - 200 OK
GET /api/nutrition/water?date=2026-01-19 - 200 OK
```

---

## ✅ Test 3: Task Management

### A. Create Task List
1. Navigate to `/tasks`
2. Click **"+ New List"** button
3. Enter name: "Work Tasks"
4. Press Enter

**Expected Result:**
- ✅ New task list created
- ✅ List appears in sidebar
- ✅ List is automatically selected

**API Call:**
```
POST /api/tasks/lists - 200 OK
```

---

### B. Add Tasks
1. Select "Work Tasks" list
2. In the task input field, enter: "Complete project documentation"
3. Select **Priority**: High
4. Click **"Add Task"**

Repeat for:
- "Review code changes" - Priority: Medium
- "Update README" - Priority: Low

**Expected Result:**
- ✅ 3 tasks appear in the list
- ✅ Each task shows correct priority color
- ✅ Tasks saved to database

**API Call:**
```
POST /api/tasks/lists/:listId/tasks - 200 OK (3 times)
```

---

### C. Complete a Task
1. Click the checkbox next to "Complete project documentation"

**Expected Result:**
- ✅ Task marked as completed (strikethrough)
- ✅ XP popup appears (+30 XP for High priority)
- ✅ XP bar increases
- ✅ Level up animation if threshold reached

**API Call:**
```
PUT /api/tasks/lists/:listId/tasks/:taskId - 200 OK
```

**Check User Stats:**
```sql
SELECT * FROM user_stats WHERE user_id = (SELECT id FROM users WHERE email = 'testuser@example.com');
```

---

### D. View Leaderboard
1. Scroll down to "Global Leaderboard" section

**Expected Result:**
- ✅ Leaderboard shows top users
- ✅ Current user appears with "YOU" badge
- ✅ Users sorted by XP (highest first)

**API Call:**
```
GET /api/tasks/leaderboard - 200 OK
```

---

### E. Edit and Delete Tasks
1. Click the **edit icon** on a task
2. Change the text
3. Press Enter

**Expected Result:**
- ✅ Task text updated
- ✅ Changes saved to database

4. Click the **delete icon** on a task

**Expected Result:**
- ✅ Task removed from list
- ✅ Deleted from database

**API Calls:**
```
PUT /api/tasks/lists/:listId/tasks/:taskId - 200 OK
DELETE /api/tasks/lists/:listId/tasks/:taskId - 200 OK
```

---

## 💬 Test 4: AI Chat

### A. View Existing Chats
1. Navigate to `/chat`

**Expected Result:**
- ✅ Chat sidebar shows existing chats
- ✅ If no chats exist, a default chat is created
- ✅ First chat is automatically selected

**API Call:**
```
GET /api/chat - 200 OK
```

---

### B. Send a Message
1. In the chat input, type: "Hello! How are you?"
2. Press Enter or click Send

**Expected Result:**
- ✅ User message appears immediately
- ✅ "AI is typing..." indicator shows
- ✅ AI response appears after 1-2 seconds
- ✅ Both messages saved to database

**API Call:**
```
POST /api/chat/:chatId/messages - 200 OK
```

**Backend Processing:**
- User message saved
- OpenAI API called (if configured)
- AI response generated
- AI message saved
- Both messages returned to frontend

---

### C. Create New Chat
1. Click **"+ New Chat"** button in sidebar

**Expected Result:**
- ✅ New chat created
- ✅ Chat appears in sidebar
- ✅ Chat is automatically selected
- ✅ Empty message area displayed

**API Call:**
```
POST /api/chat - 200 OK
```

---

### D. Delete a Chat
1. Hover over a chat in the sidebar
2. Click the **delete icon**

**Expected Result:**
- ✅ Chat removed from sidebar
- ✅ If active chat was deleted, another chat is selected
- ✅ Chat deleted from database

**API Call:**
```
DELETE /api/chat/:chatId - 200 OK
```

---

## 🔄 Test 5: Token Refresh

### A. Automatic Token Refresh
1. Log in to the app
2. Wait for 15 minutes (JWT token expires after 15 min by default)
3. Perform any action (add meal, create task, etc.)

**Expected Result:**
- ✅ Token is automatically refreshed
- ✅ Action completes successfully
- ✅ No logout or error

**Check Browser Console:**
```
POST /api/auth/refresh - 200 OK
```

**Check localStorage:**
```javascript
// New access token should be different from old one
localStorage.getItem('accessToken')
```

---

### B. Manual Token Refresh Test
1. Open browser DevTools → Console
2. Run:
```javascript
// Get current token
const oldToken = localStorage.getItem('accessToken');
console.log('Old Token:', oldToken);

// Wait 1 minute and perform an action
// Check if token changed
const newToken = localStorage.getItem('accessToken');
console.log('New Token:', newToken);
console.log('Token Changed:', oldToken !== newToken);
```

---

## 🐛 Test 6: Error Handling

### A. Network Error
1. Stop the backend server:
```bash
# In backend terminal, press Ctrl+C
```

2. Try to add a meal or create a task

**Expected Result:**
- ✅ Error message displayed
- ✅ "Failed to load data" or similar message
- ✅ Retry button available
- ✅ App doesn't crash

---

### B. Invalid Credentials
1. Log out
2. Try to log in with wrong password

**Expected Result:**
- ✅ Error message: "Invalid credentials"
- ✅ Form remains visible
- ✅ User can retry

---

### C. Validation Errors
1. Try to create account with:
   - Invalid email: "notanemail"
   - Weak password: "123"
   - Mismatched passwords

**Expected Result:**
- ✅ Validation errors displayed
- ✅ Form submission blocked
- ✅ Clear error messages

---

## 📊 Test 7: Data Consistency

### A. Multi-Tab Sync Test
1. Open app in two browser tabs
2. In Tab 1: Add a meal
3. In Tab 2: Refresh the page

**Expected Result:**
- ✅ Meal appears in Tab 2
- ✅ Data is consistent across tabs

---

### B. Logout and Re-login
1. Add several meals, tasks, and chat messages
2. Log out
3. Log back in

**Expected Result:**
- ✅ All data is preserved
- ✅ Meals, tasks, and chats are visible
- ✅ XP and level maintained

---

## 🚀 Performance Tests

### A. Loading Speed
1. Clear browser cache
2. Open DevTools → Network tab
3. Navigate to each page

**Expected Results:**
- ✅ Login page: < 1 second
- ✅ Nutrition page: < 2 seconds
- ✅ Tasks page: < 2 seconds
- ✅ Chat page: < 2 seconds

---

### B. API Response Times
Check Network tab for API calls:

**Acceptable Response Times:**
- Authentication: < 500ms
- GET requests: < 300ms
- POST/PUT requests: < 500ms
- Chat AI responses: < 3 seconds

---

## ✅ Final Checklist

### Core Features
- [ ] User can sign up
- [ ] User can log in
- [ ] User can log out
- [ ] User can add meals
- [ ] User can track water intake
- [ ] User can create task lists
- [ ] User can add and complete tasks
- [ ] User earns XP for completing tasks
- [ ] User can view leaderboard
- [ ] User can chat with AI assistant
- [ ] User can create and delete chats

### Data Persistence
- [ ] Meals persist after refresh
- [ ] Tasks persist after refresh
- [ ] Chat history persists after refresh
- [ ] User stats persist after refresh
- [ ] Data persists after logout/login

### Error Handling
- [ ] Network errors are handled gracefully
- [ ] Invalid inputs show validation errors
- [ ] API errors show user-friendly messages
- [ ] Loading states are displayed

### Security
- [ ] JWT tokens are stored securely
- [ ] Tokens are automatically refreshed
- [ ] Protected routes require authentication
- [ ] Logout clears all tokens

---

## 🎉 Success Criteria

**All tests passed?** → **Frontend is ready for production!** 🚀

**Some tests failed?** → Check:
1. Backend logs for errors
2. Browser console for JavaScript errors
3. Network tab for failed API calls
4. Database for missing data

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Authentication: ✅ / ❌
Nutrition: ✅ / ❌
Tasks: ✅ / ❌
Chat: ✅ / ❌
Token Refresh: ✅ / ❌
Error Handling: ✅ / ❌
Data Persistence: ✅ / ❌

Notes:
_______________________
_______________________
```

---

**Happy Testing! 🎯**

