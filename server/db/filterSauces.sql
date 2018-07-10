SELECT * FROM sauces
WHERE type = $1
ORDER BY name ASC;