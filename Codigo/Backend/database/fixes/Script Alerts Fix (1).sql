ALTER TABLE public."UserAlerts"
RENAME COLUMN id_read to readed

ALTER TABLE public."UserAlerts"
ALTER COLUMN readed TYPE BOOLEAN,
ALTER COLUMN readed SET DEFAULT False;

ALTER TABLE public."AlertGeoLocation"
ALTER COLUMN region TYPE VARCHAR(255)

ALTER TABLE public."Alerts"
ALTER COLUMN created_at TYPE TIMESTAMP,
ALTER COLUMN updated_at TYPE TIMESTAMP;