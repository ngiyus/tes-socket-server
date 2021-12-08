const fetch = require('request-promise-native');
const config = require("./common_config.json");

/**
 * @typedef {Object} CreateVAResponseStatus
 * @property {string} code
 * @property {string} message
 */

/**
 * @typedef {Object} CreateVAResponses
 * @property {string} id
 * @property {number} amount
 * @property {CreateVAResponseStatus} status
 * @property {string} va_number
 * @property {string} bank_code
 * @property {boolean} is_open
 * @property {boolean} is_single_use
 * @property {number} expiration_time
 * @property {string} va_status
 * @property {string} username_display
 * @property {string} partner_user_id
 * @property {number} counter_incoming_payment
 * @property {number} trx_expiration_time
 * @property {number} trx_counter
 */

let generateStaticVAURL = config.OY_URL+"/generate-static-va";
let createVAHeaders = {
    "Content-Type": "application/json",
    'X-Oy-Username': config.OY_USERNAME,
    'X-Api-Key': config.OY_API_KEY,
};

/**
 * @param {string} bankCode
 * @param {string} partnerUserID 
 * @param {string} rekName 
 * @param {Number} amount 
 * @returns {Promise<CreateVAResponses>}
 */
async function createVA(bankCode, partnerUserID, rekName, amount) {
    try {
        let usernameDisplay = `RAYA ${rekName}`;
        let resp = await fetch.post(generateStaticVAURL, {
            headers: createVAHeaders,
            body: {
                is_open: false,
                is_single_use: true,
                bank_code: bankCode,
                partner_user_id: partnerUserID,
                username_display: usernameDisplay,
                amount,
            },
            json: true,
        });
        return resp;
    } catch(error) {
        if(error.response.statusCode < 500) {
            throw {
                source: "client",
                message: "failed create va, invalid input or api key",
            };
        } else {
            throw {
                source: "server",
                message: "oy indonesia is down right now",
            };
        }
    }
}

module.exports = {
    oy: {
        createVA,
    },
};