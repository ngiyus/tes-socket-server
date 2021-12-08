const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const depositTransactionModel = pgConn.define("DepositTransaction", {
    id: {
        type: dType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: dType.STRING,
        allowNull: false,
    },
    payment_id: {
        type: dType.INTEGER,
        allowNull: false,
    },
    metadata: {
        type: dType.JSON,
    },
    expired_at: {
        type: dType.DATE,
    },
    created_at: {
        type: dType.DATE,
    },
    updated_at: {
        type: dType.DATE,
        allowNull: true,
    },
    promo_code: {
        type: dType.STRING,
        allowNull: true,
    },
    status: {
        type: dType.STRING,
        allowNull: true,
    },
    amount: {
        type: dType.INTEGER,
    },
}, {
    tableName: "test_deposit_transaction",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = depositTransactionModel;