UPDATE actionhero.round
SET ended_at = NOW()
WHERE id = ${id}
  AND ended_at IS NULL
RETURNING id, game_id AS "gameId", created_at AS "createdAt", ended_at AS "endedAt";
