const validator = require("fastest-validator");
const v = new validator();
const referralSchema = {
    user_id: {
        type: "string",
    },
    referral_link: {
        type: "string",
    },
    referrer: {
        type: "string",
        optional: true,
    },
    commision: {
        type: "number",
        integer: true,
        min: 0
    },
};
const compiledSchema = v.compile(referralSchema);
/**
 * @typedef {Object} Referral
 * @property {string} user_id
 * @property {string} referral_link
 * @property {string} referrer
 * @property {number} commision
 */

/**
 * 
 * @param {Referral} data 
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