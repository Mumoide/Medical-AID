CREATE TABLE "UserProfiles"(
    "id_profile" BIGINT NOT NULL,
    "id_user" BIGINT NOT NULL,
    "names" VARCHAR(255) NOT NULL,
    "last_names" VARCHAR(255) NOT NULL,
    "birthdate" DATE NOT NULL,
    "weight" FLOAT(8) NULL,
    "height" FLOAT(8) NULL,
    "gender" VARCHAR(255) NULL,
    "address" VARCHAR(255) NOT NULL,
    "comune" VARCHAR(255) NOT NULL,
    "phone_number" BIGINT NOT NULL
);
CREATE INDEX "userprofiles_id_user_index" ON
    "UserProfiles"("id_user");
ALTER TABLE
    "UserProfiles" ADD PRIMARY KEY("id_profile");
ALTER TABLE
    "UserProfiles" ADD CONSTRAINT "userprofiles_id_user_unique" UNIQUE("id_user");
CREATE TABLE "Users"(
    "id_user" BIGINT NOT NULL,
    "username" BIGINT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "active" INTEGER NOT NULL DEFAULT '1',
    "failed_attemps" INTEGER NOT NULL,
    "lockout_until" TIMESTAMP(0) NOT NULL,
    "lockout_count" INTEGER NOT NULL
);
CREATE INDEX "users_id_user_index" ON
    "Users"("id_user");
CREATE INDEX "users_email_index" ON
    "Users"("email");
ALTER TABLE
    "Users" ADD PRIMARY KEY("id_user");
