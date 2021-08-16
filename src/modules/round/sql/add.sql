INSERT INTO actionhero.round (game_id)
VALUES (${gameId})
RETURNING id, game_id AS "gameId", created_at AS "createdAt", ended_at AS "endedAt", bet_phase AS "betPhase";
