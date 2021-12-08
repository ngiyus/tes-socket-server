const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

/** 
 * @type {import("../infrastructure/repository_account")} */
const accountReps = require(`${infraPath}/repository_account`);

/** 
 * @type {import("../infrastructure/pgsql")} */
const { Op, literal } = require(`${infraPath}/pgsql`);

const firebase = require("./firebase");

/**
 * @param {string} userID
 * @returns {Promise<Array<import("../domain/validator_account").Account>>}
 */
async function getSpecificAccount(userID) {
    userID = await firebase.validate(userID);
    try {
        return await accountReps.findAll({
            where: {
                user_id: userID,
            },
            raw: true,
            attributes: ["account_id", "balance", "demo", "id"],
            order: [
                ["demo", "ASC"]
            ]
        });
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}
/**
 * @typedef {Object} NonDemoAccount
 * @property {number} id
 * @property {string} account_id
 * @property {number} balance
 * @property {string} user_id
 */

/**
 * @param {string} userID
 * @param {boolean=} demo
 * @returns {Promise<NonDemoAccount>}
 */
async function getNondemoAccount(userID, demo) {
    try {
        let result = await accountReps.findOne({
            attributes: ["id", "account_id", "balance", "user_id"],
            where: {
                [Op.and]: {
                    demo:demo,
                    user_id: userID,
                },
            },
        });
        if(!result) throw {
            source: "client",
            message: "account not found in user id",
        };
        return result.get();
    } catch (error) {
        throw {
            source: error.source || "server",
            message: error.message ? error.message : error,
        };
    }
}

/**
 * @param {string} userID 
 * @param {number} amount
 * @param {number} minimumAmount
 * @param {any=} transactor
 */
async function incrementAccountBalance(userID, amount,minimumAmount = 0,demo, transactor = null) {
    try {
        let result = await accountReps.update(
            { balance: literal(`balance + ${amount}`) },
            { 
                where: {
                    [Op.and]: {
                        user_id: userID,
                        demo: demo,
                    },
                    balance: {
                        [Op.gt]: 0,
                        [Op.gte]: minimumAmount,
                    }
                },
                transaction: transactor,
            },
        )
        if(result[0] != 1) {
            throw {
                source: "client",
                message: "INSUFFICIENT BALANCE",
            };
        }
    } catch (error) {
        throw {
            source: error.source || "server",
            message: error.message ? error.message : error,
        };
    }
}

module.exports = {
    getSpecificAccount,
    getNondemoAccount,
    incrementAccountBalance,
};