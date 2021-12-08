const infraPath = process.env.AWS ?
    "/opt/infrastructure" :
    "../infrastructure";

/** 
 * @type {import("../infrastructure/repository_account_transaction")} */
const accountTransactionReps = require(`${infraPath}/repository_account_transaction`);
const accountTransactionTableName = accountTransactionReps.getTableName();

const account = require("./impl_account");


/** 
 * @type {import("../infrastructure/repository_deal")} */
const dealReps = require(`${infraPath}/repository_deal`);
const dealTableName = dealReps.getTableName();

/** 
 * @type {import("../infrastructure/pgsql")} */
const { dbConn } = require(`${infraPath}/pgsql`);

/** 
 * @type {import("../infrastructure/redis")} */
const redis = require(`${infraPath}/redis`);

/** 
 * @type {import("../infrastructure/repository_market")} */
const marketReps = require(`${infraPath}/repository_market`);
const marketTableName = marketReps.getTableName();

const firebase = require("./firebase");


let getAccountTransactionQuery =
    `
    select
        ${accountTransactionTableName}.id,
        ${accountTransactionTableName}.active,
        ${accountTransactionTableName}.account_id,
        ${accountTransactionTableName}.amount,
        ${accountTransactionTableName}.base_price,
        ${accountTransactionTableName}.close_time,
        ${accountTransactionTableName}.open_time,
        ${accountTransactionTableName}.profit,
        ${accountTransactionTableName}.profit_amount,
        ${accountTransactionTableName}.type,
        
        ${dealTableName}.id as deal_id,
        ${dealTableName}.active as deal_active,
        ${dealTableName}.close_price as deal_close_price,
        ${dealTableName}.expired_at as deal_expired_at,
        ${dealTableName}.treshold_at as deal_treshold_at,
        ${dealTableName}.updated_at as deal_updated_at,

        ${marketTableName}.id as market_id,
        ${marketTableName}.name as market_name,
        ${marketTableName}.url_logo as market_url_logo
    from
        ${accountTransactionTableName}
    left join
        ${dealTableName}
    on
        ${accountTransactionTableName}.deal_id = ${dealTableName}.id
    left join
        ${marketTableName}
    on
        ${dealTableName}.market_id = ${marketTableName}.id
    where
`

/**
 * @param {string} userID
 * @param {number} id
 * @param {boolean} active
 * @param {String} accountId
 * @param {number=} limit
 * @param {number=} limit
 * @returns {Promise<Array<import("../domain/validator_account_transaction").AccountTransaction>>}
 */
async function getAccountTransaction(userID, id, active, accountId, limit = 10, offset) {
    await firebase.validate(userID);

    try {
        let result = await accountTransactionReps.sequelize.query(
            `
${getAccountTransactionQuery}
        account_id = '${accountId}'
            and
        ${accountTransactionTableName}.active = ${active}
            and
        ${accountTransactionTableName}.id >= ${id}
    order by id
    ${offset > 0 ? `offset  ${offset}` : ""}
    limit ${limit}
`, {
            raw: true,
        });
        return result[0];
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}



let getThresholdAndMarketActive = `
select
    ${marketTableName}.active as market_active,
    ${marketTableName}.name as market_name,
    ${marketTableName}.url_logo as market_url_logo,
    ${dealTableName}.treshold_at as deal_treshold_at,
    ${dealTableName}.expired_at as deal_expired_at
from
    ${dealTableName}
    inner join
    ${marketTableName}
    on
    ${dealTableName}.market_id
    =
    ${marketTableName}.id
    where ${dealTableName}.id = `;
/**
 * @typedef {import("../domain/validator_account_transaction").AccountTransaction & import("./impl_account").NonDemoAccount} CreateAccountTransactionResponse
 * 
 * @param {string} userToken 
 * @param {number | string} dealID 
 * @param {number} amount 
 * @param {string} type 
 * @param {boolean=} demo
 * @returns {Promise<CreateAccountTransactionResponse>}
 */

async function createAccountTransaction(userToken, dealID, amount, type, demo) {
    /**
     * @type {import("../infrastructure/node_modules/sequelize/types").Transaction}
     */
    let transactor;
    let commited = false;
    // if(typeof demo !== "boolean") demo = false;
    if (typeof amount !== "number") throw "AMOUNT SHOULD BE NUMBER"
    if (amount < 25000) throw "MINIMUM AMOUNT"
    try {
        let userID = await firebase.validate(userToken);
        transactor = await dbConn.transaction();

        let currentAccount = await account.getNondemoAccount(userID, demo)

        if (Number(currentAccount.balance) < Number(amount)) throw "INSUFFICIENT BALANCE";
   

        let transactionMetadata = await accountTransactionReps.sequelize.query(
            getThresholdAndMarketActive + dealID,
            { raw: true, plain: true }
        );

      

        if (!transactionMetadata) throw "DEAL NOT EXIST";
        if (!transactionMetadata.market_active) {
            throw "MARKET CLOSED";
        }

        let now = Date.now();
        if (transactionMetadata.deal_treshold_at.getTime() < now) {
            throw "DEAL CLOSED";
        }

        let basePrice = await redis.getLatestPriceData(
            transactionMetadata.market_name,
        );
        

        
        /**
         * @type {import("../domain/validator_account_transaction").AccountTransaction}*/
        let record = {
            
            deal_id: dealID,
            type,
            amount,
            profit_amount: null,
            base_price: basePrice,
            active: true,
            account_id: currentAccount.account_id,
            open_time: new Date(),
            close_time: transactionMetadata.deal_expired_at,
            created_at: new Date(),
            updated_at: null,
            profit: null,
            market_name: transactionMetadata.market_name,
            market_url_logo:transactionMetadata.market_url_logo
          
        };

        await Promise.all([
            account.incrementAccountBalance(userID, -amount, amount,demo ,transactor),

            accountTransactionReps.create(record, {
                transaction: transactor,
            }).then(data =>{
                record.id = data.dataValues.id;
             
            })
        ]);

        await transactor.commit();
        commited = true;

      
        return record;
    } catch (error) {
        throw error.message ? error.message : error;
    } finally {
        if (transactor && !commited) transactor.rollback();
    }
}

module.exports = {
    getAccountTransaction,
    createAccountTransaction,
};