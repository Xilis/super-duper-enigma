This repository includes an application that provides 2 separate functionalities, each being a solution to a given task.

One task is to essentially provide an api to store some variables and have these variables be consistent across multiple instances of the application running at
the same time.

One task is to implement a game server of sorts, that allows us to create customers, games, game rounds and place/cancel bets in said rounds.

All of it is exposed through a RESTish API, backed by a persistent database (PostgreSQL, Redis) and a message broker/scheduler

# Usage

## Docker compose

The repository includes a `docker-compose.yaml` file that can be used to start:

- 4 instances of the application (built by the included multi stage `Dockerfile`)
- redis
- rabbitmq
- postgres

Create a `./setup/.env` file. You can copy the provided `./setup/.env.example`.

Run `docker-compose up`.

The [setup/createdb.sql](setup/createdb.sql) script will be automatically executed when the postgres container is first started.

## Local

To run the application and/or tests locally, the standard nodejs setup applies.

First install all required dependencies using `npm ci` and then run the scripts in [package.json](package.json):

- `npm run dev` to start the app locally, open http://localhost:8080
- `npm run test` to run tests
- ...

# App task

- a project build with ActionHero https://www.actionherojs.com/
- using Redis
- 4 instances of the application running concurrently, reachable via ports 8081,8082,8083,8084
- an API allowing storing and fetching of variables

## Usage

Uncomment the app instances in the [docker-compose.yaml](docker-compose.yaml) file.  
Run `docker-compose up`

Open any:

- http://localhost:8081
- http://localhost:8082
- http://localhost:8083
- http://localhost:8084

# PostgreSQL task

Data model and logic:

1. There is a customer bet table. (bet_id, customer_id, game_id, round_id, create_date, win_lost_date, bet_amount, win_amount)
2. This game has a round lasting for 5-6 minutes. We can handle this scheduling in multiple ways:
    1. Publish a message to RabbitMQ to a queue with a TTL of 5 minutes that will route it to the actual "task queue". This way we offload the enqueuing of
       the "round end"
    2. Add a task into Redis / PostgreSQL and then periodically
3. In the first minute of round (betting phase) every user (from 300-500 people) can place a bet or remove the bet (20-25 requests for each person).
    - We could track the phase of the round itself as well if needed by adding a column to it
4. After the first minute bets can't be placed anymore.
    - We can always compare round start time to current time
5. When game round is finished, calculation part (settlement phase) starts (avg 20-25 bets per person) for people (300-500). In that time the next round of
   betting starts.

Context and expectations:

1. Game history (placed bets) with raw data can be reachable (by customer_id, round_id) for all time.
2. Calculation and betting on next round can work at same time without locking.
3. Candidate should use a technology provided in our tech-stack.
4. We expect to see more than one solution with pros and cons for every solution with candidate's explanation.
5. Availability of data and update performance is very important.Add missing DB columns if needed. Prepare simple simulation of this behavior that will show us
   your DB solution. We will have a discussion afterwards so you will be able to explain your thought process in more details.

## Implementation

The database schema is provided in [setup/createdb.sql](setup/createdb.sql)

The flow goes like this:

- Starting a `game` automatically starts the first `round`
- Each `customer` can place bets referencing a round, but only if the round is in the bet phase (first minute)
- Each `customer` can also cancel previously placed `bet`s, also after the bet phase is over, but before the round is ended (5 minutes)
- After the `round`s first minute, `bet`s are no longer accepted (bet phase over), at this point a new `round` is started
- After 5 minutes the `round` is ended, the processing of placed `bet`s starts. Here is where things can get messy, as the previous round processing will take
  locks on the customers wallets, and betting for the new round will also take locks on the wallets. For this reason we need to make sure the bet processing is
  quick!

Scheduling:

- When a round is started, queue 2 tasks:
    - trigger end of bet phase + create new round
    - trigger end of round

## Usage

Same as for the App task, run `docker-compose up` to bring up the stateful services and then either run the application locally or uncomment the app entries in
the compose file.

## Improvements and TODOs

- Better input validation
- More tests (qulity and quantity)
- Bet processing should be split into batches (fetch total count, divide in batches, queue task for each batch), in order to reduce the amount of rows touched
  in a transaction / shorten the tx time
- Table partitioning by different column
- Ending a game should stop new rounds from being started
