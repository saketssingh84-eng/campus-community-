
const express = require('express');

const {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent
} = require('../controllers/eventController');

const authenticateUser = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

// GET /api/events
router.get('/', getAllEvents);

// GET /api/events/:id
router.get('/:id', getEventById);

// POST /api/events (Admin only)
router.post('/', authenticateUser, requireAdmin, createEvent);

// DELETE /api/events/:id (Admin only)
router.delete('/:id', authenticateUser, requireAdmin, deleteEvent);

module.exports = router;