const transferMedicine = require('../services/transferMedicine');

module.exports = async (req, res) => {
    const op = await transferMedicine(req.user, req.body);
    res.status(op.status);
    return res.json({message: op.message});
};