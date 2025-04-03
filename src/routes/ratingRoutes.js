const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Rating information endpoints
 */

/**
 * @swagger
 * /api/v1/ratings:
 *   get:
 *     summary: Get all ratings
 *     tags: [Ratings]
 *     parameters:
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
 *         description: List of ratings
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
 *                     $ref: '#/components/schemas/Rating'
 */
router.get('/', ratingController.getAllRatings);

module.exports = router;