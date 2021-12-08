const validator = require("fastest-validator");
const v = new validator();

const accountSchema = {
    id: {
        type: "number",
    },
    account_id: {
        type: "string",
    },
    demo: {
        type: "boolean",
    },
    balance: {
        type: "number",
        optional: true,
    },
    currency: {
        type: "string",
    },
    user_id: {
        type: "string",
    },
    created_at: {
        type: "date",
        default: () => new Date(),
    },
    updated_at: {
        type: "date",
        optional: true,
    },
};
const compiledSchema = v.compile(accountSchema);

/**
 * @typedef {Object} Account
 * @property {number} id
 * @property {string} account_id
 * @property {boolean} demo
 * @property {number} balance
 * @property {string} currency
 * @property {string} user_id
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * 
 * @param {Account} data 
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