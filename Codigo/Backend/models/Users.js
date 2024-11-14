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
    failed_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Track failed attempts
    },
    lockout_until: {
      type: DataTypes.DATE, // Store lockout expiration time
      allowNull: true,
    },
    lockout_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Track number of lockouts to calculate lockout time
    },
    recovery_code: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allows null when no code is generated
      comment: "Stores the recovery code for password reset",
    },
    recovery_code_expiration: {
      type: DataTypes.DATE,
      allowNull: true, // Allows null when no expiration is set
      comment: "Expiration time for the recovery code",
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
