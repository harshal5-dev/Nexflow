import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './config/database.js';
import config from './config/index.js';
import setupSwagger from './docs/swagger.js';

import roleRoutes from './modules/role/role.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import tenantRoutes from './modules/tenant/tenant.routes.js';
import userRoutes from './modules/user/user.routes.js';
import projectRoutes from './modules/project/project.routes.js';
import taskRoutes from './modules/task/task.routes.js';

import errorHandlerMiddleware from './middlewares/errorHandler.middleware.js';
import verifyJwtToken from './middlewares/verifyJwtToken.middleware.js';
import corsConfig from './config/cors.js';

const app = express();

app.use(cors(corsConfig));
app.options(/.*/, cors(corsConfig)); // Express 5-safe preflight handler for all routes

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
setupSwagger(app);
app.use(verifyJwtToken);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);

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
