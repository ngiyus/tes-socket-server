const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

/** 
 * @type {import("../infrastructure/repository_promo_code")} */
const promoCodeReps = require(`${infraPath}/repository_promo_code`);
const promoCodeTable = promoCodeReps.getTableName();
const firebase = require("./firebase");

/** 
 * @type {import("../infrastructure/repository_promotion")} */
const promotionReps = require(`${infraPath}/repository_promotion`);
const promotionTable = promotionReps.getTableName();

let promoCodeQuery = `
    select
        ${promotionTable}.title as title,
        ${promotionTable}.description as description,
        ${promoCodeTable}.id as promo_code,
        ${promotionTable}.minimum_deposit as minimum,
        ${promotionTable}.maximum_deposit as maximum,
        ${promoCodeTable}.type as promo_type,
        ${promoCodeTable}.value as promo_value,
        ${promoCodeTable}.turnover as promo_turnover
    from
        ${promoCodeTable}
    inner join
        ${promotionTable}
    on
        ${promotionTable}.promo_code
        =
        ${promoCodeTable}.id
    where 
        active = true;
`
/**
 * @param {string} userToken 
 * @returns {Promise<Array<import("../domain/validator_promo_code").PromoCode>>}
 */
async function getPromoCode(userToken) {
    let userID = await firebase.validate(userToken);
    try {
        let promoCodes = await promoCodeReps.sequelize.query(
            promoCodeQuery,
            {
                raw: true,
            }
        )
        return promoCodes[0];
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

module.exports = {
    getPromoCode,
};