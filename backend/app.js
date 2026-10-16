require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Allowed frontend origins
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5500',
    'http://127.0.0.1:5500'
].filter(Boolean);

// Configure CORS
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import route files
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const clubRoutes = require('./routes/clubRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const tagRoutes = require('./routes/tagRoutes');
const pinnedItemRoutes = require('./routes/pinnedItemRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Import error-handling middleware
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// Home route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Campus Community Centre API is running',
        version: '1.0.0'
    });
});

// API routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/pinned-items', pinnedItemRoutes);
app.use('/api/search', searchRoutes);

// Handle unknown routes
app.use(notFoundMiddleware);

// Handle application errors
app.use(errorMiddleware);

module.exports = app;
