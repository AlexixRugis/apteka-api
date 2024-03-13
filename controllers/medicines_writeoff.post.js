const writeoffMedicine = require('../services/writeoffMedicine');

module.exports = async (req, res) => {
    const op = await writeoffMedicine(req.user, req.body);
    res.status(op.status);
    return res.json({message: op.message});
};