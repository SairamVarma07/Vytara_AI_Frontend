# Analytics Dashboard Verification Guide

## Code Verification Summary

### Backend Verification ✅

| Component | Status | Notes |
|-----------|--------|-------|
| WeightLog Entity | ✅ Complete | JPA annotations, User relationship, unique constraint |
| MoodLog Entity | ✅ Complete | JPA annotations, User relationship, unique constraint |
| WeightLogRepository | ✅ Complete | All CRUD + analytics queries |
| MoodLogRepository | ✅ Complete | All CRUD + analytics queries |
| WeightLogDto | ✅ Complete | Record with id, weightKg, date, notes |
| MoodLogDto | ✅ Complete | Record with all mood fields |
| AnalyticsDashboardDto | ✅ Complete | Nested DTOs for all analytics |
| AnalyticsService | ✅ Complete | Interface with all methods |
| AnalyticsServiceImpl | ✅ Complete | All dependencies injected |
| AnalyticsController | ✅ Complete | All 7 endpoints implemented |
| TaskRepository | ✅ Updated | Added analytics queries |

### Frontend Verification ✅

| Component | Status | Notes |
|-----------|--------|-------|
| Recharts | ✅ Installed | Version in package.json |
| api.js analytics | ✅ Complete | All 7 endpoints defined |
| AnalyticsDashboard.jsx | ✅ Complete | All charts and modals |
| AnalyticsDashboard.module.css | ✅ Complete | All styles defined |
| NutritionLayout.jsx | ✅ Updated | Dashboard integrated |

### Endpoint Mapping

| Frontend API | Backend Controller | Method |
|--------------|-------------------|--------|
| `api.analytics.getDashboard(startDate, endDate)` | `GET /api/analytics/dashboard` | ✅ Match |
| `api.analytics.logWeight(data)` | `POST /api/analytics/weight` | ✅ Match |
| `api.analytics.getWeightHistory(startDate, endDate)` | `GET /api/analytics/weight` | ✅ Match |
| `api.analytics.getLatestWeight()` | `GET /api/analytics/weight/latest` | ✅ Match |
| `api.analytics.logMood(data)` | `POST /api/analytics/mood` | ✅ Match |
| `api.analytics.getMoodHistory(startDate, endDate)` | `GET /api/analytics/mood` | ✅ Match |
| `api.analytics.getTodaysMood()` | `GET /api/analytics/mood/today` | ✅ Match |

## Database Tables (Auto-created by Hibernate)

When you start the backend, these new tables will be created:

### weight_logs
```sql
CREATE TABLE weight_logs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    weight_kg DOUBLE PRECISION NOT NULL,
    date DATE NOT NULL,
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL,
    UNIQUE (user_id, date)
);
```

### mood_logs
```sql
CREATE TABLE mood_logs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    mood_score INTEGER NOT NULL,
    energy_level INTEGER,
    stress_level INTEGER,
    sleep_hours DOUBLE PRECISION,
    notes VARCHAR(1000),
    date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    UNIQUE (user_id, date)
);
```

## Manual Testing Steps

### 1. Start Backend
```bash
cd /Users/sairamvarma/Desktop/ProjectZ/vytara/wellbeingapp
./mvnw spring-boot:run
```

### 2. Start Frontend
```bash
cd /Users/sairamvarma/Desktop/ProjectZ/vytara/wellbeingapp-frontend
npm run dev
```

### 3. Test Endpoints with cURL

**Note:** Replace `YOUR_JWT_TOKEN` with a valid token from login.

#### Test Dashboard Endpoint
```bash
curl -X GET "http://localhost:3000/api/analytics/dashboard?startDate=2026-01-01&endDate=2026-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### Test Log Weight
```bash
curl -X POST "http://localhost:3000/api/analytics/weight" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"weightKg": 75.5, "notes": "Morning weight"}'
```

#### Test Log Mood
```bash
curl -X POST "http://localhost:3000/api/analytics/mood" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"moodScore": 4, "energyLevel": 4, "stressLevel": 2, "sleepHours": 7.5}'
```

#### Test Get Weight History
```bash
curl -X GET "http://localhost:3000/api/analytics/weight?startDate=2026-01-01&endDate=2026-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Test Get Mood History
```bash
curl -X GET "http://localhost:3000/api/analytics/mood?startDate=2026-01-01&endDate=2026-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Database Verification

Connect to PostgreSQL and verify tables:
```sql
-- Check if tables were created
\dt weight_logs
\dt mood_logs

-- Check weight logs
SELECT * FROM weight_logs;

-- Check mood logs  
SELECT * FROM mood_logs;
```

## Features Implemented

1. **Calorie Trend Chart** - Area chart showing daily calorie intake with goal line
2. **Weight Trend Chart** - Line chart showing weight over time
3. **Mood Trend Chart** - Line chart showing mood scores over time
4. **Task Completion Chart** - Bar chart comparing tasks created vs completed
5. **Activity Calendar** - GitHub-style contribution graph
6. **Date Range Selector** - 7, 14, 30, 90 day options
7. **Quick Actions** - Log mood and weight directly from dashboard
8. **Streak Tracking** - Current streak, longest streak, total active days
9. **Stats Overview** - Avg calories, weight change, avg mood, tasks completed

## Troubleshooting

### Backend won't start
- Ensure Java 17+ is installed: `java -version`
- Ensure PostgreSQL is running on port 5433
- Check database connection in `application.properties`

### Frontend charts not loading
- Check browser console for errors
- Ensure backend is running
- Check authentication token is valid

### Database tables not created
- Verify `spring.jpa.hibernate.ddl-auto=update` in application.properties
- Check Hibernate logs for errors
