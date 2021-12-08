const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

const domainPath = process.env.AWS ?
    "/opt/domain":
    "../domain";

/** 
 * @type {import("../infrastructure/repository_withdraw_transaction")} */
const withdrawTransactionReps = require(`${infraPath}/repository_withdraw_transaction`);
const withdrawTransactionTableName = withdrawTransactionReps.getTableName();

/** 
 * @type {import("../infrastructure/repository_payment_method")} */
const paymentMethodReps = require(`${infraPath}/repository_payment_method`);
const paymentMethodTableName = paymentMethodReps.getTableName();

/** 
 * @type {import("../domain/validator_withdraw_transaction")} */
const withdrawTransactionDom = require(`${domainPath}/validator_withdraw_transaction`);
/** 
 * @type {import("../infrastructure/pgsql")} */
const { dbConn } = require(`${infraPath}/pgsql`);

const account = require("./impl_account");
const rule = require("./business_rule.json");
const firebase = require("./firebase");


/**
 * @param {string} userToken 
 * @param {number} paymentID 
 * @param {number} amount 
 * @param {string} rekName 
 * @param {number} rekNumber 
 * @returns {Promise<import("../domain/validator_withdraw_transaction").WithdrawTransaction>}
 */
async function createWithdrawTransaction(userToken, paymentID, amount, rekName, rekNumber) {
    if(amount < rule.minimal_withdraw_amount.value) {
        throw {
            source: "client",
            message: `MINIMUM WITHDRAW ${rule.minimal_withdraw_amount.value}`,
        };
    }

    let userID = await firebase.validate(userToken);
    /**
     * @type {import("../infrastructure/node_modules/sequelize/types").Transaction} */
    let transactor;
    let commited = false;
    try {
        transactor = await dbConn.transaction();

        /**
         * @type {import("../domain/validator_withdraw_transaction").WithdrawTransaction}*/
        let withdrawTransactionRecord = {
            user_id: userID,
            status: "WAITING",
            payment_id: paymentID,
            amount,
            metadata: {
                nomorRekening: rekNumber,
                namaRekening: rekName,
            },
            reason: null,
            updated_at: null,
        };
        
        let message = withdrawTransactionDom.validate(withdrawTransactionRecord);
        if(!message) {
            await account.incrementAccountBalance(userID, -amount, amount, transactor);
            let transaction = await withdrawTransactionReps.create(withdrawTransactionRecord,
                { transaction: transactor, raw: true, });
            await transactor.commit();
            commited = true;

            return transaction.get();
        } else{
            throw {
                source: "client",
                message,
            };
        }
    } catch (error) {
        throw {
            source: error.source || "server",
            message: error.message ? error.message : error,
        };
    } finally{
        if(!commited) await transactor.rollback();
    }
}
const getWithdrawTransactionTemplate = `
select
    metadata,
    created_at,
    status,
    amount,
    bank_name,
    bank_code,
    logo_url,
    reason,
    ${withdrawTransactionTableName}.id
from 
    ${withdrawTransactionTableName}
        inner join
    ${paymentMethodTableName}
        on
    ${withdrawTransactionTableName}.payment_id
        = 
    ${paymentMethodTableName}.id
        where
    user_id
        =`;

/**
 * @param {string} userToken 
 * @param {number=} page 
 * @param {number=} limit 
 * @returns {Promise<Array<import("../domain/validator_withdraw_transaction").WithdrawTransaction>>}
 */
async function getWithdrawTransaction(userToken, page = 0, limit = 10) {
    let userID = await firebase.validate(userToken);

    if(page < 0 || Number.isNaN(page)) {
        throw {
            source: "client",
            message: "page parameter should be a number 0 or larger",
        };
    }

    try {
        let result = await withdrawTransactionReps.
            sequelize.
            query(`
${getWithdrawTransactionTemplate}
    '${userID}'
        order by
    created_at desc
        offset
    ${page * rule.limit_per_page.value}
        limit
    ${limit}`, {
                raw: true,
            });
        return result[0];
    } catch (error) {
        throw {
            source: "server",
            message: error.message ? error.message : error,
        };
    }
}

/**
 * @param {string} userToken 
 * @param {number=} id
 * @returns {Promise<import("../domain/validator_withdraw_transaction").WithdrawTransaction>}
 */
async function getWithdrawTransactionWithID(userToken, id) {
    let userID = await firebase.validate(userToken);

    try {
        let result = await withdrawTransactionReps.
            sequelize.
            query(`
${getWithdrawTransactionTemplate}
    '${userID}'
    AND
    ${withdrawTransactionTableName}.id
        =
    ${id}
    `, {
            raw: true,
        });
        let transaction = result[0];
        if(transaction.length == 0) {
            throw {
                source: "client",
                message: "transaction not found",
            }
        }

        return transaction[0];
    } catch (error) {
        throw {
            source: "server",
            message: error.message ? error.message : error,
        };
    }
}

module.exports = {
    createWithdrawTransaction,
    getWithdrawTransaction,
    getWithdrawTransactionWithID,
};