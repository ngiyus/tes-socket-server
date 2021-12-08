const validator = require("fastest-validator");
const v = new validator();
const paymentMethodSchema = {
    id: {
        type: "number",
        integer: true,
    },
    country_id: {
        type: "string",
    },
    logo_url: {
        type: "string",
        optional: true,
    },
    deposit: {
        type: "boolean",
    },
    withdraw: {
        type: "boolean",
    },
    bank_name: {
        type: "string",
    },
    bank_code: {
        type: "string",
    }
};
const compiledSchema = v.compile(paymentMethodSchema);
/**
 * @typedef {Object} PaymentMethod
 * @property {number} id
 * @property {string} country_id
 * @property {string} logo_url
 * @property {boolean} deposit
 * @property {boolean} withdraw
 * @property {string} bank_name
 * @property {string} bank_code
 */

/**
 * 
 * @param {PaymentMethod} data 
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