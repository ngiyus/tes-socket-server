const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

/** 
 * @type {import("../infrastructure/repository_market")} */
const marketReps = require(`${infraPath}/repository_market`);
const firebase = require("./firebase");

/**
 * @param {string} userID
 * @param {number=} limit
 * @returns {Promise<Array<import("../domain/validator_market").Market>>}
 */
async function getAllMarket(userID, limit=1000) {
    await firebase.validate(userID);
    try {
        return await marketReps.findAll({
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
 * @param {string} userID
 * @param {number} marketID
 * @returns {Promise<string>}
 */
async function getMarketNameByID(userID, marketID) {
    if(!marketID) {
        marketID = userID;
    } else {
        await firebase.validate(userID);
    }
    try {
        let result = await marketReps.findByPk(marketID, {
                plain: true,
                raw: true,
                attributes: ["name"]
        })
        if(!result) return null;
        return result.name;
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

module.exports = {
    getAllMarket,
    getMarketNameByID,
};