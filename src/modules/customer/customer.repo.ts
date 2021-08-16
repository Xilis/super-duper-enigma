import { getQueryFile } from "../../helpers";
import { IDatabase, IMain } from "pg-promise";
import { Customer } from "./customer.model";

const customer = {
  add: getQueryFile(__dirname + "/sql/add.sql"),
};

export class CustomerRepository {
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

  // Adds a new game, and returns the new object;
  async add() {
    return this.db.one<Customer>(customer.add);
  }
}
