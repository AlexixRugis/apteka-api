const getMedicines = require('../services/getMedicines');
const getMedicinesInWarehouse = require('../services/getMedicinesInWarehouse');

module.exports = async (req, res) => {
    const warehouseId = req.query.warehouseId;
    if (warehouseId == null) {
        const data = await getMedicines(req.user);
        if (data != null) {
            return res.json(data);
        }
    }
    else {
        const data = await getMedicinesInWarehouse(req.user, warehouseId);
        if (data != null) {
            return res.json(data);
        }
    }
    
    res.status(500);
    return res.json({message: "Server error"});
};