UPDATE users
SET zipcode = $1
WHERE user_id = $2;