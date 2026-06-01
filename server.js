import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './src/config/db.js';
import ApiResponse from './src/utils/apiResponse.js';
import authRoutes from './src/routes/auth.routes.js';
import productRoutes from './src/routes/product.routes.js';
import categoryRoutes from './src/routes/category.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import wholesaleRoutes from './src/routes/wholesale.routes.js';
import bannerRoutes from './src/routes/banner.routes.js';
import swagger from './src/config/swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// ======================
// Global Middlewares
// ======================
// CORS and body parser BEFORE routes
app.use(
  cors({
    origin: "*",
       credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ======================
// Swagger API Docs
// ======================
app.use('/api-docs', swagger.serve, swagger.setup);

// ======================
// Uploads Static Folder
// ======================
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'public/uploads'))
);

// ======================
// API Routes
// ======================
app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/wholesale', wholesaleRoutes);

app.use('/api/banners', bannerRoutes);

// ======================
// Frontend Static Folder
// ======================
const frontendPath = path.join(
  __dirname,
  'Malharfood'
);

// Serve frontend static files
app.use(express.static(frontendPath));

// Home Route
app.get('/', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// SPA Catch-All Route
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ======================
// 404 Handler
// ======================
app.use((_req, res) => {
  return ApiResponse.error(
    res,
    404,
    'Endpoint not found'
  );
});

// ======================
// Centralized Error Middleware
// ======================
app.use((err, _req, res, _next) => {
  console.error(err.stack);

  const status = err.statusCode || 500;

  const message =
    err.message || 'Internal Server Error';

  return ApiResponse.error(
    res,
    status,
    message,
    err.errors || null
  );
});

// ======================
// Database Connection
// ======================
connectDB()
  .then(() => {
    app.listen(PORT,"0.0.0.0", () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error(
      'Failed to connect to MongoDB',
      err
    );
  });