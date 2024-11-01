const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Roles', {
    id_role: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    role_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Roles',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Roles_pkey",
        unique: true,
        fields: [
          { name: "id_role" },
        ]
      },
    ]
  });
};
