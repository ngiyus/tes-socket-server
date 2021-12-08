const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const levelModel = pgConn.define("Level", {
    id: {
        type: dType.STRING,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: dType.TEXT,
        allowNull: false,
    },
    amount: {
        type: dType.BIGINT,
        allowNull: false,
    },
}, {
    tableName: "test_level",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = levelModel;