import helmet from 'helmet';
import { Express } from 'express';

export function applySecurityHeaders(app: Express): void {
  app.disable('x-powered-by');
  
  app.use(
    helmet({
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      xFrameOptions: { action: 'deny' },
      xContentTypeOptions: true,
      xXssProtection: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    })
  );
}

