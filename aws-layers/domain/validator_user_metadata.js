const validator = require("fastest-validator");
const v = new validator();
const userMetadataSchema = {
    user_id: {
        type: "string",
    },
    fcm_token: {
        type: "string",
        optional: true,
    },
    appsflyer_id: {
        type: "string",
        optional: true,
    },
};

const compiledSchema = v.compile(userMetadataSchema);

/**
 * @typedef {Object} UserMetadata
 * @property {string} user_id
 * @property {string} fcm_token
 * @property {string} appsflyer_id
 */

/**
 * 
 * @param {UserMetadata} data 
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