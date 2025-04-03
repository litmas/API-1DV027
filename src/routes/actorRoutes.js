const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');

/**
 * @swagger
 * tags:
 *   name: Actors
 *   description: Actor information endpoints
 */

/**
 * @swagger
 * /api/v1/actors:
 *   get:
 *     summary: Get all actors
 *     tags: [Actors]
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
 *         description: List of actors
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
 *                     $ref: '#/components/schemas/Actor'
 */
router.get('/', actorController.getAllActors);

/**
 * @swagger
 * components:
 *   schemas:
 *     Actor:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the actor
 *         name:
 *           type: string
 *           description: The name of the actor
 *         moviesPlayed:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Movie'
 *           description: List of movies the actor has played in
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the actor was added
 *       example:
 *         id: 5f8d0d55b54764421b7156c5
 *         name: Leonardo DiCaprio
 *         moviesPlayed:
 *           - id: 5f8d0d55b54764421b7156c3
 *             title: Inception
 *             releaseYear: 2010
 *         createdAt: 2020-10-19T13:00:00.000Z
 */

module.exports = router;