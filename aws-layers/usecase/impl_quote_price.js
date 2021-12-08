const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

/** 
 * @type {import("../infrastructure/repository_quote_price")} */
const quotePriceReps = require(`${infraPath}/repository_quote_price`);
const firebase = require("./firebase");

/** 
 * @type {import("../infrastructure/pgsql")} */
const { Op, literal } = require(`${infraPath}/pgsql`);

/**
 * @param {string} userToken 
 * @param {string} market 
 * @param {string} isoTimestamp 
 * @param {number} interval 
 * @returns {Promise<Array<import("../domain/validator_quote_price").QuotePrice>>}
 */
async function getStockHistory(userToken, market, isoTimestamp, interval) {
    await firebase.validate(userToken);
    try {
        let historyPickLength =
            interval <= 1    ? 1 :
            interval <= 5    ? 2 :
            interval <= 15   ? 3 :
            interval <= 60   ? 4 :
            interval <= 900  ? 6 :
            interval <= 1800 ? 6 : 6;

        let specifiedDate = new Date(isoTimestamp).toISOString();
        let historyDate = new Date(isoTimestamp);
            historyDate.setHours(historyDate.getHours() - historyPickLength);

        return await quotePriceReps.findAll(
        {
            attributes:[
                [literal(`time_bucket('${interval} sec', timestamp) + '${interval} sec'`), "t"],
                [literal(`first(rate, timestamp)`), "open"],
                [literal(`last(rate, timestamp)`), "close"],
                [literal(`max(rate)`), "high"],
                [literal(`min(rate)`), "low"],
            ],
            where: {
                market,
                timestamp: {
                    [Op.gte]: historyDate,
                    [Op.lt]: specifiedDate,
                },
            },
            group: "t",
            order: [ 
                [literal("t"), "asc"]
             ],
            raw: true,
        });
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

module.exports = {
    getStockHistory,
};