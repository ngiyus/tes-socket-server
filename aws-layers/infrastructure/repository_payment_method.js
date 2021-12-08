const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const paymentMethodModel = pgConn.define("PaymentMethod", {
    id: {
        type: dType.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    country_id: {
        type: dType.STRING,
        allowNull: false,
    },
    logo_url: {
        type: dType.STRING,
        allowNull: false,
    },
    deposit: {
        type: dType.BOOLEAN,
        allowNull: false,
    },
    withdraw: {
        type: dType.BOOLEAN,
        allowNull: false,
    },
    bank_name: {
        type: dType.STRING,
        allowNull: false,
    },
    bank_code: {
        type: dType.STRING,
        allowNull: false,
    },
}, {
    tableName: "test_payment_method",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = paymentMethodModel;