import { Router } from "express";
import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
} from "../controllers/itemController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MagicItem:
 *       type: object
 *       required:
 *         - name
 *         - weight
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the item
 *         name:
 *           type: string
 *           description: The name of the item
 *         weight:
 *           type: number
 *           description: The weight of the item
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the item was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the item was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: The items managing API
 */

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MagicItem'
 *     responses:
 *       201:
 *         description: The item was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MagicItem'
 *       500:
 *         description: Some server error
 */
router.post("/", asyncHandler(createItem));

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Returns the list of all the items
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of items to skip
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of items to return
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Order of the items
 *     responses:
 *       200:
 *         description: The list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: The total number of items
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MagicItem'
 *       500:
 *         description: Some server error
 */
router.get("/", asyncHandler(getItems));

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get the item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The item ID
 *     responses:
 *       200:
 *         description: The item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MagicItem'
 *       404:
 *         description: Item not found
 *       500:
 *         description: Some server error
 */
router.get("/:id", asyncHandler(getItemById));

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Remove the item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The item ID
 *     responses:
 *       200:
 *         description: The item was deleted
 *       404:
 *         description: Item not found
 *       500:
 *         description: Some server error
 */
router.delete("/:id", asyncHandler(deleteItem));

export default router;
