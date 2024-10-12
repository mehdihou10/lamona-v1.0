// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Next.js API Documentation',
    version: '1.0.0',
    description: 'API documentation for the Next.js app',
  },
  servers: [
    {
      url: 'http://localhost:3000', 
    },
    {
      url: 'https://lamona-p1.vercel.app', 
    },

  ],

  tags: [
    {
        name: 'User APIs',
        description: 'APIs related to user management',
    },
    {
      name: 'Product APIs',
      description: 'APIs related to Product management',
    },
    {
      name: 'Cart APIs',
      description: 'APIs related to Cart management',
    },
    {
      name: 'Order APIs',
      description: 'APIs related to Order management',
    },
  ]
};

const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: ['./app/api/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
