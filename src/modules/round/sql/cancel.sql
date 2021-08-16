UPDATE actionhero.round
SET bet_phase = FALSE
WHERE id = ${id}
RETURNING id, game_id AS "gameId", created_at AS "createdAt", ended_at AS "endedAt", bet_phase AS "betPhase";
