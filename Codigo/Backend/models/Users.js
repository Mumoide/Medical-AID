const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    id_user: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Users',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "Users_pkey",
        unique: true,
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "users_email_index",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "users_id_user_index",
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
};
