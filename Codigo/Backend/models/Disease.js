const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Disease', {
    id_disease: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    precaution_1: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    precaution_2: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    precaution_3: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    precaution_4: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    precaucion_1: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    precaucion_2: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    precaucion_3: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    precaucion_4: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    precaucion_5: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "default_value"
    }
  }, {
    sequelize,
    tableName: 'Disease',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Disease_pkey",
        unique: true,
        fields: [
          { name: "id_disease" },
        ]
      },
    ]
  });
};
