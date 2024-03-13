const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./swagger');

module.exports = (app) => {
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
};