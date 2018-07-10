UPDATE users
SET instructions = $1
WHERE user_id = $2;