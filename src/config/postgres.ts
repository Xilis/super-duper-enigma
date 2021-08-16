// Database Interface Extensions:
import { GameRepository } from "../modules/game/game.repo";
import { RoundRepository } from "../modules/round/round.repo";
import pgPromise, { IDatabase, IInitOptions, IMain } from "pg-promise";
import { IConnectionParameters } from "pg-promise/typescript/pg-subset";
import { BetRepository } from "../modules/bet/bet.repo";
import { CustomerRepository } from "../modules/customer/customer.repo";

interface IExtensions {
  game: GameRepository;
  round: RoundRepository;
  bet: BetRepository;
  customer: CustomerRepository;
}

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

// pg-promise initialization options:
const initOptions: IInitOptions<IExtensions> = {
  // Extending the database protocol with our custom repositories;
  // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
  extend(obj: ExtendedProtocol, dc: any) {
    // Database Context (dc) is mainly needed for extending multiple databases with different access API.

    // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
    // which should be as fast as possible.
    obj.game = new GameRepository(obj, pgp);
    obj.round = new RoundRepository(obj, pgp);
    obj.bet = new BetRepository(obj, pgp);
    obj.customer = new CustomerRepository(obj, pgp);
  },
};

// Alternatively, you can get access to pgp via db.$config.pgp
// See: https://vitaly-t.github.io/pg-promise/Database.html#$config
// Initializing the library:
export const pgp: IMain = pgPromise(initOptions);

// Creating the database instance with extensions:
export let db: ExtendedProtocol;

export function initialize(dbConfig: IConnectionParameters) {
  db = pgp(dbConfig);
  return { db, pgp };
}
