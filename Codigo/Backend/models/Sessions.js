const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
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
      type: Sequelize.DATE,
      allowNull: true
    }
    ,
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true
    }
    ,
    created_at: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Sessions',
    schema: 'public',
    timestamps: false,
    underscored: true,
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
    ]
  });
};
