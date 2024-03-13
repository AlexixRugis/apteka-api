const createIssue = require('../services/createIssue');

module.exports = async (req, res) => {
    const op = await createIssue(req.user, req.body);
    res.status(op.status);
    return res.json({message: op.message});
};