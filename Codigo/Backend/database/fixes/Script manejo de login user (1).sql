ALTER TABLE PUBLIC."Users"
ADD COLUMN failed_attempts INT DEFAULT 0,
ADD COLUMN lockout_until TIMESTAMP,
ADD COLUMN lockout_count INT DEFAULT 0;
