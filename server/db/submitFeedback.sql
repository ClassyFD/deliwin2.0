INSERT INTO feedback 
(name, email, feedback_text, date) 
VALUES ($1, $2, $3, $4) 
RETURNING *;
