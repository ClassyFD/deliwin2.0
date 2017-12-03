INSERT INTO users (name, picture, user_id)
VALUES ($1, $2, $3)
RETURNING *;