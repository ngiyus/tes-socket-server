const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const accountTransactionModel = pgConn.define("AccountTransaction", {
    id: {
        type: dType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    deal_id: {
        type: dType.INTEGER,
        allowNull: false,
    },
    type: {
        type: dType.STRING,
        allowNull: false,
    },
    amount: {
        type: dType.INTEGER,
        allowNull: false,
    },
    profit_amount: {
        type: dType.INTEGER,
        allowNull: true,
    },
    base_price: {
        type: dType.DOUBLE,
        allowNull: false,
    },
    active: {
        type: dType.BOOLEAN,
        allowNull: false,
    },
    profit: {
        type: dType.BOOLEAN,
        allowNull: true,
    },
    account_id: {
        type: dType.STRING,
        allowNull: false,
    },
    open_time: {
        type: dType.DATE,
        allowNull: false,
    },
    close_time: {
        type: dType.DATE,
        allowNull: true,
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
    tableName: "test_account_transactions",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = accountTransactionModel;