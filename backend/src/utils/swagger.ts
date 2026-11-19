import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { env } from '../config/env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tetebatu Tourism API',
      version: '1.0.0',
      description: 'Backend API for the Desa Tetebatu tourism directory platform',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: env.API_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/v1` : 'http://localhost:5000/api/v1'),
        description: env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], 
};

export const setupSwagger = (app: any) => {
  const specs = swaggerJsdoc(options);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
};
