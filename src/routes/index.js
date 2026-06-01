import express from 'express';
const router = express.Router();
import ApiResponse from '../utils/apiResponse.js';

router.get('/status', (req, res) => {
  return ApiResponse.success(res, 200, "Backend API service is online", {
    env: process.env.NODE_ENV || 'development',
    time: new Date()
  });
});

export default router;
