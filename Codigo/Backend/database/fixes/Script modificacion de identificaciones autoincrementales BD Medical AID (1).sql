-- UserRoles Table
CREATE SEQUENCE userroles_id_user_role_seq;
ALTER TABLE "UserRoles" ALTER COLUMN "id_user_role" SET DEFAULT nextval('userroles_id_user_role_seq');

-- AuditLogs Table
CREATE SEQUENCE auditlogs_id_audit_seq;
ALTER TABLE "AuditLogs" ALTER COLUMN "id_audit" SET DEFAULT nextval('auditlogs_id_audit_seq');

-- UserAlerts Table
CREATE SEQUENCE useralerts_id_user_alert_seq;
ALTER TABLE "UserAlerts" ALTER COLUMN "id_user_alert" SET DEFAULT nextval('useralerts_id_user_alert_seq');


-- Alerts Table
CREATE SEQUENCE alerts_id_alert_seq;
ALTER TABLE "Alerts" ALTER COLUMN "id_alert" SET DEFAULT nextval('alerts_id_alert_seq');

-- Symptoms Table
CREATE SEQUENCE symptoms_id_symptom_seq;
ALTER TABLE "Symptoms" ALTER COLUMN "id_symptom" SET DEFAULT nextval('symptoms_id_symptom_seq');

-- Disease Table
CREATE SEQUENCE disease_id_disease_seq;
ALTER TABLE "Disease" ALTER COLUMN "id_disease" SET DEFAULT nextval('disease_id_disease_seq');

-- DiagnosisSymptoms Table
CREATE SEQUENCE diagnosissymptoms_id_diagnosis_symptom_seq;
ALTER TABLE "DiagnosisSymptoms" ALTER COLUMN "id_diagnosis_symptom" SET DEFAULT nextval('diagnosissymptoms_id_diagnosis_symptom_seq');

-- Diagnoses Table
CREATE SEQUENCE diagnoses_id_diagnosis_seq;
ALTER TABLE "Diagnoses" ALTER COLUMN "id_diagnosis" SET DEFAULT nextval('diagnoses_id_diagnosis_seq');

-- DiagnosisDisease Table
CREATE SEQUENCE diagnosisdisease_id_diagnosis_disease_seq;
ALTER TABLE "DiagnosisDisease" ALTER COLUMN "id_diagnosis_disease" SET DEFAULT nextval('diagnosisdisease_id_diagnosis_disease_seq');

-- Sessions Table
CREATE SEQUENCE sessions_id_session_seq;
ALTER TABLE "Sessions" ALTER COLUMN "id_session" SET DEFAULT nextval('sessions_id_session_seq');

-- NewsletterSubscribers Table
CREATE SEQUENCE newslettersubscribers_id_subscriber_seq;
ALTER TABLE "NewsletterSubscribers" ALTER COLUMN "id_subscriber" SET DEFAULT nextval('newslettersubscribers_id_subscriber_seq');

-- Roles Table
CREATE SEQUENCE roles_id_role_seq;
ALTER TABLE "Roles" ALTER COLUMN "id_role" SET DEFAULT nextval('roles_id_role_seq');

-- AlertGeoLocation Table
CREATE SEQUENCE alertgeolocation_id_geolocation_seq;
ALTER TABLE "AlertGeoLocation" ALTER COLUMN "id_geolocation" SET DEFAULT nextval('alertgeolocation_id_geolocation_seq');

-- UserProfiles Table
CREATE SEQUENCE userprofiles_id_profile_seq;
ALTER TABLE "UserProfiles" ALTER COLUMN "id_profile" SET DEFAULT nextval('userprofiles_id_profile_seq');
