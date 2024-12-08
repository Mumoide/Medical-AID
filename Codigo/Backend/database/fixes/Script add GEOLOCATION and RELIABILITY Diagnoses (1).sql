ALTER TABLE public."Diagnoses"
ADD COLUMN latitude FLOAT(9) NULL,
ADD COLUMN longitude FLOAT(9) NULL,
ADD COLUMN probability FLOAT(8) NOT NULL;
