const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const DiagnosisSymptoms = sequelize.define('DiagnosisSymptoms', {
    id_diagnosis_symptom: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_diagnosis: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Diagnoses',
        key: 'id_diagnosis'
      },
      unique: "diagnosissymptoms_id_diagnosis_unique"
    },
    id_symptom: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Symptoms',
        key: 'id_symptom'
      },
      unique: "diagnosissymptoms_id_symptom_unique"
    }
  }, {
    sequelize,
    tableName: 'DiagnosisSymptoms',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "DiagnosisSymptoms_pkey",
        unique: true,
        fields: [
          { name: "id_diagnosis_symptom" },
        ]
      },
    ]
  });

  DiagnosisSymptoms.associate = function (models) {
    // Association for DiagnosisSymptoms to Symptoms
    DiagnosisSymptoms.belongsTo(models.Symptoms, {
      foreignKey: 'id_symptom',
      as: 'symptom'
    });
  };

  return DiagnosisSymptoms;
};
