UPDATE actionhero.bet
SET ended_at = NOW(),
    canceled = TRUE
WHERE id = ${id}
  AND round_id = ${roundId}
RETURNING id, customer_id AS "customerId", game_id AS "gameId", round_id AS "roundId", created_at AS "createdAt", ended_at AS "endedAt", bet_amount AS "betAmount", win_amount AS "winAmount", canceled;
