const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

/** 
 * @type {import("../infrastructure/firebase")} */
const { firebaseConn } = require(`${infraPath}/firebase`);

/**
 * @param {string} token
 * @returns {Promise<string>}
 */
async function validate(token) {
    try {
        let user = await firebaseConn.auth().verifyIdToken(token);
        return user.uid;
    } catch (error) {
        console.log(error)
        throw {
            source: "client",
            message: "firebase id token invalid",
        };
    }
}

module.exports = {
    validate,
};