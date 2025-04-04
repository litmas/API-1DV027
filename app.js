require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const errorHandler = require('./src/middleware/error');
const movieRoutes = require('./src/routes/movieRoutes');
const actorRoutes = require('./src/routes/actorRoutes');
const ratingRoutes = require('./src/routes/ratingRoutes');
const authRoutes = require('./src/routes/authRoutes');
const connectDB = require('./src/config/db');

const app = express();

// Remove warning listeners
process.removeAllListeners('warning');

// Connect to database
connectDB();

// Trust Railway's proxy (MUST come before rate limiter)
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

// Middleware
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting with proxy support
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later',
  validate: { trustProxy: true }, // Required for Railway
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable deprecated headers
});
app.use(limiter);

app.use(express.json({ limit: '10kb' }));

// Morgan logging only in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Database API',
      version: '1.0.0',
      description: 'A RESTful API for managing movie information'
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? process.env.RAILWAY_PUBLIC_DOMAIN || 'https://your-production-url.com'
          : 'http://localhost:3000'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Movie API',
    endpoints: {
      movies: '/api/v1/movies',
      actors: '/api/v1/actors',
      ratings: '/api/v1/ratings',
      documentation: '/api-docs',
      health: '/health'
    }
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/actors', actorRoutes);
app.use('/api/v1/ratings', ratingRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
