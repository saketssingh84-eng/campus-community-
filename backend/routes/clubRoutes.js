
const express = require('express');

const {
  getAllClubs,
  getClubById,
  createClub
} = require('../controllers/clubController');

const authenticateUser = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

// GET /api/clubs
router.get('/', getAllClubs);

// GET /api/clubs/:id
router.get('/:id', getClubById);

// POST /api/clubs - Admin only
router.post('/', authenticateUser, requireAdmin, createClub);

module.exports = router;