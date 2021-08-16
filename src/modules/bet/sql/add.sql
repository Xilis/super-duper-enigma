INSERT INTO actionhero.bet(customer_id, game_id, round_id, bet_amount)
VALUES (${customerId}, ${gameId}, ${roundId}, ${amount})
RETURNING id, customer_id AS "customerId", game_id AS "gameId", round_id AS "roundId", created_at AS "createdAt", ended_at AS "endedAt", bet_amount AS "betAmount", win_amount AS "winAmount", canceled;
