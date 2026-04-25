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

  splitCommaSeparatedEnvVar(varName, defaultValue = []) {
    const value = process.env[varName];
    return value ? value.split(',').map(item => item.trim()) : defaultValue;
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
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      issuer: process.env.JWT_ISSUER || 'nexflow',
    };
  }

  get cookies() {
    return {
      jwt_token_name: process.env.COOKIE_JWT_TOKEN_NAME || 'nexflow_token',
      secure: process.env.COOKIE_SECURE === 'true',
      httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
      sameSite: process.env.COOKIE_SAME_SITE || 'lax',
      expiresIn: parseInt(process.env.COOKIE_EXPIRES_IN, 10) || 360000, // in milliseconds
    };
  }

  get cors() {
    return {
      origin: this.splitCommaSeparatedEnvVar('CORS_ORIGIN', [
        'http://localhost:5173',
      ]),
      methods: this.splitCommaSeparatedEnvVar('CORS_METHODS', [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'OPTIONS',
      ]),
      allowedHeaders: this.splitCommaSeparatedEnvVar('CORS_ALLOWED_HEADERS', [
        'Content-Type',
        'Authorization',
      ]),
      credentials: process.env.CORS_CREDENTIALS === 'true',
      maxAge: parseInt(process.env.CORS_MAX_AGE, 10) || 3600,
    };
  }

  get brevo() {
    return {
      host: process.env.BREVO_HOST || 'smtp-relay.brevo.com',
      port: parseInt(process.env.BREVO_PORT, 10) || 587,
      user: process.env.BREVO_USER || 'your-brevo-user',
      pass: process.env.BREVO_PASS || 'your-brevo-password',
      fromEmail: process.env.FROM_EMAIL || 'your-from-email',
      fromName: process.env.FROM_NAME || 'your-from-name',
    };
  }
}

export default new Config();
