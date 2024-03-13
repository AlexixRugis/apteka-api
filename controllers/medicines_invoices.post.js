const createInvoice = require('../services/createInvoice');

module.exports = async (req, res) => {
    const op = await createInvoice(req.user, req.body);
    res.status(op.status);
    return res.json({message: op.message});
};