const getUser = require('./services/getUser');

module.exports = (router) => {
    router.use(async (req, res, next) => {
        const apiKey = req.header('apikey');
        if (apiKey != null) {
            const user = await getUser(apiKey);
            if (user != null) {
                req.user = user;
                return next();
            }                
        }

        res.status(401);
        return res.json({ message: "Incorrect key"});
    });
};