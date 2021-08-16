INSERT INTO actionhero.game DEFAULT
VALUES
RETURNING id, created_at AS "createdAt", ended_at AS "endedAt";
