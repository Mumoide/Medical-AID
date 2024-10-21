const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const UserProfiles = sequelize.define('UserProfiles', {
    id_profile: {
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
      unique: "userprofiles_id_user_unique"
    },
    names: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    last_names: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    weight: {
      type: DataTypes.REAL,
      allowNull: true
    },
    height: {
      type: DataTypes.REAL,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    comune: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'UserProfiles',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "UserProfiles_pkey",
        unique: true,
        fields: [
          { name: "id_profile" },
        ]
      },
      {
        name: "userprofiles_id_user_index",
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "userprofiles_id_user_unique",
        unique: true,
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });

  // // In userProfiles.js
  // UserProfiles.associate = function (models) {
  //   UserProfiles.belongsTo(models.Users, {
  //     foreignKey: 'id_user',
  //     as: 'user', // The reverse association
  //   });
  // };

  return UserProfiles;
};
