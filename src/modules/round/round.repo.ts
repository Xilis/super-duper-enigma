import { IDatabase, IMain } from "pg-promise";
import { Round } from "./round.model";
import { getQueryFile } from "../../helpers";

const round = {
  create: getQueryFile(__dirname + "/sql/create.sql"),
  empty: getQueryFile(__dirname + "/sql/empty.sql"),
  drop: getQueryFile(__dirname + "/sql/drop.sql"),
  find: getQueryFile(__dirname + "/sql/find.sql"),
  add: getQueryFile(__dirname + "/sql/add.sql"),
  end: getQueryFile(__dirname + "/sql/end.sql"),
  cancel: getQueryFile(__dirname + "/sql/cancel.sql"),
};

export class RoundRepository {
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

  // Creates the table;
  async create(): Promise<null> {
    return this.db.none(round.create);
  }

  // Drops the table;
  async drop(): Promise<null> {
    return this.db.none(round.drop);
  }

  // Removes all rounds from the table;
  async empty(): Promise<null> {
    return this.db.none(round.empty);
  }

  // Adds a new round, and returns the new object;
  async add(params: { gameId: string }): Promise<Round> {
    return this.db.one(round.add, params);
  }

  // Tries to find a round from id;
  async findById(param: { id: string }): Promise<Round | null> {
    return this.db.oneOrNone<Round>(round.find, param);
  }

  // Returns all round rounds;
  async all(): Promise<Round[]> {
    return this.db.any("SELECT * FROM actionhero.round");
  }

  // Returns the total number of rounds;
  async total(): Promise<number> {
    return this.db.one(
      "SELECT COUNT(*) FROM actionhero.round",
      [],
      (a: { count: string }) => +a.count
    );
  }

  async end(params: { id: string }): Promise<Round> {
    const existingRound = await this.findById({ id: params.id });
    if (existingRound?.endedAt) {
      return existingRound;
    } else {
      return this.db.one<Round>(round.end, params);
    }
  }

  async cancel(params: { id: string }): Promise<Round> {
    const existingRound = await this.findById({ id: params.id });
    if (!existingRound || existingRound.endedAt || !existingRound.betPhase) {
      throw new Error("Cannot transition this round into cancel phase!");
    } else {
      return this.db.one<Round>(round.cancel, params);
    }
  }
}
