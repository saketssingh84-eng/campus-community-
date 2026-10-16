// Handles requests for routes that do not exist
const notFoundMiddleware = (req, res) => {

    // Send a 404 response because the route was not found
    res.status(404).json({
        message: 'Route not found'
    });
};


// Export the middleware
module.exports = notFoundMiddleware;