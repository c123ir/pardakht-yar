import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export const setupSwagger = (app: Express) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'پرداخت‌یار API',
        version: '1.0.0',
        description: 'مستندات API سیستم پرداخت‌یار',
      },
      servers: [
        {
          url: '/api',
          description: 'API سرور',
        },
      ],
    },
    apis: ['./src/routes/*.ts'], // مسیر فایل‌های حاوی مستندات
  };

  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}; 