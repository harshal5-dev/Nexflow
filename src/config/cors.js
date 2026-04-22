import config from './index.js';

const allowedOrigins = new Set(config.cors.origin);

const corsConfig = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders,
  credentials: config.cors.credentials,
  maxAge: config.cors.maxAge,
  optionsSuccessStatus: 204,
};

export default corsConfig;
