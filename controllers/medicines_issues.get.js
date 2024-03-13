const getAllIssues = require('../services/getAllIssues');

module.exports = async (req, res) => {
    const data = await getAllIssues(req.user);
    if (data != null) {
        return res.json(data);
    }

    res.status(500);
    return res.json({message: "Server error"});
};