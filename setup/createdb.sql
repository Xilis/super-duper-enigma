CREATE SCHEMA actionhero;


CREATE TABLE actionhero.customer
(
    id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at timestamptz DEFAULT NOW() NOT NULL
) PARTITION BY RANGE (id);


CREATE TABLE actionhero.game
(
    id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at timestamptz DEFAULT NOW() NOT NULL,
    ended_at   timestamptz
) PARTITION BY RANGE (id);


CREATE TABLE actionhero.round
(
    id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id    BIGINT REFERENCES actionhero.game (id) NOT NULL,
    created_at timestamptz DEFAULT NOW()              NOT NULL,
    ended_at   timestamptz,
    bet_phase  BOOLEAN     DEFAULT TRUE               NOT NULL
) PARTITION BY RANGE (id);


CREATE TABLE actionhero.bet
(
    id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    customer_id BIGINT REFERENCES actionhero.customer (id) NOT NULL,
    game_id     BIGINT REFERENCES actionhero.game (id)     NOT NULL,
    round_id    BIGINT REFERENCES actionhero.round (id)    NOT NULL,
    created_at  timestamptz DEFAULT NOW()                  NOT NULL,
    ended_at    timestamptz,
    bet_amount  BIGINT                                     NOT NULL,
    win_amount  BIGINT,
    canceled    BOOLEAN     DEFAULT FALSE                  NOT NULL
) PARTITION BY RANGE (id); -- maybe we should partition by round id here, we can include round id into all where clauses
CREATE INDEX ON actionhero.bet (round_id, customer_id); -- this way we can use the same index for querying bet history and also when placing bets


CREATE TABLE actionhero.game_1 PARTITION OF actionhero.game
    FOR VALUES FROM (0) TO (10000);
CREATE TABLE actionhero.game_2 PARTITION OF actionhero.game
    FOR VALUES FROM (10000) TO (20000);
CREATE TABLE actionhero.game_3 PARTITION OF actionhero.game
    FOR VALUES FROM (20000) TO (30000);

CREATE TABLE actionhero.round_1 PARTITION OF actionhero.round
    FOR VALUES FROM (0) TO (10000);
CREATE TABLE actionhero.round_2 PARTITION OF actionhero.round
    FOR VALUES FROM (10000) TO (20000);
CREATE TABLE actionhero.round_3 PARTITION OF actionhero.round
    FOR VALUES FROM (20000) TO (30000);

CREATE TABLE actionhero.customer_1 PARTITION OF actionhero.customer
    FOR VALUES FROM (0) TO (10000);
CREATE TABLE actionhero.customer_2 PARTITION OF actionhero.customer
    FOR VALUES FROM (10000) TO (20000);
CREATE TABLE actionhero.customer_3 PARTITION OF actionhero.customer
    FOR VALUES FROM (20000) TO (30000);

CREATE TABLE actionhero.bet_1 PARTITION OF actionhero.bet
    FOR VALUES FROM (0) TO (10000);
CREATE TABLE actionhero.bet_2 PARTITION OF actionhero.bet
    FOR VALUES FROM (10000) TO (20000);
CREATE TABLE actionhero.bet_3 PARTITION OF actionhero.bet
    FOR VALUES FROM (20000) TO (30000);

-- Create 300 customers
INSERT INTO actionhero.customer(created_at)
SELECT NOW()
FROM GENERATE_SERIES(1, 300);
