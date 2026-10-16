// Handles unexpected errors in the backend
const errorMiddleware = (err, req, res, next) => {

    // Print the error in the server terminal
    console.error(err);

    // Send a 500 response to the client
    res.status(500).json({
        message: 'Internal server error'
    });
};


// Export the middleware
module.exports = errorMiddleware;