const joi = require('joi');

const schema = new joi.object({
    medicine_id: joi.number().integer().required(),
    quantity: joi.number().integer().min(1).required(),
    reason: joi.string().min(1).max(120).required()
});

module.exports = (data) => {
    return schema.validate(data);
}