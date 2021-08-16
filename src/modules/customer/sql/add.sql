INSERT INTO actionhero.customer DEFAULT
VALUES
RETURNING id, created_at AS "createdAt";
