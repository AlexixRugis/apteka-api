const joi = require('joi');

const itemSchema = new joi.object({
    medicine_id: joi.number().integer().required(),
    quantity: joi.number().integer().min(1).required()
});

const schema = new joi.object({
    purpose: joi.string().min(1).max(120).required(),
    items: joi.array().items(itemSchema).min(1).required()
});

module.exports = (data) => {
    return schema.validate(data);
}