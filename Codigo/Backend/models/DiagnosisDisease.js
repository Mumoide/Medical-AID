const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const DiagnosisDisease = sequelize.define('DiagnosisDisease', {
    id_diagnosis_disease: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_disease: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Disease',
        key: 'id_disease'
      }
    },
    id_diagnosis: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Diagnoses',
        key: 'id_diagnosis'
      }
    }
  }, {
    sequelize,
    tableName: 'DiagnosisDisease',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "DiagnosisDisease_pkey",
        unique: true,
        fields: [
          { name: "id_diagnosis_disease" },
        ]
      },
    ]
  });

  DiagnosisDisease.associate = function (models) {
    // Association for DiagnosisDisease to Disease
    DiagnosisDisease.belongsTo(models.Disease, {
      foreignKey: 'id_disease',
      as: 'disease'
    });
  };

  return DiagnosisDisease;
};
