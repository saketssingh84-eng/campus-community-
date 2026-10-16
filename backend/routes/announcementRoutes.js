
const express = require('express');

const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');

const authenticateUser = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

// GET /api/announcements
router.get('/', getAllAnnouncements);

// GET /api/announcements/:id
router.get('/:id', getAnnouncementById);

// POST /api/announcements - Admin only
router.post('/', authenticateUser, requireAdmin, createAnnouncement);

// DELETE /api/announcements/:id - Admin only
router.delete('/:id', authenticateUser, requireAdmin, deleteAnnouncement);

module.exports = router;