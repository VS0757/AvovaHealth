const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes and origins
app.use(cors());

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
