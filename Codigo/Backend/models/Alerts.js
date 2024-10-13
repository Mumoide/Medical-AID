const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Alerts', {
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
    }
  }, {
    sequelize,
    tableName: 'Alerts',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "Alerts_pkey",
        unique: true,
        fields: [
          { name: "id_alert" },
        ]
      },
      {
        name: "alerts_id_admin_unique",
        unique: true,
        fields: [
          { name: "id_admin" },
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
};
