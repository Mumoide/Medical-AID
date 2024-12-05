CREATE TABLE "UserRoles"(
    "id_user_role" BIGINT NOT NULL,
    "id_user" BIGINT NOT NULL,
    "id_role" BIGINT NOT NULL
);
CREATE INDEX "userroles_id_user_index" ON
    "UserRoles"("id_user");
ALTER TABLE
    "UserRoles" ADD PRIMARY KEY("id_user_role");
ALTER TABLE
    "UserRoles" ADD CONSTRAINT "userroles_id_user_unique" UNIQUE("id_user");
ALTER TABLE
    "UserRoles" ADD CONSTRAINT "userroles_id_role_unique" UNIQUE("id_role");
CREATE TABLE "AuditLogs"(
    "id_audit" BIGINT NOT NULL,
    "id_user" BIGINT NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "timestamp" DATE NOT NULL
);
ALTER TABLE
    "AuditLogs" ADD PRIMARY KEY("id_audit");
ALTER TABLE
    "AuditLogs" ADD CONSTRAINT "auditlogs_id_user_unique" UNIQUE("id_user");
CREATE TABLE "UserAlerts"(
    "id_user_alert" BIGINT NOT NULL,
    "id_user" BIGINT NOT NULL,
    "id_alert" BIGINT NOT NULL,
    "viewed_at" DATE NULL,
    "id_read" BOOLEAN NOT NULL
);
CREATE INDEX "useralerts_id_user_index" ON
    "UserAlerts"("id_user");
CREATE INDEX "useralerts_id_alert_index" ON
    "UserAlerts"("id_alert");
ALTER TABLE
    "UserAlerts" ADD PRIMARY KEY("id_user_alert");
CREATE TABLE "Users"(
    "id_user" BIGINT NOT NULL,
    "username" BIGINT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" DATE NOT NULL,
    "updated_at" DATE NOT NULL
);
CREATE INDEX "users_id_user_index" ON
    "Users"("id_user");
CREATE INDEX "users_email_index" ON
    "Users"("email");
ALTER TABLE
    "Users" ADD PRIMARY KEY("id_user");
CREATE TABLE "Alerts"(
    "id_alert" BIGINT NOT NULL,
    "id_admin" BIGINT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "alert_type" VARCHAR(255) NOT NULL,
    "created_at" DATE NOT NULL,
    "updated_at" DATE NULL
);
CREATE INDEX "alerts_id_alert_index" ON
    "Alerts"("id_alert");
ALTER TABLE
    "Alerts" ADD PRIMARY KEY("id_alert");
ALTER TABLE
    "Alerts" ADD CONSTRAINT "alerts_id_admin_unique" UNIQUE("id_admin");
CREATE TABLE "Symptoms"(
    "id_symptom" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "severity" INTEGER NOT NULL
);
ALTER TABLE
    "Symptoms" ADD PRIMARY KEY("id_symptom");
CREATE TABLE "Disease"(
    "id_disease" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" varchar(500) NOT NULL,
    "precaution_1" varchar(500) NOT NULL,
    "precaution_2" varchar(500) NOT NULL,
    "precaution_3" varchar(500) NOT NULL,
    "precaution_4" varchar(500) NOT NULL,
    "nombre" varchar(500) NOT NULL,
    "descripcion" varchar(500) NOT NULL,
    "precaucion_1" varchar(500) NOT NULL,
    "precaucion_2" varchar(500) NOT NULL,
    "precaucion_3" varchar(500) NOT NULL,
    "precaucion_4" varchar(500) NOT NULL,
	"model_order" int NOT NULL
);
ALTER TABLE
    "Disease" ADD PRIMARY KEY("id_disease");
CREATE TABLE "DiagnosisSymptoms"(
    "id_diagnosis_symptom" BIGINT NOT NULL,
    "id_diagnosis" BIGINT NOT NULL,
    "id_symptom" BIGINT NOT NULL
);
ALTER TABLE
    "DiagnosisSymptoms" ADD PRIMARY KEY("id_diagnosis_symptom");
ALTER TABLE
    "DiagnosisSymptoms" ADD CONSTRAINT "diagnosissymptoms_id_diagnosis_unique" UNIQUE("id_diagnosis");
ALTER TABLE
    "DiagnosisSymptoms" ADD CONSTRAINT "diagnosissymptoms_id_symptom_unique" UNIQUE("id_symptom");
CREATE TABLE "Diagnoses"(
    "id_diagnosis" BIGINT NOT NULL,
    "id_user" BIGINT NOT NULL,
    "diagnosis_date" DATE NOT NULL
);
CREATE INDEX "diagnoses_id_user_index" ON
    "Diagnoses"("id_user");
ALTER TABLE
    "Diagnoses" ADD PRIMARY KEY("id_diagnosis");
ALTER TABLE
    "Diagnoses" ADD CONSTRAINT "diagnoses_id_user_unique" UNIQUE("id_user");
CREATE TABLE "DiagnosisDisease"(
    "id_diagnosis_disease" BIGINT NOT NULL,
    "id_disease" BIGINT NOT NULL,
    "id_diagnosis" BIGINT NOT NULL
);
ALTER TABLE
    "DiagnosisDisease" ADD PRIMARY KEY("id_diagnosis_disease");
CREATE TABLE "Sessions"(
    "id_session" BIGINT NOT NULL,
    "id_user" BIGINT NOT NULL,
    "session_token" VARCHAR(255) NOT NULL,
    "created_at" DATE NOT NULL,
    "expires_at" DATE NOT NULL
);
CREATE INDEX "sessions_id_user_index" ON
    "Sessions"("id_user");
ALTER TABLE
    "Sessions" ADD PRIMARY KEY("id_session");
ALTER TABLE
    "Sessions" ADD CONSTRAINT "sessions_id_user_unique" UNIQUE("id_user");
CREATE TABLE "NewsletterSubscribers"(
    "id_subscriber" BIGINT NOT NULL,
    "email" VARCHAR(255) NULL,
    "subscribed_at" DATE NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT '0',
    "unsubscribed_at" DATE NULL
);
ALTER TABLE
    "NewsletterSubscribers" ADD PRIMARY KEY("id_subscriber");
ALTER TABLE
    "NewsletterSubscribers" ADD CONSTRAINT "newslettersubscribers_email_unique" UNIQUE("email");
CREATE TABLE "Roles"(
    "id_role" BIGINT NOT NULL,
    "role_name" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Roles" ADD PRIMARY KEY("id_role");
CREATE TABLE "AlertGeoLocation"(
    "id_geolocation" BIGINT NOT NULL,
    "id_alert" BIGINT NOT NULL,
    "latitude" FLOAT(9) NOT NULL,
    "longitude" FLOAT(9) NOT NULL,
    "region" BIGINT NOT NULL
);
ALTER TABLE
    "AlertGeoLocation" ADD PRIMARY KEY("id_geolocation");
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