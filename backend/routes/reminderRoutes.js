
const express = require('express');

const {
  getAllReminders,
  getReminderById,
  createReminder,
  deleteReminder
} = require('../controllers/reminderController');

const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/reminders
router.get('/', authenticateUser, getAllReminders);

// GET /api/reminders/:id
router.get('/:id', authenticateUser, getReminderById);

// POST /api/reminders
router.post('/', authenticateUser, createReminder);

// DELETE /api/reminders/:id
router.delete('/:id', authenticateUser, deleteReminder);

module.exports = router;