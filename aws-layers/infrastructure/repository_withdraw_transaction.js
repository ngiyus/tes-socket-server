const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const withdrawTransactionModel = pgConn.define("WithdrawTransaction", {
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
    status: {
        type: dType.STRING,
        allowNull: false,
    },
    payment_id: {
        type: dType.INTEGER,
        allowNull: false,
    },
    amount: {
        type: dType.INTEGER,
    },
    metadata: {
        type: dType.JSON,
    },
    reason: {
        type: dType.TEXT,
    },
    created_at: {
        type: dType.DATE,
    },
    updated_at: {
        type: dType.DATE,
        allowNull: true,
    },
}, {
    tableName: "test_withdraw_transactions",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = withdrawTransactionModel;