const initSwagger = require('./SwaggerModule');
const initAuth = require('./AuthMiddleware');

// подключение модулей
const { serverPort } = require("./config");
const express = require("express");
const bodyParser = require('body-parser');
const apiRouter = express.Router();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'))

initSwagger(app);
initAuth(apiRouter);

apiRouter.get('/warehouses', require('./controllers/warehouses.get'));
apiRouter.get('/medicines', require('./controllers/medicines.get'));
apiRouter.get('/medicines/running_out', require('./controllers/medicines_running_out.get'));
apiRouter.get('/medicines/writeoff', require('./controllers/medicines_writeoff.get'));
apiRouter.post('/medicines/writeoff', require('./controllers/medicines_writeoff.post'));
apiRouter.get('/medicines/transfer', require('./controllers/medicines_transfer.get'));
apiRouter.post('/medicines/transfer', require('./controllers/medicines_transfer.post'));
apiRouter.get('/medicines/issues', require('./controllers/medicines_issues.get'));
apiRouter.get('/medicines/issues/:id', require('./controllers/medicines_issues_details.get'));
apiRouter.post('/medicines/issues', require('./controllers/medicines_issues.post'));
apiRouter.put('/medicines/issues/:id/complete', require('./controllers/medicines_issues_complete.put'));
apiRouter.get('/medicines/invoices', require('./controllers/medicines_invoices.get'));
apiRouter.get('/medicines/invoices/:id', require('./controllers/medicines_invoices_details.get'));
apiRouter.post('/medicines/invoices', require('./controllers/medicines_invoices.post'));

app.use('/api/', apiRouter);
app.listen(serverPort);