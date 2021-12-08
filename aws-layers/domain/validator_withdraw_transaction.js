const validator = require("fastest-validator");
const v = new validator();
const withdrawTransactionSchema = {
    id: {
        type: "number",
        optional: true
    },
    user_id: {
        type: "string",
    },
    status: {
        type: "string",
    },
    payment_id: {
        type: "number",
    },
    amount: {
        type: "number",
        optional: true,
    },
    metadata: {
        type: "any",
    },
    reason: {
        type: "string",
        optional: true,
    },
    created_at: {
        type: "date",
        default: () => new Date(),
    },
    updated_at: {
        type: "date",
        optional: true
    },
};

const compiledSchema = v.compile(withdrawTransactionSchema);
/**
 * @typedef {Object} WithdrawTransaction
 * @property {number} id
 * @property {string} user_id
 * @property {string} status
 * @property {number} payment_id
 * @property {number} amount
 * @property {any} metadata
 * @property {string} reason
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * 
 * @param {WithdrawTransaction} data 
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