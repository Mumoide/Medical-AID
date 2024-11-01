const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  const Users = sequelize.define('Users', {
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
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    tableName: 'Users',
    schema: 'public',
    timestamps: true,
    underscored: true,
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

  // Associations
  Users.associate = function (models) {
    // Users has one UserProfile
    Users.hasOne(models.UserProfiles, {
      foreignKey: 'id_user',
      as: 'profile', // Use this alias in the include statement
    });


    // Users has many UserRoles
    Users.hasMany(models.UserRoles, {
      foreignKey: 'id_user',
      as: 'roles', // Optional alias for accessing UserRoles
    });
  };

  return Users;
};
