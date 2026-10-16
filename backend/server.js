require('dotenv').config();

const app = require('./app');

// Use Render's assigned port in production,
// or port 3000 for local development.
const PORT = process.env.PORT || 3000;

// Start the server.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
