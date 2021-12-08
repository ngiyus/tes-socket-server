const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const accountModel = pgConn.define("Account", {
    id: {
        type: dType.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    account_id: {
        type: dType.STRING,
        allowNull: false,
    },
    demo: {
        type: dType.BOOLEAN,
        allowNull: false,
    },
    balance: {
        type: dType.INTEGER,
        allowNull: true,
    },
    currency: {
        type: dType.STRING,
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
    user_id: {
        type: dType.STRING,
        allowNull: false,
    },
}, {
    tableName: "test_accounts",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = accountModel;