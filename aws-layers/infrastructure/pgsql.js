const postgresConfig = require("./sequelize_config.json");
const { Sequelize, Op, literal } = require("sequelize");

/**
 * @type {Sequelize} */
var dbConn;

/**
 * @type {Sequelize} */
var timescaleDBConn;

if(!dbConn) {
    dbConn = new Sequelize(
        postgresConfig[process.env.NODE_ENV || "development"],
    );

    timescaleDBConn = new Sequelize(
        postgresConfig.timescale_history,
    );
}

module.exports = {
    dbConn,
    Op,
    literal,
    timescaleDBConn,
};