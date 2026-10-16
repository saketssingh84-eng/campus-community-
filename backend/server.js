// Load environment variables from .env
require('dotenv').config();

// Import the Express application 

const app = require('./app');


// Server port
const PORT = 3000;


// Start the server
app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});