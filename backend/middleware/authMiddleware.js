// Load environment variables
require('dotenv').config();

// Import jsonwebtoken for verifying JWT tokens
const jwt = require('jsonwebtoken');

// Import the database connection
const db = require('../../database/database');


// ==================================================
// AUTHENTICATION MIDDLEWARE
// ==================================================

const authenticateUser = (req, res, next) => {
  try {

    // Get the Authorization header
    const authHeader = req.get('Authorization');


    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }


    // Check if the header uses Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Invalid authentication format'
      });
    }


    // Extract the token from the header
    const token = authHeader.substring(7);


    // Check if token is empty
    if (!token) {
      return res.status(401).json({
        message: 'Authentication token missing'
      });
    }


    // Verify the JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    // Find the user from the ID stored inside the token
    const user = db
      .prepare(`
        SELECT id, name, email, role
        FROM users
        WHERE id = ?
      `)
      .get(decoded.userId);


    // Check if the user still exists
    if (!user) {
      return res.status(401).json({
        message: 'Invalid user'
      });
    }


    // Store authenticated user in the request
    req.user = user;


    // Continue to the next route
    next();

  } catch (error) {

    // Handle invalid or expired JWT
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({
        message: 'Invalid or expired token'
      });
    }


    // Pass unexpected errors to error middleware
    next(error);
  }
};


// Export authentication middleware
module.exports = authenticateUser;