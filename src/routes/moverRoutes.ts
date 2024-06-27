import { Router } from "express";
import {
  createMover,
  endMission,
  getMoverById,
  getMovers,
  getTopMovers,
  loadMover,
  startMission,
  updateMover,
} from "../controllers/moverController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MagicMover:
 *       type: object
 *       required:
 *         - weightLimit
 *         - energy
 *         - name
 *       properties:

 *         id:
 *           type: integer
 *           description: The auto-generated id of the mover
 *         name:
 *           type: string
 *           description: Mover name
 *         weightLimit:
 *           type: number
 *           description: The weight limit of the mover
 *         energy:
 *           type: number
 *           description: The energy level of the mover
 *         questState:
 *           type: string
 *           enum:
 *             - resting
 *             - loading
 *             - on_a_mission
 *             - done
 *           description: The current quest state of the mover
 *         missionsCompleted:
 *           type: integer
 *           description: The number of missions completed by the mover
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the mover was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the mover was last updated
 *     MagicMoverCreate:
 *       type: object
 *       required:
 *         - name
 *         - weightLimit
 *         - energy
 *       properties:
 *         name:
 *           type: string
 *           description: Mover name      
 *         weightLimit:
 *           type: number
 *           description: The weight limit of the mover
 *         energy:
 *           type: number
 *           description: The energy level of the mover
 *         questState:
 *           type: string
 *           enum:
 *             - resting
 *             - loading
 *             - on_a_mission
 *             - done
 *           description: The current quest state of the mover
 *         missionsCompleted:
 *           type: integer
 *           description: The number of missions completed by the mover
 * 
 * 
 * 
 *     MagicMoverSuccess:
 *       type: object

 *       properties:
*         success:
 *           type: boolean
 *           description: success indicator
 *         id:
 *           type: integer
 *           description: The auto-generated id of the mover
 *         weightLimit:
 *           type: number
 *           description: The weight limit of the mover
 *         energy:
 *           type: number
 *           description: The energy level of the mover
 *         questState:
 *           type: string
 *           enum:
 *             - resting
 *             - loading
 *             - on_a_mission
 *             - done
 *           description: The current quest state of the mover
 *         missionsCompleted:
 *           type: integer
 *           description: The number of missions completed by the mover
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the mover was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the mover was last updated
 *     LoadItemsDto:
 *        type: object
 *        required:
 *         - itemIds
 *        properties:
 *         itemIds:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1,2,3]
 *           description: An array of item IDs to load
 *     UpdateMoverDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the mover
 *         weightLimit:
 *           type: number
 *           description: The weight limit of the mover
 *         energy:
 *           type: number
 *           description: The energy of the mover
 *         questState:
 *           type: string
 *           enum:
 *             - resting
 *             - loading
 *             - on_a_mission
 *             - done
 *           description: The current quest state of the mover
 * 
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Movers
 *   description: The movers managing API
 */

/**
 * @swagger
 * /movers:
 *   post:
 *     summary: Create a new mover, energy, weightLimit are required(integer)
 *     tags: [Movers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MagicMoverCreate'
 *     responses:
 *       201:
 *         description: The mover was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MagicMover'
 *       500:
 *         description: Some server error
 */
router.post("/", asyncHandler(createMover));

/**
 * @swagger
 * /movers:
 *   get:
 *     summary: Returns the list of all the movers
 *     tags: [Movers]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of movers to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of movers to skip
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Order of the movers
 *     responses:
 *       200:
 *         description: The list of movers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: success indicator
 *
 *                 total:
 *                   type: integer
 *                   description: The total number of movers
 *                 movers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MagicMover'
 *       500:
 *         description: Some server error
 */
router.get("/", asyncHandler(getMovers));

/**
 * @swagger
 * /movers/{id}:
 *   put:
 *     summary: Update a mover by ID
 *     tags: [Movers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The mover ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMoverDto'
 *     responses:
 *       200:
 *         description: The mover was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MagicMover'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Mover not found
 *       500:
 *         description: Some server error
 */
router.put("/:id([0-9]+)", asyncHandler(updateMover));

/**
 * @swagger
 * /movers/{id}:
 *   get:
 *     summary: Get the mover by ID
 *     tags: [Movers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The mover ID
 *     responses:
 *       200:
 *         description: The mover details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MagicMover'
 *       404:
 *         description: Mover not found
 *       500:
 *         description: Some server error
 */
router.get("/:id([0-9]+)", asyncHandler(getMoverById));

/**
 * @swagger
 * /movers/{id}/load:
 *   post:
 *     summary: Load a mover with items
 *     tags: [Movers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The mover ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1,2,3]
 *                 description: An array of item IDs to load
 *     responses:
 *       200:
 *         description: The mover was successfully loaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MagicMover'
 *       404:
 *         description: Mover or item not found
 *       500:
 *         description: Some server error
 */
router.post("/:id([0-9]+)/load", asyncHandler(loadMover));

/**
 * @swagger
 * /movers/{id}/start-mission:
 *   post:
 *     summary: Start a mission for a mover
 *     tags: [Movers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The mover ID
 *     responses:
 *       200:
 *         description: The mission was successfully started
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MagicMover'
 *       404:
 *         description: Mover not found
 *       500:
 *         description: Some server error
 */
router.post("/:id([0-9]+)/start-mission", asyncHandler(startMission));

/**
 * @swagger
 * /movers/{id}/end-mission:
 *   post:
 *     summary: End a mission for a mover
 *     tags: [Movers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The mover ID
 *     responses:
 *       200:
 *         description: The mission was successfully ended
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MagicMover'
 *       404:
 *         description: Mover not found
 *       500:
 *         description: Some server error
 */
router.post("/:id([0-9]+)([0-9]+)/end-mission", asyncHandler(endMission));

/**
 * @swagger
 * /movers/top:
 *   get:
 *     summary: Get the movers who completed the most missions
 *     tags: [Movers]
 *     responses:
 *       200:
 *         description: The list of top movers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MagicMover'
 *       500:
 *         description: Some server error
 */
router.get("/top", asyncHandler(getTopMovers));
export default router;
