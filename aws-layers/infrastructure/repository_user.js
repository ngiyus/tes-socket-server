const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const userModel = pgConn.define("User", {
    id: {
        type: dType.STRING,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: dType.STRING,
        allowNull: false,
    },
    email: {
        type: dType.STRING,
        allowNull: false,
    },
    phone_number: {
        type: dType.STRING,
        allowNull: false,
    },
    login_method: {
        type: dType.STRING,
    },
    avatar_url: {
        type: dType.STRING,
    },
    created_at: {
        type: dType.DATE,
    },
    updated_at: {
        type: dType.DATE,
    },
    last_login: {
        type: dType.DATE,
    },
}, {
    tableName: "test_users",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = userModel;