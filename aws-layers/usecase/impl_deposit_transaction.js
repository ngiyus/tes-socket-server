const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

const domPath = process.env.AWS ?
    "/opt/domain":
    "../domain";

/** 
 * @type {import("../infrastructure/repository_deposit_transaction")} */
const depositTransactionReps = require(`${infraPath}/repository_deposit_transaction`);
const depositTransactionTableName = depositTransactionReps.getTableName();

/** 
 * @type {import("../domain/validator_deposit_transaction")} */
const depositTransactionDom = require(`${domPath}/validator_deposit_transaction`);

/** 
 * @type {import("../infrastructure/repository_payment_method")} */
const paymentMethodReps = require(`${infraPath}/repository_payment_method`);
const paymentMethodTableName = paymentMethodReps.getTableName();

/** 
 * @type {import("../infrastructure/pgsql")} */
const { Op } = require(`${infraPath}/pgsql`);

const rule = require("./business_rule.json");
const firebase = require("./firebase");

const getDepositTransactionTemplate = `
select
    metadata,
    expired_at,
    created_at,
    status,
    amount,
    bank_name,
    bank_code,
    logo_url,
    promo_code,
    ${depositTransactionTableName}.id
from 
    ${depositTransactionTableName}
        inner join
    ${paymentMethodTableName}
        on
    ${depositTransactionTableName}.payment_id
        = 
    ${paymentMethodTableName}.id
        where
    user_id
        =`;

/**
 * @param {string} userToken 
 * @param {number=} page 
 * @param {number=} limit 
 * @returns {Promise<Array<import("../domain/validator_deposit_transaction").DepositTransaction>>}
 */
async function getDepositTransaction(userToken, page = 0, limit = 10) {
    let userID = await firebase.validate(userToken);

    if(page < 0) {
        throw {
            source: "client",
            message: "page parameter should be a number 0 or larger",
        };
    }

    try {
        let result = await depositTransactionReps.
            sequelize.
            query(`
${getDepositTransactionTemplate}
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
 * @returns {Promise<import("../domain/validator_deposit_transaction").DepositTransaction>}
 */
async function getDepositTransactionWithID(userToken, id) {
    let userID = await firebase.validate(userToken);

    try {
        let result = await depositTransactionReps.
            sequelize.
            query(`
${getDepositTransactionTemplate}
    '${userID}'
    AND
    ${depositTransactionTableName}.id
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

/**
 * @param {string} userID 
 * @param {number} paymentID 
 * @param {string=} promoCode 
 * @param {string} rekName 
 * @param {number} rekNumber 
 * @param {number} amount 
 * @param {Date} expired_at 
 * @return {Promise<import("../domain/validator_deposit_transaction").DepositTransaction>}
 */
async function createDepositTransaction(
    userID,
    paymentID,
    promoCode,
    rekName,
    rekNumber,
    amount,
    expired_at
) {
    try {
        /**
         * @type {import("../domain/validator_deposit_transaction").DepositTransaction} */
        let depositTransactionRecord = {
            user_id: userID,
            payment_id: paymentID,
            metadata: {
                nomorRekening: rekNumber,
                namaRekening: rekName,
            },
            expired_at,
            updated_at: null,
            promo_code: promoCode,
            status: "WAITING",
            amount,
        };
        let message = depositTransactionDom.validate(depositTransactionRecord);
        if(!message) {
            let resp = await depositTransactionReps.create(
                depositTransactionRecord, {
                    raw: true
                }
            );
            return resp.get();
        } else {
            throw {
                source: "client",
                message: {
                    validationError: message,
                    api: "error create va",
                },
            };
        }
    } catch (error) {
        throw {
            source: error.source || "server",
            message: error.message ? error.message : error,
        };
    }
}

/**
 * @param {string} va_number 
 * @return {Promise<boolean>}
 */
async function updateDepositToSuccess(va_number) {

    try {
        let now = new Date();
        let updatedRow =
            await depositTransactionReps.update(
            { status: "SUCCESS", updated_at: now },{
            where: {
                [Op.and]: {
                    "metadata.va_number": va_number,
                    "status": "WAITING",
                    "expired_at": {
                        [Op.gt]: now,
                    }
                }
            }
        });
        return updatedRow[0] != 0;
    } catch (error) {
        throw {
            source: error.source || "server",
            message: error.message ? error.message : error,
        };
    }
}

/**
 * @param {number} id 
 * @returns {Promise<number>}
 */
async function expiringDepositTransaction(id) {
    try {
        let now = new Date();
        let updatedRow = 
            await depositTransactionReps.update(
                { status: "EXPIRED", updated_at: now },{
                where: {
                    id,
                },
            });
        return updatedRow[0] != 0;
    } catch (error) {
        throw {
            source: error.source || "server",
            message: error.message ? error.message : error,
        };
    }
}

module.exports = {
    getDepositTransaction,
    createDepositTransaction,
    updateDepositToSuccess,
    expiringDepositTransaction,
    getDepositTransactionWithID,
};