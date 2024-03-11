const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./swagger');

class SwaggerModule {
    constructor(app) {
        this.app = app;

        const options = {
          swaggerDefinition,
          // Paths to files containing OpenAPI definitions
          apis: ['index.js'],
        };
        
        const swaggerSpec = swaggerJSDoc(options);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, false));

        app.get('/', (request, response) => {
            response.redirect('/api-docs');
        });
    }
};

module.exports = SwaggerModule;