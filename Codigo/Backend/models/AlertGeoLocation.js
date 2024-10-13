const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AlertGeoLocation', {
    id_geolocation: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_alert: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Alerts',
        key: 'id_alert'
      }
    },
    latitude: {
      type: DataTypes.REAL,
      allowNull: false
    },
    longitude: {
      type: DataTypes.REAL,
      allowNull: false
    },
    region: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'AlertGeoLocation',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "AlertGeoLocation_pkey",
        unique: true,
        fields: [
          { name: "id_geolocation" },
        ]
      },
    ]
  });
};
