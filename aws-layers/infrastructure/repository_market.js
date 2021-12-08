const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const marketModel = pgConn.define("Market", {
    id: {
        type: dType.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: dType.STRING,
        allowNull: false,
    },
    url_logo: {
        type: dType.STRING,
        allowNull: false,
    },
    active: {
        type: dType.BOOLEAN,
        allowNull: false,
    },
    percentage: {
        type: dType.SMALLINT,
        allowNull: false,
    },
    open_at: {
        type: dType.DATE,
        allowNull: false,
    },
    close_at: {
        type: dType.DATE,
        allowNull: false,
    },
    precision: {
        type: dType.SMALLINT,
        allowNull: true,
    },
}, {
    tableName: "test_markets",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = marketModel;