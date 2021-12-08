const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const promotionModel = pgConn.define("Promotion", {
    id: {
        type: dType.STRING,
        allowNull: false,
        primaryKey: true,
    },
    active: {
        type: dType.BOOLEAN,
        allowNull: false,
    },
    start_date: {
        type: dType.TIME,
        allowNull: false,
    },
    end_date: {
        type: dType.TIME,
        allowNull: false,
    },
    description: {
        type: dType.TEXT,
        allowNull: false,
    },
    title: {
        type: dType.STRING,
        allowNull: false,
    },
    promo_code: {
        type: dType.STRING,
        allowNull: false,
    },
    minimum_deposit: {
        type: dType.INTEGER,
        allowNull: false,
    },
    maximum_deposit: {
        type: dType.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "test_promotion",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = promotionModel;