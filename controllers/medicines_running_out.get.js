const getMedicinesRunningOut = require('../services/getMedicinesRunningOut');

module.exports = async (req, res) => {
    const data = await getMedicinesRunningOut(req.user);
    if (data != null) {
        return res.json(data);
    }

    res.status(500);
    return res.json({message: "Server error"});
};