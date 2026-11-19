import app from './app.js';
import { env } from './config/env.js';
import { logger } from './middleware/error.js';

const port = env.PORT;

const server = app.listen(port, () => {
  logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${port}`);
});

process.on('SIGINT', () => {
  logger.info('Closing server on SIGINT...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.info('Closing server on SIGTERM...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
