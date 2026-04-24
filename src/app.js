import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './config/database.js';
import config from './config/index.js';

import roleRoutes from './modules/role/role.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import errorHandlerMiddleware from './middlewares/errorHandler.middleware.js';
import verifyJwtToken from './middlewares/verifyJwtToken.middleware.js';
import corsConfig from './config/cors.js';

const app = express();

app.use(cors(corsConfig));
app.options(/.*/, cors(corsConfig)); // Express 5-safe preflight handler for all routes

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(verifyJwtToken);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/roles', roleRoutes);

app.use(errorHandlerMiddleware);

connectDB()
  .then(() => {
    app.listen(config.server.port, () => {
      console.log(`Server is running on port ${config.server.port}`);
    });
  })
  .catch(error => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
