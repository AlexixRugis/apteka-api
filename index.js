const SwaggerModule = require('./SwaggerModule');
const DbModule = require('./DbModule');
const AuthMiddleware = require('./AuthMiddleware');

// подключение модулей
const config = require("config");
const express = require("express");
const bodyParser = require('body-parser');
const apiRouter = express.Router();

// загрузка конфигурации
const serverPort = config.get("port");
const dbFileName = config.get("db");


// создаем объект приложения
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'))
const swagger = new SwaggerModule(app);
const db = new DbModule(dbFileName);
db.init();
const auth = new AuthMiddleware(apiRouter, db);

apiRouter.get('/warehouses', async (req, res) => {
    const data = await db.getWarehouses();
    if (data == null) {
        res.status(501);
        return res.json({message: "Server error"});
    }
    return res.json(data);
});

apiRouter.get('/medicines', async (req, res) => {
    const warehouseId = req.query.warehouseId;
    if (warehouseId == null) {
        const data = await db.getMedicines(req.user);
        if (data != null) {
            return res.json(data);
        }
    }
    else {
        const data = await db.getMedicinesInWarehouse(req.user, warehouseId);
        if (data != null) {
            return res.json(data);
        }
    }
    
    res.status(501);
    return res.json({message: "Server error"});
})

apiRouter.get('/medicines/running_out', async (req, res) => {
    const data = await db.getMedicinesRunningOut(req.user);
    if (data != null) {
        return res.json(data);
    }

    res.status(501);
    return res.json({message: "Server error"});
});

apiRouter.get('/medicines/writeoff', async (req, res) => {
    const data = await db.getWriteoffs(req.user);
    if (data != null) {
        return res.json(data);
    }

    res.status(501);
    return res.json({message: "Server error"});
})

apiRouter.post('/medicines/writeoff', async (req, res) => {
    const op = await db.writeoffMedicine(req.user, req.body);
    res.status(op.status);
    return res.json({message: op.message});
});

apiRouter.get('/medicines/transfer', async (req, res) => {
    const data = await db.getTransfers(req.user);
    if (data != null) {
        return res.json(data);
    }

    res.status(501);
    return res.json({message: "Server error"});
})

apiRouter.post('/medicines/transfer', async (req, res) => {
    const op = await db.transferMedicine(req.user, req.body);
    res.status(op.status);
    return res.json({message: op.message});
});

apiRouter.get('/medicines/issues', async (req, res) => {
    const data = await db.getAllIssues(req.user);
    if (data != null) {
        return res.json(data);
    }

    res.status(501);
    return res.json({message: "Server error"});
})

apiRouter.get('/medicines/issues/:id', async (req, res) => {
    const data = await db.getIssueDetails(req.user, req.params.id);
    if (data != null) {
        return res.json(data);
    }

    res.status(404);
    return res.json({message: "Not found"});
});

apiRouter.post('/medicines/issues', async (req, res) => {
    const op = await db.createIssue(req.user, req.body);
    res.status(op.status);
    return res.json({message: op.message});
});

apiRouter.put('/medicines/issues/:id/complete', async (req, res) => {
    const op = await db.finishIssue(req.user, req.params.id);
    res.status(op.status);
    return res.json({message: op.message});
});

apiRouter.get('/medicines/invoices', async (req, res) => {
    const data = await db.getAllInvoices(req.user);
    if (data != null) {
        return res.json(data);
    }

    res.status(501);
    return res.json({message: "Server error"});
})

apiRouter.get('/medicines/invoices/:id', async (req, res) => {
    const data = await db.getInvoiceDetails(req.user, req.params.id);
    if (data != null) {
        return res.json(data);
    }

    res.status(404);
    return res.json({message: "Not found"});
});

apiRouter.post('/medicines/invoices', async (req, res) => {
    const op = await db.createInvoice(req.user, req.body);
    res.status(op.status);
    return res.json({message: op.message});
});

app.use('/api/', apiRouter);
app.listen(serverPort);