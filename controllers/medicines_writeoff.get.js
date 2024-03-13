const getWriteoffs = require('../services/getWriteoffs');

module.exports = async (req, res) => {
    const data = await getWriteoffs(req.user);
    if (data != null) {
        return res.json(data);
    }

    res.status(500);
    return res.json({message: "Server error"});
};