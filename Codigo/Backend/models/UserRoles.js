const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserRoles', {
    id_user_role: {
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
      unique: "userroles_id_user_unique"
    },
    id_role: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id_role'
      },
      unique: "userroles_id_role_unique"
    }
  }, {
    sequelize,
    tableName: 'UserRoles',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "UserRoles_pkey",
        unique: true,
        fields: [
          { name: "id_user_role" },
        ]
      },
      {
        name: "userroles_id_role_unique",
        unique: true,
        fields: [
          { name: "id_role" },
        ]
      },
      {
        name: "userroles_id_user_index",
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "userroles_id_user_unique",
        unique: true,
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
};
