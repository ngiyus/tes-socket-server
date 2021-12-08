const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const promoCodeModel = pgConn.define("PromoCode", {
    id: {
        type: dType.STRING,
        allowNull: false,
        primaryKey: true,
    },
    max_usage: {
        type: dType.INTEGER,
        allowNull: false,
    },
    usage_count: {
        type: dType.INTEGER,
        allowNull: false,
    },
    type: {
        type: dType.TEXT,
        allowNull: true,
    },
    value: {
        type: dType.SMALLINT,
        allowNull: true,
    },
    turnover: {
        type: dType.INTEGER,
        allowNull: true,
    }
}, {
    tableName: "test_promo_code",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = promoCodeModel;