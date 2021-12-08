const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

const domainPath = process.env.AWS ?
    "/opt/domain":
    "../domain";

/** 
 * @type {import("../infrastructure/repository_referral")} */
const referralReps = require(`${infraPath}/repository_referral`);

/** 
 * @type {import("../domain/validator_referral")} */
const referralDom = require(`${domainPath}/validator_referral`);

/**
 * @param {import("../domain/validator_referral").Referral} referral
 */
async function createReferral(referral) {
    try {
        let message = referralDom.validate(referral);
        if(!message) {
            await referralReps.create(referral);
        } else{
            throw {
                message,
            };
        }
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

module.exports = {
    createReferral,
};