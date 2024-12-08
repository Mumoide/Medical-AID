UPDATE public."Symptoms"
SET grupo_sintomatico = 'Problemas Visuales'
WHERE model_order in ('13')

UPDATE public."Symptoms"
SET grupo_sintomatico = 'Náuseas y Vómitos'
WHERE model_order in ('34')

UPDATE public."Symptoms"
SET grupo_sintomatico = 'Problemas de la Piel/Infecciones'
WHERE model_order in ('118','86','127')

UPDATE public."Symptoms"
SET grupo_sintomatico = 'Problemas Sistémicos/Problemas Sensoriales'
WHERE model_order = '96'