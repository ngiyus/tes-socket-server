const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

/** 
 * @type {import("../infrastructure/repository_level")} */
const levelReps = require(`${infraPath}/repository_level`);
/** 
 * @type {import("../infrastructure/pgsql")} */
const { literal } = require(`${infraPath}/pgsql`);


/**
 * @typedef {Object} Level
 * @property {number} id
 * @property {number} name
 * @property {number} name
 * 
 * @returns {Promise<Array<Level>>}
 */
async function getAllLevel() {
    try {
        let levels = await levelReps.findAll({
            raw: true,
        });
        levels.map((v) => { v.amount = Number.parseInt(v.amount); return v });
        return levels;
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

module.exports = {
    getAllLevel,
};