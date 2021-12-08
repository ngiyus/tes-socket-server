const validator = require("fastest-validator");
const v = new validator();
const quotePriceSchema = {
    timestamp: {
        type: "date",
    },
    rate: {
        type: "number",
    },
    market: {
        type: "string",
    },
};
const compiledSchema = v.compile(quotePriceSchema);
/**
 * @typedef {Object} QuotePrice
 * @property {Date} timestamp
 * @property {number} rate
 * @property {string} market
 */

/**
 * 
 * @param {QuotePrice} data 
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