const getAllInvoices = require('../services/getAllInvoices');

module.exports = async (req, res) => {
    const data = await getAllInvoices(req.user);
    if (data != null) {
        return res.json(data);
    }

    res.status(500);
    return res.json({message: "Server error"});
};