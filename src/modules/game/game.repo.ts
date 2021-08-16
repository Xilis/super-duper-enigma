import { IDatabase, IMain } from "pg-promise";
import { Game } from "./game.model";

import { getQueryFile } from "../../helpers";

const game = {
  create: getQueryFile(__dirname + "/sql/create.sql"),
  empty: getQueryFile(__dirname + "/sql/empty.sql"),
  init: getQueryFile(__dirname + "/sql/init.sql"),
  drop: getQueryFile(__dirname + "/sql/drop.sql"),
  add: getQueryFile(__dirname + "/sql/add.sql"),
  end: getQueryFile(__dirname + "/sql/end.sql"),
  find: getQueryFile(__dirname + "/sql/find.sql"),
};

export class GameRepository {
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
  async create() {
    return this.db.none(game.create);
  }

  // Drops the table;
  async drop() {
    return this.db.none(game.drop);
  }

  // Removes all records from the table;
  async empty() {
    return this.db.none(game.empty);
  }

  // Adds a new game, and returns the new object;
  async add() {
    return this.db.one<Game>(game.add);
  }

  // Tries to find a game from id;
  async findById(params: { id: string }) {
    return this.db.oneOrNone<Game>(game.find, params);
  }

  // Returns all game records;
  async all() {
    return this.db.any<Game>("SELECT * FROM actionhero.game");
  }

  // Returns the total number of games;
  async total(): Promise<number> {
    return this.db.one(
      "SELECT COUNT(*) FROM actionhero.game",
      [],
      (a: { count: string }) => +a.count
    );
  }

  // End a game if not already ended, otherwise just return it
  async end(params: { id: string }) {
    const existingGame = await this.findById({ id: params.id });
    if (existingGame?.endedAt) {
      return existingGame;
    } else {
      return this.db.oneOrNone<Game>(game.end, params);
    }
  }
}
