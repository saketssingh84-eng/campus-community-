// ==================================================
// ADMIN AUTHORIZATION MIDDLEWARE
// ==================================================

const requireAdmin = (req, res, next) => {

  // Check whether the authenticated user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Admin access required'
    });
  }

  // User is an admin, continue to the requested route
  next();
};


// Export the middleware
module.exports = requireAdmin;