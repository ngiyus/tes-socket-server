const validator = require("fastest-validator");
const v = new validator();
const dealSchema = {
    id: {
        type: "number",
    },
    market_id: {
        type: "number",
    },
    active: {
        type: "boolean",
    },
    close_price: {
        type: "number",
        optional: true,
    },
    expired_at: {
        type: "date",
    },
    treshold_at: {
        type: "date",
    },
    created_at: {
        type: "date",
        default: () => new Date(),
    },
    updated_at: {
        type: "date",
        optional: true,
        default: () => new Date(),
    },
};
const compiledSchema = v.compile(dealSchema);
/**
 * @typedef {Object} Deal
 * @property {number} id
 * @property {number} market_id
 * @property {boolean} active
 * @property {number} close_price
 * @property {Date} expired_at
 * @property {Date} treshold_at
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * 
 * @param {Deal} data 
 * @returns {Object}
 */
function validate(data) {
    let message = compiledSchema(data);
    if(message == true) return null;
    return message;
}
module.exports = {
    validate,
};