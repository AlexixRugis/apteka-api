const db = require('../DbModule');

module.exports = async (user) => {
    const data = await db.all(`SELECT * FROM issue_requests WHERE user_id = ?`, [user.id]);
    if (data != null) {
      data.forEach((v) => {
        v.user_id = undefined;
      });
    }
    return data;
};