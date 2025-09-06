export const environment = {
  production: true,
  apiBaseUrl: 'https://api.WAIE.com/api',
  baseUrl: 'https://WAIE.com',
  appName: 'WAIE',
  version: '1.0.0',
  debug: false,
  logLevel: 'error',
  features: {
    analytics: true,
    logging: false,
    caching: true
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiry: 3600, // 1 hour
    refreshTokenExpiry: 604800 // 7 days
  },
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  }
}; 