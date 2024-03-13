const getWarehouses = require('../services/getWarehouses');

module.exports = async (req, res) => {
    const data = await getWarehouses();
    if (data != null) {
        return res.json(data);
    }

    res.status(500);
    return res.json({message: "Server error"});
}