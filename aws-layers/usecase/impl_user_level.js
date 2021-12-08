const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

const domainPath = process.env.AWS ?
    "/opt/domain":
    "../domain";

/** 
 * @type {import("../infrastructure/repository_user_level")} */
const userLevelReps = require(`${infraPath}/repository_user_level`);
const userLevelTablename = userLevelReps.getTableName();

/** 
 * @type {import("../infrastructure/repository_level")} */
const levelReps = require(`${infraPath}/repository_level`);
const levelRepsTablename = levelReps.getTableName();
const firebase = require("./firebase");


/**
 * @typedef {Object} GetUserLevel
 * @property {number} level_id
 * @property {number} progress
 * @property {number} progress_total
 * 
 * 
 * @param {string} userToken 
 * @returns {Promise<GetUserLevel>}
 */
async function getUserLevel(userToken) {
    let userID = await firebase.validate(userToken);
    
    return await userLevelReps.sequelize.query(`
select
    user_level.level_id,
    user_level.progress,
    cast(level.amount as int) progress_total
from
    ${userLevelTablename} user_level
    inner join
    ${levelRepsTablename} level
    on
        user_level.level_id = level.id
    where
        user_level.user_id = '${userID}';
`, { plain: true, raw: true });
}

module.exports = {
    getUserLevel,
};