const pgConn = require("./pgsql").dbConn;
const dType = require("sequelize").DataTypes;

const enumPromoTypeModel = pgConn.define("EnumPromoType", {
    value: {
        type: dType.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: dType.TEXT,
        allowNull: false,
    },
}, {
    tableName: "test_enum_promo_type",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = enumPromoTypeModel;