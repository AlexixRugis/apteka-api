class AuthMiddleware {
    constructor(router, db) {
        this.db = db;
        this.router = router;

        router.use(async (req, res, next) => {
            const apiKey = req.header('apikey');
            if (apiKey != null) {
                const user = await db.getUser(apiKey);
                if (user != null) {
                    req.user = user;
                    return next();
                }                
            }

            res.status(401);
            return res.json({ message: "Incorrect key"});
        });
    }
}

module.exports = AuthMiddleware;