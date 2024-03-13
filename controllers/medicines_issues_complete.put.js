const finishIssue = require('../services/finishIssue');

module.exports = async (req, res) => {
    const op = await finishIssue(req.user, req.params.id);
    res.status(op.status);
    return res.json({message: op.message});
};