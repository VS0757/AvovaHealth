const cors = require('cors');
const app = require('./app');

// Enable CORS for all routes and origins
app.use(cors());

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
