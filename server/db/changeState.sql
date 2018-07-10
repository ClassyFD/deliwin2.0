UPDATE users
SET state = $1
WHERE user_id = $2;