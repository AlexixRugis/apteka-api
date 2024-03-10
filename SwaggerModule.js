const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

class SwaggerModule {
    constructor(app) {
        this.app = app;

        const swaggerDefinition = {
            openapi: '3.0.0',
            info: {
              title: 'API аптека',
              description: 'FFFF',
              version: '1.0.0',
            },
            docExpansion: 'full'
          };
        
        const options = {
        swaggerDefinition,
        // Paths to files containing OpenAPI definitions
        apis: ['index.js'],
        };
        
        const swaggerSpec = swaggerJSDoc(options);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, false, { docExpansion: 'full' }));

        app.get('/', (request, response) => {
            response.redirect('/api-docs');
        });
    }
};

module.exports = SwaggerModule;