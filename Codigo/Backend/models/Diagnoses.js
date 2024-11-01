const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Diagnoses', {
    id_diagnosis: {
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
      unique: "diagnoses_id_user_unique"
    },
    diagnosis_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    probability: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    diagnosis_session_id: {
      type: DataTypes.STRING, // UUID as a unique identifier
      allowNull: false,
      unique: true, // Ensure uniqueness
    }
  }, {
    sequelize,
    tableName: 'Diagnoses',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Diagnoses_pkey",
        unique: true,
        fields: [
          { name: "id_diagnosis" },
        ]
      },
      {
        name: "diagnoses_id_user_index",
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "diagnoses_id_user_unique",
        unique: true,
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
};
