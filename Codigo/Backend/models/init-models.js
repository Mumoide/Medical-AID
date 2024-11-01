var DataTypes = require("sequelize").DataTypes;
var _AlertGeoLocation = require("./AlertGeoLocation");
var _Alerts = require("./Alerts");
var _AuditLogs = require("./AuditLogs");
var _Diagnoses = require("./Diagnoses");
var _DiagnosisDisease = require("./DiagnosisDisease");
var _DiagnosisSymptoms = require("./DiagnosisSymptoms");
var _Disease = require("./Disease");
var _NewsletterSubscribers = require("./NewsletterSubscribers");
var _Roles = require("./Roles");
var _Sessions = require("./Sessions");
var _Symptoms = require("./Symptoms");
var _UserAlerts = require("./UserAlerts");
var _UserProfiles = require("./UserProfiles");
var _UserRoles = require("./UserRoles");
var _Users = require("./Users");

function initModels(sequelize) {
  var AlertGeoLocation = _AlertGeoLocation(sequelize, DataTypes);
  var Alerts = _Alerts(sequelize, DataTypes);
  var AuditLogs = _AuditLogs(sequelize, DataTypes);
  var Diagnoses = _Diagnoses(sequelize, DataTypes);
  var DiagnosisDisease = _DiagnosisDisease(sequelize, DataTypes);
  var DiagnosisSymptoms = _DiagnosisSymptoms(sequelize, DataTypes);
  var Disease = _Disease(sequelize, DataTypes);
  var NewsletterSubscribers = _NewsletterSubscribers(sequelize, DataTypes);
  var Roles = _Roles(sequelize, DataTypes);
  var Sessions = _Sessions(sequelize, DataTypes);
  var Symptoms = _Symptoms(sequelize, DataTypes);
  var UserAlerts = _UserAlerts(sequelize, DataTypes);
  var UserProfiles = _UserProfiles(sequelize, DataTypes);
  var UserRoles = _UserRoles(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  AlertGeoLocation.belongsTo(Alerts, { as: "id_alert_Alert", foreignKey: "id_alert"});
  Alerts.hasMany(AlertGeoLocation, { as: "AlertGeoLocations", foreignKey: "id_alert"});
  UserAlerts.belongsTo(Alerts, { as: "id_alert_Alert", foreignKey: "id_alert"});
  Alerts.hasMany(UserAlerts, { as: "UserAlerts", foreignKey: "id_alert"});
  DiagnosisDisease.belongsTo(Diagnoses, { as: "id_diagnosis_Diagnosis", foreignKey: "id_diagnosis"});
  Diagnoses.hasMany(DiagnosisDisease, { as: "DiagnosisDiseases", foreignKey: "id_diagnosis"});
  DiagnosisSymptoms.belongsTo(Diagnoses, { as: "id_diagnosis_Diagnosis", foreignKey: "id_diagnosis"});
  Diagnoses.hasOne(DiagnosisSymptoms, { as: "DiagnosisSymptom", foreignKey: "id_diagnosis"});
  DiagnosisDisease.belongsTo(Disease, { as: "id_disease_Disease", foreignKey: "id_disease"});
  Disease.hasMany(DiagnosisDisease, { as: "DiagnosisDiseases", foreignKey: "id_disease"});
  UserRoles.belongsTo(Roles, { as: "id_role_Role", foreignKey: "id_role"});
  Roles.hasOne(UserRoles, { as: "UserRole", foreignKey: "id_role"});
  DiagnosisSymptoms.belongsTo(Symptoms, { as: "id_symptom_Symptom", foreignKey: "id_symptom"});
  Symptoms.hasOne(DiagnosisSymptoms, { as: "DiagnosisSymptom", foreignKey: "id_symptom"});
  AuditLogs.belongsTo(Users, { as: "id_user_User", foreignKey: "id_user"});
  Users.hasOne(AuditLogs, { as: "AuditLog", foreignKey: "id_user"});
  Diagnoses.belongsTo(Users, { as: "id_user_User", foreignKey: "id_user"});
  Users.hasOne(Diagnoses, { as: "Diagnosis", foreignKey: "id_user"});
  Sessions.belongsTo(Users, { as: "id_user_User", foreignKey: "id_user"});
  Users.hasOne(Sessions, { as: "Session", foreignKey: "id_user"});
  UserAlerts.belongsTo(Users, { as: "id_user_User", foreignKey: "id_user"});
  Users.hasMany(UserAlerts, { as: "UserAlerts", foreignKey: "id_user"});
  UserProfiles.belongsTo(Users, { as: "id_user_User", foreignKey: "id_user"});
  Users.hasOne(UserProfiles, { as: "UserProfile", foreignKey: "id_user"});
  UserRoles.belongsTo(Users, { as: "id_user_User", foreignKey: "id_user"});
  Users.hasOne(UserRoles, { as: "UserRole", foreignKey: "id_user"});

  return {
    AlertGeoLocation,
    Alerts,
    AuditLogs,
    Diagnoses,
    DiagnosisDisease,
    DiagnosisSymptoms,
    Disease,
    NewsletterSubscribers,
    Roles,
    Sessions,
    Symptoms,
    UserAlerts,
    UserProfiles,
    UserRoles,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
