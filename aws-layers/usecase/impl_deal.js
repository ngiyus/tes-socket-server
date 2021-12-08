const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

/** 
 * @type {import("../infrastructure/repository_deal")} */
const dealReps = require(`${infraPath}/repository_deal`);

/** 
 * @type {import("../infrastructure/pgsql")} */
const { Op } = require(`${infraPath}/pgsql`);
const firebase = require("./firebase");

/**
 * @param {string} userID
 * @param {number} marketId
 * @param {String | Date} lastThresholdTime
 * @param {number=} limit
 * @returns {Promise<Array<import("../domain/validator_deal.js").Deal>>}
 */
async function getDeals(userID, marketId, lastThresholdTime, limit=10) {
    await firebase.validate(userID);
    try {
        return await dealReps.findAll({
            attributes: ["id", "treshold_at", "expired_at"],
            where: {
                market_id: marketId,
                treshold_at: {
                    [Op.gte]: lastThresholdTime
                },
                active: true,
            },
            order: [
                ["expired_at", "ASC"],
            ],
            raw: true,
            limit,
        });
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

/**
 * @typedef {Object} CloseDealReturned
 * @property {number} id
 * @property {Date} expired_at
 * 
 * @param {number} dealID 
 * @param {number} closePrice 
 * @return {Promise<CloseDealReturned>}
 */
async function closeDeal(dealID, closePrice) {    
    try {
        let result = await dealReps.update({
            close_price: closePrice,
            active: false,
        }, {
            where: {
                id: dealID,
            },
            returning: [ "id", "expired_at" ],
        });
        if(result[0] != 1) {
            throw { source: "client", message: `deal id '${dealID}'' not found`}
        }
        return result[1][0].get()
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

/**
 * @param {string} userID 
 * @param {number} marketID 
 * @param {Date} timestamp
 * @return {Promise<CloseDealReturned>} 
 */
async function getNextDeal(marketID, timestamp) {
    try {
        return await dealReps.findAll({
            attributes: ["id", "expired_at"],
            where: {
                market_id: marketID,
                active: true,
                expired_at:{
                    [Op.gt]: timestamp
                }
            },
            order: [
                ["expired_at", "ASC"],
            ],
            raw: true,
            plain: true,
            limit: 1,
        });
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

module.exports = {
    getDeals,
    closeDeal,
    getNextDeal,
};