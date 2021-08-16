SELECT id,
       created_at AS "createdAt",
       ended_at   AS "endedAt"
FROM actionhero.game
WHERE id = ${id}
