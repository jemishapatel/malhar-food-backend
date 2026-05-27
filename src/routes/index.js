const express = require('express');
const router = express.Router();
const ApiResponse = require('../utils/apiResponse');

router.get('/status', (req, res) => {
  return ApiResponse.success(res, 200, "Backend API service is online", {
    env: process.env.NODE_ENV || 'development',
    time: new Date()
  });
});

module.exports = router;
