// Import Express
const express = require('express');

// Import authentication controller functions
const {
  registerUser,
  loginUser
} = require('../controllers/authController');

// Import authentication middleware
const authenticateUser = require('../middleware/authMiddleware');

// Import admin authorization middleware
const requireAdmin = require('../middleware/adminMiddleware');


// Create an Express router
const router = express.Router();


// ==================================================
// PUBLIC AUTHENTICATION ROUTES
// ==================================================

// Register a new user
// POST /api/auth/register
router.post('/register', registerUser);

// Login user
// POST /api/auth/login
router.post('/login', loginUser);


// ==================================================
// AUTHENTICATED USER ROUTES
// ==================================================

// Get currently authenticated user's information
// GET /api/auth/me
router.get('/me', authenticateUser, (req, res) => {

  res.status(200).json({
    message: 'Authentication successful',
    user: req.user
  });

});


// ==================================================
// ADMIN-ONLY ROUTES
// ==================================================

// Test admin authorization
// GET /api/auth/admin-test
router.get(
  '/admin-test',
  authenticateUser,
  requireAdmin,
  (req, res) => {

    res.status(200).json({
      message: 'Admin authorization successful',
      user: req.user
    });

  }
);


// Export the router
module.exports = router;