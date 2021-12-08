const validator = require("fastest-validator");
const v = new validator();
const marketSchema = {
    id: {
        type: "number",
    },
    name: {
        type: "string",
    },
    url_logo: {
        type: "string",
    },
    active: {
        type: "boolean",
    },
    percentage: {
        type: "number",
    },
    open_at: {
        type: "date",
    },
    close_at: {
        type: "date",
    },
    precision: {
        type: "number",
        optional: true,
    },
};
const compiledSchema = v.compile(marketSchema);
/**
 * @typedef {Object} Market
 * @property {number} id
 * @property {string} name
 * @property {string} url_logo
 * @property {boolean} active
 * @property {number} percentage
 * @property {Date} open_at
 * @property {Date} close_at
 * @property {number} precision
 */

/**
 * 
 * @param {Market} data 
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