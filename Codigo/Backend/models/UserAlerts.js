const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('UserAlerts', {
    id_user_alert: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id_user'
      }
    },
    id_alert: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Alerts',
        key: 'id_alert'
      }
    },
    viewed_at: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    readed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  }, {
    sequelize,
    tableName: 'UserAlerts',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "UserAlerts_pkey",
        unique: true,
        fields: [
          { name: "id_user_alert" },
        ]
      },
      {
        name: "useralerts_id_alert_index",
        fields: [
          { name: "id_alert" },
        ]
      },
      {
        name: "useralerts_id_user_index",
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
};
