const validator = require("fastest-validator");
const v = new validator();
const depositTransactionSchema = {
    id: {
        type: "number",
        optional: true,
    },
    user_id: {
        type: "string",
    },
    payment_id: {
        type: "number",
    },
    metadata: {
        type: "any",
    },
    expired_at: {
        type: "date",
    },
    created_at: {
        type: "date",
        default: () => new Date(),
    },
    updated_at: {
        type: "date",
        optional: true,
    },
    promo_code: {
        type: "string",
        optional: true,
    },
    status: {
        type: "string",
        optional: true,
    },
    amount: {
        type: "number",
    },
};

const compiledSchema = v.compile(depositTransactionSchema);
/**
 * @typedef {Object} DepositTransaction
 * @property {number} id
 * @property {string} user_id
 * @property {number} payment_id
 * @property {any} metadata
 * @property {Date} expired_at
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {string} promo_code
 * @property {string} status
 * @property {number} amount
 */

/**
 * 
 * @param {DepositTransaction} data 
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