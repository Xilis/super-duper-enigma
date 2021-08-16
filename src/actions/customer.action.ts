import { Action } from "actionhero";
import { db } from "../config/postgres";

export class CustomerAdd extends Action {
  constructor() {
    super();
    this.name = "customerAdd";
    this.description = "add a customer";
    this.outputExample = {};
    this.inputs = {};
  }

  async run(data) {
    const customer = await db.customer.add();
    data.response.game = customer;
  }
}
