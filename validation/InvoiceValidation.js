const joi = require('joi');

const itemSchema = new joi.object({
    medicine_id: joi.number().integer().required(),
    price: joi.number().integer().min(1).required(),
    quantity: joi.number().integer().min(1).required(),
    expiration_date: joi.date().iso().required()
});

const schema = new joi.object({
    document_date: joi.date().iso().required(),
    provider: joi.string().min(1).max(120).required(),
    items: joi.array().items(itemSchema).min(1).required()
});

module.exports = (data) => {
    return schema.validate(data);
}