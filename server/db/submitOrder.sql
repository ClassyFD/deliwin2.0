INSERT INTO orders (price, address, status, order_id, email, date_submitted, payment_type, order_name, delivery_instructions, cart, user_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING *;