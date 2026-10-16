
const express = require('express');

const {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');

const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/schedules
router.get('/', authenticateUser, getAllSchedules);

// GET /api/schedules/:id
router.get('/:id', authenticateUser, getScheduleById);

// POST /api/schedules
router.post('/', authenticateUser, createSchedule);

// DELETE /api/schedules/:id
router.delete('/:id', authenticateUser, deleteSchedule);

module.exports = router;