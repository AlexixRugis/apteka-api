const db = require('../DbModule');

module.exports = async (user, issue_id) => {
    const data = await db.get(`SELECT * FROM issue_requests WHERE id = ? AND user_id = ?`, [issue_id, user.id]);
    if (data == null) {
      return {status:404, message: `issue with id=${issue_id} not found`};
    }
    
    if (data.completed) {
      return {status:400, message: 'issue is already completed'};
    }

    const res = db.update(`UPDATE issue_requests SET completed=1 WHERE id = ? AND user_id = ?`, [issue_id, user.id]);
    if (!res) {
      return {status:500, message: 'server error'};
    }

    return {status: 200, message: 'ok'};
};