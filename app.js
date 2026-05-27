const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');

const errorMiddleware = require('./middlewares/error.middleware');
const rateLimit = require('./middlewares/rateLimit.middleware');
const loggerMiddleware = require('./middlewares/logger.middleware');

// Routes imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/event.routes');
const noticeRoutes = require('./routes/notice.routes');
const galleryRoutes = require('./routes/gallery.routes');
const memberRoutes = require('./routes/member.routes');
const committeeRoutes = require('./routes/committee.routes');
const blogRoutes = require('./routes/blog.routes');
const donationRoutes = require('./routes/donation.routes');
const settingRoutes = require('./routes/setting.routes');

const app = express();

// Request logger
app.use(loggerMiddleware);

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow local uploads to be viewed on the frontends
}));

const corsOptions = {
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', process.env.ADMIN_URL || 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiter
app.use('/api/', rateLimit);

// Serve uploads static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes mapping
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/committees', committeeRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/settings', settingRoutes);

// Test Route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy!' });
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
