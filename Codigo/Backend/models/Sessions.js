const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Sessions', {
    id_session: {
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
      unique: "sessions_id_user_unique"
    },
    session_token: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Sessions',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "Sessions_pkey",
        unique: true,
        fields: [
          { name: "id_session" },
        ]
      },
      {
        name: "sessions_id_user_index",
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "sessions_id_user_unique",
        unique: true,
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
};
