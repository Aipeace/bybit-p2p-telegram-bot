import pino from 'pino';

const logger = pino();

export function errorHandler(err, req, res, next) {
  logger.error({ error: err, path: req.path }, 'Request error');

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(status).json({
    error: message,
    status,
    ...(details && { details })
  });
}
