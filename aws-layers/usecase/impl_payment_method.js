const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

const domainPath = process.env.AWS ?
    "/opt/domain":
    "../domain";

/** 
 * @type {import("../infrastructure/repository_payment_method")} */
const paymentMethodReps = require(`${infraPath}/repository_payment_method`);
const firebase = require("./firebase");

/**
 * @param {string} userID
 * @returns {Promise<import("../domain/validator_payment_method").PaymentMethod>}
 */
async function getPaymentDeposit(userID) {
    await firebase.validate(userID);
    try {
        return paymentMethodReps.findAll({
            attributes: ["id", "bank_name", "logo_url"],
            where: {
                deposit: true,
                country_id: "IDN"
            },
            raw: true,
        });
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

/**
 * @param {string} userID
 * @returns {Promise<import("../domain/validator_payment_method").PaymentMethod>}
 */
async function getPaymentWithdraw(userID) {
    await firebase.validate(userID);
    try {
        return paymentMethodReps.findAll({
            attributes: ["id", "bank_name", "logo_url"],
            where: {
                withdraw: true,
                country_id: "IDN"
            },
            raw: true,
        });
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

/**
 * @param {number} paymentID 
 * @returns {Promise<string>}
 */
async function getPaymentBankCode(paymentID) {
    try {
        let response = await paymentMethodReps.findOne({
            attributes: ["bank_code"],
            where: {
                deposit: true,
                country_id: "IDN",
                id: paymentID
            },
            raw: true
        });
        return response.bank_code;
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

module.exports = {
    getPaymentDeposit,
    getPaymentWithdraw,
    getPaymentBankCode,
};