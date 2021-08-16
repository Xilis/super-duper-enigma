import { Initializer } from "actionhero";
import { IConnectionParameters } from "pg-promise/typescript/pg-subset";
import { db, initialize } from "../config/postgres";

/**
 * Initialize a RabbitMQ broker
 */
export class Postgres extends Initializer {
  constructor() {
    super();
    this.name = "PostgreSQL";
    this.loadPriority = 600;
    this.startPriority = 500;
    this.stopPriority = 10000;
  }

  override async initialize() {
    const port = process.env.POSTGRESQL_PORT || 5432;
    const host = process.env.POSTGRESQL_HOST || "localhost";
    const user = process.env.POSTGRESQL_USER || "postgres";
    const password = process.env.POSTGRESQL_PASS || "postgres";
    const database = process.env.POSTGRESQL_DATABASE || "postgres";

    const dbConfig: IConnectionParameters = {
      user,
      password,
      host,
      port: +port,
      database,
    };

    initialize(dbConfig);
  }

  /**
   * Try connecting to the database.
   */
  override async start() {
    const connection = await db.connect();
    connection.done();
  }

  /**
   * Close connection pool to allow app to exit.
   */
  override async stop() {
    await db.$pool.end();
  }
}
