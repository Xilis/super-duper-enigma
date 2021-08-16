UPDATE actionhero.bet
SET win_amount = ${winAmount},
    ended_at   = NOW()
WHERE id = ${id}
RETURNING id , customer_id AS "customerId" , game_id AS "gameId" , round_id AS "roundId" , created_at AS "createdAt" , ended_at AS "endedAt" , bet_amount AS "betAmount" , win_amount AS "winAmount" , canceled
