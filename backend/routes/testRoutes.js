// Import Express Router
const express = require('express');

// Import the test controller
const { testPost } = require('../controllers/testController');

// Create a router
const router = express.Router();


// -------------------- TEST ROUTE --------------------

// POST /api/test
// Sends the request to the test controller
router.post('/', testPost);


// Export this router so app.js can use it
module.exports = router;