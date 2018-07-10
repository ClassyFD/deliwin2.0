INSERT INTO users (name, first_name, last_name, email, picture, user_id, user_type, street_address, city, state, zipcode, phone_number, instructions)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
RETURNING *;