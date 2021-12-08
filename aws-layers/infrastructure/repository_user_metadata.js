const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const userMetadataModel = pgConn.define("UserMetadata", {
    user_id: {
        type: dType.STRING,
        allowNull: false,
        primaryKey: true,
    },
    fcm_token: {
        type: dType.TEXT,
        allowNull: true,
    },
    appsflyer_id: {
        type: dType.TEXT,
        allowNull: true,
    },
}, {
    tableName: "test_user_metadata",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = userMetadataModel;