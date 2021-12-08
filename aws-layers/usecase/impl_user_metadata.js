const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

const domainPath = process.env.AWS ?
    "/opt/domain":
    "../domain";

/** 
 * @type {import("../infrastructure/repository_user_metadata")} */
const userMetadataReps = require(`${infraPath}/repository_user_metadata`);

/** 
 * @type {import("../domain/validator_user_metadata")} */
const userMetadataDom = require(`${domainPath}/validator_user_metadata`);
const firebase = require("./firebase");

/**
 * @param {string} userToken 
 * @param {string} fcmToken 
 */
async function updateFCM(userToken, fcmToken) {
    let userID = await firebase.validate(userToken);

    try {
        let updateResult = await userMetadataReps.update({
            fcm_token: fcmToken,
        },
        {
            where: {
                user_id: userID,
            },
        });
        if(updateResult[0] != 1) {
            throw "FCM Token not updated because (user id or metadata) not found";
        }
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

module.exports = {
    updateFCM,
};