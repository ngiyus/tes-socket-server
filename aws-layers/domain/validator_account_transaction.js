const validator = require("fastest-validator");
const v = new validator();

const accountTransactionSchema = {
    id: {
        type: "number",
        optional: true,
    },
    deal_id: {
        type: "number",
    },
    type: {
        type: "string",
    },
    amount: {
        type: "number",
    },
    profit_amount: {
        type: "number",
        optional: true,
    },
    base_price: {
        type: "number",
    },
    active: {
        type: "boolean",
    },
    profit: {
        type: "boolean",
        optional: true,
    },
    account_id: {
        type: "string",
    },
    open_time: {
        type: "date",
    },
    close_time: {
        type: "date",
        optional: true,
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
const compiledSchema = v.compile(accountTransactionSchema);
/**
 * @typedef {Object} AccountTransaction
 * @property {number} id
 * @property {number} deal_id
 * @property {string} type
 * @property {number} amount
 * @property {number} profit_amount
 * @property {number} base_price
 * @property {boolean} active
 * @property {boolean} profit
 * @property {string} account_id
 * @property {Date} open_time
 * @property {Date} close_time
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * 
 * @param {AccountTransaction} data 
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