const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management endpoints
 */

router
  .route('/')
  /**
   * @swagger
   * /api/v1/movies:
   *   get:
   *     summary: Get all movies
   *     tags: [Movies]
   *     parameters:
   *       - in: query
   *         name: genre
   *         schema:
   *           type: string
   *         description: Filter by genre
   *       - in: query
   *         name: year
   *         schema:
   *           type: integer
   *         description: Filter by release year
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Number of items per page
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *         description: Sort by field (prefix with - for descending)
   *     responses:
   *       200:
   *         description: List of movies
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 results:
   *                   type: integer
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Movie'
   */
  .get(movieController.getAllMovies)
  /**
   * @swagger
   * /api/v1/movies:
   *   post:
   *     summary: Create a new movie
   *     tags: [Movies]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Movie'
   *     responses:
   *       201:
   *         description: Movie created successfully
   *       401:
   *         description: Unauthorized (missing or invalid token)
   *       400:
   *         description: Bad request (invalid data)
   */
  .post(protect, movieController.createMovie);

router
  .route('/:id')
  /**
   * @swagger
   * /api/v1/movies/{id}:
   *   get:
   *     summary: Get a movie by ID
   *     tags: [Movies]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Movie ID
   *     responses:
   *       200:
   *         description: Movie details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Movie'
   *       404:
   *         description: Movie not found
   */
  .get(movieController.getMovie)
  /**
   * @swagger
   * /api/v1/movies/{id}:
   *   put:
   *     summary: Update a movie
   *     tags: [Movies]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Movie ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Movie'
   *     responses:
   *       200:
   *         description: Movie updated successfully
   *       401:
   *         description: Unauthorized (missing or invalid token)
   *       404:
   *         description: Movie not found
   *       400:
   *         description: Bad request (invalid data)
   */
  .put(protect, movieController.updateMovie)
  /**
   * @swagger
   * /api/v1/movies/{id}:
   *   delete:
   *     summary: Delete a movie
   *     tags: [Movies]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Movie ID
   *     responses:
   *       204:
   *         description: Movie deleted successfully
   *       401:
   *         description: Unauthorized (missing or invalid token)
   *       404:
   *         description: Movie not found
   */
  .delete(protect, movieController.deleteMovie);

router
  .route('/:id/ratings')
  /**
   * @swagger
   * /api/v1/movies/{id}/ratings:
   *   get:
   *     summary: Get ratings for a movie
   *     tags: [Movies]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Movie ID
   *     responses:
   *       200:
   *         description: List of ratings for the movie
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 results:
   *                   type: integer
   *                 data:
   *                   type: object
   *                   properties:
   *                     ratings:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Rating'
   *       404:
   *         description: Movie not found
   */
  .get(movieController.getMovieRatings);

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - releaseYear
 *         - genre
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the movie
 *         title:
 *           type: string
 *           description: The title of the movie
 *         releaseYear:
 *           type: integer
 *           description: The release year of the movie
 *         genre:
 *           type: string
 *           enum: ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller']
 *           description: The genre of the movie
 *         description:
 *           type: string
 *           description: A brief description of the movie
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the movie was added
 *       example:
 *         id: 5f8d0d55b54764421b7156c3
 *         title: Inception
 *         releaseYear: 2010
 *         genre: Sci-Fi
 *         description: A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.
 *         createdAt: 2020-10-19T12:00:00.000Z
 *     Rating:
 *       type: object
 *       required:
 *         - movie
 *         - value
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the rating
 *         movie:
 *           $ref: '#/components/schemas/Movie'
 *         value:
 *           type: number
 *           minimum: 1
 *           maximum: 10
 *           description: The rating value (1-10)
 *         review:
 *           type: string
 *           description: An optional review text
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the rating was added
 *       example:
 *         id: 5f8d0d55b54764421b7156c4
 *         movie:
 *           id: 5f8d0d55b54764421b7156c3
 *           title: Inception
 *           releaseYear: 2010
 *         value: 9
 *         review: One of the best movies I've ever seen!
 *         createdAt: 2020-10-19T12:30:00.000Z
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = router;