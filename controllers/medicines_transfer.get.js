const getTransfers = require('../services/getTransfers');

module.exports = async (req, res) => {
    const data = await getTransfers(req.user);
    if (data != null) {
        return res.json(data);
    }

    res.status(500);
    return res.json({message: "Server error"});
};