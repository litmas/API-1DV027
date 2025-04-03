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

const app = express();
process.removeAllListeners('warning');

require('./src/config/db')();

app.get('/', (req, res) => {
    res.json({
      message: 'Movie API',
      endpoints: {
        movies: '/api/v1/movies',
        actors: '/api/v1/actors',
        ratings: '/api/v1/ratings',
        documentation: '/api-docs'
      }
    });
  });

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
        url: 'http://localhost:3000'
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

app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100
});
app.use(limiter);

app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/actors', actorRoutes);
app.use('/api/v1/ratings', ratingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

module.exports = app;