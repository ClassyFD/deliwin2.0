INSERT INTO users (name, email, picture, user_id, user_type, address, phone_number)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;