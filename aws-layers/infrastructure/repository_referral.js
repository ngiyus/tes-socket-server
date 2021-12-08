const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const referralModel = pgConn.define("Referral", {
    user_id: {
        type: dType.STRING,
        allowNull: false,
        primaryKey: true,
    },
    referral_link: {
        type: dType.STRING,
        allowNull: false,
    },
    referrer: {
        type: dType.STRING,
        allowNull: true,
    },
    commision: {
        type: dType.INTEGER,
        allowNull: false,
    }
}, {
    tableName: "test_referral",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = referralModel;