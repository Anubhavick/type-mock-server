import { Request, Response, NextFunction } from 'express';

// Rate limiting middleware
export function rateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  const requests = new Map();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key).filter((time: number) => time > windowStart);
    
    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    userRequests.push(now);
    requests.set(key, userRequests);
    next();
  };
}

// Request validation middleware
export function validateRequest(req: Request, res: Response, next: NextFunction) {
  // Add custom validation logic here
  const contentType = req.headers['content-type'];
  
  if (req.method === 'POST' && contentType && !contentType.includes('application/json')) {
    return res.status(400).json({
      error: 'Invalid content type',
      expected: 'application/json'
    });
  }
  
  next();
}

// Response time middleware
export function responseTime(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}
