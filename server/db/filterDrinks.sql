SELECT * FROM drinks
WHERE type = $1
ORDER BY name ASC;