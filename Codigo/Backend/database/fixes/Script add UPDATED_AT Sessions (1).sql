ALTER TABLE "Sessions"
ADD COLUMN "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "public"."Sessions"
ALTER COLUMN "expires_at" TYPE TIMESTAMP,
ALTER COLUMN "created_at" TYPE TIMESTAMP,
ALTER COLUMN "updated_at" TYPE TIMESTAMP;

ALTER TABLE "public"."Users"
ALTER COLUMN "created_at" TYPE TIMESTAMP,
ALTER COLUMN "updated_at" TYPE TIMESTAMP;