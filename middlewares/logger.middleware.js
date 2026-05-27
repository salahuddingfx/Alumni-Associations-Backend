/**
 * Custom Creative API Request Logger Middleware
 * Provides real-time request tracking, origin details, and millisecond response timers with ANSI colors.
 */
const loggerMiddleware = (req, res, next) => {
  const start = process.hrtime();
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const origin = req.headers.origin || req.headers.referer || 'Direct Access';

  // Color mapping for standard HTTP methods
  let methodColor = '\x1b[36m'; // Cyan for GET
  if (req.method === 'POST') methodColor = '\x1b[32m'; // Green
  if (req.method === 'PUT' || req.method === 'PATCH') methodColor = '\x1b[33m'; // Yellow
  if (req.method === 'DELETE') methodColor = '\x1b[31m'; // Red
  const coloredMethod = `${methodColor}\x1b[1m[${req.method}]\x1b[0m`;

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
    
    // Color mapping for response HTTP status codes
    let statusColor = '\x1b[32m'; // Green for 2xx
    if (res.statusCode >= 300 && res.statusCode < 400) statusColor = '\x1b[34m'; // Blue for 3xx redirects
    if (res.statusCode >= 400 && res.statusCode < 500) statusColor = '\x1b[33m'; // Yellow for 4xx client errors
    if (res.statusCode >= 500) statusColor = '\x1b[31m'; // Red for 5xx server errors
    const coloredStatus = `${statusColor}\x1b[1m${res.statusCode}\x1b[0m`;

    const size = res.get('Content-Length') || '0';

    // Output formatted block representation to console
    console.log(
      `\x1b[90m┌─\x1b[0m ${coloredMethod} \x1b[35m${req.originalUrl}\x1b[0m` +
      `\n\x1b[90m├─\x1b[0m IP: \x1b[36m${ip}\x1b[0m | Origin: \x1b[36m${origin}\x1b[0m` +
      `\n\x1b[90m└─\x1b[0m Status: ${coloredStatus} | Time: \x1b[33m${timeInMs}ms\x1b[0m | Size: \x1b[32m${size}B\x1b[0m\n`
    );
  });

  next();
};

module.exports = loggerMiddleware;
