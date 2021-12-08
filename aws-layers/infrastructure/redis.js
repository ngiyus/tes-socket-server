const Redis = require("ioredis");
const redisConfig = require("./redis_config.json");
const redisClient = new Redis(redisConfig.REDIS_URL);

/**
 * @param {string} marketName 
 * @returns {Promise<number>}
 */
async function getLatestPriceData(marketName) {
    try {
        let priceData = await redisClient.xrevrange(marketName, "+", "-", "COUNT", 1);
        if(priceData.length == 0) {
            throw {
                source: "client",
                message: "Market price not found",
            };
        }
        return Number.parseFloat(priceData[0][1][1]);
    } catch (error) {
        if(error.source) throw error;
        throw {
            source: "server",
            message: "error exist when getting latest price",
        };
    }
}

module.exports = {
    getLatestPriceData,
};