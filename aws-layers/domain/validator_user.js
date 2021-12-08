const validator = require("fastest-validator");
const v = new validator({
    useNewCustomCheckerFunction: true,
    messages: {
        stringEnum: "login_method only allowed Facebook or Google, but got '{actual}'",
    }
});
const userSchema = {
    id: {
        type: "string",
    },
    name: {
        type: "string",
    },
    email: {
        type: "email",
    },
    phone_number: {
        type: "string",
    },
    referrer: {
        type: "string",
        optional: true,
    },
    login_method: {
        type: "string",
        optional: true,
        enum: [ "Facebook", "Google" ],
    },
    created_at: {
        type: "date",
        default: () => new Date(),
        optional: true
    },
    updated_at: {
        type: "date",
        default: () => new Date(),
        optional: true
    },
    last_login: {
        type: "date",
        optional: true
    },
};
const compiledSchema = v.compile(userSchema);
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} avatar_url
 * @property {string} phone_number
 * @property {string} login_method
 * @property {string} referrer
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {Date} last_login
 */

/**
 * 
 * @param {User} data 
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