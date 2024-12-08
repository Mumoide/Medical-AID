ALTER TABLE public."Diagnoses"
ADD COLUMN diagnosis_session_id VARCHAR(255) UNIQUE;
