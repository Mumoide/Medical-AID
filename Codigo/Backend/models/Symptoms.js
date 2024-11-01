const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Symptoms', {
    id_symptom: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    severity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    grupo_sintomatico: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    model_order: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Symptoms',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Symptoms_pkey",
        unique: true,
        fields: [
          { name: "id_symptom" },
        ]
      },
    ]
  });
};
