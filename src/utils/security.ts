// Security utilities for input sanitization and validation

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Rate limit checker (simple implementation)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests = 10, timeWindowMs = 60000) { // 10 requests per minute
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside time window
    const recentRequests = userRequests.filter(time => now - time < this.timeWindow);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }
}

export const apiRateLimiter = new RateLimiter();

/**
 * Secure API key validation
 */
export const validateApiKey = (apiKey: string): { isValid: boolean; message: string } => {
  if (!apiKey || apiKey.trim() === '') {
    return { isValid: false, message: 'API key is required' };
  }
  
  if (apiKey === 'your_api_key_here' || apiKey === 'demo_key') {
    return { isValid: false, message: 'Please configure a real API key' };
  }
  
  if (apiKey.length < 20) {
    return { isValid: false, message: 'API key appears to be invalid (too short)' };
  }
  
  return { isValid: true, message: 'API key is valid' };
};

/**
 * Content Security Policy violation reporter
 */
export const reportCSPViolation = (violationEvent: SecurityPolicyViolationEvent) => {
  console.warn('CSP Violation:', {
    blockedURI: violationEvent.blockedURI,
    violatedDirective: violationEvent.violatedDirective,
    originalPolicy: violationEvent.originalPolicy
  });
  
  // In production, send to security monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to monitoring service
  }
};

// Set up CSP violation reporting
if (typeof window !== 'undefined') {
  window.addEventListener('securitypolicyviolation', reportCSPViolation);
}