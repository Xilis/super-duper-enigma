SELECT id,
       game_id    AS "gameId",
       created_at AS "createdAt",
       ended_at   AS "endedAt",
       bet_phase  AS "betPhase"
FROM actionhero.round
WHERE id = ${id};
