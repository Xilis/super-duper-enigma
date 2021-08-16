import { IDatabase, IMain } from "pg-promise";
import { Bet } from "./bet.model";
import { getQueryFile } from "../../helpers";

const bet = {
  add: getQueryFile(__dirname + "/sql/add.sql"),
  cancel: getQueryFile(__dirname + "/sql/cancel.sql"),
  find: getQueryFile(__dirname + "/sql/find.sql"),
  findInRound: getQueryFile(__dirname + "/sql/findInRound.sql"),
  winOrLose: getQueryFile(__dirname + "/sql/winOrLose.sql"),
};

export class BetRepository {
  /**
   * @param db
   * Automated database connection context/interface.
   *
   * If you ever need to access other repositories from this one,
   * you will have to replace type 'IDatabase<any>' with 'any'.
   *
   * @param pgp
   * Library's root, if ever needed, like to access 'helpers'
   * or other namespaces available from the root.
   */
  constructor(private db: IDatabase<any>, private pgp: IMain) {
    // If your repository needs to use helpers like ColumnSet, you should create it conditionally, inside the constructor, i.e. only once, as a singleton.
  }

  async add(params: {
    customerId: string;
    gameId: string;
    roundId: string;
    amount: number;
  }) {
    return this.db.one<Bet>(bet.add, params);
  }

  // Tries to find a game from id;
  async findById(params: { id: string }) {
    return this.db.oneOrNone<Bet>(bet.find, params);
  }

  // Cancel a bet;
  async cancel(params: { id: string; roundId: string }) {
    return this.db.one<Bet>(bet.cancel, params);
  }

  async findInRound(params: { roundId: string }) {
    return this.db.manyOrNone<Bet>(bet.findInRound, params);
  }

  async winOrLose(params: { id: string; winAmount: number | null }) {
    return this.db.one<Bet>(bet.winOrLose, params);
  }
}
