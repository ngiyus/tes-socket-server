const pgConn = require("./pgsql").timescaleDBConn;
const dType = require("sequelize").DataTypes;

const quotePriceModel = pgConn.define("QuotePrice", {
    timestamp: {
        type: dType.TIME,
        allowNull: false,
    },
    rate: {
        type: dType.DOUBLE,
        allowNull: false,
    },
    market: {
        type: dType.STRING,
        allowNull: true,
    },
}, {
    tableName: "quote_price",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    freezeTableName: true
});

quotePriceModel.removeAttribute('id');
module.exports = quotePriceModel;