export const environment = {
  production: false,
  apiBaseUrl: 'https://staging-api.WAIE.com/api',
  baseUrl: 'https://staging.WAIE.com',
  appName: 'WAIE Staging',
  version: '1.0.0',
  debug: true,
  logLevel: 'warn',
  features: {
    analytics: true,
    logging: true,
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