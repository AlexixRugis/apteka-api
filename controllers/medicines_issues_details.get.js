const getIssueDetails = require('../services/getIssueDetails');

module.exports = async (req, res) => {
    const data = await getIssueDetails(req.user, req.params.id);
    if (data != null) {
        return res.json(data);
    }

    res.status(404);
    return res.json({message: "Not found"});
};