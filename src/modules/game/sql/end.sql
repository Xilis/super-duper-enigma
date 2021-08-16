UPDATE actionhero.game
SET ended_at = NOW()
WHERE id = ${id}
  AND ended_at IS NULL
RETURNING id, created_at AS "createdAt", ended_at AS "endedAt";
