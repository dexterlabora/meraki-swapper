const express = require("express");

// Create express instnace
const app = express();

// Require API routes
const meraki = require("./routes/meraki");

// Import API Routes
app.use(meraki);

// Export the server middleware
module.exports = {
  path: "/api",
  handler: app
};
