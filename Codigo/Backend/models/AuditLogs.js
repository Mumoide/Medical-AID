const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AuditLogs', {
    id_audit: {
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
      },
      unique: "auditlogs_id_user_unique"
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'AuditLogs',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "AuditLogs_pkey",
        unique: true,
        fields: [
          { name: "id_audit" },
        ]
      },
      {
        name: "auditlogs_id_user_unique",
        unique: true,
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
};
