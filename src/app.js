const express = require('express');
const cors = require('cors');
const ApiResponse = require('./utils/apiResponse');

// Initialize Express App
const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load Routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const orderRoutes = require('./routes/order.routes');
const wholesaleRoutes = require('./routes/wholesale.routes');
const bannerRoutes = require('./routes/banner.routes');
const swagger = require('./config/swagger');

// Swagger API Documentation route
app.use('/api-docs', swagger.serve, swagger.setup);

// Serve static files (uploaded images)
app.use('/uploads', express.static('public/uploads'));

// API Base Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wholesale', wholesaleRoutes);
app.use('/api/banners', bannerRoutes);

// 404 Route handler
app.use((req, res, next) => {
  return ApiResponse.error(res, 404, "Endpoint not found");
});

// Centralized error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return ApiResponse.error(res, status, message, err.errors || null);
});

module.exports = app;
