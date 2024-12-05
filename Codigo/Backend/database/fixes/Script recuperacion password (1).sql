ALTER TABLE PUBLIC."Users"
ADD COLUMN recovery_code INT,
ADD COLUMN recovery_code_expiration TIMESTAMP;
