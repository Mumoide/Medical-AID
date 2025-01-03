const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Alerts = sequelize.define('Alerts', {
    id_alert: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_admin: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: "alerts_id_admin_unique"
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    alert_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      field: "created_at", // Map to snake_case field in DB
    },
    updated_at: {
      type: DataTypes.DATE,
      field: "updated_at", // Map to snake_case field in DB
    },
  }, {
    sequelize,
    tableName: 'Alerts',
    schema: 'public',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "Alerts_pkey",
        unique: true,
        fields: [
          { name: "id_alert" },
        ]
      },
      {
        name: "alerts_id_alert_index",
        fields: [
          { name: "id_alert" },
        ]
      },
    ]
  });

  Alerts.associate = function (models) {
    Alerts.hasMany(models.UserAlerts, {
      foreignKey: 'id_alert',
      as: 'userAlerts'
    });
    Alerts.hasOne(models.AlertGeoLocation, {
      foreignKey: 'id_alert',
      as: 'geoLocation'
    });
  };

  return Alerts;
};
