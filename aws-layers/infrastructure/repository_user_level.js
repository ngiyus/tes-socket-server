const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const userLevelModel = pgConn.define("UserLevel", {
    user_id: {
        type: dType.STRING,
        allowNull: false,
    },
    progress: {
        type: dType.INTEGER,
        allowNull: false,
    },
    level_id: {
        type: dType.SMALLINT,
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
    tableName: "test_user_level",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = userLevelModel;