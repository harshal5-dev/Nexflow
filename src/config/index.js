import dotenv from 'dotenv';
import path from 'path';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

class Config {
  constructor() {
    this.validateRequiredEnvVars();
  }

  validateRequiredEnvVars() {
    const requiredVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
  }

  get env() {
    return process.env.NODE_ENV || 'development';
  }

  get isDevelopment() {
    return this.env === 'development';
  }

  get isProduction() {
    return this.env === 'production';
  }

  get server() {
    return {
      port: process.env.PORT || 3000,
    };
  }

  get mongoDB() {
    return {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb',
    };
  }

  get jwt() {
    return {
      secret: process.env.JWT_SECRET || 'your-super-secret-key-change-this',
    };
  }
}

export default new Config();
