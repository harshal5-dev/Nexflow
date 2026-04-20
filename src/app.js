import express from 'express';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/database.js';
import config from './config/index.js';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

connectDB()
  .then(() => {
    app.listen(config.server.port, () => {
      console.log('Server is running on port 8081');
    });
  })
  .catch(error => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
