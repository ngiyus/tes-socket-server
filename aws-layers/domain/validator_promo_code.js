const validator = require("fastest-validator");
const v = new validator();
const promoCodeSchema = {
    id: {
        type: "string",
    },
    max_usage: {
        type: "number",
        integer: true,
        default: 100,
    },
    usage_count: {
        type: "number",
        integer: true,
        default: 0,
    },
    type: {
        type: "string",
        optional: true,
    },
    value: {
        type: "number",
        optional: true,
    },
    turnover: {
        type: "number",
        optional: true,
    },
};
const compiledSchema = v.compile(promoCodeSchema);
/**
 * @typedef {Object} PromoCode
 * @property {string} id
 * @property {number} max_usage
 * @property {number} usage_count
 * @property {string} type
 * @property {number} value
 * @property {number} turnover
 */

/**
 * 
 * @param {PromoCode} data 
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