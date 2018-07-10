UPDATE users
SET street_address = $1
WHERE user_id = $2;