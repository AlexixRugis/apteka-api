const getInvoiceDetails = require('../services/getInvoiceDetails');

module.exports = async (req, res) => {
    const data = await getInvoiceDetails(req.user, req.params.id);
    if (data != null) {
        return res.json(data);
    }

    res.status(404);
    return res.json({message: "Not found"});
};