const infraPath = process.env.AWS ?
    "/opt/infrastructure":
    "../infrastructure";

const domainPath = process.env.AWS ?
    "/opt/domain":
    "../domain";

/** 
 * @type {import("../infrastructure/repository_user")} */
const userReps = require(`${infraPath}/repository_user`);
/** 
 * @type {import("../domain/validator_user")} */
const userDom = require(`${domainPath}/validator_user`);
const firebase = require("./firebase");

/**
 * @param {import("../domain/validator_user").User} user 
 * @param {string} token
 */
async function createUser(user, token) {
    let userID = await firebase.validate(token);
    try {
        user.id = userID;
        let message = userDom.validate(user);
        let reff;
        if(user.referrer) {
            reff = user.referrer;
            delete user.referrer;
        }
        if(!message) {
            await userReps.create(user);
        } else{
            throw {
                message,
            };
        }
        user.referrer = reff;
    } catch (error) {
        throw {
            source: "client",
            message: error.message ? error.message : error,
        };
    }
}

/**
 * @param {string} token 
 */
async function updateLastLogin(token) {
    let userID = await firebase.validate(token);
    try {
        let result = await userReps.update(
            { last_login: new Date() },
            { where: { id: userID } },
        );
        if(result[0] == 0) {
            throw {
                source: "client",
                message: `user id ${userID} not found`,
            };
        }
    } catch (error) {
        if(error.source) {
            throw error;
        }

        throw {
            source: "server",
            message: error.message ? error.message : error,
        };
    }
}
/**
 * @param {string} token 
 * @param {string} name 
 */
async function updateUserName(token, name) {
    let userID = await firebase.validate(token);

    try {
        if(typeof name !== "string") {
            throw { source: "client", message: "name should be a string" };
        }

        let result = await userReps.update(
            { name, },
            { where: { id: userID } },
        );
        if(result[0] == 0) {
            throw {
                source: "client",
                message: `user id ${userID} not found`,
            };
        }
    } catch (error) {
        if(error.source) {
            throw error;
        }

        throw {
            source: "server",
            message: error.message ? error.message : error,
        };
    }
}

/**
 * @param {string} token
 * @returns {Promise<import("../domain/validator_user").User>}
 */
async function getUser(token) {
    let userID = await firebase.validate(token);

    try {
        let user = await userReps.findByPk(userID);
        if(user != null) return user.get();
        throw {
            source: "client",
            message: `user id ${userID} not found`,
        };
    } catch (error) {
        if(error.source) {
            throw error;
        }

        throw {
            source: "server",
            message: error.message ? error.message : error,
        };
    }
}

/**
 * @param {string} token
 * @returns {boolean}
 */
async function isExist(token) {
    let userID = await firebase.validate(token);

    try {
        let user = await userReps.findByPk(userID);
        return user != null;
    } catch (error) {
        throw {
            source: "server",
            message: error.message ? error.message : error,
        };
    }
}

module.exports = {
    createUser,
    updateLastLogin,
    updateUserName,
    getUser,
    isExist,
};