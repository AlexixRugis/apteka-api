const joi = require('joi');

const schema = new joi.object({
    medicine_id: joi.number().integer().required(),
    warehouse_to: joi.number().integer().required()
});

module.exports = (data) => {
    return schema.validate(data);
}