CREATE TABLE "Roles"(
    "id_role" BIGINT NOT NULL,
    "role_name" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Roles" ADD PRIMARY KEY("id_role");
CREATE TABLE "UserRoles"(
    "id_user_role" BIGINT NOT NULL,
    "id_user" BIGINT NOT NULL,
    "id_role" BIGINT NOT NULL
);
CREATE INDEX "userroles_id_user_index" ON
    "UserRoles"("id_user");
ALTER TABLE
    "UserRoles" ADD PRIMARY KEY("id_user_role");
CREATE TABLE "Sessions"(
    "id_session" BIGINT NOT NULL,
    "id_user" BIGINT NOT NULL,
    "session_token" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,
    "expires_at" TIMESTAMP(0) NOT NULL
);
CREATE INDEX "sessions_id_user_index" ON
    "Sessions"("id_user");
ALTER TABLE
    "Sessions" ADD PRIMARY KEY("id_session");
CREATE TABLE "AuditLogs"(
    "id_audit" BIGINT NOT NULL,
    "id_user" BIGINT NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(0) NOT NULL
);
ALTER TABLE
    "AuditLogs" ADD PRIMARY KEY("id_audit");
CREATE TABLE "Symptoms"(
    "id_symptom" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "severity" INTEGER NOT NULL,
    "nombre" VARCHAR(500) NOT NULL,
    "grupo_sintomatico" VARCHAR(500) NOT NULL,
    "model_order" INTEGER NOT NULL
);
ALTER TABLE
    "Symptoms" ADD PRIMARY KEY("id_symptom");
CREATE TABLE "Disease"(
    "id_disease" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "precaution_1" VARCHAR(500) NOT NULL,
    "precaution_2" VARCHAR(500) NOT NULL,
    "precaution_3" VARCHAR(500) NOT NULL,
    "precaution_4" VARCHAR(500) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(500) NOT NULL,
    "precaucion_1" VARCHAR(500) NOT NULL,
    "precaucion_2" VARCHAR(255) NOT NULL,
    "precaucion_3" VARCHAR(500) NOT NULL,
    "precaucion_4" VARCHAR(500) NOT NULL,
    "precaucion_5" VARCHAR(500) NOT NULL,
    "model_order" INTEGER NOT NULL
);
ALTER TABLE
    "Disease" ADD PRIMARY KEY("id_disease");
CREATE TABLE "NewsletterSubscribers"(
    "id_subscriber" BIGINT NOT NULL,
    "email" VARCHAR(255) NULL,
    "subscribed_atdate" TIMESTAMP(0) NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT '0',
    "unsubscribed_at" TIMESTAMP(0) NULL
);
ALTER TABLE
    "NewsletterSubscribers" ADD PRIMARY KEY("id_subscriber");
ALTER TABLE
    "NewsletterSubscribers" ADD CONSTRAINT "newslettersubscribers_email_unique" UNIQUE("email");
CREATE TABLE "Diagnoses"(
    "id_diagnosis" BIGINT NOT NULL,
    "id_user" BIGINT NULL,
    "diagnosis_date" TIMESTAMP(0) NOT NULL,
    "latitude" FLOAT(9) NOT NULL,
    "longitude" FLOAT(9) NOT NULL,
    "probability" FLOAT(8) NOT NULL,
    "diagnoses_session_id" VARCHAR(255) NOT NULL
);
CREATE INDEX "diagnoses_id_user_index" ON
    "Diagnoses"("id_user");
ALTER TABLE
    "Diagnoses" ADD PRIMARY KEY("id_diagnosis");
ALTER TABLE
    "Diagnoses" ADD CONSTRAINT "diagnoses_diagnoses_session_id_unique" UNIQUE("diagnoses_session_id");
CREATE TABLE "DiagnosisDisease"(
    "id_diagnosis_disease" BIGINT NOT NULL,
    "id_disease" BIGINT NOT NULL,
    "id_diagnosis" BIGINT NOT NULL
);
ALTER TABLE
    "DiagnosisDisease" ADD PRIMARY KEY("id_diagnosis_disease");
CREATE TABLE "DiagnosisSymptoms"(
    "id_diagnosis_symptom" BIGINT NOT NULL,
    "id_diagnosis" BIGINT NOT NULL,
    "id_symptom" BIGINT NOT NULL
);
ALTER TABLE
    "DiagnosisSymptoms" ADD PRIMARY KEY("id_diagnosis_symptom");
CREATE TABLE "Alerts"(
    "id_alert" BIGINT NOT NULL,
    "id_admin" BIGINT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "alert_type" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,
    "updated_at" TIMESTAMP(0) NULL
);
CREATE INDEX "alerts_id_alert_index" ON
    "Alerts"("id_alert");
ALTER TABLE
    "Alerts" ADD PRIMARY KEY("id_alert");
CREATE TABLE "UserAlerts"(
    "id_user_alert" BIGINT NOT NULL,
    "id_user" BIGINT NOT NULL,
    "id_alert" BIGINT NOT NULL,
    "viewed_at" TIMESTAMP(0) NULL,
    "readed" BOOLEAN NOT NULL DEFAULT '0'
);
CREATE INDEX "useralerts_id_user_index" ON
    "UserAlerts"("id_user");
CREATE INDEX "useralerts_id_alert_index" ON
    "UserAlerts"("id_alert");
ALTER TABLE
    "UserAlerts" ADD PRIMARY KEY("id_user_alert");
CREATE TABLE "AlertGeoLocation"(
    "id_geolocation" BIGINT NOT NULL,
    "id_alert" BIGINT NOT NULL,
    "latitude" FLOAT(9) NOT NULL,
    "longitude" FLOAT(9) NOT NULL,
    "region" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "AlertGeoLocation" ADD PRIMARY KEY("id_geolocation");
ALTER TABLE
    "DiagnosisSymptoms" ADD CONSTRAINT "diagnosissymptoms_id_diagnosis_foreign" FOREIGN KEY("id_diagnosis") REFERENCES "Diagnoses"("id_diagnosis");
ALTER TABLE
    "DiagnosisDisease" ADD CONSTRAINT "diagnosisdisease_id_disease_foreign" FOREIGN KEY("id_disease") REFERENCES "Disease"("id_disease");
ALTER TABLE
    "AuditLogs" ADD CONSTRAINT "auditlogs_id_audit_foreign" FOREIGN KEY("id_audit") REFERENCES "Users"("id_user");
ALTER TABLE
    "AlertGeoLocation" ADD CONSTRAINT "alertgeolocation_id_alert_foreign" FOREIGN KEY("id_alert") REFERENCES "Alerts"("id_alert");
ALTER TABLE
    "UserAlerts" ADD CONSTRAINT "useralerts_id_alert_foreign" FOREIGN KEY("id_alert") REFERENCES "Alerts"("id_alert");
ALTER TABLE
    "UserProfiles" ADD CONSTRAINT "userprofiles_id_user_foreign" FOREIGN KEY("id_user") REFERENCES "Users"("id_user");
ALTER TABLE
    "DiagnosisSymptoms" ADD CONSTRAINT "diagnosissymptoms_id_symptom_foreign" FOREIGN KEY("id_symptom") REFERENCES "Symptoms"("id_symptom");
ALTER TABLE
    "UserAlerts" ADD CONSTRAINT "useralerts_id_user_foreign" FOREIGN KEY("id_user") REFERENCES "Users"("id_user");
ALTER TABLE
    "UserRoles" ADD CONSTRAINT "userroles_id_user_foreign" FOREIGN KEY("id_user") REFERENCES "Users"("id_user");
ALTER TABLE
    "DiagnosisDisease" ADD CONSTRAINT "diagnosisdisease_id_diagnosis_foreign" FOREIGN KEY("id_diagnosis") REFERENCES "Diagnoses"("id_diagnosis");
ALTER TABLE
    "UserRoles" ADD CONSTRAINT "userroles_id_role_foreign" FOREIGN KEY("id_role") REFERENCES "Roles"("id_role");
ALTER TABLE
    "Sessions" ADD CONSTRAINT "sessions_id_user_foreign" FOREIGN KEY("id_user") REFERENCES "Users"("id_user");
ALTER TABLE
    "Diagnoses" ADD CONSTRAINT "diagnoses_id_user_foreign" FOREIGN KEY("id_user") REFERENCES "Users"("id_user");