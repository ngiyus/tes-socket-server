const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const dealModel = pgConn.define("Deal", {
    id: {
        type: dType.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    market_id: {
        type: dType.INTEGER,
        allowNull: false,
    },
    active: {
        type: dType.BOOLEAN,
        allowNull: false,
    },
    close_price: {
        type: dType.DOUBLE,
        allowNull: true,
    },
    expired_at: {
        type: dType.DATE,
        allowNull: false,
    },
    treshold_at: {
        type: dType.DATE,
        allowNull: false,
    },
    created_at: {
        type: dType.DATE,
        allowNull: false,
    },
    updated_at: {
        type: dType.DATE,
        allowNull: true,
    },
}, {
    tableName: "test_deals",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = dealModel;